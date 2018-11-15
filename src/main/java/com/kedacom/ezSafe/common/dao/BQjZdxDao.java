package com.kedacom.ezSafe.common.dao;

import com.kedacom.avatar.core.dao.Dao;
import com.kedacom.ezSafe.common.domain.BQjZdx;

import java.util.List;

/**
 * Created by xuerdi on 2017/9/21.
 */
public interface BQjZdxDao extends Dao<BQjZdx> {
    public List<BQjZdx> selectByZdlx(String zdlx);

    public List<BQjZdx> selectZdmcChain(String zdbh);

}
