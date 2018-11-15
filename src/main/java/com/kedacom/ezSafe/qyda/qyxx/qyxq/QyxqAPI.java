package com.kedacom.ezSafe.qyda.qyxx.qyxq;

import com.kedacom.ezSafe.common.service.EsCommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/qyda/qyxx")
public class QyxqAPI {
    @Autowired
    private EsCommonService esCommonService;

    @RequestMapping(value = "/returnQyxq",method = RequestMethod.GET)
    public Map returnQyxq(@RequestParam Map<String, Object> params){
        Map<String, Object> message = new HashMap<>();
        message.put("message",null);
        List<Map> list = esCommonService.selectByMap("a_safe_qyjcxx","qyjcxx",params);
        if(list.size()>0){
            return list.get(0);
        }else {
            return message;
        }
    }
}
