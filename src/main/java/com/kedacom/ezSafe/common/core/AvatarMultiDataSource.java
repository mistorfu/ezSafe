package com.kedacom.ezSafe.common.core;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * CopyRight ?1995-2015: 苏州科达科技股份有限公司
 * Project： avatar-ezFireExt
 * Module：  com.kedacom.avatar.core.config
 * Description：
 * Author：      Liwei
 * Create Date： 2015/6/3 14:44
 * Version：     V0.1
 * History：
 */
public class AvatarMultiDataSource extends AbstractRoutingDataSource {


    private static final ThreadLocal<String> dataSourceKey = new InheritableThreadLocal<String>();

    public static void setDataSourceKey(String dataSource) {
        dataSourceKey.set(dataSource);
    }
    @Override
    protected Object determineCurrentLookupKey() {
        return dataSourceKey.get();
    }
}
