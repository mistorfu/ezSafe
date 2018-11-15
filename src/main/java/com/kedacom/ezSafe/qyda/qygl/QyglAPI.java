package com.kedacom.ezSafe.qyda.qygl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.service.AFireExportModel;
import com.kedacom.ezSafe.common.service.AFireExportService;
import com.kedacom.ezSafe.common.service.EsCommonService;
import com.kedacom.ezSafe.common.utils.ComConvert;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by fudapeng on 2018/9/25.
 */
@RestController
@RequestMapping("/api/qyda/qygl")
public class QyglAPI {
    @Autowired
    private EsCommonService commonService;

    @Autowired
    private AFireExportService aFireExportService;

    @Autowired
    private QyglService qyglService;

    private Map exportMap = new ConcurrentHashMap();
    private List<String> COLUMNS = Arrays.asList("QYBH", "QYMC", "SSHYLY.VALUE", "QYFL.VALUE", "SSWG.WGMC",
            "GSZCH", "ZZJGDM", "TYSHXYBM", "ZCLX.VALUE", "ZCDZ", "JYDZ");
    private List<String> COLUMNS_DESC = Arrays.asList("企业编号", "企业名称", "所属行业", "企业分类", "所属网格",
            "工商注册号", "机构代码", "信用编码", "注册类型", "注册地址", "经营地址");

    @RequestMapping(value = "getQyjcxx", method = RequestMethod.GET)
    public Map getQyjcxx(@RequestParam Map<String, Object> params) {
        if (params.containsKey("pageSize")) params.put("limit", params.get("pageSize"));
        if (params.containsKey("skip")) params.put("offset", params.get("skip"));
        return commonService.selectPagedDataByMap("a_safe_qyjcxx", "qyjcxx", params);
    }

    @RequestMapping(value = "save", method = RequestMethod.POST)
    public Map<String, String> saveQyjcxx(@RequestParam Map<String, Object> params) throws IOException {
        Map<String, String> message = new HashMap<>();
        ObjectMapper objMapper = new ObjectMapper();
        Map object = objMapper.readValue(params.get("qyjcxx").toString(), Map.class);
        if(object.get("CLRQ").equals("")){
            object.put("CLRQ",null);
        }if(object.get("TCRQ").equals("")){
            object.put("TCRQ",null);
        }if(((Map)object.get("FRDB")).get("CSRQ").equals("")){
            ((Map)object.get("FRDB")).put("CSRQ",null);
        }
        String state = object.get("STATE_TYPE").toString();
        String id = object.get("QYBH").toString();
        String now_date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        if (state.equals("update")){
            object.remove("STATE_TYPE");
            object.put("GXSJ",now_date);
            String result = commonService.update("a_safe_qyjcxx", "qyjcxx",id, object);
            message.put("ID","update");
            message.put("VALUE",result);
        }else if(state.equals("insert")){
            object.remove("STATE_TYPE");
            object.put("RKSJ",now_date);
            String result = commonService.insert("a_safe_qyjcxx", "qyjcxx",id, object);
            message.put("ID","insert");
            message.put("VALUE",result);
        }
        return message;

    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public boolean deleteQyjcxxByArray(@RequestParam Map<String, Object> params) throws Exception {
        String ids = ComConvert.toString(params.get("ids"));
        List idList = new ObjectMapper().readValue(ids, List.class);
        return qyglService.deleteQyjcxxByArray(idList);
    }

    @RequestMapping(value = "/exportExcel", method = RequestMethod.POST)
    public void exportExcel(@RequestParam Map<String, Object> params) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        QueryBuilder query = EsCommonService.getQueryBuilderFromMap(params);
        ClassLoader loader = EsCommonService.class.getClassLoader();
        String dicPath = loader.getResource("").getPath().replace("/WEB-INF", "").replace("/classes", "") + "temp/";
        String fileName = "qyjcxx-all" + sdf.format(new Date()) + ".xlsx";
        AFireExportModel exportModel = new QyglAPI.ExportModel(COLUMNS_DESC, COLUMNS, dicPath, fileName,
                exportMap, params.get("exportId").toString());
        aFireExportService.startSearchDb(query, EsAliases.QYJCXX, exportModel, "企业基础信息");
    }

    @RequestMapping(value = "/progress", method = RequestMethod.GET)
    public String progress(@RequestParam String exportId) {
        String downLoadUrl;
        if (ComConvert.toString(exportMap.get(exportId)).equals("")) {
            return "0";
        }
        if (exportMap.get(exportId) instanceof Integer) {
            return exportMap.get(exportId).toString();
        } else {
            downLoadUrl = ComConvert.toString(exportMap.get(exportId));
            final String innerExportId = exportId;
            Timer timer = new Timer();
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    exportMap.remove(innerExportId);
                }
            }, 10000);
        }
        return downLoadUrl;
    }

    @RequestMapping(value = "/stopExport", method = RequestMethod.GET)
    public void stopExport(@RequestParam String exportId) {
        exportMap.put(exportId, -1);
    }

    private class ExportModel extends AFireExportModel {
        private ExportModel(List<String> columnName, List<String> textName, String dicPath,
                            String fileName, Map fileId, String progressId) {
            super(columnName, textName, dicPath, fileName, fileId, progressId);
        }

        @Override
        public List<Map<String, Object>> Filter(SearchHit[] hits) {
            List<Map<String, Object>> result = new ArrayList<>();
            for (SearchHit hit : hits) {
                result.add(hit.getSource());
            }
            return result;
        }
    }
}