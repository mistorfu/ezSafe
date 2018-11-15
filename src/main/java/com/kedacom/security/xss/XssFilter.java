package com.kedacom.security.xss;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Created by xuerdi
 * Date: 2018/7/30
 * xss过滤器
 **/
//@WebFilter(filterName = "xssFilter" , urlPatterns = "/api/*")
public class XssFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void doFilter(ServletRequest request , ServletResponse response , FilterChain chain)
        throws IOException ,ServletException
    {
        XssHttpServletRequestWrapper xssRequest = new XssHttpServletRequestWrapper((HttpServletRequest) request);
        chain.doFilter(xssRequest, response);

    }

    @Override
    public void destroy(){}

}