package com.kedacom.ezSafe.common.service;


import com.kedacom.ezSafe.common.domain.BQjXzqy;
import com.kedacom.ezSafe.common.domain.BQjZdx;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.ESComUtil;
import com.kedacom.ezSafe.common.utils.ZdxCache;
import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.range.Range;
import org.elasticsearch.search.aggregations.bucket.range.date.DateRangeAggregationBuilder;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 灾情信息
 */
@Service
@SuppressWarnings("unchecked")
public class AFireZqxxService {

    private final ESComUtil esComUtil;
    private final BQjXzqyService m_bQjXzqyService;
    private final ESClientManager esClientManager;

    @Autowired
    public AFireZqxxService(ESComUtil esComUtil , BQjXzqyService m_bQjXzqyService ,
                            ESClientManager esClientManager) {
        this.esComUtil = esComUtil;
        this.m_bQjXzqyService = m_bQjXzqyService;
        this.esClientManager = esClientManager;
    }

    /**
     * 根据灾情编号获取灾情信息
     **/
    public Map<String , Object> getZqxxByZqbh(String zqbh) {
        return esComUtil.getFromId(zqbh , EsAliases.ZQXX);
    }

    /**
     * 根据行政区划编号 时间段 灾情类型 获取灾情等级统计
     * @param params province：行政区划编号，ZQLX：灾情类型数据链，timeList：时间段列表
     * @return
     */
    public List<Map<String, Object>> getZqdjByDateRange(Map<String , Object> params)
    {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Map<String , Object>> realRes = new ArrayList<>();

        String name = params.get("province").toString();

        BQjXzqy item = m_bQjXzqyService.getXznbbmByXZBM(name);

        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.must(QueryBuilders.prefixQuery("SZDXZQH.XZQHNBBM",item.getXznbbm())); //行政区划内部编码
        query.must(QueryBuilders.prefixQuery("ZQLX.CHAIN" , ComConvert.toString(params.get("ZQLX")))); //灾情类型
        query.must(QueryBuilders.termQuery("ZQBS","1")); //真警
        query.mustNot(QueryBuilders.regexpQuery("GLBH","*")); //没有关联编号

        List<String> timeList =(List) params.get("timeList");
        Integer length = timeList.size();
        List<Long> emptyValueList = new ArrayList<>();
        String endTime = timeList.get(0);
        AggregationBuilder agg = AggregationBuilders.terms("type").field("ZQDJ.ID");
        DateRangeAggregationBuilder aggr = AggregationBuilders.dateRange("range").field("LASJ");

        for (int i = 0; i < timeList.size(); i++) {
            if (0 != i) {
                emptyValueList.add(0L);
                String startTime = timeList.get(i);
                aggr.addRange(startTime , endTime);
                endTime = startTime;
            }
        }
        agg.subAggregation(aggr);

        SearchSourceBuilder searchSourceBuilder = ESComUtil.getSearchSourceBuilder(query , 0 , agg);
        SearchRequest searchRequest = new SearchRequest().indices(EsAliases.ZQXX.getRead()).types(EsAliases.ZQXX.getType()).source(searchSourceBuilder);
        System.out.println("zqqs" + searchRequest.toString());
        try
        {
            SearchResponse response = esClientManager.getClient().search(searchRequest);
            Terms terms = response.getAggregations().get("type");
            for (Terms.Bucket entry : terms.getBuckets()) {
                Map<String, Object> map = new HashMap<>();
                map.put("name", entry.getKeyAsString());
                Range range = entry.getAggregations().get("range");
                List<String> nameList = new ArrayList<>();
                List<Long> valueList = new ArrayList<>();
                for (Range.Bucket bucket: range.getBuckets()){
                    nameList.add(bucket.getToAsString());
                    valueList.add(bucket.getDocCount());
                }

                map.put("nameList", nameList);
                map.put("valueList" , valueList);

                result.add(map);
            }
            List<BQjZdx> zqdjList = ZdxCache.getZdxByZdlx("10047");
            if (null != zqdjList) {
                for (BQjZdx zqdj : zqdjList) {
                    String zqdjId = zqdj.getZdbh();
                    Boolean flag = false;
                    for (Map<String, Object> singleRes : result) {
                        if (ComConvert.toString(singleRes.get("name")).equals(zqdjId)) {
                            flag = true;
                            singleRes.put("zwm", zqdj.getZdmc());
                            realRes.add(singleRes);
                            break;
                        }
                    }
                    if (!flag) {
                        Map<String, Object> map = new HashMap<>();
                        if (timeList.size() == length) {
                            List<String> tmp = new ArrayList<>();
                            for (int x = timeList.size() - 2 ; x > -1 ; x--) {
                                tmp.add(timeList.get(x));
                            }
                            timeList = tmp;
                        }
                        map.put("nameList", timeList);
                        map.put("valueList", emptyValueList);
                        map.put("name", zqdjId);
                        map.put("zwm", zqdj.getZdmc());
                        realRes.add(map);
                    }
                }
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }

        return realRes;
    }


    /**
     * 删除目录及目录以下文件
     **/
    public void delete(String path) {
        File f = new File(path);
        if (f.isDirectory()) {
            String[] list = f.list();
            for (int i = 0; i < list.length; i++) {
                delete(path + "//" + list[i]);
            }
        }
        f.delete();
    }

    /**
     * 每日凌晨三点删除temp目录下文件
     * **/
    @Scheduled(cron = "0 0 3 * * ?")
    public void timeDelete() {
        ClassLoader loader = AFireZqxxService.class.getClassLoader();
        String dicPath = loader.getResource("").getPath().replace("/WEB-INF", "").replace("/classes", "") + "temp/";
        delete(dicPath);
    }
}
