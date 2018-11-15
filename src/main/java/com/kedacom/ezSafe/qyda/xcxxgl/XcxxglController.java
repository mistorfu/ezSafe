package com.kedacom.ezSafe.qyda.xcxxgl;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
@Controller
@RequestMapping("/qyda/xcxxgl")
public class XcxxglController {
    @RequestMapping(value = "", method = RequestMethod.GET)

    public String index() {
        return "ezSafe/qyda/xcxxgl/page.ftl";
    }
}
