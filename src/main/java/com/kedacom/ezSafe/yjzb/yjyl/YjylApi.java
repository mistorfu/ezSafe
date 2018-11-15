package com.kedacom.ezSafe.yjzb.yjyl;


import com.kedacom.ezSafe.common.domain.BQjXzqy;
import com.kedacom.ezSafe.common.service.AFireExportService;
import com.kedacom.ezSafe.common.service.AFireZqxxService;
import com.kedacom.ezSafe.common.service.BQjXzqyService;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.CommonUtil;
import com.kedacom.ezSafe.common.utils.PinyinUtil;
import org.apache.ibatis.session.RowBounds;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by yangjunshi on 2018/4/28.
 */
@RestController
@RequestMapping("/api/yjyl")
public class YjylApi {
    private static final Logger logger = LoggerFactory.getLogger(YjylApi.class);

    @Autowired
    private YjylService szylService;

    @Autowired
    private BQjXzqyService bQjXzqyService;

    @Autowired
    private AFireExportService aFireExportService;

    @RequestMapping(value = "/indexNewSzyl", method = RequestMethod.POST)
    public boolean indexNewSzyl(@RequestParam Map<String, Object> params) {
        Map<String, Object> indexParam = new HashMap<>();

        indexParam = setParams(params);
        //入库用户
        if (params.get("user") != null) {
            indexParam.put("RKRY", params.get("user"));
        }
        //入库时间
        indexParam.put("RKSJ", params.get("rksj"));

        //记录状态
        indexParam.put("JLZT", 1);

        //演练文件
        indexParam.put("YLWJ", new ArrayList<>());

        return szylService.indexNewSzyl(indexParam);
    }

    @RequestMapping(value = "/getAllSzyl", method = RequestMethod.GET)
    public List<Map<String, Object>> getAllSzyl(@RequestParam Map<String,Object> params) {
        List<Map<String , Object>> result = szylService.getAllSzyl(params);
        return result;
    }

    @RequestMapping(value = "/updateSzyl", method = RequestMethod.POST)
    public boolean updateSzyl(@RequestParam Map<String, Object> params) {
        Map<String, Object> indexParam = setParams(params);

        //获取ID
        indexParam.put("ID", ComConvert.toString(params.get("id")));

        return szylService.updateSzyl(indexParam);
    }

    @RequestMapping(value = "/deleteSzyl", method = RequestMethod.POST)
    public boolean deleteSzyl(@RequestParam Map<String, Object> params) {
        String id = ComConvert.toString(params.get("id"));
        return szylService.deleteSzyl(id);
    }

    /**
     * 更新文件信息
     */
    @RequestMapping(value = "/updateFile", method = RequestMethod.POST)
    public boolean updateFile(@RequestParam Map<String, Object> params) {
        return szylService.updateFile(params);
    }


    /**
     * 设置好基本条件
     *
     * @param params
     * @return
     */
    private Map<String, Object> setParams(Map<String, Object> params) {
        Map<String, Object> indexParam = new HashMap<>();
        //演练名称
        indexParam.put("YLMC", params.get("ylmc"));
        //演练地点
        if (params.get("yldd") != null) {
            indexParam.put("YLDD", params.get("yldd"));
        } else {
            indexParam.put("YLDD", "");
        }
        //所在地消防机构 、 所在地行政区划
        if (params.get("ssdw") != null) {
            String[] xfjgxzqh = ComConvert.toString(params.get("ssdw")).split(";");
            if (xfjgxzqh.length == 7) {
                Map<String, Object> xfjg = new HashMap<>();
                Map<String, Object> xzqh = new HashMap<>();
                xfjg.put("XFJGBH", xfjgxzqh[0]);
                xfjg.put("XFJGMC", xfjgxzqh[1]);
                xfjg.put("XFJGNBBM", xfjgxzqh[2]);
                xfjg.put("XFJGJC", xfjgxzqh[3]);
                xzqh.put("XZQHBH", xfjgxzqh[4]);
                xzqh.put("XZQHMC", xfjgxzqh[5]);
                xzqh.put("XZQHNBBM", xfjgxzqh[6]);
                indexParam.put("SZDXFJG", xfjg);
                indexParam.put("SZDXZQH", xzqh);
            }
        } else {
            Map<String, Object> xfjg = new HashMap<>();
            Map<String, Object> xzqh = new HashMap<>();
            xfjg.put("XFJGBH", "");
            xfjg.put("XFJGMC", "");
            xfjg.put("XFJGNBBM", "");
            xzqh.put("XZQHBH", "");
            xzqh.put("XZQHMC", "");
            xzqh.put("XZQHNBBM", "");
            indexParam.put("SZDXFJG", xfjg);
            indexParam.put("SZDXZQH", xzqh);
        }
        //开始时间、结束时间
        if (params.get("startTime") != null && !params.get("startTime").equals("")) {
            indexParam.put("KSSJ", ComConvert.toString(params.get("startTime")));
        }
        else{
            indexParam.put("KSSJ",null);
        }
        if (params.get("endTime") != null && !params.get("endTime").equals("")) {
            indexParam.put("JSSJ", ComConvert.toString(params.get("endTime")));
        }
        else{
            indexParam.put("JSSJ", null);
        }

        //演练单位
        if (params.get("yldw") != null) {
            indexParam.put("YLDW", params.get("yldw"));
        } else {
            indexParam.put("YLDW", "");
        }
        //演练内容
        if (params.get("ylnr") != null) {
            indexParam.put("YLNR", params.get("ylnr"));
        } else {
            indexParam.put("YLNR", "");
        }
        //演练概述
        if (params.get("ylgs") != null) {
            indexParam.put("YLGS", params.get("ylgs"));
        } else {
            indexParam.put("YLGS", "");
        }

        //主办单位
        if (params.get("zbdw") != null) {
            indexParam.put("ZBDW", params.get("zbdw"));
        } else {
            indexParam.put("ZBDW", "");
        }

        //参与单位
        if (params.get("cydw") != null) {
            indexParam.put("CYDW", params.get("cydw"));
        } else {
            indexParam.put("CYDW", "");
        }

        //重大安保活动
        if (params.get("zdabhd") != null) {
            String[] zdabhd = ComConvert.toString(params.get("zdabhd")).split(";");
            if (zdabhd.length == 2) {
                Map<String, Object> zdabhdMap = new HashMap<>();
                zdabhdMap.put("ABHDBH", zdabhd[0]);
                zdabhdMap.put("ABHDMC", zdabhd[1]);
                indexParam.put("ZDABHD", zdabhdMap);
            }
        } else {
            Map<String, Object> zdabhdMap = new HashMap<>();
            zdabhdMap.put("ABHDBH", "");
            zdabhdMap.put("ABHDMC", "");
            indexParam.put("ZDABHD", zdabhdMap);
        }

        List<String> jsnr_qh = new ArrayList<>();
        List<String> jsnr_dd = new ArrayList<>();


        //检索内容——演练名称
        String mc = ComConvert.toString(indexParam.get("YLMC"));
        List<String> jsnr_mc = PinyinUtil.generatePinyin(mc);
        //检索内容——行政区划
        if (params.get("ssdw") != null) {
            String[] xfjgxzqh = ComConvert.toString(params.get("ssdw")).split(";");
            if (xfjgxzqh.length == 7) {
                String sheng = "";
                String qhmc = "";
                String[] xzqhnbbm = xfjgxzqh[6].split("\\.");
                for (int i = 1; i < xzqhnbbm.length; i++) {
                    Map<String, Object> paramsMap = new HashMap<>();
                    paramsMap.put("xzbm", xzqhnbbm[i]);
                    BQjXzqy xzqh = bQjXzqyService.selectByMap(paramsMap, RowBounds.DEFAULT).get(0);
                    if (i == 1) {
                        sheng = xzqh.getXzmc();
                    }
                    qhmc += xzqh.getXzmc();
                }

                String qhmc3 = xfjgxzqh[5];
                jsnr_qh.addAll(PinyinUtil.generatePinyin(qhmc));
                jsnr_qh.addAll(PinyinUtil.generatePinyin(qhmc3));

                sheng = sheng + mc;
                jsnr_mc.addAll(PinyinUtil.generatePinyin(sheng));
            }
        }

        //检索内容--演练地点
        String dd = ComConvert.toString(indexParam.get("YLDD"));
        if (!dd.equals("")) {
            jsnr_dd.addAll(PinyinUtil.generatePinyin(dd));
        }

        List<String> jsnr = new ArrayList<>();
        jsnr.addAll(jsnr_dd);
        jsnr.addAll(jsnr_mc);
        jsnr.addAll(jsnr_qh);

        indexParam.put("JSNR", jsnr);

        return indexParam;
    }

    //导出Excel
    @RequestMapping(value = "/exportExcel", method = RequestMethod.POST)
    public String exportExcel(@RequestParam Map<String , Object> params) {
        List<Map<String , Object>> result = new ArrayList<>();//file接收数据
        String flag="false";
        int rowIndex = 0;
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
        List<String> columnName = new ArrayList<>();  //表格title
        List<String> textName = new ArrayList<>();    //每行字段名
        columnName.add("演练名称");
        columnName.add("演练时段");
        columnName.add("演练地点");
        columnName.add("演练单位");
        columnName.add("演练内容");
        textName.add("YLMC");
        textName.add("YLSD");
        textName.add("YLDD");
        textName.add("YLDW");
        textName.add("YLNR");
        List szylArray=CommonUtil.parseList(params.get("szylData").toString());
        for(int i=0;i<szylArray.size();i++)
        {
            Map dxalMap=new HashMap();
            dxalMap.put("YLMC",((Map)szylArray.get(i)).get("YLMC"));
            if(!ComConvert.toString(((Map)szylArray.get(i)).get("KSSJ")).equals("")||!ComConvert.toString(((Map)szylArray.get(i)).get("JSSJ")).equals(""))
            {
                dxalMap.put("YLSD",((Map)szylArray.get(i)).get("KSSJ")+"~"+((Map)szylArray.get(i)).get("JSSJ"));
            }
            else{
                dxalMap.put("YLSD","");
            }
            dxalMap.put("YLDD",((Map)szylArray.get(i)).get("YLDD"));
            dxalMap.put("YLDW",((Map)szylArray.get(i)).get("YLDW"));
            dxalMap.put("YLNR",((Map)szylArray.get(i)).get("YLNR"));
            result.add(dxalMap);
        }
        SXSSFWorkbook wb = new SXSSFWorkbook(5000);
        Sheet sheet = aFireExportService.exportHead(wb,columnName,"应急演练");
        rowIndex = aFireExportService.commonExport(wb, sheet, result, rowIndex,textName);
        try {
            ClassLoader loader = AFireZqxxService.class.getClassLoader();
            String dicPath = loader.getResource("").getPath().replace("/WEB-INF", "").replace("/classes", "") + "temp/";
            String fileName = "yjyl" + df.format(new Date()) + ".xlsx";
            File file = new File(dicPath);
            if (!file.exists()) {
                System.out.println("目标文件所在目录不存在，准备创建目录！");
                file.mkdirs();
                System.out.println("创建目录成功");
            }
            FileOutputStream fout = new FileOutputStream(dicPath + fileName);
            wb.write(fout);
            fout.close();
            return "temp/" + fileName;
        }catch (IOException e) {
            e.printStackTrace();
        }
        return flag;
    }
}
