package com.kedacom.ezSafe.common.enums;

import com.kedacom.ezSafe.common.utils.ComCache;
import com.kedacom.ezSafe.common.utils.PzxxCache;

import java.util.HashMap;
import java.util.Map;

/**
 * es表别名枚举
 */
public enum EsAliases {

    //企业档案数据表
    QYJCXX("safe_qyjcxx_read", "safe_qyjcxx_write", "a_safe_qyjcxx", "qyjcxx", "企业基础信息"),
    QYZZXK("safe_qyzzxk_read", "safe_qyzzxk_write", "a_safe_qyzzxk", "qyzzxk", "企业资质许可"),
    QYRYBZ("safe_qyrybz_read", "safe_qyrybz_write", "a_safe_qyrybz", "qyrybz", "企业荣誉表彰"),
    QYFGZD("safe_qyfgzd_read", "safe_qyfgzd_write", "a_safe_qyfgzd", "qyfgzd", "企业法规制度"),
    AQSCJG("safe_aqscjg_read", "safe_aqscjg_write", "a_safe_aqscjg", "aqscjg", "安全生产机构"),
    AQSCMB("safe_aqscmb_read", "safe_aqscmb_write", "a_safe_aqscmb", "aqscmb", "安全生产目标"),
    AQSCCN("safe_aqsccn_read", "safe_aqsccn_write", "a_safe_aqsccn", "aqsccn", "安全生产承诺"),
    QYGLRY("safe_qyglry_read", "safe_qyglry_write", "a_safe_qyglry", "qyglry", "企业管理人员"),
    QYTZRY("safe_qytzry_read", "safe_qytzry_write", "a_safe_qytzry", "qytzry", "企业特种人员"),
    QYXCRW("safe_qyxcrw_read", "safe_qyxcrw_write", "a_safe_qyxcrw", "qyxcrw", "企业巡查任务"),
    QYAQYH("safe_qyaqyh_read", "safe_qyaqyh_write", "a_safe_qyaqyh", "qyaqyh", "企业安全隐患"),
    QYAQSG("safe_qyaqsg_read", "safe_qyaqsg_write", "a_safe_qyaqsg", "qyaqsg", "企业安全事故"),

    //重大安保活动表
    SZYL("fire_szyl_read", "fire_szyl_write", "a_fire_szyl", "yjyl", "实战演练"),

    //灭火救援力量表
    XFDW("fire_xfdw_read", "fire_xfdw_write", "a_fire_xfdw", "xfdw", "消防单位"),

    //应急管理数据表
    YJYA("fire_yjya_read", "fire_yjya_write", "a_fire_yjya", "yjya", "应急预案"),
    YJZS("fire_yjzs_read", "fire_yjzs_write", "a_fire_yjzs", "yjzs", "应急知识"),
    YJSX("fire_yjsx_read", "fire_yjsx_write", "a_fire_yjsx", "yjsx", "应急事项"),
    YJFA("fire_yjfa_read", "fire_yjfa_write", "a_fire_yjfa", "yjfa", "应急方案"),
    YJDX("fire_yjdx_read", "fire_yjdx_write", "a_fire_yjdx", "yjdx", "应急对象"),

    //警情处置数据表
    ZQXX("fire_zqxx_read", "fire_zqxx_write", "a_fire_zqxx", "zqxx", "灾情信息"),

    //战备值守数据表
    ZYSX("fire_zysx_read", "fire_zysx_write", "a_fire_zysx", "zysx", "重要事项");

    private String read;
    private String write;
    private String index;
    private String type;
    private String desc;
    private static Map<String, String> seedsMap = new HashMap<>();

    static {
        PzxxCache pzxxCache = ComCache.getInstance().getPzxxCache();
        String pzxxValue = pzxxCache.getPzxx("eskjqfw");
        if (pzxxValue != null && !pzxxValue.trim().equals("")) {
            String[] configs = pzxxValue.split(":");
            if (configs.length == 2 && !configs[0].trim().equals("")) {
                String[] indexs = configs[1].split(",");
                for (String item : indexs) {
                    if (!item.trim().equals("")) {
                        seedsMap.put(item, configs[0] + ":" + item);
                    }
                }
            }
        }
    }

    EsAliases(String read, String write, String index, String type, String desc) {
        this.read = read;
        this.write = write;
        this.index = index;
        this.type = type;
        this.desc = desc;
    }

    public String getRead() {
        String index = read;
        if (seedsMap != null && seedsMap.containsKey(index)) {
            index = seedsMap.get(index);
        }
        return index;
    }

    public String getWrite() {
        return write;
    }

    public String getType() {
        return type;
    }

    public String getIndex() {
        return index;
    }

    public String getDesc() {
        return desc;
    }
}
