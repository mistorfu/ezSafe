package com.kedacom.ezSafe.qyda.aqyhgl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @Description:
 * @author: hanshuhao
 * @Date: 2018/10/11
 */
@Controller
@RequestMapping(value = "/qyda/aqyhgl")
public class AqyhglController {
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index() {
        return "ezSafe/qyda/aqyhgl/aqyhgl.ftl";
    }
}
