package com.kedacom.ezSafe.qyda.qyxx.flfg;

import com.kedacom.ezSafe.common.service.EsCommonService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * @author luping
 * @date 2018/9/18
 */
@RestController
@RequestMapping("/api/flfg")
public class FlfgAPI {

    @Autowired
    EsCommonService esCommonService;

    @RequestMapping(value = "/getFlfg",method = RequestMethod.POST)
    public Map getFlfg(@RequestParam Map<String,Object> params) {
        params.put("limit",params.get("pageSize"));
        params.put("offset",params.get("skip"));
        return esCommonService.selectPagedDataByMap("a_safe_qyfgzd","qyfgzd",params);
    }
}
