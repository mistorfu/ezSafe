package com.kedacom.ezSafe.qyda.qygl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import org.apache.http.entity.ContentType;
import org.apache.http.nio.entity.NStringEntity;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.client.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by fudapeng on 2018/10/11.
 */
@Service
public class QyglService {
    private static final Logger logger = LoggerFactory.getLogger(QyglService.class);
    @Autowired
    private ESClientManager esClientManager;

    public boolean deleteQyjcxxByArray(List<String> ids) {
        Map<String, String> params = new HashMap<>();
        boolean result = false;
        Map map = new HashMap();
        Map terms = new HashMap();
        Map xxbh = new HashMap();
        xxbh.put("QYBH", ids);
        terms.put("terms", xxbh);
        map.put("query", terms);
        try {
            ObjectMapper objMapper = new ObjectMapper();
            String requst = objMapper.writeValueAsString(map);
            Response response = esClientManager.getLowClient()
                    .performRequest("POST",
                            "/safe_qyjcxx_read/qyjcxx/_delete_by_query",
                            params,
                            new NStringEntity(requst, ContentType.APPLICATION_JSON));
            Map responseJson = objMapper.readValue(EntityUtils.toString(response.getEntity()), Map.class);
            int deleted = ComConvert.toInteger(responseJson.get("deleted"), 0);
            if (deleted == ids.size()) {
                result = true;
            }
        } catch (IOException e) {
            e.printStackTrace();

        }
        return result;
    }
}