package com.kedacom.ezSafe.qyda.qyxx;

import com.kedacom.ezSafe.common.service.EsCommonService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Created by fudapeng on 2018/9/21.
 */
@RestController
@RequestMapping("/api/qyda/qyxx")
public class QyxxAPI {
    private static final Logger logger = LoggerFactory.getLogger(QyxxAPI.class);
    @Autowired
    private EsCommonService commonService;

    @RequestMapping(value = "qygk")
    public List<Map> getQygkxx(@RequestParam Map<String, Object> params) {
        return commonService.selectByMap("a_safe_qyjcxx", "qyjcxx", params);
    }
}