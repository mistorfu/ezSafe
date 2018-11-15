package com.kedacom.ezSafe.common.dao;

import com.kedacom.avatar.core.dao.Dao;
import com.kedacom.ezSafe.common.domain.BQjXzqy;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

/**
 * Created by xuerdi on 2017/9/21.
 */
public interface BQjXzqyDao extends Dao<BQjXzqy> {
    public List<BQjXzqy> getChildrenByXZBM(String xzfbm, RowBounds rowBounds);

    public BQjXzqy getXznbbmByXZBM(String name, RowBounds rowBounds);

    public BQjXzqy getXznbbmByXZMC(String name, RowBounds rowBounds);

    public List<BQjXzqy> searchXzqhByQypy(Map param, RowBounds rowBounds);

    /***
     * 返回对应行政级别以上的区域
     * -1获取所有
     * @param xzjb 0国1省2市3区县
     * @return 返回行政区域列表
     */
    List<BQjXzqy> find(@Param("xzjb") Integer xzjb);

    /***
     * 根据行政编码获取该区域下所有的行政区域集合
     * @param xzbm
     * @return
     */
    List<BQjXzqy> findAllByXzbm(@Param("xzbm") String xzbm);


    /**
     * 根据行政编码获取行政区域
     * @param xzbm
     * @return
     */
    BQjXzqy findByXzbm(@Param("xzbm") String xzbm);


    List<BQjXzqy> selectXzqyChain(@Param("xzbm") String xzbm);

    Integer countChildrenByXZBM(String xzfbm, RowBounds rowBounds);
	
	List<Map> checkXzqyChildren(@Param(value = "xzbms") List<String> xzbms);
}
