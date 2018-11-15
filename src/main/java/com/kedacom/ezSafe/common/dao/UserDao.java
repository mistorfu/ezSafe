package com.kedacom.ezSafe.common.dao;

import com.kedacom.avatar.core.dao.Dao;
import com.kedacom.ezSafe.common.bean.UserInfoBean;
import com.kedacom.ezSafe.common.domain.User;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * Created by ligengen on 15-3-21.
 */
public interface UserDao extends Dao<User> {

    /**
     * 验证用户密码
     * @param userCode
     * @param password
     * @return 返回符合条件的记录数
     */
    public Integer validateUserPassword(String userCode, String password);
    public int checkRyTable(Map map);
    public int checkUserTable(Map map);
    public List<Map<String,String>> getUserGroup(String unitCode);

    public List<Map<String,String>> getUserInfo(Map map);

    @Select("SELECT RY.DLM,DW.SSXQ,DW.DWJB FROM B_RS_RY ry LEFT JOIN B_RS_DW dw on RY.LSDW=DW.DWBH where RY.DLM=#{dlm} AND ROWNUM<=1")
    @Results({
            @Result(property ="username",column = "dlm"),
            @Result(property = "ssxq",column = "ssxq"),
            @Result(property = "dwjb",column = "dwjb")
    })
    UserInfoBean getUserSsxq(@Param("dlm") String username);
}
