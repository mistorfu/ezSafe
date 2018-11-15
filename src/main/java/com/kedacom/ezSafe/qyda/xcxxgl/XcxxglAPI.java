package com.kedacom.ezSafe.qyda.xcxxgl;

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
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/qyda/xcxxgl")
public class XcxxglAPI {
    @Autowired
    private EsCommonService commonService;

    @Autowired
    private XcxxglService xcxxglService;

    @Autowired
    private AFireExportService aFireExportService;

    private Map exportMap = new ConcurrentHashMap();
    private List<String> COLUMNS = Arrays.asList("XXBH","QYXX", "RWBH","RWMC", "XCFL", "XCLB",
            "XCZT","JHXCNR","JHXCSM", "JHKSSJ", "JHJSSJ","JHXCRY","SJXCRY",
            "SJKSSJ","SJJSSJ","SJXCNR","SJXCSM","XCJG","BZXX","SSJZ","SSXQ");
    private List<String> COLUMNS_DESC = Arrays.asList("信息编号","企业信息", "任务编号", "任务名称", "巡查分类","巡查类别",
            "巡查状态","计划巡查内容","计划巡查说明", "计划开始时间", "计划结束时间","计划巡查人员","实际巡查人员",
            "实际开始时间","实际结束时间","实际巡查内容","实际巡查说明","巡查结果","备注信息","所属街镇","所属辖区");
    /**
     * 查询 巡查信息
     **/
    @RequestMapping(value = "/getXcxx", method = RequestMethod.GET)
    public Map getQyjcxx(@RequestParam Map<String, Object> params) {
        if (params.containsKey("pageSize")) params.put("limit", params.get("pageSize"));
        if (params.containsKey("skip")) params.put("offset", params.get("skip"));
        return commonService.selectPagedDataByMap("a_safe_qyxcrw", "qyxcrw", params);
    }

    /**
     * 查询任务对应的隐患信息
     */
    @RequestMapping(value = "/getYhxx", method = RequestMethod.GET)
    public Map<String,Object> getYhxx(@RequestParam String rwbh){
        return xcxxglService.getYhxx(rwbh);
    }

    /**
     * 删除 巡查信息
     **/
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public boolean deleteXcxxByArray(@RequestParam Map<String, Object> params) throws Exception {
        String ids = ComConvert.toString(params.get("ids"));
        List idarray = new ObjectMapper().readValue(ids, List.class);
        return xcxxglService.deleteXcxxByArray(idarray);
    }

    /**
     * 导出 巡查信息
     **/
    @RequestMapping(value = "/exportExcel", method = RequestMethod.POST)
    public void exportExcel(@RequestParam Map<String, Object> params) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        QueryBuilder query = EsCommonService.getQueryBuilderFromMap(params);
        ClassLoader loader = EsCommonService.class.getClassLoader();
        String dicPath = loader.getResource("").getPath().replace("/WEB-INF", "").replace("/classes", "") + "temp/";
        String fileName = "qyxcxx-all" + sdf.format(new Date()) + ".xlsx";
        AFireExportModel exportModel = new XcxxglAPI.ExportModel(COLUMNS_DESC, COLUMNS, dicPath, fileName,
                exportMap, params.get("exportId").toString());
        aFireExportService.startSearchDb(query, EsAliases.QYXCRW, exportModel, "企业巡查信息");
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
                Map<String, Object> map = xcxxglService.xcxxFilter(hit.getSource());
                Map<String, Object> xcxxMap = new HashMap();
                //企业信息
                StringBuilder qyxx = new StringBuilder();
                if(!"".equals(map.get("QYXX"))){
                    qyxx.append(ComConvert.toString(ComConvert.toMap(map.get("QYXX")).get("QYMC")));
                }
                //巡查分类
                StringBuilder xcfl = new StringBuilder();
                if(!"".equals(map.get("XCFL"))){
                    xcfl.append(ComConvert.toString(ComConvert.toMap(map.get("XCFL")).get("VALUE")));
                }
                StringBuilder xclb = new StringBuilder();
                if(!"".equals(map.get("XCLB"))){
                    xclb.append(ComConvert.toString(ComConvert.toMap(map.get("XCLB")).get("VALUE")));
                }
                StringBuilder xczt = new StringBuilder();
                if(!"".equals(map.get("XCZT"))){
                    xczt.append(ComConvert.toString(ComConvert.toMap(map.get("XCZT")).get("VALUE")));
                }
                //计划巡查人员
                StringBuilder jhxcry = new StringBuilder();
                if(!"".equals(map.get("JHXCRY"))){
                    if(map.get("JHXCRY") instanceof java.util.List){
                        List list=(List) map.get("JHXCRY");
                        for (Object obj:list) {
                            Map temp = (Map) obj;
                            jhxcry.append(ComConvert.toString(ComConvert.toString(temp.get("RYXM")+"，")));
                        }
                    }else {
                        jhxcry.append(ComConvert.toString(ComConvert.toMap(map.get("JHXCRY")).get("RYXM")));
                    }
                }
                StringBuilder sjxcry = new StringBuilder();
                if(!"".equals(map.get("SJXCRY"))){
                    if(map.get("SJXCRY") instanceof java.util.List){
                        List list=(List) map.get("SJXCRY");
                        for (Object obj:list) {
                            Map temp = (Map) obj;
                            sjxcry.append(ComConvert.toString(ComConvert.toString(temp.get("RYXM")+"，")));
                        }
                    }else {
                        sjxcry.append(ComConvert.toString(ComConvert.toMap(map.get("SJXCRY")).get("RYXM")));
                    }
                }
                //巡查结果
                StringBuilder xcjg = new StringBuilder();
                if(!"".equals(map.get("XCJG"))){
                    xcjg.append(ComConvert.toString(ComConvert.toMap(map.get("XCJG")).get("VALUE")));
                }
                //所属街镇
                StringBuilder ssjz = new StringBuilder();
                if(!"".equals(map.get("SSJZ"))){
                    ssjz.append(ComConvert.toString(ComConvert.toMap(map.get("SSJZ")).get("JZMC")));
                }
                //所属辖区
                StringBuilder ssxq = new StringBuilder();
                if(!"".equals(map.get("SSXQ"))){
                    ssxq.append(ComConvert.toString(ComConvert.toMap(map.get("SSXQ")).get("XZQHJC") == "" ? ComConvert.toMap(map.get("SSXQ")).get("XZQHMC") : ComConvert.toMap(map.get("SSXQ")).get("XZQHJC")));
                }
                //实际巡查内容
                StringBuilder sjxcnr = new StringBuilder();
                if(!"".equals(map.get("SJXCNR"))){
                    if(map.get("SJXCNR") instanceof java.util.List){
                        List list = (List) map.get("SJXCNR");
                        for (Object obj:list) {
                            Map temp = (Map) obj;
                            sjxcnr.append(ComConvert.toString(ComConvert.toString(temp.get("XJDW")+"，")));
                            sjxcnr.append(ComConvert.toString(ComConvert.toString(temp.get("XJSM")+"；")));
                        }
                    }else {
                        sjxcnr.append(ComConvert.toString(ComConvert.toMap(map.get("SJXCNR")).get("XJDW")+"，"));
                        sjxcnr.append(ComConvert.toString(ComConvert.toMap(map.get("SJXCNR")).get("XJSM")+"；"));
                    }
                }
                //计划巡查内容
                StringBuilder jhxcnr = new StringBuilder();
                if(!"".equals(map.get("JHXCNR"))){
                    if(map.get("JHXCNR") instanceof java.util.List){
                        List list = (List) map.get("JHXCNR");
                        for (Object obj:list) {
                            Map temp = (Map) obj;
                            jhxcnr.append(ComConvert.toString(ComConvert.toString(temp.get("XJDW")+"，")));
                            jhxcnr.append(ComConvert.toString(ComConvert.toString(temp.get("XJSM")+"；")));
                        }
                    }else {
                        jhxcnr.append(ComConvert.toString(ComConvert.toMap(map.get("JHXCNR")).get("XJDW")+"，"));
                        jhxcnr.append(ComConvert.toString(ComConvert.toMap(map.get("JHXCNR")).get("XJSM")+"；"));
                    }
                }
                //附件信息
                StringBuilder fjxx = new StringBuilder();
                if (!"".equals(map.get("FJXX"))) {
                    if(map.get("FJXX") instanceof java.util.List){
                        List list = (List) map.get("FJXX");
                        for (Object obj : list) {
                            Map temp = (HashMap) obj;
                            fjxx.append("附件类型：" + ComConvert.toString(temp.get("FJLX") + "，"));
                            fjxx.append("附件名称：" + ComConvert.toString(temp.get("FJMC") + "，"));
                            fjxx.append("附件后缀：" + ComConvert.toString(temp.get("FJHZ") + "，"));
                            fjxx.append("附件描述：" + ComConvert.toString(temp.get("FJMS") + "，"));
                            fjxx.append("Url地址：" + ComConvert.toString(temp.get("FJDZ") + "，"));
                            fjxx.append("显示顺序：" + ComConvert.toString(temp.get("XSSX") + "；"));
                        }
                    }else {
                        fjxx.append("附件类型：" + ComConvert.toString(ComConvert.toMap(map.get("FJXX")).get("FJLX")));
                        fjxx.append("附件名称：" + ComConvert.toString(ComConvert.toMap(map.get("FJXX")).get("FJMC")));
                        fjxx.append("附件后缀：" + ComConvert.toString(ComConvert.toMap(map.get("FJXX")).get("FJHZ")));
                        fjxx.append("附件描述：" + ComConvert.toString(ComConvert.toMap(map.get("FJXX")).get("FJMS")));
                        fjxx.append("Url地址：" + ComConvert.toString(ComConvert.toMap(map.get("FJXX")).get("FJDZ")));
                        fjxx.append("显示顺序：" + ComConvert.toString(ComConvert.toMap(map.get("FJXX")).get("XSSX")));
                    }

                }
                xcxxMap.put("XXBH", ComConvert.toString(map.get("XXBH")));
                xcxxMap.put("RWBH", ComConvert.toString(map.get("RWBH")));
                xcxxMap.put("RWMC", ComConvert.toString(map.get("RWMC")));
                xcxxMap.put("QYXX", ComConvert.toString(qyxx));
                xcxxMap.put("XCFL", ComConvert.toString(xcfl));
                xcxxMap.put("XCLB", ComConvert.toString(xclb));
                xcxxMap.put("XCZT", ComConvert.toString(xczt));
                xcxxMap.put("JHXCNR", ComConvert.toString(jhxcnr));
                xcxxMap.put("JHXCSM", ComConvert.toString(map.get("JHXCSM")));
                xcxxMap.put("JHKSSJ", ComConvert.toString(map.get("JHKSSJ")));
                xcxxMap.put("JHJSSJ", ComConvert.toString(map.get("JHJSSJ")));
                xcxxMap.put("JHXCRY", ComConvert.toString(jhxcry));
                xcxxMap.put("SJXCRY", ComConvert.toString(sjxcry));
                xcxxMap.put("SJKSSJ", ComConvert.toString(map.get("SJKSSJ")));
                xcxxMap.put("SJJSSJ", ComConvert.toString(map.get("SJJSSJ")));
                xcxxMap.put("SJXCNR", ComConvert.toString(sjxcnr));
                xcxxMap.put("SJXCSM", ComConvert.toString(map.get("SJXCSM")));
                xcxxMap.put("XCJG", ComConvert.toString(xcjg));
                xcxxMap.put("FJXX", ComConvert.toString(fjxx));
                xcxxMap.put("SSJZ", ComConvert.toString(ssjz));
                xcxxMap.put("SSXQ", ComConvert.toString(ssxq));
                xcxxMap.put("BZXX", ComConvert.toString(map.get("BZXX")));
                result.add(xcxxMap);
            }
            return result;
        }
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public String saveXcxxgl(@RequestParam Map<String, Object> params) throws IOException {

        Map object = new ObjectMapper().readValue(params.get("miniFire").toString(), Map.class);
        return xcxxglService.saveXcxxgl(object);
    }

}
