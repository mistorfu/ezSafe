package com.kedacom.ezSafe.qyda.aqsggl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = "/qyda/aqsggl")
public class AqsgglController {
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index() {
        return "ezSafe/qyda/aqsggl/page.ftl";
    }
}
