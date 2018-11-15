package com.kedacom.ezSafe.common.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import com.kedacom.ezSafe.common.utils.kafka.KafkaClientManager;
import com.kedacom.ezSafe.common.utils.kafka.KafkaDefine;
import com.kedacom.avatar.logging.AvatarLogger;
import com.kedacom.avatar.logging.AvatarLoggerFactory;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Created by xuerdi
 * Date: 2018/5/7
 **/
@Service
public class ESComUtil {

    private final ESClientManager esClient;
    private final KafkaClientManager kafka;
    @Autowired
    public ESComUtil(ESClientManager esClient , KafkaClientManager kafka) {
        this.esClient = esClient;
        this.kafka = kafka;
    }

    private static AvatarLogger logger = AvatarLoggerFactory.getLogger(ESComUtil.class, "Avatar.ESComUtil");

    private static final int DEFAULT_SEARCH_SIZE = 20;

    public List<Map<String , Object>> querySearch(QueryBuilder query , EsAliases target) throws IOException{
        return this.querySearch(query , target , DEFAULT_SEARCH_SIZE );
    }

    public List<Map<String , Object>> querySearch(QueryBuilder query, EsAliases target , int size) throws IOException {
        return this.querySearch(query , target , size , new ArrayList<>());
    }

    public List<Map<String , Object>> querySearch(QueryBuilder query, EsAliases target , int size , SortBuilder... sorts) throws IOException {
        List<SortBuilder> sortList = new ArrayList<>();
        if (null != sorts) {
            for (SortBuilder sort : sorts) {
                if (null != sort) {
                    sortList.add(sort);
                }
            }
        }
        return this.querySearch(query , target , size , sortList);
    }

    /**
     * 根据query搜索
     * @param query 查询条件
     * @param target 索引
     * @param size size
     * @param sorts 排序
     * @return result of the search
     * @throws IOException esClient search IOException
     */
    public List<Map<String , Object>> querySearch(QueryBuilder query , EsAliases target, int size , List<SortBuilder> sorts) throws IOException{
        List<Map<String , Object>> res = new ArrayList<>();
        if (query instanceof BoolQueryBuilder) {
            ((BoolQueryBuilder) query).mustNot(QueryBuilders.termQuery("JLZT" , "0"));
        }

        SearchSourceBuilder ssb = new SearchSourceBuilder()
                .query(query)
                .size(size)
                .explain(false);

        if (null != sorts && sorts.size() > 0) {
            for (SortBuilder sort : sorts) {
                if (sort != null) {
                    ssb.sort(sort);
                }
            }
        }

        SearchRequest request = new SearchRequest()
                .source(ssb)
                .indices(target.getRead())
                .types(target.getType())
                .preference("preference");

        logger.debug(request.toString());
        SearchResponse response = esClient.getClient().search(request);
        if (response != null) {
            SearchHits hits = response.getHits();
            for (SearchHit hit : hits) {
                Map<String , Object> tmp = hit.getSourceAsMap();
                tmp.put("id" , hit.getId());
                res.add(tmp);
            }
        }

        return res;
    }

    /**
     * 根据query和target以及sort来from size查询
     * @param query query
     * @param target EsAliases()
     * @param from from
     * @param size size
     * @param sort sort
     * @return {data:ListMap , total: TotalHits}
     * @throws IOException IOException
     */
    public Map<String , Object> queryFromSize(QueryBuilder query , EsAliases target, int from , int size , SortBuilder sort) throws IOException{
        Map<String , Object> res = new HashMap<>();
        List<Map<String , Object>> dataList = new ArrayList<>();
        if (query instanceof BoolQueryBuilder) {
            ((BoolQueryBuilder) query).mustNot(QueryBuilders.termQuery("JLZT" , "0"));
        }

        if (from >= 5000) {
            from = 5000 - size;
        }

        SearchSourceBuilder ssb = getSearchSourceBuilder(query , from , size , null);

        if (sort != null) {
            ssb.sort(sort);
        }

        SearchRequest request = new SearchRequest()
                .source(ssb)
                .indices(target.getRead())
                .types(target.getType())
                .preference("preference");

        logger.debug("Index: " + target.getRead() + " QueryFromSize SearchRequest: " + request.toString());
        SearchResponse response = esClient.getClient().search(request);

        SearchHits hits = response.getHits();
        for (SearchHit hit : hits) {
            Map<String , Object> tmp = hit.getSourceAsMap();
            tmp.put("id" , hit.getId());
            dataList.add(tmp);
        }
        res.put("data" , dataList);
        res.put("total" , hits.getTotalHits());
        return res;
    }

    public static SearchSourceBuilder getSearchSourceBuilder(QueryBuilder query , int size) {
        return getSearchSourceBuilder(query , 0 , size , null);
    }

    public static SearchSourceBuilder getSearchSourceBuilder(QueryBuilder query , int  from , int size) {
        return getSearchSourceBuilder(query , from , size , null);
    }

    public static SearchSourceBuilder getSearchSourceBuilder(QueryBuilder query , int size , AggregationBuilder agg) {
        AggregationBuilder[] aggs = {agg};
        return getSearchSourceBuilder(query , 0 , size , aggs);
    }

    /**
     * 通用searchSourceBuilder
     * @param query query
     * @param from from
     * @param size size
     * @param aggs aggregation
     * @return searchSourceBuilder
     */
    public static SearchSourceBuilder getSearchSourceBuilder(QueryBuilder query , int from , int size , AggregationBuilder[] aggs) {
        if (query instanceof BoolQueryBuilder) {
            ((BoolQueryBuilder) query).mustNot(QueryBuilders.termQuery("JLZT" , "0"));
        }
        SearchSourceBuilder res = new SearchSourceBuilder()
                .from(from)
                .size(size)
                .query(query)
                .explain(false)
                .timeout(new TimeValue(10 , TimeUnit.SECONDS));
        if (aggs != null && aggs.length > 0) {
            for (AggregationBuilder agg : aggs) {
                res.aggregation(agg);
            }
        }
        return res;
    }

    /**
     * 获取TotalHits number
     * @param query 查询条件
     * @param target 索引
     * @return totalHits
     */
    public long getTotalHits(QueryBuilder query , EsAliases target) {
        long res = 0;
        if (query instanceof BoolQueryBuilder) {
            ((BoolQueryBuilder) query).mustNot(QueryBuilders.termQuery("JLZT" , "0"));
        }
        SearchSourceBuilder ssb = getSearchSourceBuilder(query , 0);
        SearchRequest request = new SearchRequest()
                .source(ssb)
                .indices(target.getRead())
                .types(target.getType())
                .preference("preference");

        logger.debug("getTotalHits SearchRequest String : " + request.toString());
        try{
            SearchResponse response = esClient.getClient().search(request);
            if (response != null) {
                res = response.getHits().getTotalHits();
            }
        } catch (IOException e) {
            logger.warn("getTotalHits Failed ---- Index: " + target.getRead());
            e.printStackTrace();
            return res;
        }
        return res;
    }

    /**
     * Get Request
     * @param id id
     * @param target index/type
     * @return data
     */
    public Map<String , Object> getFromId(String id , EsAliases target) {
        Map<String , Object> res = new HashMap<>();
        if (StringUtils.isEmpty(id)) {
            return res;
        }
        GetRequest getRequest = new GetRequest().id(id).index(target.getRead()).type(target.getType());
        try {
            GetResponse getResponse = esClient.getClient().get(getRequest);
            if (getResponse != null) {
                res = getResponse.getSourceAsMap();
                if (res != null) {
                    res.put("id" , getResponse.getId());
                } else {
                    return new HashMap<>();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            logger.warn("Get Request Failed , Index: "  + target.getRead() + " , Id: " + id);
            return res;
        }
        return res;
    }

    /**
     * common index
     * @param target index and type
     * @param id id
     * @param sourceJson source
     * @return success or fail
     */
    public boolean index(EsAliases target , String id , String sourceJson) {
        try {

            Map<String , Object> source = CommonUtil.parseMap(sourceJson);
            IndexRequest request = new IndexRequest().index(target.getWrite()).type(target.getType())
                    .id(id).source(source).timeout(new TimeValue(10 , TimeUnit.SECONDS));
            DocWriteResponse.Result result = esClient.getClient().index(request).getResult();
            if (result == DocWriteResponse.Result.CREATED
                    || result == DocWriteResponse.Result.UPDATED) {
                kafka.sendMessage(id , "" , target , sourceJson , KafkaDefine.OPERA_ADD);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return false;
    }
    public boolean index(EsAliases target , String id , Map source) throws JsonProcessingException {
        String sourceJson =  CommonUtil.toJSONString(source);
        return this.index(target , id , sourceJson);
    }

    /**
     * common update
     * @param target index and type
     * @param id id
     * @param docJson doc
     * @return success of fail
     */
    public boolean update(EsAliases target , String id , String docJson) {
        try {
            Map<String , Object> doc = CommonUtil.parseMap(docJson);
            UpdateRequest request = new UpdateRequest().index(target.getWrite()).type(target.getType())
                    .id(id).doc(doc).timeout(new TimeValue(10 , TimeUnit.SECONDS));
            DocWriteResponse.Result result = esClient.getClient().update(request).getResult();
            if (result == DocWriteResponse.Result.UPDATED
                    || result == DocWriteResponse.Result.NOOP) {
                kafka.sendMessage(id , "" , target , docJson , KafkaDefine.OPERA_COVER);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return false;
    }
    public boolean update(EsAliases target , String id , Map doc) throws JsonProcessingException {
        String docJson = CommonUtil.toJSONString(doc);
        return this.update(target , id , docJson);
    }

    /**
     * common delete
     * @param target index and type
     * @param id id
     * @return success or fail
     */
    public boolean delete(EsAliases target , String id) {
        DeleteRequest request = new DeleteRequest().index(target.getWrite()).type(target.getType())
                .id(id).timeout(new TimeValue(10 , TimeUnit.SECONDS));
        try {
            DeleteResponse response = esClient.getClient().delete(request);
            if (response.getResult() == DocWriteResponse.Result.DELETED
                    || response.getResult() == DocWriteResponse.Result.NOT_FOUND) {
                kafka.sendMessage(id , "" , target , "" , KafkaDefine.OPERA_DEL);
                return true;
            }
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return false;
    }


    /**
     * use Bulk to Delete
     * @param target
     * @param ids  Id List
     * @return
     */
    public boolean bulkDelete(EsAliases target , List<String> ids) {
        BulkRequest request = new BulkRequest().timeout(new TimeValue(10 , TimeUnit.SECONDS));
        for (String id : ids) {
            DeleteRequest delete = new DeleteRequest().index(target.getWrite()).type(target.getType())
                    .id(id).timeout(new TimeValue(10 , TimeUnit.SECONDS));
            request.add(delete);
        }
        try {
            BulkResponse response = esClient.getClient().bulk(request);
            for (BulkItemResponse resp : response.getItems()) {
                if (!resp.isFailed()) {
                    kafka.sendMessage(resp.getId() , "" , target , "" , KafkaDefine.OPERA_DEL);
                }
            }
        } catch(IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}