package com.kedacom.ezSafe.qyda.qyxx.zzjg;

import com.kedacom.ezSafe.common.service.EsCommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * @author luping
 * @date 2018/9/17
 */
@RestController
@RequestMapping("/api/zzjg")
public class ZzjgAPI {

    @Autowired
    EsCommonService esCommonService;

    @RequestMapping(value = "/getZzjg", method = RequestMethod.POST)
    public Map getZzjg(@RequestParam Map<String, Object> params) {
        params.put("limit", params.get("pageSize"));
        params.put("offset",params.get("skip"));
        return esCommonService.selectPagedDataByMap("a_safe_aqscjg","aqscjg",params);
    }
}
