package com.kedacom.ezSafe.common.utils;

import com.kedacom.avatar.base.web.context.SpringContextUtil;
import com.kedacom.ezSafe.common.domain.BQjZdx;
import com.kedacom.ezSafe.common.service.BQjZdxService;
import org.apache.ibatis.session.RowBounds;

import java.util.*;

import static java.util.Arrays.asList;

/**
 * Created by yangjunshi on 2018/1/20.
 */
//字典项缓存
public class ZdxCache {
    private static Map<String,List<BQjZdx>> zdxCacheMap = new HashMap();

    public static void initCache() {
        BQjZdxService zdxService = SpringContextUtil.getBean("BQjZdxService", BQjZdxService.class);
        Map<String, Object> param = new HashMap();
        param.put("orderByClause", "ZDBH ASC");
        List<BQjZdx> zdxList = zdxService.selectByMap(param, RowBounds.DEFAULT);
        Map<String, List<BQjZdx>> zdxMap = new HashMap<>();
        for (BQjZdx zdxItem : zdxList) {
            String zdlx = zdxItem.getZdlx();
            if (!zdxMap.containsKey(zdlx)) {
                List<BQjZdx> temp = new ArrayList<>();
                temp.add(zdxItem);
                zdxMap.put(zdlx, temp);
            } else {
                zdxMap.get(zdlx).add(zdxItem);
            }
        }
        zdxCacheMap = zdxMap;
    }

    //根据字典类型获取字典项
    public static List<BQjZdx> getZdxByZdlx(String zdlx)
    {
        if(!zdlx.isEmpty())
        {
            return zdxCacheMap.get(zdlx);
        }
        else{
            return null;
        }
    }

    //根据字典类型获取字典项
    public static List<BQjZdx> getZdxByZdlx(String zdlx,String zdjb)
    {
        List<BQjZdx> list = new ArrayList<>();
        List<BQjZdx> result = new ArrayList<>();
        if(!zdlx.isEmpty())
        {
            list=zdxCacheMap.get(zdlx);
            for(BQjZdx item:list)
            {
                if(item.getZdjb().equals(zdjb))
                {
                    result.add(item);
                }
            }
            return result;
        }
        else{
            return null;
        }
    }

    //根据字典类型获取字典项(List版)
    public static Map<String,List<BQjZdx>> getZdxByZdlx(List<String> zdlx)
    {
        Map<String,List<BQjZdx>> result=new HashMap<>();
        if(zdlx.size()>0)
        {
            for(int i=0;i<zdlx.size();i++)
            {
                result.put(zdlx.get(i),zdxCacheMap.get(zdlx.get(i)));
            }
            return result;
        }
        else{
            return null;
        }
    }

    //根据字典类型获取字典项(List版)
    public static List<BQjZdx> getZdxByZdlx(String zdlx,boolean returnList)
    {
        List<BQjZdx> result=new ArrayList<>();
        String[] zdlxs=zdlx.split(",");
        if(zdlxs.length>0)
        {
            for(int i=0;i<zdlxs.length;i++)
            {
                result.addAll(zdxCacheMap.get(zdlxs[i]));
            }
            return result;
        }
        else{
            return null;
        }
    }

    //根据字典类型获取字典项(String[]版)
    public static Map<String,List<BQjZdx>> getZdxByZdlx(String[] zdlx)
    {
        List list=asList(zdlx);
        return getZdxByZdlx(list);
    }

    //根据字典类型获取字典项
    public static BQjZdx getZdxByZdlxAndZdbh(String zdlx,String zdbh)
    {
        List<BQjZdx> list = new ArrayList<>();
        if(!zdlx.isEmpty())
        {
            list=zdxCacheMap.get(zdlx);
            for(BQjZdx item:list)
            {
                if(item.getZdbh().equals(zdbh))
                {
                    return item;
                }
            }
        }
        else{
            return null;
        }
        return null;
    }

    //根据字典类型获取字典项树形结构
    public static List<Map<String, Object>> getZdxTreeByZdlx(String zdlx) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<BQjZdx> zdxList = zdxCacheMap.get(zdlx);
        for (BQjZdx item : zdxList) {
            if(item.getSfxs().equals("0"))
            {
                continue;
            }
            if (item.getFjbh().equals("-1")) {
                Map map = initZdxMap(item,zdxList);
                result.add(map);
            }
        }

        return result;
    }

    //根据字典类型获取字典项树形结构
    public static List<Map<String, Object>> getZdxTreeByZdlx(String zdlx,boolean isExpanded) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<BQjZdx> zdxList = zdxCacheMap.get(zdlx);
        for (BQjZdx item : zdxList) {
            if(item.getSfxs().equals("0"))
            {
                continue;
            }
            if (item.getFjbh().equals("-1")) {
                Map map = initZdxMap(item,zdxList);
                map.put("expanded", isExpanded);
                result.add(map);
            }
        }

        return result;
    }

    public static List<Map<String, Object>> getZdxTreeByZdlxNew(String zdlx) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<BQjZdx> zdxList = zdxCacheMap.get(zdlx);
        Map<String, Map<String, Object>> map = new HashMap<>();
        for (BQjZdx item : zdxList) {
            if(item.getSfxs().equals("0"))
            {
                continue;
            }
            Map<String, Object> xzqy = new HashMap<>();
            xzqy.put("id", item.getZdbh());
            xzqy.put("text", item.getZdmc());
            xzqy.put("nbbm", item.getNbbm());
            xzqy.put("fjbm", item.getFjbh());
            xzqy.put("zdpy", item.getZdpy());
            xzqy.put("expanded", false);
            xzqy.put("items", new ArrayList<Map>());
            map.put(item.getZdbh(), xzqy);
        }
        for (String key : map.keySet()) {
            Map map1 = map.get(key);
            if (map.get(map1.get("fjbm")) != null) {
                List list = (List) map.get(map1.get("fjbm").toString()).get("items");
                list.add(map.get(key));
                map.get(map.get(key).get("fjbm").toString()).put("items", list);
            }else{
                result.add(map.get(key));
            }
        }
        return result;
    }

    //根据字典类型获取字典项树形结构(img版)
    public static List<Map<String, Object>> getZdxTreeByZdlx(String zdlx,String img) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<BQjZdx> zdxList = zdxCacheMap.get(zdlx);
        for (BQjZdx item : zdxList) {
            if(item.getSfxs().equals("0"))
            {
                continue;
            }
            if (item.getFjbh().equals("-1")) {
                Map map =initZdxMap(item,zdxList);
                map.put("imageUrl", img);
                map.put("expanded", true);
                result.add(map);
            }
        }

        return result;
    }

    public static List<Map<String, Object>> getNextLevel(String zdbh, List<BQjZdx> zdxList) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (BQjZdx item : zdxList) {
            if(item.getSfxs().equals("0"))
            {
                continue;
            }
            if (item.getFjbh().equals(zdbh)) {
                Map map =initZdxMap(item,zdxList);
                map.put("expanded", false);
                list.add(map);
            }
        }
        if (list.size() > 0) {
            return list;
        } else {
            return null;
        }
    }

    public static List<Map<String, Object>> getNextLevel(String zdbh,String img, List<BQjZdx> zdxList) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (BQjZdx item : zdxList) {
            if(item.getSfxs().equals("0"))
            {
                continue;
            }
            if (item.getFjbh().equals(zdbh)) {
                Map map =initZdxMap(item,zdxList);
                map.put("imageUrl", img);
                map.put("expanded", false);
                list.add(map);
            }
        }
        if (list.size() > 0) {
            return list;
        } else {
            return null;
        }
    }

    //根据字典类型获取下拉结构
    public static List<Map<String , Object>> getZdxDropdownByZdlx(String zdlx,Boolean hasChain) {
        List<Map<String , Object>> result = new ArrayList<>();
        List<BQjZdx> zdx = zdxCacheMap.get(zdlx);
        for (BQjZdx item : zdx) {
            Map<String , Object> map = new HashMap<>();
            map.put("ID" , item.getZdbh());
            map.put("VALUE" , item.getZdmc());
            if(hasChain)
            {
                map.put("CHAIN" , item.getNbbm());
            }
            result.add(map);
        }

        return result;

    }

    //根据字典类型以及字典编号获取内部结构
    public static List<BQjZdx> selectZdmcChain(String zdlx, String zdbh) {
        List<BQjZdx> result = new ArrayList<>();
        List<BQjZdx> zdxList = zdxCacheMap.get(zdlx);
        Map<String, BQjZdx> temp = new HashMap<>();
        String[] fjbms = null;
        for (BQjZdx item : zdxList) {
            if (item.getZdbh().equals(zdbh)) {
                temp.put(item.getZdjb(), item);
                fjbms = item.getNbbm().split("\\.");
            }
        }
        if (fjbms.length > 0) {
            for (BQjZdx item : zdxList) {
                if (Arrays.asList(fjbms).contains(item.getZdbh())) {
                    temp.put(item.getZdjb(), item);
                }
            }
            for(int i = fjbms.length-1;i>=1;i--){
                result.add(temp.get(ComConvert.toString(i)));
            }
        }
        return result;
    }

    private static Map  initZdxMap(BQjZdx item,List zdxList)
    {

        Map<String, Object> map = new HashMap<>();
        map.put("id", item.getZdbh());
        map.put("text", item.getZdmc());
        map.put("nbbm", item.getNbbm());
        map.put("fjbm", item.getFjbh());
        map.put("zdpy", item.getZdpy());
        map.put("zdjb",item.getZdjb());
        map.put("expanded", false);
        map.put("items",getNextLevel(item.getZdbh(), zdxList));
        return map;
    }

}
