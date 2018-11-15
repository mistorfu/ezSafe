package com.kedacom.security.session;

import com.kedacom.ezSafe.common.domain.User;

/**
 * CopyRight ©1995-2015: 苏州科达科技股份有限公司
 * Project：     Avatar2平台
 * Module：      Avatar2平台-****
 * Description： ******************
 * Author：      YeFei
 * Create Date： 2016-08-11 19:40
 * Version：     V0.1
 * History：
 * 2016-08-11 Modified By YeFei Comment:*****
 */
public class UserSession {

    private static ThreadLocal<User> local = new ThreadLocal<User>();

    public static void setUserSession(User session) {

        System.out.println("Thread.currentThread().getName() = " + Thread.currentThread().getName());

        local.set(session);
    }

    public static User getUserSession() {
        System.out.println("Thread.currentThread().getName() = " + Thread.currentThread().getName());

        return local.get();
    }

    public static void removeSession() {
        local.remove();
    }
}
