package com.kedacom.ezSafe.qyda.qygl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by fudapeng on 2018/9/25.
 */
@Controller
@RequestMapping(value = "/qyda/qygl")
public class QyglController {
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index() {
        return "ezSafe/qyda/qygl/page.ftl";
    }
}