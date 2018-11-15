package com.kedacom.ezSafe.common.service;

import com.kedacom.avatar.core.base.BaseService;
import com.kedacom.avatar.core.dao.mapper.MapperCriteria;
import com.kedacom.avatar.core.dao.mapper.MapperExample;
import com.kedacom.ezSafe.common.dao.UnitDao;
import com.kedacom.ezSafe.common.domain.Unit;
import com.kedacom.avatar.logging.AvatarLogger;
import com.kedacom.avatar.logging.AvatarLoggerFactory;
import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CopyRight ©1995-2015: 苏州科达科技股份有限公司
 * Project： avatar-ezFireExt
 * Module：  com.kedacom.ezSafe.statistic.service
 * Description：
 * Author：      Liwei
 * Create Date： 2015/3/20 9:53
 * Version：     V0.1
 * History：add getUnitByUnitCode method with cache capacity
 */
@Service
public class UnitService extends BaseService<Unit> {

    AvatarLogger avatarLogger = AvatarLoggerFactory.getLogger(UnitService.class, "ezFireExt.UnitService");

    /**
     * 获取顶级组织机构
     *
     * @return
     */
    public Unit getRootUnit() {
        MapperExample example = new MapperExample();
        example.createCriteria().addCriterion("lsgx = ", "-1", "lsgx");
        List<Unit> units = super.selectByExample(example, new RowBounds());
        if (units.size() == 0) {
            avatarLogger.debug("Unit not found root unit.");
            return null;
        } else {
            return units.get(0);
        }
    }

    /**
     * 获取直接子节点，不包括节点本身
     *
     * @param dwnbbm 单位内部编码
     * @return
     */
    public List<Unit> getDirectSubUnitNodes(String dwnbbm) {
        String unitCode = dwnbbm.substring(dwnbbm.lastIndexOf(".") + 1);
        List<Unit> unitList = _getDirectSubNodes(unitCode);
        // 过滤直属科室等
//        UnitUtil.filterUnitDirectOffice(ret);
        return unitList;
    }

    public List<Unit> getSelfAndSubUnitNodes(String dwnbbm) {
        String unitCode = dwnbbm.substring(dwnbbm.lastIndexOf(".") + 1);
        List<Unit> unitList = _getDirectSubNodesAndSelf(unitCode);
        return unitList;
    }

    public Unit getUnitByUnitCode(String unitCode) {
        MapperExample example = new MapperExample();
        example.createCriteria().addCriterion("dwbh = ", unitCode, "dwbh");
        avatarLogger.debug("get unit by the unit code which is {}", unitCode);
        List<Unit> units = super.selectByExample(example, new RowBounds());
        if (units.size() == 0) {
            avatarLogger.debug("Unit not found with unitCode {}", unitCode);
            return null;
        } else {
            return units.get(0);
        }
    }

    /**
     * 按照单位编号，批量查询单位信息
     *
     * @param unitCodes
     * @return
     */
    public List<Unit> findByUnitCodes(List<String> unitCodes) {
        List<Unit> units = new ArrayList<Unit>();
        UnitDao unitDao = (UnitDao) dao;
        try {
            units = unitDao.findByUnitCodes(unitCodes);
        } catch (Exception e) {
            avatarLogger.error("", "fail to getUnit from DB", e.getMessage(), e.getCause());
            avatarLogger.debug(e.getMessage(), e);
        }
        return units;
    }

    public List<Unit> getTopChildUnits() {
        Unit root = getRootUnit();
        if (root == null) {
            return new ArrayList<Unit>();
        } else {
            return getDirectSubUnitNodes(root.getDwnbbm());
        }
        //return getDirectSubUnitNodes(root);
    }

    public int getChildsCount(String parentId) {
        Map params = new HashMap();
        params.put("lsgx", parentId);
        params.put("sfxq", 1);
        int nCount = super.countByMap(params);
        return nCount;
    }

    /**
     * 获取当前节点的所有子，孙，……节点
     */
    public List<Unit> getUnitDescendant(String dwnbbm) {
        UnitDao unitDao = (UnitDao) this.dao;
        List<Unit> unitList = unitDao.getUnitDescendant(dwnbbm);
        return unitList;
    }

    /**
     * 根据单位编码查询其自身和其直接下级节点
     *
     * @param unitInnerCode {dwnbbm, 单位内部编码}
     * @return
     */
    public List<Unit> getSelfAndDirectSubNodes(String unitInnerCode) {
        String unitCode = unitInnerCode.substring(unitInnerCode.lastIndexOf(".") + 1);
        List<Unit> unitList = getSelfAndDirectSubNodesByUnitCode(unitCode);
        return unitList;
    }

    /**
     * 根据单位编码查询其自身和其直接下级节点
     *
     * @param unitCode {dwnbbm, 单位内部编码}
     * @return
     */
    public List<Unit> getSelfAndDirectSubNodesByUnitCode(String unitCode) {
        List<Unit> unitList = _getDirectSubNodesAndSelf(unitCode);
        // 过滤直属科室等
//        UnitUtil.filterUnitDirectOffice(unitList);
        return unitList;
    }

    public Map<String, Unit> getCachedUnits() {
        Map<String, Unit> resultMap = new HashMap<String, Unit>();
        MapperExample example = new MapperExample();
        example.createCriteria().addCriterion("SFXQ = ", 1, "sfxq");
        List<Unit> units = super.selectByExample(example, new RowBounds());
        for (Unit unit : units) {
            resultMap.put(unit.getDwbh(), unit);
        }
        return resultMap;
    }

    /**
     * dengzhaohui
     * 获取有效的所有单位（有监控点位的单位）省，市，县，派出所
     *
     * @return key = orgCode
     * value = unit
     */
    public List<Unit> getAllEffectiveUnit() {
        List<Unit> retList = new ArrayList<Unit>();
        MapperExample example = new MapperExample();
        example.createCriteria().addCriterion("SFXQ = ", 1, "sfxq");
        List<Unit> units = super.selectByExample(example, new RowBounds());
        if (units == null || units.size() == 0) {
            avatarLogger.debug("Unit not found with unitCode {}");
            return retList;
        }
        // 过滤直属科室等
//        UnitUtil.filterUnitDirectOffice(units);
        return units;
    }

    public int insertAutoXH(Unit unit) {
        UnitDao unitDao = (UnitDao) this.dao;
        return unitDao.insertAutoXH(unit);
    }

    /**
     * 通过行政单位编码， 查询指定行政单位的直接子行政单位集合
     *
     * @param unitCode
     * @return
     */
    private List<Unit> _getDirectSubNodes(String unitCode) {
        MapperExample mapperExample = new MapperExample();
        MapperCriteria mapperCriteria = mapperExample.createCriteria();
        mapperCriteria.addCriterion("SFXQ = ", 1, "sfxq");
        mapperCriteria.addCriterion("LSGX = ", unitCode, "lsgx");
        mapperExample.setOrderByClause("LSGX ASC");

        UnitDao unitDao = (UnitDao) dao;
        List<Unit> list = unitDao.selectByExample(mapperExample, RowBounds.DEFAULT);
        return list;
    }

    /**
     * 通过行政单位编码， 查询指定行政单位的直接子行政单位集合和其本身
     *
     * @param unitCode
     * @return
     */
    List<Unit> _getDirectSubNodesAndSelf(String unitCode) {
        MapperExample mapperExample = new MapperExample();
        MapperCriteria mapperCriteria = mapperExample.createCriteria();
        mapperCriteria.addCriterion("SFXQ = ", 1, "sfxq");
        mapperCriteria.addCriterion("LSGX = ", unitCode, "lsgx");

        MapperCriteria orCriteria = mapperExample.createCriteria();
        orCriteria.addCriterion("DWBH = ", unitCode, "dwbh");
        mapperExample.or(orCriteria);

        mapperExample.setOrderByClause("LSGX ASC, DWBH ASC");

        UnitDao unitDao = (UnitDao) dao;
        List<Unit> list = unitDao.selectByExample(mapperExample, RowBounds.DEFAULT);
        return list;
    }

}
