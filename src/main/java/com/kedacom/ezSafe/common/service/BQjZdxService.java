package com.kedacom.ezSafe.common.service;

import com.kedacom.avatar.core.base.BaseService;
import com.kedacom.ezSafe.common.dao.BQjZdxDao;
import com.kedacom.ezSafe.common.domain.BQjZdx;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BQjZdxService extends BaseService<BQjZdx> {

    public List<BQjZdx> selectZdmcChain(String zdbh) {
        BQjZdxDao Bdao = (BQjZdxDao)this.dao;
        return Bdao.selectZdmcChain(zdbh);
    }
}
