package com.kedacom.ezSafe.yjzb.yjyl;


import com.kedacom.avatar.logging.AvatarLogger;
import com.kedacom.avatar.logging.AvatarLoggerFactory;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.CommonUtil;
import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import com.kedacom.ezSafe.common.utils.kafka.KafkaClientManager;
import com.kedacom.ezSafe.common.utils.kafka.KafkaDefine;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

/**
 * Created by yangjunshi on 2018/5/29.
 */
@Service
public class YjylService {
    AvatarLogger logger = AvatarLoggerFactory.getLogger(YjylService.class, "ezFireExt.SzylService");

    @Autowired
    private ESClientManager esClientManager;

    @Autowired
    private KafkaClientManager kafka;

    /**
     * 获取查询实战演练（2000条）
     *
     * @return ListMap
     */
    public List<Map<String, Object>> getAllSzyl(Map map) {
        List<Map<String, Object>> result = new ArrayList<>();
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery().must(QueryBuilders.termQuery("JLZT", "1"));
        if (map.get("DWNBBM") != null && map.get("DWNBBM") != "") {
            boolQueryBuilder.must(QueryBuilders.prefixQuery("SZDXFJG.XFJGNBBM", map.get("DWNBBM").toString()));
        }
        if (map.get("kssj") != null && map.get("kssj") != "") {
            boolQueryBuilder.must(QueryBuilders.rangeQuery("KSSJ").gte(map.get("kssj").toString()));
        }
        if (map.get("jssj") != null && map.get("jssj") != "") {
            boolQueryBuilder.must(QueryBuilders.rangeQuery("JSSJ").lte(map.get("jssj").toString()));
        }
        if (map.get("gjz") != null && map.get("gjz") != "") {
            String[] arr = map.get("gjz").toString().split("\\s+");
            for (int i = 0; i < arr.length; i++) {
                boolQueryBuilder.must(QueryBuilders.wildcardQuery("YLMC", "*" + arr[i] + "*"));
            }
        }
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().timeout(new TimeValue(10 , TimeUnit.SECONDS)).size(2000).query(boolQueryBuilder).explain(false).sort("KSSJ", SortOrder.ASC);
        SearchRequest searchRequest = new SearchRequest().indices(EsAliases.SZYL.getRead()).types(EsAliases.SZYL.getType()).source(searchSourceBuilder);
        logger.debug("实战演练查询条件" + searchRequest.toString());
        SearchResponse searchResponse = null;
        try {
            searchResponse = esClientManager.getClient().search(searchRequest);
        } catch (IOException e) {
            e.printStackTrace();
        }

        SearchHit[] searchHits = searchResponse.getHits().getHits();
        for (SearchHit hit : searchHits) {
            hit.getSource().put("ID" , hit.getId());
            result.add(hit.getSource());
        }
        return result;
    }

    /**
     * 添加实战演练
     *
     * @param params
     * @return
     */
    public boolean indexNewSzyl(Map<String, Object> params) {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        params.put("YLBH", uuid);
        IndexRequest indexRequest = new IndexRequest(EsAliases.SZYL.getWrite(), EsAliases.SZYL.getType(), uuid)
                .source(params);
        IndexResponse indexResponse = null;
        try {
            indexResponse = esClientManager.getClient().index(indexRequest);
        } catch (IOException e) {
            e.printStackTrace();
        }

        Boolean result = indexResponse.getResult() == DocWriteResponse.Result.CREATED || indexResponse.getResult() == DocWriteResponse.Result.UPDATED;

        if (result) {
            String content = CommonUtil.toJSONString(params);
            kafka.sendMessage(uuid , "" , EsAliases.SZYL , content , KafkaDefine.OPERA_ADD);
        }

        return result;

    }

    /**
     * 更新实战演练
     *
     * @param params
     * @return
     */
    public boolean updateSzyl(Map<String, Object> params) {
        String id = ComConvert.toString(params.get("ID"));
        params.remove("ID");
        UpdateRequest updateRequest = new UpdateRequest(EsAliases.SZYL.getWrite(), EsAliases.SZYL.getType(), id)
                .doc(params);
        UpdateResponse updateResponse = null;
        try {
            updateResponse = esClientManager.getClient().update(updateRequest);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Boolean result;
        result = updateResponse.getResult() == DocWriteResponse.Result.UPDATED || updateResponse.getResult() == DocWriteResponse.Result.NOOP;

        if (result) {
            String content = CommonUtil.toJSONString(params );
            kafka.sendMessage(id, "", EsAliases.SZYL, content, KafkaDefine.OPERA_MOD);
        }
        return result;
    }

    /**
     * 删除实战演练
     *
     * @param id
     * @return
     */
    public boolean deleteSzyl(String id) {
        DeleteRequest deleteRequest = new DeleteRequest(EsAliases.SZYL.getWrite(), EsAliases.SZYL.getType(), id);
        DeleteResponse deleteResponse = null;
        try {
            deleteResponse = esClientManager.getClient().delete(deleteRequest);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Boolean result;
        result = deleteResponse.getResult() == DocWriteResponse.Result.NOT_FOUND || deleteResponse.getResult() == DocWriteResponse.Result.DELETED;
        if (result) {
            kafka.sendMessage(id, "", EsAliases.SZYL, "", KafkaDefine.OPERA_DEL);
        }
        return result;
    }

    /**
     * 更新文件信息
     **/
    public boolean updateFile(Map<String , Object> params) {
        String id = params.get("YLBH").toString();
        UpdateRequest updateRequest = new UpdateRequest();
        updateRequest.index(EsAliases.SZYL.getRead());
        updateRequest.type(EsAliases.SZYL.getType());
        updateRequest.id(id);
        Map<String,Object> json = CommonUtil.parseMap(params.get("YLWJ").toString());
        try {
            updateRequest.doc(jsonBuilder()
                    .startObject()
                    .field("YLWJ",json)
                    .endObject());
        } catch (IOException e) {
            e.printStackTrace();
        }

        logger.warn("================更新文件信息==================" + updateRequest.toString());
        UpdateResponse updateResponse = null;

        try {
            updateResponse = esClientManager.getClient().update(updateRequest);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Boolean result = updateResponse.getResult() == DocWriteResponse.Result.UPDATED || updateResponse.getResult() == DocWriteResponse.Result.NOOP;

        if (result) {
            Map<String,Object> content = new HashMap<>();
            content.put("YLWJ" , json);
            kafka.sendMessage(id , "" , EsAliases.SZYL , content.toString() , KafkaDefine.OPERA_MOD);
        }
        return result;
    }
}
