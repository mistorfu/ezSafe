package com.kedacom.ezSafe.qyda.qyxx.aqsg;


import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.*;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class AqsgService {


    @Autowired
    private ESClientManager esClientManager;

    RestHighLevelClient client;

    public List<Map> getAqsgXx(String KSSJ,String QYBH){
        int fromdate = Integer.parseInt(KSSJ);
        int todate = fromdate+1;

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        RangeQueryBuilder rangeQueryBuilder = QueryBuilders
                .rangeQuery("KSSJ")
                .gte(fromdate+"-01-01 00:00:00")
                .lt(todate+"-01-01 00:00:00");
        TermQueryBuilder termQueryBuilder = QueryBuilders
                .termQuery("QYXX.QYBH",QYBH);
        FieldSortBuilder fsb = SortBuilders.fieldSort("KSSJ");
        fsb.order(SortOrder.ASC);
        sourceBuilder.sort(fsb);

        BoolQueryBuilder boolBuilder = QueryBuilders.boolQuery();
        boolBuilder.must(rangeQueryBuilder);
        boolBuilder.must(termQueryBuilder);
        sourceBuilder.query(boolBuilder);
        SearchRequest searchRequest = new SearchRequest()
                .indices("a_safe_qyaqsg")
                .types("qyaqsg")
                .source(sourceBuilder);
        SearchResponse response = null;
        System.out.println(searchRequest);
        try {
            response = esClientManager.getClient().search(searchRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
        SearchHits searchResult = response.getHits();
        List<Map> list = new ArrayList<>();
        Iterator<SearchHit> iterator = searchResult.iterator();
        while (iterator.hasNext()) {
            list.add(iterator.next().getSourceAsMap());
        }
        System.out.println(list.toString());
        System.out.println(list.size());

        return list;
    }

}
