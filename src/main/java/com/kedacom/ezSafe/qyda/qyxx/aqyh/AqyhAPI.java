package com.kedacom.ezSafe.qyda.qyxx.aqyh;

import com.kedacom.ezSafe.common.service.EsCommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * Created by fudapeng on 2018/9/13.
 */
@RestController
@RequestMapping("qyda/qyxx")
public class AqyhAPI {

    @Autowired
    EsCommonService esCommonService;

    @Autowired
    AqyhService aqyhService;


    @RequestMapping(value = "aqyh")
    public Map<String,Object> selectAqyhBySeason(Integer year,String qybh){
        Map<String,Object> result= new HashMap<>();

        int s = 1;
        for(int i =1;i<=12;i+=3){
            String from = String.format("%d-%02d-01 00:00:00",year,i);
            String to = String.format("%d-%02d-01 00:00:00",year,i+3);
            if(i==10){
                to = String.format("%d-%02d-01 00:00:00",year+1,1);
            }
            Map<String,Object> params= new HashMap<>();


            params.put("SJKSSJ|gte",from);
            params.put("SJKSSJ|lt",to);
            params.put("qyxx.qybh",qybh);
            params.put("limit",500);


            System.out.println("from:"+from);
            System.out.println("to:"+to);

            //获取所有任务，
            List<Map> list =esCommonService.selectByMap("safe_qyxcrw_read","qyxcrw",params);
            Set<String> keys =new HashSet<>();

            Iterator<Map> iterator = list.iterator();
            while(iterator.hasNext()){
                Map<String, Object> next = iterator.next();
                next.put("YHSL",0);
                next.put("YHXQ",null);
                keys.add((String)next.get("RWBH"));
            }

            //获取隐患数，和隐患id
            Map<String,Object> aggs =aqyhService.selectDataByYear(keys);
            Set<Map.Entry<String, Object>> entries = aggs.entrySet();

            for(Map.Entry<String, Object> m: entries){
                String key = m.getKey();
                Object value = m.getValue();
                if(key.equals("yhxq")){
                    continue;
                }
                for(int j=0;j<list.size();j++){
                    if(list.get(j).get("RWBH").equals(key)){
                        list.get(j).put("YHSL",value);
                        list.get(j).put("YHXQ",((Map)aggs.get("yhxq")).get(key));
                        break;
                    }
                }


            }

            result.put("season"+s++,list);
        }

        return result;
    }



}