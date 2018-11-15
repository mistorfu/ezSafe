package com.kedacom.ezSafe.common.utils;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.kedacom.ezSafe.common.utils.redis.RedisUtil;

/**
 * Title: 	通用缓存
 * Author: 	ShenQing
 */
public class ComCache
{
	private static ComCache 	s_comCache = new ComCache();					//1. 通用缓存单实例
	private PzxxCache			m_pzxxCache = new PzxxCache();					//2. 配置信息缓存对象


	/**
	 * 更新缓存的方法
	 */
	public static void updateCache(int operaType, int type, int subType
								 , List<Object> cacheList, String channelName)
	{
		for (int i = 0; i < cacheList.size(); i++)
		{
			updateCache(operaType, type, subType, cacheList.get(i), channelName);
		}
	}
	
	/**
	 * 更新缓存的方法
	 */
	public static void updateCache(int operaType, int type, int subType
								 , Object cacheContent, String channelName)
	{
		try
		{
			ObjectMapper mapper = new ObjectMapper();
			ObjectNode root = mapper.createObjectNode();
			ObjectNode operaInfo = mapper.createObjectNode();
			
			String json = mapper.writeValueAsString(cacheContent);
			operaInfo.set("content", mapper.readTree(json));
			operaInfo.put("subType", subType);
			operaInfo.put("type", type);
			
			root.put("operaType", operaType);
			root.set("operaInfo", operaInfo);

			RedisUtil redisUtil = RedisUtil.getInstance();
			redisUtil.publish(channelName, root.toString());
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取单实例的方法
	 */
	public static ComCache getInstance()
	{
		return s_comCache;
	}

	/**
	 * 获取配置信息缓存的方法
	 */
	public PzxxCache getPzxxCache()
	{
		return m_pzxxCache;
	}



	/**
	 * 初始化缓存的方法
	 */
	public void initCache()
	{
		ZdxCache.initCache();
		m_pzxxCache.initCache();
	}
	
	/**
	 * 默认构造方法
	 */
	private ComCache()
	{
		initCache();
		subscribe();
	}
	
	/**
	 * 订阅缓存的方法
	 */
	private void subscribe()
	{
//		RedisUtil redisUtil = RedisUtil.getInstance();
//		redisUtil.psubscribe(new JedisPubSubListener()
//		{
//			public void onPMessage(String pattern, String channel, String message)
//			{
//				super.onPMessage(pattern, channel, message);
//
//				try
//				{
//					if (pattern.equals("CACHE.*"))
//					{
//						Map map = resolveMessage(message);
//						if (null != map)
//						{
//							int operaType = (Integer)map.get("operaType");
//							Map operaInfo = (Map)map.get("operaInfo");
//							if (channel.equals("CACHE.PZXX"))
//							{
//								m_pzxxCache.updateCache(operaType, operaInfo);
//							}
//						}
//					}
//					else
//					{
//						String sblx = channel.equals("24.SBZT") ? "0" : "1";
//						for (String parameter : message.split(";"))
//						{
//							String[] deviceInfo = parameter.split(":");
//							if (2 == deviceInfo.length)
//							{
//								m_sbxxCache.updateCache(sblx, deviceInfo[0], deviceInfo[1]);
//							}
//						}
//					}
//				}
//				catch (Exception e)
//				{
//					e.printStackTrace();
//				}
//			}
//		}, new String[] { "CACHE.*", "*.SBZT" });
	}
	
	/**
	 * 解析Redis消息的方法
	 */
	private Map resolveMessage(String message)
	{
		Map map = null;
		try
		{
			ObjectMapper mapper = new ObjectMapper();
			map = mapper.readValue(message, Map.class);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		return map;
	}
}