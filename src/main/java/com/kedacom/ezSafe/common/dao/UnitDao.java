package com.kedacom.ezSafe.common.dao;

import com.kedacom.avatar.core.dao.Dao;
import com.kedacom.ezSafe.common.domain.Unit;

import java.util.List;

/**
 * Created by ligengen on 15-3-12.
 */
public interface UnitDao extends Dao<Unit> {
    /**
     * 按照单位编号，批量查询单位信息
     *
     * @param unitCodes
     * @return
     */
    List<Unit> findByUnitCodes(List<String> unitCodes);

    /**
     * 根据单位内部编号，获取该单位的所有子节点，孙子节点等。但是不包含节点本身
     *
     * @param unitInnerCode 应对数据表中 DWNBBM
     */
    List<Unit> getUnitDescendant(String unitInnerCode);

    int insertAutoXH(Unit unit);

}
