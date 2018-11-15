package com.kedacom.ezSafe.yjzb.yjsc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = "/yjzb/yjsc")
public class YjscController {

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String show() {
        return "ezSafe/yjzb/yjsc/yjsc.ftl";
    }
}