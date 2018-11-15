package com.kedacom.ezSafe.common.utils.redis;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

public class JedisThread extends Thread 
{
	private Jedis _jedis;
	private JedisPubSub _jedisPubSub;
	private String[] _channels;
	private int _type = 0;
	
	public JedisThread(Jedis jedis, JedisPubSub jedisPubSub, String[] channels, int type)
	{
		_jedis = jedis;
		_jedisPubSub = jedisPubSub;
		_channels = channels;
		_type = type;
	}
	
	public synchronized void run()
	{
		try
		{
			if(_type == 0)
			{
				_jedis.subscribe(_jedisPubSub, _channels);
			}
			else
			{
				_jedis.psubscribe(_jedisPubSub, _channels);
			}
		}
		catch(Exception e)
		{				
		}
		
		try
		{
			if(_jedis != null)
			{
				_jedis.close();
				_jedis = null;
			}

			_jedis = RedisUtil.getInstance().getJedis();
			
			System.out.println("redis连接成功！");
		}
		catch(Exception e)
		{
			System.out.println("redis连接超时！");
			try 
			{
				Thread.sleep(1000);
			} 
			catch (InterruptedException e1) 
			{
				e1.printStackTrace();
			}
		}	
		this.run();
    }
}
