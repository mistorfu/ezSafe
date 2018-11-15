package com.kedacom.ezSafe.common.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import org.apache.http.util.EntityUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.elasticsearch.action.search.ClearScrollRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.slice.SliceBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * Created by JMF on 2018/1/18.
 */
@Service
public class AFireExportService {
    @Autowired
    private ESClientManager esClientManager;

    private static final Logger logger = LoggerFactory.getLogger(AFireExportService.class);

    public Sheet exportHead(SXSSFWorkbook wb, List<String> columnName , String sheetName) {

        //在webbook中添加一个sheet,对应Excel文件中的sheet
        Sheet sheet = wb.createSheet(sheetName);

        //在sheet中添加表头第0行
        Row row = sheet.createRow(0);

        //创建单元格，并设置值表头 设置表头居中
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        // 创建一个居中格式 自动换行

        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setFillForegroundColor((short) 13);
        style.setFont(font);
        style.setWrapText(true);

        Cell cell;
        for (int i = 0; i < columnName.size(); i++) {
            cell = row.createCell(i);
            cell.setCellValue(columnName.get(i));
            cell.setCellStyle(style);
            sheet.setColumnWidth(i, 1200 * columnName.get(i).length());
        }

        return sheet;
    }

    public int commonExport(SXSSFWorkbook wb, Sheet sheet, List<Map<String, Object>> filesExport, int rowIndex, List<String> textName) {
        //在sheet中添加表头第0行
        Row row;

        CellStyle styleText = wb.createCellStyle();

        // 创建一个居中格式 自动换行

        styleText.setVerticalAlignment(VerticalAlignment.CENTER);
        styleText.setWrapText(true);

        for (Map<String , Object> file : filesExport) {
            Cell cell;
            row = sheet.createRow(++rowIndex);
            row.setHeightInPoints(30);
            for (int j = 0; j < textName.size(); j++) {
                if (!textName.get(j).contains(".")) {
                    if (file.get(textName.get(j)) != null) {
                        cell = row.createCell(j);
                        cell.setCellStyle(styleText);
                        cell.setCellValue(file.get(textName.get(j)).toString());
                    }
                } else {
                    String[] keys = textName.get(j).split("\\.");
                    if (keys.length == 2 && file.get(keys[0]) != null) {
                        cell = row.createCell(j);
                        cell.setCellStyle(styleText);
                        cell.setCellValue(((Map)file.get(keys[0])).get(keys[1]).toString());
                    }
                }
            }

        }

        return rowIndex;

    }

    public void startSearchDb(QueryBuilder query, EsAliases esAliases, AFireExportModel exportModel, String sheetName) {
        int totalNums = getTotalNum(query, esAliases);
        int max = 1;
        Map<String, Integer> file = exportModel.getFileId();
        String fileId = exportModel.getProgressId();
        LinkedBlockingQueue<SearchHit[]> queue = new LinkedBlockingQueue<>();
        SXSSFWorkbook wb = new SXSSFWorkbook(3000);
        Consumer consumer = new Consumer(wb, queue, exportModel, sheetName, totalNums);
        file.put(exportModel.getProgressId(), 0);
        if (totalNums > 2000000) {
            max = getMax(getShards(esAliases));
            logger.debug("=================start multiply export==================");
        }
        logger.debug("=================thread number : " + max + "=====================");

        ExecutorService pool = Executors.newFixedThreadPool(max);
        for (int i = 0; i < max; i++) {
            pool.execute(new Producer(query, esAliases, queue, i, max, exportModel));
        }
        pool.shutdown();
        file.put(exportModel.getProgressId(), 10);
        consumer.start();
        while (true) {
            if (!file.containsKey(fileId) || file.get(fileId) == -1) {
                consumer.flag = false;
                file.remove(fileId);
                logger.debug("=======================stop export=========================");
                break;
            }
            if (pool.isTerminated()) {
                consumer.flag = false;
            }
            if (!consumer.isAlive() && file.containsKey(fileId) && file.get(fileId) != -1) {
                logger.debug("=======================start to write=========================");
                String downLoadPath = writeFiles(wb, exportModel);
                logger.debug("=======================download url:" + downLoadPath + "=========================");
                exportModel.getFileId().put(fileId, downLoadPath);
                break;
            }
        }
    }

    class Producer extends Thread {
        private QueryBuilder query;
        private EsAliases esAliases;
        private RestHighLevelClient esClient;
        private LinkedBlockingQueue<SearchHit[]> queue;
        private AFireExportModel exportModel;
        private int max;
        private int i;


        public Producer(QueryBuilder query, EsAliases esAliases, LinkedBlockingQueue<SearchHit[]> queue, int i, int max, AFireExportModel exportModel) {
            this.query = query;
            this.esAliases = esAliases;
            this.exportModel = exportModel;
            this.esClient = esClientManager.getClient();
            this.queue = queue;
            this.max = max;
            this.i = i;
        }

        @Override
        public void run() {
            Map<String, Integer> file = exportModel.getFileId();
            String fileId = exportModel.getProgressId();
            try {
                logger.debug("====================thread:" + i + "start=======================");
                String scrollId;
                Long nums = 0L;
                SearchHit[] searchHits;
                SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
                        .size(4000)
                        .query(query)
                        .explain(false);
                if (null != exportModel.getSortOrder() && max == 1) {
                    searchSourceBuilder.sort(exportModel.getSortText(), exportModel.getSortOrder());
                }

                if (max != 1) {
                    searchSourceBuilder.slice(new SliceBuilder(i, max));
                }

                SearchRequest searchRequest = new SearchRequest()
                        .indices(esAliases.getRead())
                        .types(esAliases.getType())
                        .source(searchSourceBuilder)
                        .scroll("1m");

                SearchResponse searchResponse;

                searchResponse = esClient.search(searchRequest);
                scrollId = searchResponse.getScrollId();
                searchHits = searchResponse.getHits().getHits();

                while (searchHits.length > 0) {
                    if (!file.containsKey(fileId) || file.get(fileId) == -1) {
                        break;
                    }
                    nums += searchHits.length;
                    logger.debug("=============thread" + i + ":get " + nums + "data===================");
                    queue.add(searchHits);
                    SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
                    scrollRequest.scroll("2m");
                    searchResponse = esClientManager
                            .getClient()
                            .searchScroll(scrollRequest);

                    scrollId = searchResponse.getScrollId();
                    searchHits = searchResponse.getHits().getHits();
                }
                ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
                clearScrollRequest.addScrollId(scrollId);
                esClientManager.getClient().clearScroll(clearScrollRequest);
                logger.debug("==================thread" + i + "stop==============");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    class Consumer extends Thread {
        public Boolean flag = true;
        private SXSSFWorkbook wb;
        private LinkedBlockingQueue<SearchHit[]> queue;
        private AFireExportModel exportModel;
        private String sheetName;
        private Sheet sheet;
        private int rowIndex = 0;
        private int total = 0;
        private int totalNums = 0;
        private int progress = 0;

        public Consumer(SXSSFWorkbook wb, LinkedBlockingQueue<SearchHit[]> queue, AFireExportModel exportModel, String sheetName, int totalNums) {
            this.queue = queue;
            this.exportModel = exportModel;
            this.sheetName = sheetName;
            this.wb = wb;
            this.totalNums = totalNums;
        }

        @Override
        public void run() {
            logger.debug("=====================consumer start=================");
            sheet = exportHead(wb, exportModel.getColumnName(), sheetName);
            Map<String, Integer> file = exportModel.getFileId();
            String fileId = exportModel.getProgressId();
            while (true) {
                SearchHit[] hits = queue.poll();
                if (null == hits && !flag) {
                    Thread.currentThread().interrupt();
                    logger.debug("=====================consumer stop=================");
                    break;
                } else if (null != hits) {
                    List<Map<String, Object>> filesExport = exportModel.Filter(hits);
                    if (rowIndex > 900000) {
                        total += rowIndex;
                        sheet = exportHead(wb, exportModel.getColumnName(), sheetName + Math.ceil(total / 900000));
                        rowIndex = 0;
                    }
                    file.put(fileId, 20);
                    rowIndex = commonExport(wb, sheet, filesExport, rowIndex, exportModel.getTextName());
                    if (file.containsKey(fileId) && file.get(fileId) != -1) {
                        progress = (total + rowIndex) / (totalNums / 100);
                        file.put(fileId, progress <= 100 ? progress : 100);
                    }
                }
            }
        }
    }

    private String writeFiles(SXSSFWorkbook wb, AFireExportModel exportModel) {
        File file = new File(exportModel.getDicPath());
        if (!file.exists()) {
            logger.debug("===================didn't have the dir，start to make dir！==============");
            file.mkdirs();
            logger.debug("======================make dir success=========================");
        }
        logger.debug("========================start to write=======================");
        FileOutputStream fout;
        try {
            fout = new FileOutputStream(exportModel.getDicPath() + exportModel.getFileName());
            wb.write(fout);
            fout.close();
            wb.close();
            return "temp/" + exportModel.getFileName();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "failed";
    }

    private int getShards(EsAliases esAliases) {
        int shards = 1;
        try {
            Response response = esClientManager.getLowClient().performRequest("GET", esAliases.getIndex() + "/_settings");
            Map responseJson = new ObjectMapper().readValue(EntityUtils.toString(response.getEntity()), Map.class);
            Map indics = (Map)responseJson.get(esAliases.getIndex());
            Map settings = (Map) indics.get("settings");
            Map index = (Map) settings.get("index");
            shards = Integer.parseInt(index.get("number_of_shards").toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return shards;
    }

    private int getMax(int a) {
        int result = 1;
        if (a < 6) {
            return a;
        }
        for (int i = 1; i < a; i++) {
            if (a % i == 0) {
                result = i;
            }
        }
        return getMax(result);
    }

    private int getTotalNum(QueryBuilder query, EsAliases esAliases) {
        int result = 0;
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
                .size(0)
                .query(query)
                .explain(false);
        SearchRequest searchRequest = new SearchRequest()
                .indices(esAliases.getRead())
                .types(esAliases.getType())
                .source(searchSourceBuilder);
        SearchResponse searchResponse = null;

        try {
            searchResponse = esClientManager.getClient().search(searchRequest);
            result = (int) (searchResponse.getHits().getTotalHits());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }
}

