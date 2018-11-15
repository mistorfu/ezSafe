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
public class YjzsService {

    @Autowired
    private ESComUtil esComUtil;

    public boolean addYjzs(String id, String docJson) {
        return esComUtil.index(EsAliases.YJZS, id, docJson);
    }

    public boolean updateYjzs(String id, String docJson) {
        return esComUtil.update(EsAliases.YJZS, id, docJson);
    }
}