package com.kedacom.ezSafe.yjzb.yjsc.service;


import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.ESComUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by yangyuntao
 * Date: 2018/9/7
 **/
@Service
public class YjfaService {

    @Autowired
    private ESComUtil esComUtil;

    public boolean updateYjfa(String id, String docJson) {
        return esComUtil.update(EsAliases.YJFA, id, docJson);
    }
}