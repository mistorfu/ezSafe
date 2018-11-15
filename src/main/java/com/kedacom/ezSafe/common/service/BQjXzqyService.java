package com.kedacom.ezSafe.common.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.kedacom.avatar.core.base.BaseService;
import com.kedacom.ezSafe.common.bean.UserInfoBean;
import com.kedacom.ezSafe.common.dao.BQjXzqyDao;
import com.kedacom.ezSafe.common.dao.UserDao;
import com.kedacom.ezSafe.common.domain.BQjXzqy;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by xuerdi on 2017/9/21.
 */
@Service
public class BQjXzqyService extends BaseService<BQjXzqy> {

    @Autowired
    private UserDao userDao;

    public List<BQjXzqy> getChildrenByXZBM(String name) {
        BQjXzqyDao Bdao = (BQjXzqyDao)this.dao;
        String[] zhixiashi = {"110000" , "120000" , "310000"};
        String[] zhixiaxian = {"130000","650000","420000","460000","410000"};
        if (name.equals("500000") || name.equals("500100") || name.equals("500200")){   //重庆，特殊处理，直辖县
            name = "'500100','500200'";
        }
        for (String zxs : zhixiashi) {   //直辖市特殊处理
            if (zxs.equals(name)) {
                name = name.substring(0,3) + "100";
                break;
            }
        }
        for (String zxx : zhixiaxian) {    //拥有直辖县的省份特殊处理
            if (zxx.equals(name)) {
                name = "'" + name + "','" + name.substring(0,2) + "9000'";
                break;
            }
        }
        List<BQjXzqy> result = Bdao.getChildrenByXZBM(name, RowBounds.DEFAULT);
        for (BQjXzqy item: result) {
            String midBh = item.getXzbm();
            if (midBh.length() > 7 &&  midBh.substring(2,6).equals("9000")) {
                result.remove(item);
                break;
            }
        }
        return result;
    }

    public Integer countChildrenByXZBM(String name) {
        BQjXzqyDao Bdao = (BQjXzqyDao)this.dao;
        String[] zhixiashi = {"110000" , "120000" , "310000"};
        String[] zhixiaxian = {"130000","650000","420000","460000","410000"};
        if (name.equals("500000") || name.equals("500100")){   //重庆，特殊处理，直辖县
            name = "'500100','500200'";
        }
        for (String zxs : zhixiashi) {   //直辖市特殊处理
            if (zxs.equals(name)) {
                name = name.substring(0,3) + "100";
                break;
            }
        }
        for (String zxx : zhixiaxian) {    //拥有直辖县的省份特殊处理
            if (zxx.equals(name)) {
                name = "'" + name + "','" + name.substring(0,2) + "9000'";
                break;
            }
        }
        return Bdao.countChildrenByXZBM(name, RowBounds.DEFAULT);
    }

    public BQjXzqy getXznbbmByXZBM(String name) {
        BQjXzqyDao Bdao = (BQjXzqyDao)this.dao;
        return Bdao.getXznbbmByXZBM(name, RowBounds.DEFAULT);
    }

    public BQjXzqy getXznbbmByXZMC(String name) {
        BQjXzqyDao Bdao = (BQjXzqyDao)this.dao;
        return Bdao.getXznbbmByXZMC(name, RowBounds.DEFAULT);
    }

    public List<BQjXzqy> searchXzqhByQypy(Map param) {
        BQjXzqyDao Bdao = (BQjXzqyDao)this.dao;
        return Bdao.searchXzqhByQypy(param, RowBounds.DEFAULT);
    }

    private static Cache<String, List<BQjXzqy>> treenodexzqys = CacheBuilder.newBuilder()
            .maximumSize(100)//最多100个
            .expireAfterWrite(2, TimeUnit.HOURS)//写入后多久失效
            .expireAfterAccess(1, TimeUnit.HOURS)//多久没有读写则失效
            .initialCapacity(10)
            .build();

   private static Cache<String, BQjXzqy> xzqys = CacheBuilder.newBuilder()
            .maximumSize(3000)//最多3000个
            .expireAfterWrite(2, TimeUnit.HOURS)//写入后多久失效
            .expireAfterAccess(1, TimeUnit.HOURS)//一个小时没有读写则失效
            .build();

    /***
     * 根据行政编码获取行政区域数据
     * 利用缓存机制，防止频繁读取数据库
     * @param xzbm 行政编码
     * @return {@link BQjXzqy}
     */
    public BQjXzqy getXzqy(String xzbm)
    {
        BQjXzqyDao Bdao = (BQjXzqyDao)this.dao;
        BQjXzqy bQjXzqyEntity=xzqys.getIfPresent(xzbm);
        if(bQjXzqyEntity==null) {
            bQjXzqyEntity = Bdao.findByXzbm(xzbm);
            if(bQjXzqyEntity!=null) {
                xzqys.put(bQjXzqyEntity.getXzbm(), bQjXzqyEntity);
            }
        }
        return bQjXzqyEntity;
    }

    /***
     * 根据用户名获取其所在辖区
     * @param username
     * @return
     */
    public UserInfoBean getUserSsxq(String username)
    {
        if(username==null)return null;
        return userDao.getUserSsxq(username);
    }

    public List<BQjXzqy> getXzqyByXznbbm(String xznbbm) {
        Map<String, Object> params = new HashMap<>();
        params.put("xznbbm", xznbbm);
        List<BQjXzqy> xzqyList = dao.selectByMap(params, RowBounds.DEFAULT);

        return xzqyList;
    }

    public Map<String, Integer> checkXzqyChildren(List<String> xzbms) {
        List<Map> dataList = ((BQjXzqyDao) dao).checkXzqyChildren(xzbms);
        Map<String, Integer> result = new HashMap<String, Integer>();
        for(Map map : dataList){
            result.put(map.get("XZFBM").toString(), Integer.parseInt(map.get("CHILDRENNUM").toString()));
        }
        return result;
    }

    public List<BQjXzqy> selectXzqyChain(String xzbm) {
        BQjXzqyDao Bdao = (BQjXzqyDao)this.dao;
        return Bdao.selectXzqyChain(xzbm);
    }
}
