package com.kedacom.ezSafe.common.service;

import com.kedacom.avatar.core.base.BaseService;
import com.kedacom.avatar.core.dao.mapper.MapperCriteria;
import com.kedacom.avatar.core.dao.mapper.MapperExample;
import com.kedacom.ezSafe.common.dao.UserDao;
import com.kedacom.ezSafe.common.domain.User;
import com.kedacom.avatar.logging.AvatarLogger;
import com.kedacom.avatar.logging.AvatarLoggerFactory;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ligengen on 15-3-21.
 * 2015/4/2 liwei add getUserUnitCode method
 */


@Service
public class UserService extends BaseService<User> {

    @Value("${watermark}")
    private String watermark;

    AvatarLogger avatarLogger = AvatarLoggerFactory.getLogger(UserService.class, "ezFireExt.userService");

    public String getUserUnitCode(String userCode) {
        String unitCode = "";
        MapperExample mapperExample = new MapperExample();
        mapperExample.createCriteria().addCriterion("dlm = ", userCode, "dlm");
        List<User> userList = super.selectByExample(mapperExample, new RowBounds());
        if (userList == null || userList.size() == 0) {
            avatarLogger.debug("No user found with userCode :" + userCode);
        } else {
            unitCode = userList.get(0).getLsdw();
        }

        if ("".equals(unitCode)) {
            avatarLogger.debug("No assigned unit to the user with usercode" + userCode + ".");
        }

        return unitCode;
    }

    public int checkRyTable(Map map) {
        UserDao userDao = (UserDao) dao;
        int count = userDao.checkRyTable(map);
        return count;
    }

    public int checkUserTable(Map map) {
        UserDao userDao = (UserDao) dao;
        int count = userDao.checkUserTable(map);
        return count;
    }

    /**
     * 验证是否存在指定用户名、密码的用户
     *
     * @return
     */
    public User validateUser(String userCode, String password) {
        User user = null;
        boolean success = true;

        MapperExample mapperExample = new MapperExample();
        MapperCriteria mapperCriteria = mapperExample.createCriteria();
        mapperCriteria.addCriterion("dlm = ", userCode, "dlm");
        List<User> userList = super.selectByExample(mapperExample, new RowBounds());
        if (userList == null || userList.size() == 0) {
            success = false;
            avatarLogger.error("", "", "In table b_rs_ry , no user is found which userCode :" + userCode);
        } else {
            user = userList.get(0);
        }
        if (!success) {
            return user;
        }
        if (!StringUtils.isEmpty(user.getDlmm())) {
            avatarLogger.info("In table b_rs_ry , the user's dlmm is found which userCode :" + userCode);
            return user;
        } else {
            avatarLogger.warn("In table b_rs_ry , the user's dlmm is not found which userCode :" + userCode);
            UserDao userDao = (UserDao) dao;
            int userNum = 0;
            try {
                user.setDlmm(password);
                userNum = userDao.validateUserPassword(userCode, password);
            } catch (Exception e) {
                avatarLogger.debug(e.getMessage(), e);
            }
            return userNum <= 0 ? null : user;
        }
    }

    /**
     * @description 根据单位编号获取用户分组
     * @param
     * @return
     * DATE 2017/6/23.
     */
    public List<Map<String,String>> getUserGroup(String unitCode){
        UserDao userDao = (UserDao) dao;
        List userGroupList = userDao.getUserGroup(unitCode);
        return userGroupList;
    }

    public List<Map<String,String>> getUserInfo(Map map) {
        UserDao userDao = (UserDao) dao;
        return userDao.getUserInfo(map);
    }

    public Map<String,String> getUserInfo(String userCode) {
        Map<String, Object> params = new HashMap<>();
        params.put("userCode", userCode);

        UserDao userDao = (UserDao) dao;
        List<Map<String, String>> userList = userDao.getUserInfo(params);
        if (userList.size() > 0) {
            userList.get(0).put("watermark", watermark);
        }
        return userList.size()>0 ? userList.get(0) : null;
    }
}
