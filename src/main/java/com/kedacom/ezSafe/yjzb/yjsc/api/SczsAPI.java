package com.kedacom.ezSafe.yjzb.yjsc.api;


import com.kedacom.ezSafe.yjzb.yjsc.service.SczsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Created by xuerdi
 * Date: 2018/9/7
 **/
@RestController
@RequestMapping("/api/yjzb/sczs")
public class SczsAPI {

    @Autowired
    private SczsService sczsService;

    @RequestMapping(value = "/getDetails" , method = RequestMethod.GET)
    public Map<String , Object> getDetails(@RequestParam String id ,
                                           @RequestParam String mark)
    {
        if (mark.equals("zsd")) {
            return sczsService.getYjzs(id);
        } else {
            return sczsService.getYjfa(id);
        }
    }
}