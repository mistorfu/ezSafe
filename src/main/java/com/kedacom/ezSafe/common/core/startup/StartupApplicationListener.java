package com.kedacom.ezSafe.common.core.startup;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * CopyRight ©1995-2015: 苏州科达科技股份有限公司
 * Project：     Avatar2平台
 * Module：      Avatar2平台-****
 * Description： ******************
 * Author：      YeFei
 * Create Date： 2016-01-04 6:12
 * Version：     V0.1
 * History：
 * 2016-01-04 Modified By YeFei Comment:*****
 */
@Component
public class StartupApplicationListener implements ApplicationListener<ContextRefreshedEvent> {

    private static boolean isStart = false;

    List< ? extends StartupHandler> startupHandlers = Arrays.asList(new CacheConfigStartupHandler());

//    @Override
//    public void contextInitialized(ServletContextEvent servletContextEvent) {
//
//        ServletContext context = servletContextEvent.getServletContext();
//        ApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(context);
//
//        for( StartupHandler startupHandler : startupHandlers ){
//
//            startupHandler.startHandler( ctx );
//        }
//    }
//
//    @Override
//    public void contextDestroyed(ServletContextEvent servletContextEvent) {
//
//    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {

        if( !isStart ){
            ApplicationContext applicationContext =  contextRefreshedEvent.getApplicationContext();
            if( applicationContext.getParent() != null ){
                isStart = true;
                for( StartupHandler startupHandler : startupHandlers ){
                    startupHandler.startHandler( applicationContext );
                }
            }
        }
    }
}
