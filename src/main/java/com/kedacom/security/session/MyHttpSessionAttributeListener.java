package com.kedacom.security.session;

import com.kedacom.ezSafe.common.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;

/**
 * CopyRight ©1995-2015: 苏州科达科技股份有限公司
 * Project：     Avatar2平台
 * Module：      Avatar2平台-****
 * Description： ******************
 * Author：      YeFei
 * Create Date： 2016-08-11 19:41
 * Version：     V0.1
 * History：
 * 2016-08-11 Modified By YeFei Comment:*****
 */
public class MyHttpSessionAttributeListener implements HttpSessionAttributeListener {

    private Logger myLogger = LoggerFactory.getLogger(MyHttpSessionAttributeListener.class );

    public void attributeAdded(HttpSessionBindingEvent event) {

        myLogger.info("EventName: {}", event.getName() );
        if ("user".equals(event.getName())) {
            UserSession.setUserSession((User)event.getValue());
        }
    }

    @Override
    public void attributeRemoved(HttpSessionBindingEvent event) {
        if ("user".equals(event.getName())) {
            UserSession.removeSession();
        }
    }

    public void attributeReplaced(HttpSessionBindingEvent event) {
        myLogger.info("EventName: {}", event.getName() );
        if ("user".equals(event.getName())) {
            UserSession.setUserSession((User)event.getValue());
        }
    }
}
