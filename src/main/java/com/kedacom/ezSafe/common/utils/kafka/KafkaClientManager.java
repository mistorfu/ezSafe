package com.kedacom.ezSafe.common.utils.kafka;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedacom.ezSafe.common.domain.Unit ;
import com.kedacom.ezSafe.common.domain.User;
import com.kedacom.ezSafe.common.enums.EsAliases;
import com.kedacom.ezSafe.common.utils.ComCache;
import com.kedacom.avatar.logging.AvatarLogger;
import com.kedacom.avatar.logging.AvatarLoggerFactory;
import com.kedacom.ezSafe.common.utils.CommonUtil;
import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.joda.time.DateTime;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Young on 2017/9/19.
 */
@Service
public class KafkaClientManager
{
    private static AvatarLogger logger = AvatarLoggerFactory.getLogger(KafkaClientManager.class, "Avatar.KafkaClientManager");

    private KafkaProducer<String, String> s_ProducerClient = null;

    private static KafkaClientManager s_ClientManager = new KafkaClientManager();

    public static KafkaClientManager getInstance() {
        return s_ClientManager;
    }

    private static ObjectMapper MAPPER = new ObjectMapper();

    private KafkaClientManager()
    {

    }

    /**
     * 发送kafka消息
     * @param xxbh 消息中记录编号（主键值）
     * @param xxlb 综合Topic时，内部可自定义
     * @param xxdx ES数据传EsAliases，oracle数据传表名
     * @param xxnr 消息数据内容
     * @param czlx 操作类型
     */
    public void sendMessage(String xxbh, String xxlb, Object xxdx, String xxnr, String czlx)
    {
        this.sendMessage(xxbh, xxlb, xxdx, xxnr, czlx, "", "");
    }

    /**
     * 发送kafka消息
     * @param xxbh 消息中记录编号（主键值）
     * @param xxlb 综合Topic时，内部可自定义
     * @param xxdx ES数据传EsAliases，oracle数据传表名
     * @param xxnr 消息数据内容
     * @param czlx 操作类型
     * @param xxly 信息来源
     * @param zdysj 自定义数据
     */
    public void sendMessage(String xxbh, String xxlb, Object xxdx, String xxnr, String czlx, String xxly, String zdysj)
    {
        try
        {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            User user = (User) request.getSession().getAttribute("user");
            Unit unit = (Unit) request.getSession().getAttribute("userOrg");
            //操作用户
            Map<String,Object> objUser = new HashMap<>();
            objUser.put("YHM", user.getDlm());
            objUser.put("YHBH", user.getJh());
            objUser.put("YHXM", user.getJyxm());
            //操作单位
            Map<String,Object> objUnit = new HashMap<>();
            objUnit.put("DWBH", unit.getDwbh());
            objUnit.put("DWMC", unit.getDwmc());
            objUnit.put("DWJC", unit.getDwsx());
            objUnit.put("DWNBBM", unit.getDwnbbm());

            String topic = "";
            String dataType = "";
            if(xxdx instanceof EsAliases) {
                EsAliases esAliase = (EsAliases) xxdx;
                topic = KafkaDefine.KAFKA_TOPIC_MAP.get(esAliase.getRead());
                dataType = esAliase.getIndex() + ":" + esAliase.getType();
            }
            else {
                topic = KafkaDefine.KAFKA_TOPIC_MAP.get((String) xxdx);
                dataType = (String) xxdx;
            }
            Map<String,Object> objMsg = new HashMap<>();
            objMsg.put("XXBH", xxbh);
            objMsg.put("XXLB", xxlb);
            objMsg.put("XXDX", dataType);
            objMsg.put("XXNR", xxnr);
            objMsg.put("XXLY", "ezFireExt");
            objMsg.put("ZDYSJ", zdysj);
            objMsg.put("CZLX", czlx);
            objMsg.put("CZYH", objUser);
            objMsg.put("CZDW", objUnit);
            objMsg.put("CZSJ", DateTime.now().toString("yyyy-MM-dd HH:mm:ss"));

            if(this.s_ProducerClient == null)
            {
                this.createClient();
            }

            ProducerRecord record = new ProducerRecord<>(topic, xxbh, CommonUtil.toJSONString(objMsg));
            this.s_ProducerClient.send(record, new SendCallback());
        }
        catch (Exception e) {
            logger.error("", e.getMessage(), "");
        }
    }

    private void createClient()
    {
        try
        {
            if (ComCache.getInstance().getPzxxCache().getPzxx("kafkaEnable").equals("1"))
            {
                String pzxxValue = ComCache.getInstance().getPzxxCache().getPzxx("kafkaProducer");
                if (pzxxValue.equals("")) {
                    logger.error("", "系统配置中没有Kafka配置信息", "");
                    return;
                }
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> mapConfig = objectMapper.readValue(pzxxValue, new TypeReference<HashMap<String, Object>>() {
                });
                this.s_ProducerClient = new KafkaProducer<String, String>(mapConfig);
            }
        }
        catch (IOException e) {
            logger.error("", "Kafka配置信息错误：" + e.getMessage(), "");
        }
    }

    /**
     * 发送消息的回调
     */
    public class SendCallback implements Callback {
        @Override
        public void onCompletion(RecordMetadata recordMetadata, Exception e) {
            if (null != e) {
                logger.error("", "Send Kafka Msg Failed：" + e.getMessage(), "");
            } else {
                logger.debug("Send Kafka Msg Success");
            }
        }
    }
}
