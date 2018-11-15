package com.kedacom.ezSafe.qyda.qyxx;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by fudapeng on 2018/9/12.
 */
@Controller
@RequestMapping(value = "/qyda/qyxx")
public class QyxxController {
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index() {
        return "ezSafe/qyda/qyxx/page.ftl";
    }
}