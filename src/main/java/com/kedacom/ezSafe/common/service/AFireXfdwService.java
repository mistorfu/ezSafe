package com.kedacom.ezSafe.common.service;

import com.kedacom.avatar.logging.AvatarLogger;
import com.kedacom.avatar.logging.AvatarLoggerFactory;
import com.kedacom.ezSafe.common.domain.BQjXzqy;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.CommonUtil;
import com.kedacom.ezSafe.common.utils.ESComUtil;
import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import org.apache.ibatis.session.RowBounds;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.filters.Filters;
import org.elasticsearch.search.aggregations.bucket.filters.FiltersAggregator;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 消防单位
 */
@Service
public class AFireXfdwService {

    private AvatarLogger logger = AvatarLoggerFactory.getLogger(AFireXfdwService.class, "ezFireExt.AFireXfdwService");

    private final ESClientManager esClientManager;
    private final BQjXzqyService m_bQjXzqyService;
    private final ESComUtil esComUtil;

    @Autowired
    public AFireXfdwService(ESClientManager esClientManager , BQjXzqyService m_bQjXzqyService ,
                            ESComUtil esComUtil) {
        this.esComUtil = esComUtil;
        this.m_bQjXzqyService = m_bQjXzqyService;
        this.esClientManager = esClientManager;
    }

    /**
     * 根据行政区划编号获取省的消防单位级别统计(总队、大队、中队)
     *
     * @param province 行政区划编号
     * @return
     */
    public List<Map<String, Object>> getXfdwByProvince(String province , String xzfbm) {
        List<Map<String, Object>> result = new ArrayList<>();
        BoolQueryBuilder query = QueryBuilders.boolQuery();

        BQjXzqy bQjXzqy = judgeDirectlyCity(province, xzfbm);
        String filterXznbbm = bQjXzqy.getXznbbm();

        query.must(QueryBuilders.prefixQuery("SZDXZQH.XZQHNBBM",filterXznbbm));
        query.mustNot(QueryBuilders.termQuery("JLZT" , "0"));
        SearchSourceBuilder searchSourceBuilder = ESComUtil.getSearchSourceBuilder(query , 0);

        FiltersAggregator.KeyedFilter zongdui = new FiltersAggregator.KeyedFilter("zongdui" , QueryBuilders.termQuery("DWJB", "1"));
        FiltersAggregator.KeyedFilter zhidui = new FiltersAggregator.KeyedFilter("zhidui" , QueryBuilders.termQuery("DWJB", "2"));
        FiltersAggregator.KeyedFilter dadui = new FiltersAggregator.KeyedFilter("dadui" , QueryBuilders.termQuery("DWJB", "3"));
        FiltersAggregator.KeyedFilter zhongdui = new FiltersAggregator.KeyedFilter("zhongdui" , QueryBuilders.termQuery("DWJB", "4"));

        searchSourceBuilder.aggregation(AggregationBuilders.filters("filters" ,
                zongdui , zhidui , dadui , zhongdui));


        SearchRequest searchRequest = new SearchRequest()
                .indices(EsAliases.XFDW.getRead())
                .types(EsAliases.XFDW.getType())
                .source(searchSourceBuilder);


        logger.debug("获取消防单位级别统计:" + searchRequest.toString());
        try {
            SearchResponse response = esClientManager.getClient().search(searchRequest);
            Filters filters = response.getAggregations().get("filters");
            for (Filters.Bucket bucket : filters.getBuckets()) {
                Map<String , Object> tmp = new HashMap<>();
                tmp.put("name" , bucket.getKey());
                tmp.put("value" , bucket.getDocCount());
                result.add(tmp);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    /**
     * 根据消防内部编码获取支队
     */
    public List<Map<String, Object>> getZhiduiByXfnbbm(String xfnbbm)
    {
        List<Map<String, Object>> result = new ArrayList<>();

        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.must(QueryBuilders.prefixQuery("DWNBBM", xfnbbm));
        query.must(QueryBuilders.termQuery("DWJB", "2"));
        query.mustNot(QueryBuilders.termQuery("JLZT","0"));
        try {
            result = esComUtil.querySearch(query , EsAliases.XFDW , 1000);
        } catch (IOException e) {
            e.printStackTrace();
            logger.warn("根据内部编码获取支队失败");
        }
        return result;
    }

    /**
     * 根据单位类别查询消防单位
     *
     * @param dwlb 单位级别
     * @return List<Map>
     */
    public List<Map<String, Object>> getXfdwByDWJB(String dwlb) {
        List<Map<String, Object>> result = new ArrayList<>();
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.must(QueryBuilders.termQuery("DWJB", dwlb));
        query.mustNot(QueryBuilders.termQuery("JLZT" , "0"));
        try {
            result = esComUtil.querySearch(query , EsAliases.XFDW , 1000);
        } catch (IOException e) {
            e.printStackTrace();
            logger.warn("根据单位类别查询消防单位 失败");
        }

        return result;
    }

    /**
     * 根据单位隶属关系和类别查询消防单位 用上级查下级
     * @param lsgx  , dwjb 隶属关系 , 单位类别
     * @return List<Map>
     */
    public List<Map<String , Object>> getXfdwByLSGX(String lsgx , String dwjb){
        List<Map<String,Object>> result = new ArrayList<>();
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.must(QueryBuilders.termQuery("LSGX" , lsgx));
        query.must(QueryBuilders.termQuery("DWJB" , dwjb));
        try {
            result = esComUtil.querySearch(query , EsAliases.XFDW , 1000);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }


    /**
     * 根据单位编号List查询消防单位
     *
     * @param dwbhList
     * @return
     */
    public List<Map<String, Object>> getXfdwListByDwbh(List<String> dwbhList) {
        List<Map<String, Object>> result = new ArrayList<>();

        QueryBuilder query = QueryBuilders.termsQuery("DWBH", dwbhList);
        try {
            result = esComUtil.querySearch(query , EsAliases.XFDW , 1000);
        } catch (IOException e) {
            e.printStackTrace();
            return result;
        }

        return result;
    }

    /**
     * 根据单位编号获取消防单位
     * @param dwbh
     * @return
     */
    public Map<String , Object> getXfdwByDwbh(String dwbh) {
        return esComUtil.getFromId(dwbh , EsAliases.XFDW);
    }

    /**
     * 根据行政区划编号获取消防单位
     *
     * @param xzqh
     * @return
     */
    public List<Map<String, Object>> getXfdwByXzqhbh(String xzqh) {
        List<Map<String , Object>> result = new ArrayList<>();
        QueryBuilder query = QueryBuilders.matchQuery("SZDXZQH.XZQHBH", xzqh);
        QueryBuilder query1 = QueryBuilders.termQuery("DWJB", "4");
        BoolQueryBuilder query2 = QueryBuilders.boolQuery().must(query).must(query1);

        try {
            result = esComUtil.querySearch(query2 , EsAliases.XFDW , 1000);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 根据隶属关系查询下级单位
     * @param lsgx
     * @return
     */
    public List<Map<String , Object>> getXfdwByLSGX(String lsgx){
        List<Map<String,Object>> result = new ArrayList<>();
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.must(QueryBuilders.termQuery("LSGX" , lsgx));

        SortBuilder sort1 = SortBuilders.fieldSort("DWJB").order(SortOrder.ASC);
        SortBuilder sort2 = SortBuilders.fieldSort("XSSX").order(SortOrder.ASC);

        try {
            result = esComUtil.querySearch(query , EsAliases.XFDW , 1000 , sort1 , sort2);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    /**
     * 隶属关系和最小单位级别
     * @param lsgx 隶属关系
     * @param dwjb minlevel
     * @return xfdw list
     */
    public List<Map<String , Object>> lsgxAndDwjb(String lsgx ,String dwjb) {
        List<Map<String,Object>> result = new ArrayList<>();
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.must(QueryBuilders.termQuery("LSGX" , lsgx));
        query.must(QueryBuilders.rangeQuery("DWJB").lte(dwjb));
        SortBuilder sort1 = SortBuilders.fieldSort("DWJB").order(SortOrder.ASC);
        SortBuilder sort2 = SortBuilders.fieldSort("XSSX").order(SortOrder.ASC);
        try {
            result = esComUtil.querySearch(query , EsAliases.XFDW , 1000 , sort1 , sort2);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 根据隶属关系，获取下级消防单位数量
     * @param lsgx 隶属关系
     * @return 下级消防单位数量
     */
    public Long nextLvlXfdwNum(String lsgx) {
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.must(QueryBuilders.termQuery("LSGX" , lsgx));
        return esComUtil.getTotalHits(query , EsAliases.XFDW);
    }

    public Map<String, Long> nextLvlXfdwNum(List<String> dwbhList) {
        Map result = new HashMap();
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        boolQuery.must(QueryBuilders.termsQuery("LSGX", dwbhList));
        AggregationBuilder aggregation = AggregationBuilders.terms("agg").field("LSGX").size(dwbhList.size());
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().query(boolQuery).explain(false).size(0).aggregation(aggregation);
        SearchRequest searchRequest = new SearchRequest().indices(EsAliases.XFDW.getRead()).types(EsAliases.XFDW.getType()).source(searchSourceBuilder);
        logger.debug("聚合" + searchRequest.toString());
        try {
            SearchResponse response = esClientManager.getClient().search(searchRequest);
            Terms terms = response.getAggregations().get("agg");
            for (Terms.Bucket bucket : terms.getBuckets()) {
                result.put(bucket.getKey().toString(), bucket.getDocCount());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    /**
     * 根据检索内容和单位内部编码搜索消防单位
     * @param jsnr 检索内容
     * @param userXfjgnbbm 用户消防机构
     * @param minLevel
     * @return
     */
    public List<Map<String , Object>> searchXfdwByJsnr(String jsnr , String userXfjgnbbm , String minLevel) {
        List<Map<String , Object>> result = new ArrayList<>();
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.mustNot(QueryBuilders.termQuery("JLZT" , 0));
        query.must(QueryBuilders.prefixQuery("DWNBBM" , userXfjgnbbm));

        //正则，搜索限定了内部编码的最小级别，相当于treeLevel
        StringBuilder dwnbbmReg = new StringBuilder("1\\.[A-Za-z0-9]{32}");
        for (int i = 0; i < ComConvert.toInteger(minLevel , 5) ; i++) {
            dwnbbmReg.append("(\\.[A-Za-z0-9]{32})?");
        }
        query.must(QueryBuilders.regexpQuery("DWNBBM" , dwnbbmReg.toString()));

        String[] jsnrList = jsnr.toUpperCase().split("\\s+");

        for (String one_jsnr : jsnrList) {
            query.must(QueryBuilders.wildcardQuery("JSNR" , "*" + one_jsnr + "*"));
        }

        SortBuilder sort1 = SortBuilders.fieldSort("DWJB").order(SortOrder.ASC);
        SortBuilder sort2 = SortBuilders.fieldSort("XSSX").order(SortOrder.ASC);

        try {
            result = esComUtil.querySearch(query , EsAliases.XFDW , 1000 , sort1 , sort2);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;

    }

    public BQjXzqy judgeDirectlyCity(String province , String xzfbm) {
        BQjXzqy bQjXzqy;
        if (CommonUtil.isNumeric(province)) {
            bQjXzqy = m_bQjXzqyService.getXznbbmByXZBM(province);
        } else {
            Map<String , Object> paramsMap = new HashMap<>();
            String xzfbm1 = xzfbm.substring(0,4) + "00";
            if (xzfbm.equals("500100")) {
                bQjXzqy = m_bQjXzqyService.getXznbbmByXZMC(province);
            } else {
                paramsMap.put("xzmc", province);
                paramsMap.put("xzfbm", xzfbm1);
                bQjXzqy = m_bQjXzqyService.selectByMap(paramsMap, RowBounds.DEFAULT).get(0);
            }
        }
        return bQjXzqy;
    }

    /**
     * 获取所有大队（含大队）以上消防机构(除去部局)
     */
    public Map<String, Object> getXfjgMaxDdjb3()
    {
        List<Map<String, Object>> xfjg = new ArrayList<>();
        Map<String, Object> result=new HashMap();

        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.mustNot(QueryBuilders.termsQuery("DWJB","0","5"));
        try {
            xfjg = esComUtil.querySearch(query , EsAliases.XFDW , 10000);
        } catch (IOException e) {
            e.printStackTrace();
            logger.warn("获取所有大队（含大队）以上消防机构(除去部局)");
        }
        for(Map item : xfjg)
        {
            result.put(ComConvert.toString(item.get("DWBH")),item);
        }
        return result;
    }

    public Map<String , Object> getXfdwByXzqhnbbm(String xzqhnbbm) {
        Map<String , Object> res = new HashMap<>();
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        String xzbm = xzqhnbbm.split("\\.")[xzqhnbbm.split("\\.").length - 1];
        BQjXzqy xzqy = m_bQjXzqyService.getXznbbmByXZBM(xzbm);

        query.must(QueryBuilders.termQuery("SZDXZQH.XZQHBH" , xzbm));
        query.must(QueryBuilders.wildcardQuery("DWMC" , "*" + xzqy.getXzmc().substring(0 , 2) + "*"));
        SortBuilder sort = SortBuilders.fieldSort("DWJB").order(SortOrder.ASC);
        List<Map<String , Object>> resultList = new ArrayList<>();
        try {
            resultList = esComUtil.querySearch(query , EsAliases.XFDW , 1 , sort);
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (resultList.size() > 0) {
            res = resultList.get(0);
        }
        return res;
    }

    /**
     * 根据单位内部编码和单位级别获取下级机构
     */
    public List<Map<String , Object>> getLowLvDwByXzqhnbbmAndDwjb(String dwnbbm,String dwjb) {
        BoolQueryBuilder query = QueryBuilders.boolQuery();
        query.must(QueryBuilders.prefixQuery("DWNBBM" , dwnbbm));
        query.must(QueryBuilders.termQuery("DWJB" , dwjb));
        List<Map<String , Object>> resultList = new ArrayList<>();
        try {
            resultList = esComUtil.querySearch(query , EsAliases.XFDW , 1000);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return resultList;
    }
}

