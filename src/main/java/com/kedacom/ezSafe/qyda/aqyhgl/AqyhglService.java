package com.kedacom.ezSafe.qyda.aqyhgl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import opensource.jpinyin.PinyinFormat;
import opensource.jpinyin.PinyinHelper;
import org.apache.http.entity.ContentType;
import org.apache.http.nio.entity.NStringEntity;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.support.WriteRequest;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.Response;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * @Description:
 * @author: hanshuhao
 * @Date: 2018/10/11
 */
@Service
public class AqyhglService {
    private static final Logger logger = LoggerFactory.getLogger(AqyhglService.class);
    @Autowired
    private ESClientManager esClientManager;
    public Map<String, Object> getAqyh(Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        Long count = 0L;
        Long count1 = 0L;
        List dataList = new ArrayList();
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.mustNot(QueryBuilders.termsQuery("JLZT", "0"));
        if (!ComConvert.toString(params.get("QYMC")).equals("")) {
            query.must(QueryBuilders.wildcardQuery("QYXX.QYMC", "*" + params.get("QYMC") + "*"));
        }
        if (!ComConvert.toString(params.get("YHLX")).equals("")) {
            query.must(QueryBuilders.termQuery("YHLX.ID", ComConvert.toString(params.get("YHLX"))));
        }
        if (!ComConvert.toString(params.get("YHJB")).equals("")) {
            query.must(QueryBuilders.termQuery("YHJB.ID", ComConvert.toString(params.get("YHJB"))));
        }
        if (!ComConvert.toString(params.get("YHLY")).equals("")) {
            query.must(QueryBuilders.termQuery("YHLY.ID", ComConvert.toString(params.get("YHLY"))));
        }

        if (!ComConvert.toString(params.get("XZNBBM")).equals("")) {
            if (ComConvert.toString(params.get("onlySelf")).equals("0")) {
                query.must(QueryBuilders.prefixQuery("SSXQ.XZQHNBBM", ComConvert.toString(params.get("XZNBBM"))));
            } else {
                query.must(QueryBuilders.termQuery("SSXQ.XZQHNBBM", ComConvert.toString(params.get("XZNBBM"))));
            }
        }
        if (!ComConvert.toString(params.get("WGBH")).equals("")) {
            query.must(QueryBuilders.prefixQuery("SSWG.WGBH", ComConvert.toString(params.get("WGBH"))));
        }

        int skip = ComConvert.toInteger(params.get("skip"), 0);
        int pageSize = ComConvert.toInteger(params.get("pageSize"), 60);

        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
                .from(skip)
                .size(pageSize)
                .query(query)
                .sort("RKSJ", SortOrder.DESC)
                .timeout(new TimeValue(10, TimeUnit.SECONDS))
                .explain(false);

        SearchRequest searchRequest = new SearchRequest()
                .indices("a_safe_qyaqyh")
                .types("qyaqyh")
                .source(searchSourceBuilder).preference("preference");
        SearchResponse response = null;
        try {
            response = esClientManager.getClient().search(searchRequest);
        } catch (IOException e) {
            e.printStackTrace();
        }

        SearchHit[] searchHits = response.getHits().getHits();
        count = response.getHits().totalHits;
        for (SearchHit hit : searchHits) {
            Map<String, Object> map = hit.getSource();
            dataList.add(aqyhFilter(map));
        }

        result.put("total", count);
        result.put("data", dataList);
        return result;
    }
    public Map<String, Object> aqyhFilter(Map<String, Object> data) {
        if (!data.containsKey("XXBH")) data.put("XXBH", "");
        if (!data.containsKey("RWBH")) data.put("RWBH", "");
        if (!data.containsKey("QYXX")) data.put("QYXX", "");
        if (!data.containsKey("YHBH")) data.put("YHBH", "");
        if (!data.containsKey("YHMC")) data.put("YHMC", "");
        if (!data.containsKey("YHLX")) data.put("YHLX", "");
        if (!data.containsKey("YHJB")) data.put("YHJB", "");
        if (!data.containsKey("YHLY")) data.put("YHLY", "");
        if (!data.containsKey("YHWZ")) data.put("YHWZ", "");
        if (!data.containsKey("YHBW")) data.put("YHBW", "");
        if (!data.containsKey("YHNR")) data.put("YHNR", "");
        if (!data.containsKey("JCRY")) data.put("JCRY", "");
        if (!data.containsKey("JCSJ")) data.put("JCSJ", "");
        if (!data.containsKey("JCFJ")) data.put("JCFJ", "");
        if (!data.containsKey("ZGQX")) data.put("ZGQX", "");
        if (!data.containsKey("ZRBM")) data.put("ZRBM", "");
        if (!data.containsKey("ZRRY")) data.put("ZRRY", "");
        if (!data.containsKey("LXDH")) data.put("LXDH", "");
        if (!data.containsKey("ZGJL")) data.put("ZGJL", "");
        if (!data.containsKey("ZGJG")) data.put("ZGJG", "");
        if (!data.containsKey("BZXX")) data.put("BZXX", "");
        if (!data.containsKey("SSJZ")) data.put("SSJZ", "");
        if (!data.containsKey("SSXQ")) data.put("SSXQ", "");
        return data;
    }
    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    public boolean deleteAqsgByArray(List<String> ids) {
        Map<String, String> params = new HashMap<>();
        boolean result = false;
        Map map = new HashMap();
        Map terms = new HashMap();
        Map xxbh = new HashMap();
        xxbh.put("XXBH",ids);
        terms.put("terms",xxbh);
        map.put("query",terms);
        try {
            ObjectMapper objMapper = new ObjectMapper();
            String requst = objMapper.writeValueAsString(map);
            Response response = esClientManager.getLowClient()
                    .performRequest("POST",
                            "/safe_qyaqyh_read/qyaqyh/_delete_by_query",
                            params,
                            new NStringEntity(requst, ContentType.APPLICATION_JSON));
            Map responseJson = objMapper.readValue(EntityUtils.toString(response.getEntity()), Map.class);
            int deleted= ComConvert.toInteger( responseJson.get("deleted"),0);
            if(deleted==ids.size())
            {
                result=true;
            }
        } catch (IOException e) {
            e.printStackTrace();

        }
        return result;
    }
    /**
     * 更新信息
     **/
    public String save(Map params) {
        String id = params.get("XXBH").toString();
        if (ComConvert.toString(params.get("ZGQX")).equals("")) {
            params.put("ZGQX", null);
        }
        List<String> jsnr = new ArrayList<> ();
        List<String> temp = new ArrayList<>();
        temp.add(ComConvert.toString(params.get("YHBH")));
        temp.add(ComConvert.toString(params.get("YHMC")));

        for (String item : temp) {
            jsnr.add(item);
            jsnr.add(PinyinHelper.getShortPinyin(item).toUpperCase());
            jsnr.add(PinyinHelper.convertToPinyinString(item, "", PinyinFormat.WITHOUT_TONE).toUpperCase());
        }
        params.put("JSNR", jsnr);
        Date date = new Date();
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String gxsj = df.format(date);
        params.put("GXSJ", gxsj);
        UpdateRequest updateRequest = new UpdateRequest(EsAliases.QYAQYH.getRead(), EsAliases.QYAQYH.getType(), id).timeout(new TimeValue (10, TimeUnit.SECONDS))
                .doc(params);
        UpdateResponse updateResponse = null;
        logger.debug("企业安全隐患更新" + updateRequest.toString());
        try {
            updateResponse = esClientManager.getClient().update(updateRequest);
        } catch (Exception e) {
            String rksj = df.format(date);
            params.put("RKSJ", rksj);
            if (params.containsKey("GXSJ")) {
                params.remove("GXSJ");
            }
            IndexRequest indexRequest = new IndexRequest(EsAliases.QYAQYH.getWrite(), EsAliases.QYAQYH.getType(), id)

                    .source(params).setRefreshPolicy(WriteRequest.RefreshPolicy.IMMEDIATE);
            IndexResponse indexResponse = null;
            try {
                indexResponse = esClientManager.getClient().index(indexRequest);
            } catch (IOException er) {
                er.printStackTrace();
            }
            return id;
        }
        return id;
    }
}
