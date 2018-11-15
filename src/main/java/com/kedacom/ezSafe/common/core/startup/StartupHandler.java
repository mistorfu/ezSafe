package com.kedacom.ezSafe.common.core.startup;

import org.springframework.context.ApplicationContext;

/**
 * CopyRight ©1995-2015: 苏州科达科技股份有限公司
 * Project：     Avatar2平台
 * Module：      Avatar2平台-****
 * Description： ******************
 * Author：      YeFei
 * Create Date： 2016-01-04 6:37
 * Version：     V0.1
 * History：
 * 2016-01-04 Modified By YeFei Comment:*****
 */
public interface StartupHandler {

    void startHandler(ApplicationContext applicationContext);
}
