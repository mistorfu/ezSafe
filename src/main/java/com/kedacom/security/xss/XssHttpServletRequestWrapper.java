package com.kedacom.security.xss;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by xuerdi
 * Date: 2018/7/30
 * XSS过滤处理
 **/
public class XssHttpServletRequestWrapper extends HttpServletRequestWrapper{

    public XssHttpServletRequestWrapper(HttpServletRequest request) {
        super(request);
    }

    @Override
    public String[] getParameterValues(String name) {
        String[] values = super.getParameterValues(name);
        if (values != null)
        {
            int length = values.length;
            String[] escapseValues = new String[length];
            for (int i = 0; i < length; i++)
            {
                // 防xss攻击和过滤前后空格
                escapseValues[i] = Jsoup.clean(values[i], Whitelist.relaxed()).trim().intern();
            }
            return escapseValues;
        }
        return super.getParameterValues(name);
    }


    @Override
    public String getParameter(String name) {
        String value = super.getParameter(name);
        if (value != null) {
            return Jsoup.clean(value , Whitelist.relaxed()).trim().intern();
        }
        return super.getParameter(name);
    }

    @Override
    public Map<String , String[]> getParameterMap() {
        Map<String , String[]> valueMap = super.getParameterMap();
        if (valueMap != null) {
            Map<String , String[]> escapseMap = new HashMap<>(valueMap);
            for (String key : valueMap.keySet()) {
                String[] values = valueMap.get(key);
                int length = values.length;
                String[] escapseValues = new String[length];
                for (int i = 0; i < length; i++)
                {
                    // 防xss攻击和过滤前后空格
                    escapseValues[i] = Jsoup.clean(values[i], Whitelist.relaxed()).trim().intern();
                }
                escapseMap.put(key , escapseValues);
            }
            return escapseMap;
        }
        return super.getParameterMap();
    }

}