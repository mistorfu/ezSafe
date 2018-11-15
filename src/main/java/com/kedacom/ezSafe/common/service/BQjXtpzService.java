package com.kedacom.ezSafe.common.service;

import com.kedacom.avatar.core.base.BaseService;
import com.kedacom.ezSafe.common.dao.BQjXtpzDao;
import com.kedacom.ezSafe.common.domain.BQjXtpz;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class BQjXtpzService extends BaseService<BQjXtpz> {
    public List<BQjXtpz> xtpzSearch(Map map) {
        BQjXtpzDao Bdao = (BQjXtpzDao)this.dao;
        return Bdao.xtpzSearch(map);
    }

    public void xtpzDeleteByList(List xhs) {
        BQjXtpzDao Bdao = (BQjXtpzDao)this.dao;
        Bdao.xtpzDeleteByList(xhs);
    }

    public Long getNextXh() {
        BQjXtpzDao Bdao = (BQjXtpzDao)this.dao;
        return Bdao.getNextXh();
    }
}
