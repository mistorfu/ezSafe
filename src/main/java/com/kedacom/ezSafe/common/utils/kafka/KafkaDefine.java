package com.kedacom.ezSafe.common.utils.kafka;

import java.util.HashMap;

/**
 * Title: 	kafka通用定义类
 * Author: 	YangYunTao
 */
public class KafkaDefine
{
	public static final String OPERA_ADD = "1";								//1. 新增操作
	public static final String OPERA_DEL = "2";								//2. 删除操作
	public static final String OPERA_MOD = "3";								//3. 修改操作
	public static final String OPERA_COVER = "4";							//4. 存在修改，否则添加

	public static final HashMap<String, String> KAFKA_TOPIC_MAP; 		//kafka消息topic与es各索引的对应关系

	static {
		KAFKA_TOPIC_MAP = new HashMap<>(64);
		// 基础资源数据
		KAFKA_TOPIC_MAP.put("fire_dwxx_read", "t_fire_basic");
		KAFKA_TOPIC_MAP.put("fire_dwxx_miehuo_read", "t_fire_basic");
		KAFKA_TOPIC_MAP.put("fire_jzxx_read", "t_fire_basic");
		KAFKA_TOPIC_MAP.put("fire_yqgx_read", "t_fire_basic");
		KAFKA_TOPIC_MAP.put("fire_glsd_read", "t_fire_basic");
		KAFKA_TOPIC_MAP.put("fire_shxx_read", "t_fire_basic");
		KAFKA_TOPIC_MAP.put("fire_dzd_read", "t_fire_basic");
		KAFKA_TOPIC_MAP.put("fire_wxq_read", "t_fire_basic");
		KAFKA_TOPIC_MAP.put("fire_hdz_read", "t_fire_basic");
		KAFKA_TOPIC_MAP.put("fire_sdz_read", "t_fire_basic");
		// 社会联动数据
		KAFKA_TOPIC_MAP.put("fire_yjlddw_read", "t_fire_social");
		KAFKA_TOPIC_MAP.put("fire_lqbzdw_read", "t_fire_social");
		KAFKA_TOPIC_MAP.put("fire_mhjyzj_read", "t_fire_social");
		// 执法监督数据
		KAFKA_TOPIC_MAP.put("fire_zftj_read", "t_fire_law");
		// 重大安保数据
		KAFKA_TOPIC_MAP.put("fire_abhd_read", "t_fire_safe");
		KAFKA_TOPIC_MAP.put("fire_abcs_read", "t_fire_safe");
		KAFKA_TOPIC_MAP.put("fire_abbs_read", "t_fire_safe");
		KAFKA_TOPIC_MAP.put("fire_abll_read", "t_fire_safe");
		KAFKA_TOPIC_MAP.put("fire_abdt_read", "t_fire_safe");
		KAFKA_TOPIC_MAP.put("fire_abld_read", "t_fire_safe");
		KAFKA_TOPIC_MAP.put("fire_ablx_read", "t_fire_safe");
		KAFKA_TOPIC_MAP.put("fire_abqy_read", "t_fire_safe");
		// 灭火救援力量
		KAFKA_TOPIC_MAP.put("fire_xfdw_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_ybdw_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_xfdz_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_zydw_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_ddbd_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_zybd_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_ryxx_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_ryzt_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_clxx_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_clzt_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_zbxx_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_tzzb_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_mhyj_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_wzck_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_cbwz_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_xhs_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_xfsc_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_xfsh_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_qsmt_read", "t_fire_outfire");
		KAFKA_TOPIC_MAP.put("fire_trsy_read", "t_fire_outfire");
		// 警情处置数据
		KAFKA_TOPIC_MAP.put("fire_zqxx_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_zqly_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_zqry_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_zqzl_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_zqwx_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_xcxx_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_dpxx_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_zyxx_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_zqwj_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_wdxx_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_wsxx_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_hcdt_read", "t_fire_alarm");
		KAFKA_TOPIC_MAP.put("fire_dxal_read", "t_fire_alarm");
		// 战备值守数据
		KAFKA_TOPIC_MAP.put("fire_zbdt_read", "t_fire_duty");
		KAFKA_TOPIC_MAP.put("fire_zbkb_read", "t_fire_duty");
		KAFKA_TOPIC_MAP.put("fire_zqll_read", "t_fire_duty");
		KAFKA_TOPIC_MAP.put("fire_zysx_read", "t_fire_duty");
		KAFKA_TOPIC_MAP.put("fire_sxyq_read", "t_fire_duty");
		KAFKA_TOPIC_MAP.put("fire_zqyj_read", "t_fire_duty");
		KAFKA_TOPIC_MAP.put("fire_tqyb_read", "t_fire_duty");
		// 应急管理
		KAFKA_TOPIC_MAP.put("fire_yjya_read", "t_fire_ems");
		KAFKA_TOPIC_MAP.put("fire_szyl_read", "t_fire_ems");
		KAFKA_TOPIC_MAP.put("fire_bncs_read", "t_fire_ems");
		KAFKA_TOPIC_MAP.put("fire_jyll_read", "t_fire_ems");
		KAFKA_TOPIC_MAP.put("fire_yjzs_read", "t_fire_ems");
		KAFKA_TOPIC_MAP.put("fire_yjsx_read", "t_fire_ems");
		KAFKA_TOPIC_MAP.put("fire_yjdx_read", "t_fire_ems");
		KAFKA_TOPIC_MAP.put("fire_yjfa_read", "t_fire_ems");
		// 百度请求
		KAFKA_TOPIC_MAP.put("baidu_request" , "t_baidu_req");
		// 航班高铁
		KAFKA_TOPIC_MAP.put("travel_request" , "t_travel_req");
	}
}