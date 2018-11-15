package com.kedacom.ezSafe.yjzb.yjsc.service;

import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.ESComUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by xuerdi
 * Date: 2018/9/7
 **/
@Service
public class SczsService {

    @Autowired
    private ESComUtil esComUtil;

    public Map<String , Object> getYjzs(String id) {
        return esComUtil.getFromId(id , EsAliases.YJZS);
    }

    public Map<String , Object> getYjfa(String id) {
        return esComUtil.getFromId(id , EsAliases.YJFA);
    }
}