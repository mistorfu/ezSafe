package com.kedacom.ezSafe.common.utils;

import java.util.HashMap;
import java.util.Map;

public class ComConvert
{
    /**
     * object转换int的函数
     */
    public static int toInteger(Object value, int defaultValue)
    {
        try
        {
            return (null != value) ? Integer.parseInt(value.toString()) : defaultValue;
        }
        catch (Exception e)
        {
            return defaultValue;
        }
    }

    /**
     * object转换long的函数
     */
    public static long toLong(Object value, long defaultValue)
    {
        try
        {
            return (null != value) ? Long.parseLong(value.toString()) : defaultValue;
        }
        catch (Exception e)
        {
            return defaultValue;
        }
    }

    /**
     * object转换double的函数
     */
    public static double toDouble(Object value, double defaultValue)
    {
        try
        {
            return (null != value) ? Double.parseDouble(value.toString()) : defaultValue;
        }
        catch (Exception e)
        {
            return defaultValue;
        }
    }

    /**
     * object转换string的函数
     */
    public static String toString(Object value)
    {
        return (null != value) ? value.toString() : "";
    }

    /**
     * object转换map的函数
     */
    public static Map<String , Object> toMap(Object value) {
        return (null != value) ? (Map) value : new HashMap<>();
    }
}
