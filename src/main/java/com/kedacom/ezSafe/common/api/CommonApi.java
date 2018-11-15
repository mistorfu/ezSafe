package com.kedacom.ezSafe.common.api;

import com.kedacom.ezSafe.common.service.EsCommonService;
import com.kedacom.ezSafe.common.service.UserService;
import com.kedacom.ezSafe.common.utils.ComCache;
import com.kedacom.ezSafe.common.utils.PzxxCache;
import com.kedacom.ezSafe.common.utils.ZdxCache;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/common-api")
public class CommonApi {
    @Autowired
    private UserService userService;

    @Autowired
    private EsCommonService commonService;

    @RequestMapping(value = "/getUserInfo", produces = {"application/json"})
    public Map getUserInfo(String userCode) {
        if (userCode == null || userCode.equals("")) {
            return null;
        } else {
            return userService.getUserInfo(userCode);
        }
    }

    @RequestMapping(value = "/getXzqhTree", method = RequestMethod.GET, produces = {"application/json"})
    public List<Map> getXzqhTree(@RequestParam(required = false, value = "id") String id
            , @RequestParam(required = false, value = "imgUrl", defaultValue = "") String imgUrl
            , @RequestParam(required = false, defaultValue = "false") Boolean noHead
            , @RequestParam(required = false, defaultValue = "3") Integer minLevel) {
        List<Map> tree = new ArrayList<Map>();
        String[] ids = id.split(";");
        id = ids[0];
        boolean bIsInit = false;
        if (ids.length > 1) bIsInit = true;

        if (bIsInit || id.length() < 6 || id.endsWith("00")) {
            Map param = new HashMap();
            if (bIsInit) {
                param.put("XZBM", id);
            } else {
                param.put("XZFBM", id);
            }
            param.put("fields", "XZBM,XZMC,XZNBBM");
            param.put("sort", "xzbm");
            param.put("limit", 100);
            List<Map> dataList = commonService.selectByMap("a_ez_xzqy", "xzqy", param);
            param = new HashMap();
            StringBuilder sb = new StringBuilder();
            for (Map item : dataList) {
                sb.append(item.get("XZBM").toString() + ",");
            }
            param.put("xzfbm", sb.toString());
            param.put("aggField", "XZFBM");
            Map<String, Integer> childrenNumMap = commonService.getAggregationCount("a_ez_xzqy", "xzqy", param);
            if (id.length() == 6 && !id.endsWith("0000")) {
                param = new HashMap();
                param.put("ssxq.xzqhbh", sb.toString());
                param.put("aggField", "SSXQ.XZQHBH");
                childrenNumMap.putAll(commonService.getAggregationCount("a_ez_wgxx", "wgxx", param));
            }
            for (Map item : dataList) {
                Map node = new HashMap();
                String xzbm = item.get("XZBM").toString();
                String value = xzbm + ";" + item.get("XZMC").toString() + ";" + item.get("XZNBBM").toString();
                node.put("id", xzbm);
                node.put("text", item.get("XZMC"));
                node.put("innerCode", value);
                node.put("xzbm", xzbm);
                node.put("xzmc", item.get("XZMC"));
                if (childrenNumMap.containsKey(xzbm)) {
                    node.put("ImageUrl", imgUrl);
                    node.put("hasChildren", true);
                } else {
                    node.put("hasChildren", false);
                }
                tree.add(node);
            }
        } else {
            Map param = new HashMap();
            param.put("ssxq.xzqhbh", id);
            param.put("limit", 100);
            List<Map> dataList = commonService.selectByMap("a_ez_wgxx", "wgxx", param);
            for (Map item : dataList) {
                Map node = new HashMap();
                node.put("id", item.get("WGBH"));
                node.put("text", item.get("WGMC"));
                node.put("innerCode", item.get("WGBH") + ";" + item.get("WGMC"));
                node.put("hasChildren", false);

                tree.add(node);
            }
        }

        return tree;
    }

    @RequestMapping(value = "/getZdx", method = RequestMethod.GET)
    public List<Map<String, Object>> getZdx(@RequestParam String zdlx) {
        return ZdxCache.getZdxTreeByZdlx(zdlx, false);
    }

    @RequestMapping(value = "/getXzqhList", method = RequestMethod.GET)
    public List<Map> getXzqhList(@RequestParam Map<String, Object> params) {
        if (params.containsKey("pageSize")) params.put("limit", params.get("pageSize"));
        if (params.containsKey("skip")) params.put("offset", params.get("skip"));
        List<Map> xzqhList = commonService.selectByMap("a_ez_xzqy", "xzqy", params);
        params.put("wgmc", params.get("xzmc"));
        params.put("fields", "WGBH,WGMC");
        params.remove("xzmc");
        params.remove("xznbbm");
        xzqhList.addAll(commonService.selectByMap("a_ez_wgxx", "wgxx", params));
        return xzqhList;
    }

    @RequestMapping(value = "/getXfdwList", method = RequestMethod.GET)
    public List<Map> getXfdwList(@RequestParam Map<String, Object> params){
        if (params.containsKey("pageSize")) params.put("limit", params.get("pageSize"));
        if (params.containsKey("skip")) params.put("offset", params.get("skip"));
        List<Map> xfdwList = commonService.selectByMap("a_ez_xzqy", "xzqy", params);

        return xfdwList;
    }

    @RequestMapping(value = "/getWgxx", method = RequestMethod.GET)
    public Map getWgxx(@RequestParam Map<String, Object> params) {
        if (params.containsKey("pageSize")) params.put("limit", params.get("pageSize"));
        if (params.containsKey("skip")) params.put("offset", params.get("skip"));
        return commonService.selectPagedDataByMap("a_ez_wgxx", "wgxx", params);
    }

    @RequestMapping(value = "/downloadFile")
    public void downloadFile(String fileUrl, String fileName, HttpServletResponse response) {
        try {
            URL url = new URL(fileUrl);
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(30 * 1000);
            if (StringUtils.isEmpty(fileName)) fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            response.reset();
            response.setContentType("multipart/form-data");
            response.setHeader("content-disposition", "attachment;fileName=" + URLEncoder.encode(fileName, "UTF-8"));
            OutputStream outStream = response.getOutputStream();
            InputStream inStream = conn.getInputStream();
            byte[] buffer = new byte[2048];
            int len;
            while((len=inStream.read(buffer)) != -1 ){
                outStream.write(buffer, 0, len);
            }
            inStream.close();
            outStream.flush();
            outStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 查询文件类型配置项
     */
    @RequestMapping(value = "/getFileType", method = RequestMethod.GET)
    public Map<String, Object> getFileType() {
        Map<String, Object> result = new HashMap<>();

        PzxxCache pzxxCache = ComCache.getInstance().getPzxxCache();
        result.put("tpwjlx", pzxxCache.getPzxx("tpwjlx"));
        result.put("spwjlx", pzxxCache.getPzxx("spwjlx"));

        return result;
    }
}
