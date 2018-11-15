package com.kedacom.ezSafe.common.core.startup;

import com.kedacom.ezSafe.common.utils.*;
import com.kedacom.avatar.logging.AvatarLogger;
import com.kedacom.avatar.logging.AvatarLoggerFactory;
import org.springframework.context.ApplicationContext;

/**
 * CopyRight ©1995-2015: 苏州科达科技股份有限公司
 * Project：     Avatar2平台
 * Module：      Avatar2平台-****
 * Description： ******************
 * Author：      YeFei
 * Create Date： 2016-01-04 6:38
 * Version：     V0.1
 * History：
 * 2016-01-04 Modified By YeFei Comment:*****
 */
public class CacheConfigStartupHandler implements StartupHandler
{
    private AvatarLogger myLogger = AvatarLoggerFactory.getLogger(CacheConfigStartupHandler.class, "Avatar.CacheConfigStartupHandler");

    @Override
    public void startHandler(ApplicationContext context)
    {
        ComCache.getInstance();
    }
}
