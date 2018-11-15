package com.kedacom.ezSafe.yjzb.yjsc.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.domain.BQjZdx;
import com.kedacom.ezSafe.common.domain.User;
import com.kedacom.ezSafe.common.service.AFireXfdwService;
import com.kedacom.ezSafe.common.utils.*;
import com.kedacom.ezSafe.yjzb.yjsc.service.YjdxService;
import com.kedacom.ezSafe.yjzb.yjsc.service.YjfaService;
import com.kedacom.ezSafe.yjzb.yjsc.service.YjzsService;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/yjzb/yjsc")
public class YjscAPI {
    @Autowired
    YjdxService yjdxService;
    @Autowired
    YjzsService yjzsService;
    @Autowired
    YjfaService yjfaService;
    @Autowired
    AFireXfdwService xfdwService;

    @RequestMapping(value = "/saveYjdx", method = RequestMethod.POST)
    public String saveYjdx(@RequestParam Map<String, Object> params) {
        Map<String,Object> object =  CommonUtil.parseMap(params.get("yjdx").toString());
        String id = yjdxService.saveYjdx(object);
        return id;
    }

    @RequestMapping(value = "/getYjdx", method = RequestMethod.GET)
    public List<Map<String, Object>> getYjdx() {
        return yjdxService.getYjdx();
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

    /**
     * 修改应急知识
     */
    @RequestMapping(value = "/updateYjzs", method = RequestMethod.POST)
    public boolean updateYjzs(@RequestParam Map<String, Object> params, HttpSession session) {
        User user = (User) session.getAttribute("user");
        Map<String,Object> objData = CommonUtil.parseMap(params.get("yjzs").toString()) ;
        //修改时间
        objData.put("GXRY", user.getDlm());
        objData.put("GXSJ", DateTime.now().toString("yyyy-MM-dd HH:mm:ss"));
        //检索内容
        List<String> jsnr = new ArrayList<>();
        if (!CommonUtil.toString(objData.get("ZSBT")).equals("")) {
            jsnr.addAll(PinyinUtil.generatePinyin(CommonUtil.toString(objData.get("ZSBT")).toUpperCase()));
        }
        if (!CommonUtil.toString(objData.get("ZSNR")).equals("")) {
            jsnr.addAll(PinyinUtil.generatePinyin(CommonUtil.toString(objData.get("ZSNR")).toUpperCase()));
        }
        if (!CommonUtil.toString(objData.get("ZSBZ")).equals("")) {
            jsnr.addAll(PinyinUtil.generatePinyin(CommonUtil.toString(objData.get("ZSBZ")).toUpperCase()));
        }
        if (jsnr.size() > 0) {
            objData.put("JSNR", jsnr.toArray(new String[jsnr.size()]));
        }

        return yjzsService.updateYjzs(objData.get("ZSBH").toString(), CommonUtil.toJSONString(objData));
    }

    /**
     * 修改应急方案
     */
    @RequestMapping(value = "/updateYjfa", method = RequestMethod.POST)
    public boolean updateYjfa(@RequestParam Map<String, Object> params, HttpSession session) {
        User user = (User) session.getAttribute("user");
        Map<String,Object> objData =  CommonUtil.parseMap(params.get("yjfa").toString());
        //修改时间
        objData.put("GXRY", user.getDlm());
        objData.put("GXSJ", DateTime.now().toString("yyyy-MM-dd HH:mm:ss"));
        //检索内容
        List<String> jsnr = new ArrayList<>();
        if (!CommonUtil.toString(objData.get("FAMC")).equals("")) {
            jsnr.addAll(PinyinUtil.generatePinyin(CommonUtil.toString(objData.get("FAMC")).toUpperCase()));
        }
        if (!CommonUtil.toString(objData.get("FANR")).equals("")) {
            jsnr.addAll(PinyinUtil.generatePinyin(CommonUtil.toString(objData.get("FANR")).toUpperCase()));
        }
        if (!CommonUtil.toString(objData.get("FABZ")).equals("")) {
            jsnr.addAll(PinyinUtil.generatePinyin(CommonUtil.toString(objData.get("FABZ")).toUpperCase()));
        }
        if (jsnr.size() > 0) {
            objData.put("JSNR", jsnr.toArray(new String[jsnr.size()]));
        }

        return yjfaService.updateYjfa(objData.get("FABH").toString(), CommonUtil.toJSONString(objData));
    }
	
	@RequestMapping(value = "/getZsfa", method = RequestMethod.GET)
    public List<Map<String, Object>> getZsfa(@RequestParam Map<String, Object> params) {
        return yjdxService.getZsfa(params);
    }

    @RequestMapping(value = "/getZdx", method = RequestMethod.GET)
    public List<BQjZdx> getZdx(@RequestParam Map<String, Object> params) {
        return ZdxCache.getZdxByZdlx(ComConvert.toString(params.get("zdlx")));
    }

    @RequestMapping(value = "/saveZsfaTree", method = RequestMethod.POST)
    public String saveZsfaTree(@RequestParam Map<String, Object> params) {
        yjdxService.insert(params);
        return "success";
    }

    @RequestMapping(value = "/deleteDx", method = RequestMethod.POST)
    public String deleteDx(@RequestParam Map<String, Object> params) {
        yjdxService.delete(params);
        return "success";
    }
}