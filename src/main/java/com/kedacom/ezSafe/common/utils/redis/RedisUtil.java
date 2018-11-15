package com.kedacom.ezSafe.common.utils.redis;

import java.util.*;
import java.util.Map.Entry;

import com.kedacom.ezSafe.common.utils.ComCache;
import com.kedacom.avatar.logging.AvatarLogger;
import com.kedacom.avatar.logging.AvatarLoggerFactory;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisPubSub;
import redis.clients.jedis.ScanParams;
import redis.clients.jedis.ScanResult;


public class RedisUtil {
    private JedisPool _jedisPool;
    private static RedisUtil _redisUtil = new RedisUtil();
    private static AvatarLogger logger = AvatarLoggerFactory.getLogger(RedisUtil.class, "Avatar.RedisUtil");

    public static RedisUtil getInstance() {
        return _redisUtil;
    }

    public Jedis getJedis() {
        return _jedisPool.getResource();
    }

    public void subscribe(JedisPubSub jedisPubSub, String[] channels) {
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                JedisThread jedisThread = new JedisThread(jedis, jedisPubSub, channels, 0);
                jedisThread.setDaemon(true);
                jedisThread.start();
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        }
    }

    public void psubscribe(JedisPubSub jedisPubSub, String[] patterns) {
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                JedisThread jedisThread = new JedisThread(jedis, jedisPubSub, patterns, 1);
                jedisThread.setDaemon(true);
                jedisThread.start();
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        }
    }

    public void set(String key, String value) {
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                jedis.set(key, value);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }
    }

    public void hset(String key, String field ,String value) {
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                jedis.hset(key, field ,value);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }
    }

    public String get(String key) {
        String result = "";
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                result = jedis.get(key);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }

        return result;
    }

    public Set<String> keys(String pattern) {
        Set<String> result = new HashSet<String>();
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                result = jedis.keys(pattern);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }
        return result;
    }

    public String hget(String key, String field) {
        String result = "";
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                result = jedis.hget(key, field);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }

        return result;
    }

    public Map<String , String> hgetAll(String key) {
        Map<String , String> result = null;
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                result = jedis.hgetAll(key);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }

        return result;
    }


    public List<String> mget(String[] keyList) {
        List<String> result = new ArrayList<>();
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                result = jedis.mget(keyList);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }

        return result;
    }

    public List<Entry<String, String>> hscan(String key, String field) {
        ScanResult<Entry<String, String>> result = null;
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                ScanParams params = new ScanParams();
                params.match(field);
                result = jedis.hscan(key, "0", params);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }

        return result.getResult();
    }

    public void publish(String channel, String message) {
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                jedis.publish(channel, message);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }
    }

    public boolean exists(String channel) {
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                return jedis.exists(channel);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
            return false;
        } finally {
            if (null != jedis)
                jedis.close();

            return false;
        }
    }

    public void delete(String channel) {
        Jedis jedis = null;
        try {
            if (_jedisPool != null) {
                jedis = _jedisPool.getResource();
                jedis.del(channel);
            }
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            if (null != jedis) {
                jedis.close();
                jedis = null;
            }
        } finally {
            if (null != jedis)
                jedis.close();
        }
    }

    public boolean TestRedisLink() {
        if (_jedisPool == null)
            return false;

        try {
            Jedis jedis = _jedisPool.getResource();
            jedis.get("testKey");
            return true;
        } catch (Exception e) {
            logger.error("redis连接超时！", "", "");
            return false;
        }
    }

    private RedisUtil() {
        initRedis();
    }

    private void initRedis() {
        String redisConfig = ComCache.getInstance().getPzxxCache().getPzxx("redis");
        if (redisConfig.length() > 0)
        {
            JedisPoolConfig config = new JedisPoolConfig();
            config.setMaxWaitMillis(1000 * 30);
            config.setTestOnBorrow(true);
            config.setMaxTotal(100);

            String[] ss = redisConfig.split(":");
            _jedisPool = new JedisPool(config, ss[0], Integer.parseInt(ss[1]));
        }
        else
        {
            System.out.print("系统配置表中，配置redis服务器地址为空！");
        }
    }
}