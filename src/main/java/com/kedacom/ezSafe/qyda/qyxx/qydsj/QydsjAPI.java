package com.kedacom.ezSafe.qyda.qyxx.qydsj;

import com.kedacom.ezSafe.common.service.EsCommonService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.*;

@RestController
@RequestMapping("/api/qyda/qyxx")
public class QydsjAPI {
    private static final Logger logger = LoggerFactory.getLogger(QydsjAPI.class);

    @Autowired
    private EsCommonService commonService;



    @RequestMapping(value = "downLoadQyxxPic")
    public void downloadFile(HttpServletRequest request, HttpServletResponse response,
                             @RequestParam(value = "dataUrl") String dataUrl,
                             @RequestParam(value = "fileName") String fileName) throws IOException {
        URL url = null;

        InputStream is = null;

        ByteArrayOutputStream outStream = null;
        OutputStream outputStream = null;
        HttpURLConnection httpUrl = null;
        try {
            response.setContentType("multipart/form-data");
            response.setHeader("Content-Disposition","attachment; filename = "+ URLEncoder.encode(fileName,"utf-8"));
            outputStream = response.getOutputStream();
            url = new URL(dataUrl);

            httpUrl = (HttpURLConnection) url.openConnection();

            httpUrl.connect();

            httpUrl.getInputStream();

            is = httpUrl.getInputStream();


            outStream = new ByteArrayOutputStream();

            //创建一个Buffer字符串

            byte[] buffer = new byte[1024];

            //每次读取的字符串长度，如果为-1，代表全部读取完毕

            int len = 0;

            //使用一个输入流从buffer里把数据读取出来

            while ((len = is.read(buffer)) != -1) {

                //用输出流往buffer里写入数据，中间参数代表从哪个位置开始读，len代表读取的长度

                outStream.write(buffer, 0, len);
                outputStream.write(buffer,0, len);
            }

        } catch (Exception e) {

            e.printStackTrace();

        } finally {
            outputStream.close();
            if (is != null)

            {

                try {

                    is.close();

                } catch (IOException e) {

                    e.printStackTrace();

                }

            }

            if (outStream != null)

            {

                try {

                    outStream.close();

                } catch (IOException e) {

                    e.printStackTrace();

                }

            }

            if (httpUrl != null)

            {

                httpUrl.disconnect();

            }

        }

    }

    /**
     * 企业大事记 查询接口
     *
     * @param parms take数据类型：  1 资质许可 2 荣誉表彰 3 生产目标 4 生产承诺 5 全部事记
     * @return
     */
    @RequestMapping("getQydsj")
    public List<Map> getQydsj(@RequestParam Map<String, Object> parms) {
        //数据类型
        String optype = parms.get("take").toString();
        List<Map> result = new ArrayList<>();

        if (optype == null || optype.equals("")) {
            return null;
        }
        if (Integer.parseInt(optype) < 1 || Integer.parseInt(optype) > 5) {
            return null;
        }
        if (!optype.equals("5")) {
            return getSingleSj(parms);
        }

        //optype等于5的情况
        //依次获取4种类型的数据
        for (int i = 0; i < 4; i++) {
            parms.put("take", i + 1);
            List<Map> maps = getSingleSj(parms);
            result.addAll(maps);
        }

        //去重处理，保留年份唯一值
        Set<String> set = new HashSet<>();
        for (int k = 0; k < result.size(); k++) {
            String s = result.get(k).keySet().iterator().next().toString();
            set.add(s);
        }

        //相同年份的数据放在同一个key下
        List<Map> list = new ArrayList<>();
        for (String s : set) {
            Map map = new HashMap();
            List<Map> ll = new ArrayList<>();
            for (int k = 0; k < result.size(); k++) {
                String i = result.get(k).keySet().iterator().next().toString();
                if (s.equals(i)) {
                    ll.addAll((List<Map>) (result.get(k).get(i)));
                }
            }
            map.put(s, ll);
            list.add(map);
        }
        //key年份排序
        List<Map> list1 = sortByYear(list);
        //value中日期排序
        list1 = sortByField(list1);
        return list1;
    }

    @RequestMapping("getZzxkDetail")
    public Map getZzxkDetail(@RequestParam Map<String, Object> params) {
        List<Map> list = commonService.selectByMap("a_safe_qyzzxk", "qyzzxk", params);
        if (list.size() > 0) {
            FjSort(list);
            return list.get(0);
        } else {
            return null;
        }
    }

    @RequestMapping("getScmbDetail")
    public Map<String, Object> getScmbDetail(@RequestParam Map<String, Object> params) {
        List<Map> list = commonService.selectByMap("a_safe_aqscmb", "aqscmb", params);
        if (list.size() > 0) {
            FjSort(list);
            return list.get(0);
        } else {
            return null;
        }
    }

    @RequestMapping("getSccnDetail")
    public Map<String, Object> getSccnDetail(@RequestParam Map<String, Object> params) {
        List<Map> list = commonService.selectByMap("a_safe_aqsccn", "aqsccn", params);
        if (list.size() > 0) {
            return list.get(0);
        } else {
            return null;
        }
    }
    /**
     * 查询企业大事记四种类型中任一事记通用方法，
     * optype说明：1 资质许可； 2 荣誉表彰； 3 生产目标； 4 生产承诺。
     *
     * @param parms
     * @return key:year,value:list（对应年份的es数据）
     */
    public List<Map> getSingleSj(Map<String, Object> parms) {
        //四种类型对应的索引，类型，排序字段
        String[] indexarr = {"a_safe_qyzzxk", "a_safe_qyrybz", "a_safe_aqscmb", "a_safe_aqsccn"};
        String[] typearr = {"qyzzxk", "qyrybz", "aqscmb", "aqsccn"};
        String[] fieldarr = {"FZRQ", "BZRQ", "FBRQ", "FBRQ"};
        String optype = parms.get("take").toString();

        if (optype == null || optype.equals("")) {
            return null;
        }
        int op = Integer.parseInt(optype);

        parms.put("sort", fieldarr[op - 1]);
        parms.put("order", "DESC");
        //设置es返回1000条数据
        parms.put("limit", 1000);

        //根据optype获取索引，类型和参数等信息，执行es查询，获取结果
        List<Map> list = commonService.selectByMap(indexarr[op - 1], typearr[op - 1], parms);
        //附件排序
        FjSort(list);
        //针对每条记录做一些处理
        for (int i = 0; i < list.size(); i++) {
            Map map = list.get(i);

            //设置TYPE事记种类
            if (map != null) {
                map.put("TYPE", op);
            }
            //切换显示日期的格式xxxx-xx-xx  ->  xxxx/xx/xx
            if (map.get(fieldarr[op - 1]) != null) {
                map.put("sortField", map.get(fieldarr[op - 1]).toString());
                map.put(fieldarr[op - 1], map.get(fieldarr[op - 1]).toString().replace("-", "/"));
            }
            list.set(i, map);
        }

        //构建输出数据结构   list<key:year,value:list（对应年份的es数据）>
        List<Map> result = buildResult(list, fieldarr[op - 1]);
        return result;
    }


    //根据预留的sortField字段排序
    private List<Map> sortByField(List<Map> list1) {
        for (int i = 0; i < list1.size(); i++) {
            String key = list1.get(i).keySet().iterator().next().toString();
            List<Map> values = (List<Map>) list1.get(i).get(key);
            for (int j = 0; j < values.size(); j++) {
                for (int k = 0; k < values.size() - 1 - j; k++) {
                    String field = values.get(k).get("sortField").toString();
                    String fieldk = values.get(k + 1).get("sortField").toString();
                    if (field.compareTo(fieldk) < 0) {
                        Map tmp;
                        tmp = values.get(k + 1);
                        values.set(k + 1, values.get(k));
                        values.set(k, tmp);
                    }
                }
            }

        }
        return list1;
    }


    //排序，按key年份排序
    private List<Map> sortByYear(List<Map> list) {

        if (list.size() == 1)
            return list;
        for (int i = 0; i < list.size(); i++) {
            for (int k = 0; k < list.size() - 1 - i; k++) {
                String keyi = list.get(k).keySet().iterator().next().toString();
                String keyk = list.get(k + 1).keySet().iterator().next().toString();
                if (keyi.compareTo(keyk) < 0) {
                    Map temp;
                    temp = list.get(k + 1);
                    list.set(k + 1, list.get(k));
                    list.set(k, temp);
                }
            }
        }
        return list;
    }


    /**
     * @param list
     * @param s    可以获取年份的字段
     * @return 构造数据结构 list < key:year,value:list（对应年份的es数据）>
     */
    private List<Map> buildResult(List<Map> list, String s) {
        int mark = 0;//标记下一组(年份)数据的开始位置

        List<Map> result = new ArrayList<>();

        if (list.size() == 1) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put(list.get(0).get(s).toString().substring(0, 4), list);
            result.add(map);
        }
        for (int i = 0; i < list.size() - 1; i++) {
            if (!list.get(i).get(s).toString().substring(0, 4).equals(list.get(i + 1).get(s).toString().substring(0, 4))) {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put(list.get(i).get(s).toString().substring(0, 4), list.subList(mark, i + 1));
                mark = i + 1;
                result.add(map);
                if (i + 1 == list.size() - 1) {
                    Map<String, Object> newmap = new LinkedHashMap<>();
                    Map lastmap = list.get(i+1);
                    List<Map> lastlist = new ArrayList<>();
                    lastlist.add(lastmap);
                    newmap.put(list.get(i + 1).get(s).toString().substring(0, 4), lastlist);
                    result.add(newmap);
                    return result;
                }
            }
            if (i + 1 == list.size() - 1) {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put(list.get(i + 1).get(s).toString().substring(0, 4), list.subList(mark, i + 1));
                result.add(map);
            }

        }
        return result;
    }


    /**
     * 附件排序，根据es结果中的附件顺序FJXX将结果中的单个附件进行排序
     *
     * @param list
     */

    public void FjSort(List<Map> list) {
        for (int i = 0; i < list.size(); i++) {

            Map map = list.get(i);
            if (map.get("FJXX") instanceof Map) {
                continue;
            }
            if (map.get("FJXX") instanceof ArrayList) {
                ArrayList<Map> list1 = (ArrayList<Map>) (map.get("FJXX"));
                Map temp;
                for (int k = 0; k < list1.size(); k++) {
                    for (int j = 0; j < list1.size() - 1 - k; j++) {
                        if ((list1.get(j)).get("XSSX").toString().compareTo((list1.get(j + 1)).get("XSSX").toString()) > 0) {
                            temp = (list1.get(j + 1));
                            list1.set(j + 1, list1.get(j));
                            list1.set(j, temp);
                        }
                    }
                }
                map.put("FJXX", list1);
                list.set(i, map);
            }
        }

    }

}