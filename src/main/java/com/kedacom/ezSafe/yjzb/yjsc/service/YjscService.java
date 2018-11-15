package com.kedacom.ezSafe.yjzb.yjsc.service;


import com.kedacom.ezSafe.common.utils.elasticsearch.ESClientManager;
import com.kedacom.ezSafe.common.utils.kafka.KafkaClientManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;


@Service
public class YjscService {

    @Autowired
    private ESClientManager esClientManager;

    @Autowired
    private KafkaClientManager kafka;

    /**
     * 查询人员信息(翻页查询)
     */
    public Map<String, Object> getYjsc(Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        //TODO 查询人员信息
        return result;
    }
}
