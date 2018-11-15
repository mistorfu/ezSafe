package com.kedacom.security.filter;

import com.kedacom.avatar.core.dao.mapper.MapperCriteria;
import com.kedacom.avatar.core.dao.mapper.MapperExample;
import com.kedacom.ezSafe.common.domain.Unit;
import com.kedacom.ezSafe.common.domain.User;
import com.kedacom.ezSafe.common.service.UnitService;
import com.kedacom.ezSafe.common.service.UserService;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LoginFreeInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    @Autowired
    private UnitService unitService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse httpServletResponse, Object handler) throws Exception {
        if (request.getHeader("x-requested-with") != null && request.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")) {
            return true;
        }
        String userName = request.getParameter("username");
        if (userName != null && !"".equals(userName)) {
//            // 如果切换用户，则首先清空当前session中的登录信息
//            request.getSession().setAttribute("user", null);
//            request.getSession().setAttribute("userName", null);

            User user = (User) request.getSession().getAttribute("user");
            if (user == null || !userName.equals(user.getDlm())) {
                MapperExample mapperExample = new MapperExample();
                MapperCriteria mapperCriteria = mapperExample.createCriteria();
                mapperCriteria.addCriterion("dlm = ", userName, "dlm");
                List<User> userList = userService.selectByExample(mapperExample, RowBounds.DEFAULT);
                if (userList != null && !userList.isEmpty()) {
                    request.getSession().setAttribute("user", userList.get(0));
                    request.getSession().setAttribute("userName", userList.get(0).getDlm());

                    //查询用户单位信息
                    Map<String, Object> params = new HashMap<>();
                    params.put("dwbh", userList.get(0).getLsdw());
                    List<Unit> unitList = unitService.selectByMap(params, RowBounds.DEFAULT);
                    if(unitList != null && !unitList.isEmpty()){
                        request.getSession().setAttribute("userOrg", unitList.get(0));
                    }
                }
            }
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
