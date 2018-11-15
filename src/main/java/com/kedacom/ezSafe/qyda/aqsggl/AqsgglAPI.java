package com.kedacom.ezSafe.qyda.aqsggl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.service.AFireExportModel;
import com.kedacom.ezSafe.common.service.AFireExportService;
import com.kedacom.ezSafe.common.service.EsCommonService;
import com.kedacom.ezSafe.common.utils.ComCache;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.PzxxCache;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/qyda/aqsggl")
public class AqsgglAPI {
    @Autowired
    private EsCommonService commonService;

    @Autowired
    private AqsgglService aqsgglService;

    @Autowired
    private AFireExportService aFireExportService;

    private Map exportMap = new HashMap<>();

    private List<String> COLUMNS = Arrays.asList(
            "XXBH", "SGBH", "SGMC", "QYXX", "KSSJ", "JSSJ", "SGLB.VALUE", "SGJB.VALUE", "SGYY", "SGJG", "SGMS", "QSRS",
            "ZSRS", "SWRS", "JJSS", "SGFJ", "DCRY", "SGZR", "CLJY", "ZGCS", "ZGFJ", "ZGSJ", "SSJZ.JZMC", "SSXQ.XZQHMC", "BZXX");
    private List<String> COLUMNS_DESC = Arrays.asList(
            "信息编号","事故编号", "事故名称", "企业信息", "开始时间", "结束时间", "事故类别", "事故级别", "事故原因", "事故经过", "事故描述", "轻伤人数",
            "重伤人数","死亡人数", "经济损失", "事故附件", "调查人员", "事故责任", "处理建议", "整改措施", "整改附件", "整改时间", "所属街镇", "所属辖区", "备注信息");

    /**
     * 查询安全事故信息
     **/
    @RequestMapping(value = "/getAqsg", method = RequestMethod.GET)
    public Map<String,Object> getAqsg(@RequestParam Map<String, Object> params) {
        if (params.containsKey("pageSize")) params.put("limit", params.get("pageSize"));
        if (params.containsKey("skip")) params.put("offset", params.get("skip"));
        return commonService.selectPagedDataByMap("a_safe_qyaqsg", "qyaqsg", params);
    }

    /**
     * 删除安全事故信息
     **/
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public boolean deleteAqsgByArray(@RequestParam Map<String, Object> params) throws IOException {
        String ids = ComConvert.toString(params.get("ids"));
        List idList = new ObjectMapper().readValue(ids,List.class);
        return aqsgglService.deleteAqsgByArray(idList);
    }

    /**
     * 导出安全事故信息
     **/
    @RequestMapping(value = "/exportExcel", method = RequestMethod.POST)
    public void exportExcel(@RequestParam Map<String, Object> params) {
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
        QueryBuilder query = EsCommonService.getQueryBuilderFromMap(params);
        ClassLoader loader = EsCommonService.class.getClassLoader();
        String dicPath = loader.getResource("").getPath().replace("/WEB-INF", "").replace("/classes", "") + "temp/";
        String fileName = "aqsg-all" + df.format(new Date()) + ".xlsx";
        AFireExportModel exportModel = new AqsgglAPI.ExportModel(COLUMNS_DESC, COLUMNS, dicPath, fileName, exportMap, params.get("exportId").toString());
        aFireExportService.startSearchDb(query, EsAliases.QYAQSG, exportModel, "企业安全事故");

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
            exportMap.remove(exportId);
        }
        return downLoadUrl;
    }

    /**
     * 中止导出
     **/
    @RequestMapping(value = "/stopExport", method = RequestMethod.GET)
    public void stopExport(@RequestParam String exportId) {
        exportMap.put(exportId, -1);
    }

    private class ExportModel extends AFireExportModel {
        private ExportModel(List<String> columnName, List<String> textName, String dicPath, String fileName, Map fileId, String progressId) {
            super(columnName, textName, dicPath, fileName, fileId, progressId);
        }
        @Override
        public List<Map<String, Object>> Filter(SearchHit[] hits) {
            List<Map<String, Object>> result = new ArrayList<>();
            for (SearchHit hit : hits) {
                Map<String, Object> map = hit.getSource();
                // 企业信息
                if (map.containsKey("QYXX")) {
                    if (!"" .equals(map.get("QYXX"))){
                        StringBuilder qyxx = new StringBuilder();
                        qyxx.append("企业编号: " + ComConvert.toString(ComConvert.toMap(map.get("QYXX")).get("QYBH") + "，"));
                        qyxx.append("企业名称: " + ComConvert.toString(ComConvert.toMap(map.get("QYXX")).get("QYMC") + "。"));
                        map.put("QYXX",qyxx);
                    }
                }

                // 经济损失
                if (map.containsKey("JJSS")) {
                    if (!"" .equals(map.get("JJSS"))){
                        StringBuilder jjss = new StringBuilder();
                        jjss.append("单位: " + ComConvert.toString(ComConvert.toMap(map.get("JJSS")).get("DW") + "，"));
                        jjss.append("金额: " + ComConvert.toString(ComConvert.toMap(map.get("JJSS")).get("JE") + "。"));
                        map.put("JJSS",jjss);
                    }
                }

                // 事故附件
                if (map.containsKey("SGFJ")) {
                    if (!"" .equals(map.get("SGFJ"))){
                        StringBuilder sgfj = new StringBuilder();
                        List list = (List) map.get("SGFJ");
                        for (Object obj : list) {
                            Map temp = (HashMap) obj;
                            sgfj.append("附件类型：" + ComConvert.toString(temp.get("FJLX") + "，"));
                            sgfj.append("附件名称：" + ComConvert.toString(temp.get("FJMC") + "，"));
                            sgfj.append("附件后缀：" + ComConvert.toString(temp.get("FJHZ") + "，"));
                            sgfj.append("附件描述：" + ComConvert.toString(temp.get("FJMS") + "，"));
                            sgfj.append("Url地址：" + ComConvert.toString(temp.get("FJDZ") + "，"));
                            sgfj.append("显示顺序：" + ComConvert.toString(temp.get("XSSX") + "；"));
                        }
                        map.put("SGFJ",sgfj);
                    }
                }

                // 整改附件
                if (map.containsKey("ZGFJ")) {
                    if (!"" .equals(map.get("ZGFJ"))){
                        StringBuilder zgfj = new StringBuilder();
                        List list = (List) map.get("ZGFJ");
                        for (Object obj : list) {
                            Map temp = (HashMap) obj;
                            zgfj.append("附件类型：" + ComConvert.toString(temp.get("FJLX") + "，"));
                            zgfj.append("附件名称：" + ComConvert.toString(temp.get("FJMC") + "，"));
                            zgfj.append("附件后缀：" + ComConvert.toString(temp.get("FJHZ") + "，"));
                            zgfj.append("附件描述：" + ComConvert.toString(temp.get("FJMS") + "，"));
                            zgfj.append("Url地址：" + ComConvert.toString(temp.get("FJDZ") + "，"));
                            zgfj.append("显示顺序：" + ComConvert.toString(temp.get("XSSX") + "；"));
                        }
                        map.put("ZGFJ",zgfj);
                    }
                }
                result.add(map);
            }
            return result;
        }
    }

    /**
     * 新增和修改安全事故信息
     * **/
    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public String save(@RequestParam Map<String, Object> params) throws IOException{
        ObjectMapper objMapper = new ObjectMapper();
        Map object = objMapper.readValue(params.get("miniFire").toString(), Map.class);
        return aqsgglService.save(object);
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
