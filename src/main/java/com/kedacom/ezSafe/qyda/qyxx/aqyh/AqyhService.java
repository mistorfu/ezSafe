package com.kedacom.ezSafe.qyda.qyxx.aqyh;

import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermsQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.ParsedTerms;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class AqyhService {

    private static final Logger logger = LoggerFactory.getLogger(AqyhService.class);
    @Autowired
    private ESClientManager esClientManager;

    public Map<String,Object> selectDataByYear(Set<String> keys){
        Map<String,Object> aggMap = new HashMap<>();
        Map<String,Object> xcrwList = new HashMap<>();
        TermsQueryBuilder termsQueryBuilder = QueryBuilders.termsQuery("RWBH",keys);

        AggregationBuilder aggregationBuilder = AggregationBuilders.terms("yhsl").field("RWBH").size(500);

        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().query(termsQueryBuilder).size(500).aggregation(aggregationBuilder).explain(false);
        SearchRequest searchRequest = new SearchRequest().indices("safe_qyaqyh_read").types("qyaqyh").source(searchSourceBuilder);

        logger.info(searchRequest.toString());

        try {
            SearchResponse response = esClientManager.getClient().search(searchRequest);

            SearchHit[] hits = response.getHits().getHits();
            for (SearchHit hit : hits) {
                Map<String, Object> sourceAsMap = hit.getSourceAsMap();

                try{
                    List<Map> zgjl = (List<Map>) sourceAsMap.get("ZGJL");
                    Collections.sort(zgjl, new Comparator<Map>() {
                        @Override
                        public int compare(Map o1, Map o2) {
                            if (o1.get("ZGSJ") == null && o2.get("ZGSJ") == null)
                                return 0;
                            if (o1.get("ZGSJ") == null)
                                return -1;
                            if (o2.get("ZGSJ") == null)
                                return 1;
                            try{
                                DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                                Date date1 =sdf.parse(o2.get("ZGSJ").toString());
                                Date date2 =sdf.parse(o1.get("ZGSJ").toString());
                                return Long.valueOf(date2.getTime()).compareTo(Long.valueOf(date1.getTime()));
                            }catch (Exception ex){
                                System.out.println("时间转换异常");
                            }
                            return 0;

                        }
                    });

                    for ( int tag = 1; tag<=zgjl.size();tag++ ) {
                        Map next =zgjl.get(tag-1);
                        next.put("ZGCX",tag);
                    }
                }catch (Exception ex){
                    System.out.println(ex.getMessage());
                }

                String rwbh = (String) sourceAsMap.get("RWBH");
                List tempList = new ArrayList();
                if(xcrwList.containsKey(rwbh)){
                    List rwxxs = (List) xcrwList.get(rwbh);
                    rwxxs.add(sourceAsMap);


                }else{
                    tempList.add(sourceAsMap);
                    xcrwList.put(rwbh,tempList);
                }

            }


            ParsedTerms parsedTerms = (ParsedTerms) response.getAggregations().asMap().get("yhsl");
            List<? extends Terms.Bucket> buckets = parsedTerms.getBuckets();
            for (Terms.Bucket bucket : buckets){
                aggMap.put( bucket.getKeyAsString(),bucket.getDocCount());
            }
            aggMap.put("yhxq",xcrwList);
            return aggMap;
        } catch (java.io.IOException e) {
            logger.warn("search data from ES error. " + e.getMessage());
        }

        return aggMap;
    }

    public List<Map<String,Object>> selectXCRWByYear(String gteYear,String ltYear,String qybh){
        List<Map<String,Object>> lists = new ArrayList<>();
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        boolQueryBuilder.must(QueryBuilders.rangeQuery("RKSJ").gte(gteYear));
        boolQueryBuilder.must(QueryBuilders.rangeQuery("RKSJ").lt(ltYear));
        boolQueryBuilder.must(QueryBuilders.termQuery("QYXX.QYBH",qybh));



        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().query(boolQueryBuilder).size(500).explain(false);
        SearchRequest searchRequest = new SearchRequest().indices("safe_qyxcrw_read").types("qyxcrw").source(searchSourceBuilder);

        logger.info(searchRequest.toString());

        try {
            SearchResponse response = esClientManager.getClient().search(searchRequest);
            for (SearchHit hit :  response.getHits()){
                Map<String, Object> sourceAsMap = hit.getSourceAsMap();
                lists.add(sourceAsMap);
            }

            return lists;
        } catch (java.io.IOException e) {
            logger.warn("search data from ES error. " + e.getMessage());
        }
        return lists;
    }

}
