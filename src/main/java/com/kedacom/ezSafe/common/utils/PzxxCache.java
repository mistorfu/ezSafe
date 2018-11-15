package com.kedacom.ezSafe.common.utils;

import java.util.*;

import com.kedacom.avatar.base.web.context.SpringContextUtil;
import com.kedacom.ezSafe.common.domain.BQjXtpz;
import com.kedacom.ezSafe.common.service.BQjXtpzService;
import org.apache.ibatis.session.RowBounds;

/**
 * Title: 	配置缓存
 * Author: 	ShenQing
 */
public class PzxxCache
{
	/**
	 * 配置信息缓存
	 */
	private Map m_pzxxMap = new HashMap<String, BQjXtpz>();
	
	/**
	 * 获取配置信息的方法
	 */
	public List<BQjXtpz> getPzxx()
	{
		return new ArrayList<BQjXtpz>(m_pzxxMap.values());
	}
	
	/**
	 * 获取配置信息的方法
	 */
	public String getPzxx(String key)
	{
		String value = "";
		if (m_pzxxMap.containsKey(key))
		{
			value = ((BQjXtpz)m_pzxxMap.get(key)).getPzz();
		}
		
		return value;
	}
	
	/**
	 * 初始化缓存的方法
	 */
	public void initCache()
	{
		m_pzxxMap.clear();

		BQjXtpzService xtpzService = SpringContextUtil.getBean("BQjXtpzService", BQjXtpzService.class);
		List<BQjXtpz> xtpzList = xtpzService.selectByMap(new HashMap<String, Object>(), RowBounds.DEFAULT);
		for (int i = 0; i < xtpzList.size(); i++)
		{
			m_pzxxMap.put(xtpzList.get(i).getBlm(), xtpzList.get(i));
		}
	}
}