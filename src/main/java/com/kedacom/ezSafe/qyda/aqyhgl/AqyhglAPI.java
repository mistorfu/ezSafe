package com.kedacom.ezSafe.qyda.aqyhgl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.service.AFireExportModel;
import com.kedacom.ezSafe.common.service.AFireExportService;
import com.kedacom.ezSafe.common.service.EsCommonService;
import com.kedacom.ezSafe.common.utils.ComCache;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.PzxxCache;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @Description:
 * @author: hanshuhao
 * @Date: 2018/10/11
 */
@RestController
@RequestMapping("/api/qyda/aqyhgl")
public class AqyhglAPI {
    @Autowired
    private AqyhglService aqyhglService;

    @Autowired
    private EsCommonService commonService;

    @Autowired
    private AFireExportService aFireExportService;

    private Map exportMap = new HashMap<>();

    private List<String> COLUMNS = Arrays.asList("XXBH", "YHBH", "QYXX.QYMC", "YHMC", "YHLX.VALUE", "YHJB.VALUE",
            "YHLY.VALUE", "JCRY.RYXM", "JCSJ", "SSJZ.JZMC", "SSXQ.XZQHMC");
    private List<String> COLUMNS_DESC = Arrays.asList("信息编号", "隐患编号", "企业名称", "隐患名称", "隐患类型", "隐患级别",
            "隐患来源", "检察人员", "检查时间", "所属街镇", "所属辖区");

    /**
     * 查询安全隐患信息
     **/
    @RequestMapping(value = "/getAqyh", method = RequestMethod.GET)
    public Map<String,Object> getAqyh(@RequestParam Map<String, Object> params) {
        if (params.containsKey("pageSize")) params.put("limit", params.get("pageSize"));
        if (params.containsKey("skip")) params.put("offset", params.get("skip"));
        return commonService.selectPagedDataByMap("a_safe_qyaqyh", "qyaqyh", params);
    }

    /**
     * 删除安全隐患信息
     **/
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public boolean deleteAqsgByArray(@RequestParam Map<String, Object> params) throws Exception {
        String ids = ComConvert.toString(params.get("ids"));
        List idarray = new ObjectMapper().readValue(ids, List.class);
        return aqyhglService.deleteAqsgByArray(idarray);
    }

    /**
     * 导出安全隐患信息
     **/
    @RequestMapping(value = "/exportExcel", method = RequestMethod.POST)
    public void exportExcel(@RequestParam Map<String, Object> params) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        QueryBuilder query = EsCommonService.getQueryBuilderFromMap(params);
        ClassLoader loader = EsCommonService.class.getClassLoader();
        String dicPath = loader.getResource("").getPath().replace("/WEB-INF", "").replace("/classes", "") + "temp/";
        String fileName = "qyaqyh-all" + sdf.format(new Date()) + ".xlsx";
        AFireExportModel exportModel = new ExportModel(COLUMNS_DESC, COLUMNS, dicPath, fileName,
                exportMap, params.get("exportId").toString());
        aFireExportService.startSearchDb(query, EsAliases.QYAQYH, exportModel, "企业安全隐患");
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
    /**
     * 新增和修改安全隐患信息
     * **/
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public String save(@RequestParam Map<String, Object> params) throws Exception {
        Map object = new ObjectMapper().readValue(params.get("miniFire").toString(), Map.class);
        return aqyhglService.save(object);
    }
    /**
     * 获取初始化数据
     */
    @RequestMapping(value = "/getInit", method = RequestMethod.GET)
    public Map<String, Object> getInit() {
        Map<String, Object> result = new HashMap<>();
        PzxxCache pzxxCache = ComCache.getInstance().getPzxxCache();
        result.put("tpwjlx", pzxxCache.getPzxx("tpwjlx"));
        result.put("spwjlx", pzxxCache.getPzxx("spwjlx"));

        return result;
    }
}
