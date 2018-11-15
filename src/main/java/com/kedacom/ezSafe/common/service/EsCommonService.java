package com.kedacom.ezSafe.common.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.common.geo.builders.ShapeBuilders;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * Created by fudapeng on 2018/9/13.
 */
@Service
public class EsCommonService {
    private static final Logger logger = LoggerFactory.getLogger(EsCommonService.class);
    private static final List<String> reservedParams = Arrays.asList("limit", "offset", "sort", "order", "lat", "lon",
            "distance", "take", "skip", "page", "pageSize", "_", "exportId", "fields", "aggField");

    @Autowired
    private ESClientManager esClientManager;

    /**
     * 通用ES查询，返回分页信息
     * @param index
     * @param type
     * @param params
     * @return
     */
    public Map selectPagedDataByMap(String index, String type, Map<String, Object> params) {
        Map result = new HashMap();

        SearchHits hits = getSearchHitsByMap(index, type, params);
        long count = 0;
        List<Map> data = new LinkedList<Map>();
        if (hits != null) {
            count = hits.getTotalHits();
            SearchHit[] searchHits = hits.getHits();
            if (searchHits != null) {
                for (int i = 0; i < searchHits.length; i++) {
                    data.add(searchHits[i].getSource());
                }
            }
        }

        result.put("data", data);
        result.put("total", count);
        return result;
    }

    /**
     * 通用ES查询
     * @param index
     * @param type
     * @param params
     * @return
     */
    public List<Map> selectByMap(String index, String type, Map<String, Object> params) {
        List<Map> result = new LinkedList<Map>();

        SearchHits hits = getSearchHitsByMap(index, type, params);
        if (hits != null) {
            SearchHit[] searchHits = hits.getHits();
            if (searchHits == null || searchHits.length == 0) {
                return result;
            } else {
                for (int i = 0; i < searchHits.length; i++) {
                    result.add(searchHits[i].getSource());
                }
            }
        }

        return result;
    }

    public Map<String, Integer> getAggregationCount(String index, String type, Map<String, Object> params) {
        QueryBuilder query = getQueryBuilderFromMap(params);
        String aggField = params.get("aggField").toString();
        AggregationBuilder aggregation = AggregationBuilders.terms("agg").field(aggField).size(1000);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().query(query).explain(false).size(0).aggregation(aggregation);
        SearchRequest searchRequest = new SearchRequest().indices(index).types(type).source(searchSourceBuilder);
        logger.info(searchRequest.toString());

        try {
            SearchResponse response = esClientManager.getClient().search(searchRequest);
            Terms terms = response.getAggregations().get("agg");
            Map<String, Integer> map = new HashMap<String, Integer>();
            for (Terms.Bucket bucket : terms.getBuckets()) {
                map.put(bucket.getKey().toString(), (int)bucket.getDocCount());
            }
            return map;
        } catch (java.io.IOException e) {
            logger.warn("search data from ES error. " + e.getMessage());
        }
        return null;
    }

    private SearchHits getSearchHitsByMap(String index, String type, Map<String, Object> params) {
        int limit = params.containsKey("limit") ? Integer.parseInt(params.get("limit").toString()) : 10;
        int offset = params.containsKey("offset") ? Integer.parseInt(params.get("offset").toString()) : 0;

        QueryBuilder query = getQueryBuilderFromMap(params);

        SortBuilder sort = SortBuilders.fieldSort("GXSJ").order(SortOrder.DESC);
        if (params.containsKey("sort")) {
            if (params.containsKey("order")) {
                if (params.get("order").toString().toUpperCase().equals("DESC"))
                    sort = SortBuilders.fieldSort(params.get("sort").toString().toUpperCase()).order(SortOrder.DESC);
                else
                    sort = SortBuilders.fieldSort(params.get("sort").toString().toUpperCase()).order(SortOrder.ASC);
            } else {
                sort = SortBuilders.fieldSort(params.get("sort").toString().toUpperCase()).order(SortOrder.ASC);
            }
        }

        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().from(offset).size(limit).query(query).sort(sort).explain(false);
        if (params.containsKey("fields")) {
            String[] fields = params.get("fields").toString().toUpperCase().split(",");
            searchSourceBuilder.fetchSource(fields, null);
        }
        SearchRequest searchRequest = new SearchRequest().indices(index).types(type).source(searchSourceBuilder);
        logger.info(searchRequest.toString());

        try {
            SearchResponse response = esClientManager.getClient().search(searchRequest);
            return response.getHits();
        } catch (java.io.IOException e) {
            logger.warn("search data from ES error. " + e.getMessage());
        }
        return null;
    }

    public static QueryBuilder getQueryBuilderFromMap(Map<String, Object> params) {
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            String field = entry.getKey();
            if(null == entry.getValue()){
                continue;
            }
            String pattern = entry.getValue().toString();
            if (!reservedParams.contains(field) && !StringUtils.isEmpty(pattern)) {
                if (field.contains("|")) { //范围查询
                    String[] condition = field.toUpperCase().split("\\|");
                    if (condition.length == 2) {
                        if (condition[1].equals("GTE")) {
                            query.must(QueryBuilders.rangeQuery(condition[0]).gte(pattern));
                        } else if (condition[1].equals("GT")) {
                            query.must(QueryBuilders.rangeQuery(condition[0]).gt(pattern));
                        } else if (condition[1].equals("LTE")) {
                            query.must(QueryBuilders.rangeQuery(condition[0]).lte(pattern));
                        } else if (condition[1].equals("LT")) {
                            query.must(QueryBuilders.rangeQuery(condition[0]).lt(pattern));
                        }
                    }
                } else if (pattern.contains(",")) {
                    query.must(QueryBuilders.termsQuery(field.toUpperCase(), pattern.split(",")));
                } else if (pattern.endsWith("*") && pattern.indexOf("*") == pattern.length() - 1) { //前缀查询
                    query.must(QueryBuilders.prefixQuery(field.toUpperCase(), pattern.substring(0, pattern.length() - 1)));
                } else if (pattern.contains("*")) { //通配符查询
                    query.must(QueryBuilders.wildcardQuery(field.toUpperCase(), pattern));
                } else { //精准查询
                    query.must(QueryBuilders.termQuery(field.toUpperCase(), pattern));
                }
            }
        }

        if (params.containsKey("lat") && params.containsKey("lon") && params.containsKey("distance")) {
            double jd = Double.parseDouble(params.get("lon").toString());
            double wd = Double.parseDouble(params.get("lat").toString());
            double distance = Double.parseDouble(params.get("distance").toString());
            try {
                query.must(QueryBuilders.geoShapeQuery("SHAPE",
                        ShapeBuilders.newCircleBuilder().center(jd, wd).radius(String.valueOf(distance) + "m")));
            } catch (java.io.IOException e) {
                logger.warn("search by distance error. " + e.getMessage());
            }
        }

        return query;
    }

    /**
     * 通用ES新增
     * @param index
     * @param type
     * @param id 为空时，使用生成的UUID
     * @param record
     * @return
     */
    public String insert(String index, String type, String id, Map record) {
        String returnMsg = "failed";
        if (id == null) {
            id = UUID.randomUUID().toString();
        }

        try {
            ObjectMapper objMapper = new ObjectMapper();
            String recordString = objMapper.writeValueAsString(record);
            IndexRequest request = new IndexRequest(index, type);
            request.source(recordString, XContentType.JSON);
            request.id(id);
            logger.info(request.toString());
            IndexResponse resp = esClientManager.getClient().index(request);

            if (resp.getResult() != DocWriteResponse.Result.CREATED) {
                logger.warn("insert failed");
            } else {
                returnMsg = "inserted";
            }
        } catch (Exception e) {
            logger.warn("insert failed. " + e.getMessage());
        }

        return returnMsg;
    }

    /**
     * 通用ES修改
     * @param index
     * @param type
     * @param id
     * @param record
     * @return
     */
    public String update(String index, String type, String id, Map record) {
        String returnMsg = "failed";
        try {
            String recordString = new ObjectMapper().writeValueAsString(record);
            UpdateRequest request = new UpdateRequest(index, type, id);
            request.doc(recordString, XContentType.JSON);
            logger.info(request.toString());
            UpdateResponse resp = esClientManager.getClient().update(request);

            if(resp.getResult() != DocWriteResponse.Result.UPDATED) {
                logger.warn("update failed");
            } else {
                returnMsg = "updated";
            }
        } catch (Exception e) {
            logger.warn("update failed. " + e.getMessage());
        }

        return returnMsg;
    }

    /**
     * 通用ES删除
     * @param index
     * @param type
     * @param id
     * @return
     */
    public String delete(String index, String type, String id) {
        String returnMsg = "failed";
        try {
            DeleteRequest dr = new DeleteRequest(index, type, id);
            logger.info(dr.toString());
            DeleteResponse resp = esClientManager.getClient().delete(dr);

            if(resp.getResult() != DocWriteResponse.Result.DELETED) {
                logger.warn("delete failed");
            } else {
                returnMsg = "deleted";
            }
        } catch (Exception e) {
            logger.warn("delete failed. " + e.getMessage());
        }
        return returnMsg;
    }
}