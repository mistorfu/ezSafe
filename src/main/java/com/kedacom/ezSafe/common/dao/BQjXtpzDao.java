package com.kedacom.ezSafe.common.dao;

import com.kedacom.avatar.core.dao.Dao;
import com.kedacom.ezSafe.common.domain.BQjXtpz;

import java.util.List;
import java.util.Map;


public interface BQjXtpzDao extends Dao<BQjXtpz> {

    public List<BQjXtpz> xtpzSearch(Map map);
    public void xtpzDeleteByList(List xhs);
    public Long getNextXh();
}
