package com.kedacom.ezSafe.qyda.aqsggl;

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
import org.elasticsearch.action.support.WriteRequest;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.Response;
import org.elasticsearch.common.unit.TimeValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class AqsgglService {
    private static final Logger logger = LoggerFactory.getLogger(AqsgglService.class);
    @Autowired
    private ESClientManager esClientManager;

    /**
     * 批量删除
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
                            "/safe_qyaqsg_read/qyaqsg/_delete_by_query",
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

    /**
     * 更新信息
     **/
    public String save(Map params) {
        String id = params.get("XXBH").toString();
        if (ComConvert.toString(params.get("KSSJ")).equals("")) {
            params.put("KSSJ", null);
        }
        if (ComConvert.toString(params.get("JSSJ")).equals("")) {
            params.put("JSSJ", null);
        }
        if (ComConvert.toString(params.get("ZGSJ")).equals("")) {
            params.put("ZGSJ", null);
        }
        List<String> jsnr = new ArrayList<> ();
        List<String> temp = new ArrayList<>();
        temp.add(ComConvert.toString(params.get("SGBH")));
        temp.add(ComConvert.toString(params.get("SGMC")));

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
        UpdateRequest updateRequest = new UpdateRequest(EsAliases.QYAQSG.getRead(), EsAliases.QYAQSG.getType(), id).timeout(new TimeValue (10, TimeUnit.SECONDS))
                .doc(params);
        UpdateResponse updateResponse = null;
        logger.debug("企业安全事故更新" + updateRequest.toString());
        try {
            updateResponse = esClientManager.getClient().update(updateRequest);
        } catch (Exception e) {
            String rksj = df.format(date);
            params.put("RKSJ", rksj);
            if (params.containsKey("GXSJ")) {
                params.remove("GXSJ");
            }
            IndexRequest indexRequest = new IndexRequest(EsAliases.QYAQSG.getWrite(), EsAliases.QYAQSG.getType(), id)

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
