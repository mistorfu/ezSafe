package com.kedacom.ezSafe.qyda.qyxx.aqsg;


import com.kedacom.ezSafe.common.service.EsCommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aqsg")
public class AqsgApI {

    @Autowired
    private EsCommonService esCommonService;

    @RequestMapping("/getaqsg")
    public List<Map> getAqsg(String KSSJ,String QYBH){

        int fromdate = Integer.parseInt(KSSJ);
        int todate = fromdate + 1;

        Map<String,Object> params = new HashMap<>();
        params.put("kssj|gte",fromdate+"-01-01 00:00:00");
        params.put("kssj|lt",todate+"-01-01 00:00:00");
        params.put("qyxx.qybh","Q/ASLJSW0001S-2013");
        params.put("sort","KSSJ");

        return esCommonService.selectByMap("a_safe_qyaqsg","qyaqsg",params);
    }
    @RequestMapping("/getaqsgxq")
    public List<Map> getAqsgxx(@RequestParam Map<String,Object> params){
        System.out.println(params.get("XXBH"));

        return esCommonService.selectByMap("a_safe_qyaqsg","qyaqsg",params);
    }

}
