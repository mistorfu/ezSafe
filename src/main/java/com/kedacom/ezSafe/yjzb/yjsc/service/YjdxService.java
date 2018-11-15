package com.kedacom.ezSafe.yjzb.yjsc.service;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.CommonUtil;
import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import com.kedacom.ezSafe.common.utils.kafka.KafkaClientManager;
import org.apache.http.entity.ContentType;
import org.apache.http.nio.entity.NStringEntity;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
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
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class YjdxService {
    @Autowired
    private ESClientManager esClientManager;

    @Autowired
    private KafkaClientManager kafkaClientManager;

    /**
     * 获取应急对象结构
     **/
    public List<Map<String, Object>> getYjdx() {
        List<Map<String, Object>> result = new ArrayList<>();
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery().mustNot(QueryBuilders.termQuery("JLZT", 0));
        SearchSourceBuilder ssr = new SearchSourceBuilder()
                .timeout(new TimeValue(10, TimeUnit.SECONDS))
                .size(10000)
                .query(queryBuilder)
                .explain(false);

        SearchRequest searchRequest = new SearchRequest()
                .indices(EsAliases.YJDX.getRead())
                .types(EsAliases.YJDX.getType())
                .source(ssr);

        SearchResponse searchResponse = null;
        try {
            searchResponse = esClientManager.getClient().search(searchRequest);
            searchResult(searchResponse, result);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return changeToTree(result, "DXBH", "FJDX", 2, "DXMC", "", "");
    }

    /**
     * 保存应急对象
     **/
    public String saveYjdx(Map params) {
        String id = params.get("DXBH").toString();
        UpdateRequest updateRequest = new UpdateRequest(EsAliases.YJDX.getRead(), EsAliases.YJDX.getType(), id).timeout(new TimeValue(10, TimeUnit.SECONDS))
                .doc(params);
        UpdateResponse updateResponse = null;
        try {
            updateResponse = esClientManager.getClient().update(updateRequest);
        } catch (Exception e) {
            IndexRequest indexRequest = new IndexRequest(EsAliases.YJDX.getWrite(), EsAliases.YJDX.getType(), id)
                    .source(params).setRefreshPolicy(WriteRequest.RefreshPolicy.IMMEDIATE);
            IndexResponse indexResponse = null;
            try {
                indexResponse = esClientManager.getClient().index(indexRequest);
            } catch (IOException er) {
                er.printStackTrace();
            }
            kafkaClientManager.sendMessage(id, "yjdxCreate", EsAliases.YJDX, params.toString(), "1");
            return id;
        }
        kafkaClientManager.sendMessage(id, "yjdxUpdate", EsAliases.YJDX, params.toString(), "3");
        return id;
    }

    /**
     * 删除应急对象
     **/
    public boolean deleteYjdx(String id) {
        DeleteRequest deleteRequest = new DeleteRequest(EsAliases.YJDX.getWrite(), EsAliases.YJDX.getType(), id).timeout(new TimeValue(10, TimeUnit.SECONDS));
        DeleteResponse deleteResponse = null;
        try {
            deleteResponse = esClientManager.getClient().delete(deleteRequest);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Boolean result;
        result = deleteResponse.getResult() == DocWriteResponse.Result.NOT_FOUND || deleteResponse.getResult() == DocWriteResponse.Result.DELETED;
        kafkaClientManager.sendMessage(id, "zysxDelete", EsAliases.ZYSX, "", "2");
        return result;
    }

    /**
     * 获取知识方案结构
     **/
    public List<Map<String, Object>> getZsfa(Map params) {
        List<Map<String, Object>> result = new ArrayList<>();
        QueryBuilder queryId = QueryBuilders.termQuery("DXBH", ComConvert.toString(params.get("DXBH")));
        SearchSourceBuilder ssr = new SearchSourceBuilder()
                .timeout(new TimeValue(10, TimeUnit.SECONDS))
                .size(1)
                .query(queryId)
                .explain(false);

        SearchRequest searchRequest = new SearchRequest()
                .indices(EsAliases.YJDX.getRead())
                .types(EsAliases.YJDX.getType())
                .source(ssr);
        SearchResponse searchResponse = null;
        try {
            searchResponse = esClientManager.getClient().search(searchRequest);
            Map yjdx = searchResponse.getHits().getHits()[0].getSource();
            result.add(zskTree(yjdx, params));
            result.add(faTree(yjdx, params));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    private List<Map<String, Object>> changeToTree(List<Map<String, Object>> lists, String id, String FJBH, int length, String text, String faflImg, String yjsxImg) {
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Map<String, Object>> map = new HashMap<>();
        for (Map list : lists) {
            int deep = ComConvert.toString(list.get("NBBM")).split("\\.").length - length;
            if (id.equals("FABH")) {
                list.put("DXLB", "YJFA");
                if (deep == 1) {
                    list.put("img", faflImg);
                } else if (deep > 1) {
                    list.put("img", yjsxImg);
                }
            }
            list.put("id", ComConvert.toString(list.get(id)));
            list.put("text", ComConvert.toString(list.get(text)));
            list.put("deep", deep);
            list.put("items", new ArrayList<>());
            map.put(ComConvert.toString(list.get(id)), list);
        }
        for (String key : map.keySet()) {
            Map yjdx = map.get(key);
            if (!ComConvert.toString(yjdx.get(FJBH)).equals("-1")) {
                if (map.get(ComConvert.toString(yjdx.get(FJBH))) == null) {
                    continue;
                }
                List list = (List) map.get(ComConvert.toString(yjdx.get(FJBH))).get("items");
                list.add(map.get(key));
                map.get(ComConvert.toString(map.get(key).get(FJBH))).put("items", list);
            } else {
                result.add(map.get(key));
            }
        }
        return result;
    }

    /**
     * 知识库树
     **/
    private Map<String, Object> zskTree(Map yjdx, Map params) {
        Map<String, Object> zsk = new HashMap<>();
        zsk.put("deep", 0);
        zsk.put("id", ComConvert.toString(yjdx.get("DXBH")));
        zsk.put("text", ComConvert.toString(params.get("zskName")));
        zsk.put("img", ComConvert.toString(params.get("ZSKRootImg")));
        zsk.put("expanded", true);
        zsk.put("DXBH", ComConvert.toString(yjdx.get("DXBH")));
        zsk.put("DXLB", "ZSKRoot");
        List<Map<String, Object>> yjzs = (List<Map<String, Object>>) yjdx.get("YJZS");
        zsk.put("items", getZsk(yjzs, yjdx, params));
        return zsk;
    }

    private List<Map<String, Object>> getZsk(List<Map<String, Object>> yjzs, Map yjdx, Map params) {
        List<String> zsIds = new ArrayList<>();
        List<Map<String, Object>> SearchResult = new ArrayList<>();
        Map<String, Map<String, Object>> zsMap = new HashMap<>();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> zs : yjzs) {
            zsIds.add(ComConvert.toString(zs.get("ZSBH")));
            zsMap.put(ComConvert.toString(zs.get("ZSBH")), zs);
        }
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery()
                .must(QueryBuilders.termsQuery("ZSBH", zsIds))
                .mustNot(QueryBuilders.termQuery("JLZT", 0));
        SearchSourceBuilder ssr = new SearchSourceBuilder()
                .timeout(new TimeValue(10, TimeUnit.SECONDS))
                .size(10000)
                .query(queryBuilder)
                .explain(false);

        SearchRequest searchRequest = new SearchRequest()
                .indices(EsAliases.YJZS.getRead())
                .types(EsAliases.YJZS.getType())
                .source(ssr);

        SearchResponse searchResponse = null;
        try {
            searchResponse = esClientManager.getClient().search(searchRequest);
            searchResult(searchResponse, SearchResult);
        } catch (IOException e) {
            e.printStackTrace();
        }
        for (Map<String, Object> map : SearchResult) {
            Map zs = zsMap.get(ComConvert.toString(map.get("ZSBH")));
            map.put("id", ComConvert.toString(zs.get("ZSBH")));
            map.put("text", ComConvert.toString(zs.get("ZSBT")));
            map.put("XSSX", ComConvert.toString(zs.get("XSSX")));
            map.put("DXBH", ComConvert.toString(yjdx.get("DXBH")));
            map.put("img", ComConvert.toString(params.get("YJZSImg")));
            map.put("DXLB", "YJZS");
            map.put("deep", 1);
            result.add(map);
        }
        return result;
    }

    /**
     * 事故方案树
     **/
    private Map<String, Object> faTree(Map yjdx, Map params) {
        Map<String, Object> sgfa = new HashMap<>();
        String yjfaImg = ComConvert.toString(params.get("YJFAImg"));
        String yjsxImg = ComConvert.toString(params.get("YJSXImg"));
        sgfa.put("deep", 0);
        sgfa.put("expanded", true);
        sgfa.put("id", "");
        sgfa.put("text", ComConvert.toString(params.get("sgfaName")));
        sgfa.put("DXBH", ComConvert.toString(yjdx.get("DXBH")));
        sgfa.put("img", ComConvert.toString(params.get("SGFARootImg")));
        sgfa.put("DXLB", "SGFARoot");
        sgfa.put("items", getSgfa(ComConvert.toString(yjdx.get("DXBH")), yjfaImg, yjsxImg));
        return sgfa;
    }

    /**
     * 获取事故方案树结构
     **/
    public List<Map<String, Object>> getSgfa(String dxbh, String faflImg, String yjsxImg) {
        List<Map<String, Object>> result = new ArrayList<>();
        BoolQueryBuilder queryBuilder = QueryBuilders.boolQuery()
                .must(QueryBuilders.termQuery("DXBH", dxbh))
                .mustNot(QueryBuilders.termQuery("JLZT", 0));
        SearchSourceBuilder ssr = new SearchSourceBuilder()
                .timeout(new TimeValue(10, TimeUnit.SECONDS))
                .size(10000)
                .query(queryBuilder)
                .explain(false);

        SearchRequest searchRequest = new SearchRequest()
                .indices(EsAliases.YJFA.getRead())
                .types(EsAliases.YJFA.getType())
                .source(ssr);

        SearchResponse searchResponse = null;
        try {
            searchResponse = esClientManager.getClient().search(searchRequest);
            searchResult(searchResponse, result);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return changeToTree(result, "FABH", "FJFA", 1, "FAMC", faflImg, yjsxImg);
    }

    private void searchResult(SearchResponse searchResponse, List<Map<String, Object>> result) {
        SearchHits hits = searchResponse.getHits();
        SearchHit[] searchHits = hits.getHits();
        for (SearchHit x : searchHits) {
            result.add(x.getSource());
        }
    }

    /**
     * 新增删除方案及知识
     **/
    public void insert(Map<String, Object> params) {
        String dxlb = ComConvert.toString(params.get("dxlb"));
        Map<String,Object> dxnr = CommonUtil.parseMap(params.get("dxnr").toString());
        EsAliases esAliases = null;
        EsAliases esAliasesFather = null;
        String id = "";
        String idFather = ComConvert.toString(dxnr.get("idFather"));
        dxnr.remove("idFather");
        String nr = "";
        switch (dxlb) {
            case "YJFA":
                esAliasesFather = EsAliases.YJDX;
                esAliases = EsAliases.YJFA;
                id = "FABH";
                nr = "YJFA";
                break;
            case "YJZS":
                esAliasesFather = EsAliases.YJDX;
                esAliases = EsAliases.YJZS;
                id = "ZSBH";
                nr = "YJZS";
                break;
            default:
                break;
        }
        if (params.get("czlx").equals("save") || (dxlb.equals("YJFA") && params.get("czlx").equals("swap"))) {
            UpdateRequest updateRequest = new UpdateRequest(esAliases.getRead(), esAliases.getType(), ComConvert.toString(dxnr.get(id))).timeout(new TimeValue(10, TimeUnit.SECONDS))
                    .doc(dxnr);
            UpdateResponse updateResponse = null;
            try {
                updateResponse = esClientManager.getClient().update(updateRequest);
            } catch (Exception e) {
                IndexRequest indexRequest = new IndexRequest(esAliases.getWrite(), esAliases.getType(), ComConvert.toString(dxnr.get(id)))
                        .source(dxnr).setRefreshPolicy(WriteRequest.RefreshPolicy.IMMEDIATE);
                IndexResponse indexResponse = null;
                try {
                    indexResponse = esClientManager.getClient().index(indexRequest);
                } catch (IOException er) {
                    er.printStackTrace();
                }
                kafkaClientManager.sendMessage(id, dxlb + "Create", esAliases, dxnr.toString(), "1");
            }
            kafkaClientManager.sendMessage(id, dxlb + "Update", esAliases, dxnr.toString(), "3");
        } else if (params.get("czlx").equals("delete")) {
            if (dxlb.equals("YJZS")) {
                DeleteRequest deleteRequest = new DeleteRequest(esAliases.getWrite(), esAliases.getType(), ComConvert.toString(dxnr.get(id))).timeout(new TimeValue(10, TimeUnit.SECONDS));
                DeleteResponse deleteResponse = null;
                try {
                    deleteResponse = esClientManager.getClient().delete(deleteRequest);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                kafkaClientManager.sendMessage(ComConvert.toString(dxnr.get(id)), dxlb + "Delete", esAliases, "", "2");
            } else if (dxlb.equals("YJFA")) {
                List<String> fabhs = new ArrayList<>(); //对象编号
                getList(fabhs, dxnr, "id");
                deleteByArray(fabhs, "FABH", "/fire_yjfa_read/yjfa/_delete_by_query", EsAliases.YJFA);
            }
        }

        if (dxlb.equals("YJZS")) {
            UpdateRequest updateRequest = new UpdateRequest();
            updateRequest.index(esAliasesFather.getRead()).type(esAliasesFather.getType()).id(idFather);
            ObjectMapper objectMapper = new ObjectMapper();
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(ArrayList.class, Object.class);

            List list = new ArrayList();
            try {
                list = objectMapper.readValue(ComConvert.toString(params.get("dxList")),javaType);
            } catch (IOException e) {
                e.printStackTrace();
            }

            Map<String,Object> jsonobj = new HashMap<>();
            jsonobj.put(nr, list);
            updateRequest.doc(jsonobj);
            UpdateResponse updateResponse = null;
            try {
                updateResponse = esClientManager.getClient().update(updateRequest);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 删除对象
     **/
    public void delete(Map<String, Object> params) {
        Map<String,Object> yjdx =  CommonUtil.parseMap(params.get("yjdx").toString());
        List<String> dxbhs = new ArrayList<>(); //对象编号
        getList(dxbhs, yjdx, "DXBH");
        deleteByArray(dxbhs, "DXBH", "/fire_yjdx_read/yjdx/_delete_by_query", EsAliases.YJDX);
        deleteByArray(dxbhs, "DXBH", "/fire_yjfa_read/yjfa/_delete_by_query", EsAliases.YJFA);
    }

    private void getList(List list, Map dx, String id) {
        list.add(dx.get(id));
        if (dx.containsKey("items") || dx.get("items") != null) {
            List childrenDx =  CommonUtil.parseList(ComConvert.toString(dx.get("items"))); //子对象数组
            for (int i = 0; i < childrenDx.size(); i++) {
                getList(list, (Map) childrenDx.get(i), id);
            }
        }
    }

    /**
     * 批量删除
     *
     * @param bhs
     * @return
     */
    public boolean deleteByArray(List<String> bhs, String Bhname, String endpoint, EsAliases type) {
        boolean result = false;
        Map map = new HashMap();
        Map terms = new HashMap();
        Map bh = new HashMap();
        bh.put(Bhname, bhs);
        terms.put("terms", bh);
        map.put("query", terms);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String requst =objectMapper.writeValueAsString(map);
            Response response = esClientManager.getLowClient()
                    .performRequest("POST",
                            endpoint,
                            Collections.emptyMap(),
                            new NStringEntity(requst, ContentType.APPLICATION_JSON));
            Map<String,Object> responseJson=  CommonUtil.parseMap(EntityUtils.toString(response.getEntity()));
            int deleted = ComConvert.toInteger(responseJson.get("deleted"), 0);
            if (deleted == bhs.size()) {
                result = true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        for (String id : bhs) {
            kafkaClientManager.sendMessage(id, type.getType() + "Delete", type, "", "2");
        }
        return result;
    }


}
