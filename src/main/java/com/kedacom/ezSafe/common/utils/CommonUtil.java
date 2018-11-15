package com.kedacom.ezSafe.common.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Description;
import java.lang.reflect.Field;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 公用处理类
 * Created by ligengen on 16-3-3.
 */
@JsonInclude(JsonInclude.Include.ALWAYS)
public class CommonUtil {

    private static ObjectMapper objectMapper = null;

    public static String underlineToCamel2(String param) {
        if (param == null || "".equals(param.trim())) {
            return "";
        }
        StringBuilder sb = new StringBuilder(param.toLowerCase());
        Matcher mc = Pattern.compile("_").matcher(param);
        int i = 0;
        while (mc.find()) {
            int position = mc.end() - (i++);
            //String.valueOf(Character.toUpperCase(sb.charAt(position)));
            sb.replace(position - 1, position + 1, sb.substring(position, position + 1).toUpperCase());
        }
        return sb.toString();
    }

    public static <T> void setDefaultValue(Class<T> classType, T target) {
        if (target == null) {
            return;
        }
        try {
            Field[] fields = classType.getDeclaredFields();
            for (Field field : fields) {
                field.setAccessible(true);
                if (field.getType() == String.class) {
                    field.set(target, "");
                } else if (field.getType() == Integer.class || field.getType() == Long.class
                        || field.getType() == Double.class) {
                    field.set(target, -1);
                } else if (field.getType() == Float.class) {
                    field.set(target, -1f);
                } else if (field.getType() == Date.class) {
                    field.set(target, new Date());
                } else {
                    field.set(target, null);
                }
            }
        } catch (Exception e) {

        }
    }


    @Description("对象转换成字符串")
    public static String toString(Object object) {
        if (object == null) {
            return "";
        } else {
            return object.toString();
        }
    }


    @Description("判断string是否是数字")
    public static boolean isNumeric(String str) {
        for (int i = 0; i < str.length(); i++) {
            if (!Character.isDigit(str.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    /**
     * 判断灾情是否结案
     * @param id
     * @return
     */
    public static boolean judgeZqja(String id) {
        PzxxCache pzxx = ComCache.getInstance().getPzxxCache();
        if (id.equals("")) return false;
        if (pzxx.getPzxx("zqxx_zqyjaj") == null || pzxx.getPzxx("zqxx_zqyjaj").equals("")) {
            return id.equals("12");
        } else {
            List<String> zqjaList = Arrays.asList(pzxx.getPzxx("zqxx_zqyjaj").split(","));
            return zqjaList.contains(id);
        }
    }



    /**
     * deepcopy Map
     * @param o
     * @return
     */
    public static Map<String , Object> deepCopy(Map<String , Object> o) {
        Map<String , Object> r = new HashMap<>();
        for (String x : o.keySet()) {
            r.put(x , o.get(x));
        }
        return r;
    }



    public static String toJSONString(Object obj) {
        if (null == objectMapper) {
            objectMapper = new ObjectMapper();
        }
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Map<String , Object> parseMap(String json) {
        return parseObject(json, new TypeReference<Map<String, Object>>() {});
    }


    public static List<Map<String , Object>> parseList(String json) {
        return parseObject(json, new TypeReference<List<Map<String, Object>>>() {});
    }

    public static <T> T parseObject(String jsonStr , Class<T> valueType) {
        if (null == objectMapper) {
            objectMapper = new ObjectMapper();
        }
        try {
            return objectMapper.readValue(jsonStr , valueType);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static <T> T parseObject(String jsonStr , TypeReference<T> typeReference) {
        if (null == objectMapper) {
            objectMapper = new ObjectMapper();
        }
        try {
            return objectMapper.readValue(jsonStr , typeReference);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}

