package com.kedacom.ezSafe.qyda.whpqygl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by fudapeng on 2018/11/20.
 */
@Controller
@RequestMapping(value = "/qyda/whpqygl")
public class WhpqyglController {
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index() {
        return "ezSafe/qyda/whpqygl/page.ftl";
    }
}