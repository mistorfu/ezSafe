package com.kedacom.ezSafe.common.utils;

import opensource.jpinyin.PinyinFormat;
import opensource.jpinyin.PinyinHelper;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by edwin on 2018/5/15.
 */
public class PinyinUtil {
    public static String converterToFirstSpell(String chinese) {
        return PinyinHelper.getShortPinyin(chinese).toUpperCase();
    }

    public static String converterToSpell(String chinese) {
        return PinyinHelper.convertToPinyinString(chinese, "", PinyinFormat.WITHOUT_TONE).toUpperCase();
    }

    public static List<String> generatePinyin(String s) {
        List<String> result = new ArrayList<>();
        if (!StringUtils.isEmpty(s)) {
            result.add(s);
            result.add(converterToFirstSpell(s).toUpperCase());
            result.add(converterToSpell(s).toUpperCase());
        }
        return result;
    }

    public static String convertToSpellAll(String str, int maxLength) {
        StringBuffer result = new StringBuffer();
        String[] multiStr = str.split(" ");
        for (int i = 0; i < multiStr.length; i++) {
            String name = multiStr[i];
            if (!name.isEmpty()) {
                String original = "." + name.toUpperCase() + ".";
                if (result != null && !result.toString().isEmpty()) {
                    result.append(";" + original);
                } else {
                    result.append(original);
                }
                String firstSpell = "." + PinyinUtil.converterToFirstSpell(name) + ".";
                if (!firstSpell.isEmpty() && !original.equals(firstSpell))
                    result.append(";" + firstSpell);
                String pinyinSpell = "." + PinyinUtil.converterToSpell(name) + ".";
                if (!pinyinSpell.isEmpty() && !original.equals(pinyinSpell))
                    result.append(";" + pinyinSpell);
            }
        }
        String pinyin = result.toString();
        if (maxLength != -1) {
            maxLength = maxLength - (str.length() + multiStr.length * 3) * 2;
            if (pinyin.length() > maxLength) {
                pinyin = pinyin.substring(0, maxLength - 1);
                if (pinyin.charAt(pinyin.length() - 1) == ';') {
                    pinyin = pinyin.substring(0, maxLength - 2);
                } else if (pinyin.charAt(pinyin.length() - 2) == ';') {
                    pinyin = pinyin.substring(0, maxLength - 3);
                } else if (pinyin.charAt(pinyin.length() - 1) != '.') {
                    pinyin += ".";
                }
            }
        }
        return pinyin;
    }
}
