package com.kedacom.ezSafe.qyda.xcxxgl;

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

@Service
public class XcxxglService {

    private static final Logger logger = LoggerFactory.getLogger(XcxxglService.class);
    @Autowired
    private ESClientManager esClientManager;

    public Map<String, Object> xcxxFilter(Map<String, Object> data) {
        if (!data.containsKey("XXBH")) data.put("XXBH", "");
        if (!data.containsKey("RWBH")) data.put("RWBH", "");
        if (!data.containsKey("RWMC")) data.put("RWMC", "");
        if (!data.containsKey("QYXX")) data.put("QYXX", "");
        if (!data.containsKey("XCFL")) data.put("XCFL", "");
        if (!data.containsKey("XCLB")) data.put("XCLB", "");
        if (!data.containsKey("XCZT")) data.put("XCZT", "");
        if (!data.containsKey("JHXCNR")) data.put("JHXCNR", "");
        if (!data.containsKey("JHXCSM")) data.put("JHXCSM", "");
        if (!data.containsKey("JHKSSJ")) data.put("JHKSSJ", "");
        if (!data.containsKey("JHJSSJ")) data.put("JHJSSJ", "");
        if (!data.containsKey("JHXCRY")) data.put("JHXCRY", "");
        if (!data.containsKey("SJXCRY")) data.put("SJXCRY", "");
        if (!data.containsKey("SJKSSJ")) data.put("SJKSSJ", "");
        if (!data.containsKey("SJJSSJ")) data.put("SJJSSJ", "");
        if (!data.containsKey("SJXCNR")) data.put("SJXCNR", "");
        if (!data.containsKey("SJXCSM")) data.put("SJXCSM", "");
        if (!data.containsKey("XCJG")) data.put("XCJG", "");
        if (!data.containsKey("BZXX")) data.put("BZXX", "");
        if (!data.containsKey("FJXX")) data.put("FJXX", "");
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
    public boolean deleteXcxxByArray(List<String> ids) {
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
                            "/safe_qyxcrw_read/qyxcrw/_delete_by_query",
                            params,
                            new NStringEntity(requst, ContentType.APPLICATION_JSON));
            Map responseJson = objMapper.readValue(EntityUtils.toString(response.getEntity()), Map.class);
            int deleted=ComConvert.toInteger( responseJson.get("deleted"),0);
            if(deleted==ids.size())
            {
                result=true;
            }
        } catch (IOException e) {
            e.printStackTrace();

        }
        return result;
    }

    public Map<String,Object> getYhxx(String rwbh) {
        Map<String,Object> map=new HashMap<>();
        List dataList = new ArrayList();
        BoolQueryBuilder query= QueryBuilders.boolQuery();
        query.must(QueryBuilders.termQuery("RWBH",rwbh));
        SearchSourceBuilder searchSourceBuilder=new SearchSourceBuilder()
                .query(query)
                .sort("RKSJ", SortOrder.DESC)
                .timeout(new TimeValue(10, TimeUnit.SECONDS))
                .explain(false);
        SearchRequest searchRequest=new SearchRequest()
                .indices("a_safe_qyaqyh").types("qyaqyh").source(searchSourceBuilder).preference("preference");
        SearchResponse searchResponse=null;
        try {
            searchResponse= esClientManager.getClient().search(searchRequest);
        } catch (IOException e){
            e.printStackTrace();
        }
        SearchHit[] searchHits=searchResponse.getHits().getHits();
        for (SearchHit hit:searchHits) {
            Map<String,Object> map1=hit.getSource();
            dataList.add(yhFilter(map1));
        }
        map.put("data",dataList);
        return map;
    }
    public Map<String, Object> yhFilter(Map<String, Object> data) {
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

    public String saveXcxxgl(Map params){
        String id = params.get("XXBH").toString();
        if (ComConvert.toString(params.get("JHKSSJ")).equals("")) {
            params.put("JHKSSJ", null);
        }
        if (ComConvert.toString(params.get("JHJSSJ")).equals("")) {
            params.put("JHJSSJ", null);

        }
        if (ComConvert.toString(params.get("SJKSSJ")).equals("")) {
            params.put("SJKSSJ", null);

        }
        if (ComConvert.toString(params.get("SJJSSJ")).equals("")) {
            params.put("SJJSSJ", null);

        }
        List<String> jsnr = new ArrayList<>();
        List<String> temp = new ArrayList<>();
        temp.add(ComConvert.toString(params.get("RWBH")));
        temp.add(ComConvert.toString(params.get("RWMC")));

        for (String item : temp) {
            jsnr.add(item);
            jsnr.add(PinyinHelper.getShortPinyin(item).toUpperCase());
            jsnr.add(PinyinHelper.convertToPinyinString(item, "", PinyinFormat.WITHOUT_TONE).toUpperCase());
        }
        params.put("JSNR", jsnr);
        UpdateRequest updateRequest = new UpdateRequest(EsAliases.QYXCRW.getRead(), EsAliases.QYXCRW.getType(), id).timeout(new TimeValue(10, TimeUnit.SECONDS))
                .doc(params);
        UpdateResponse updateResponse = null;
        logger.debug("企业巡查任务更新" + updateRequest.toString());
        try {
            updateResponse = esClientManager.getClient().update(updateRequest);
        } catch (Exception e) {
            Date date = new Date();
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String rksj = df.format(date);
            params.put("RKSJ", rksj);
            IndexRequest indexRequest = new IndexRequest(EsAliases.QYXCRW.getWrite(), EsAliases.QYXCRW.getType(), id)

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
