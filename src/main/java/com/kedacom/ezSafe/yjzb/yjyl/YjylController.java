package com.kedacom.ezSafe.yjzb.yjyl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by yangjunshi on 2018/4/28.
 */
@Controller
public class YjylController {
    @RequestMapping(value = "/yjzb/yjyl", method = RequestMethod.GET)
    public String enterSzylInput() {
        return "ezSafe/yjzb/yjyl/yjyl.ftl";
    }
}
