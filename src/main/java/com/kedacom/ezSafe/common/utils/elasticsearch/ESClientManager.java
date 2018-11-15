package com.kedacom.ezSafe.common.utils.elasticsearch;

import com.kedacom.ezSafe.common.utils.ComCache;
import com.kedacom.ezSafe.common.utils.ComConvert;
import com.kedacom.ezSafe.common.utils.PzxxCache;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Young on 2017/9/19.
 */
@Service
public class ESClientManager
{
    private Object obj = new Object();
    private RestClient s_LowClient = null;
    private RestHighLevelClient s_HighClient = null;

    public ESClientManager()
    {
    }

    public RestHighLevelClient getClient()
    {
        if(this.s_HighClient == null)
        {
            synchronized(obj)
            {
                this.createClient();
            }
        }

        return this.s_HighClient;
    }

    public RestClient getLowClient()
    {
        if(this.s_LowClient == null)
        {
            synchronized(obj)
            {
                this.createClient();
            }
        }

        return this.s_LowClient;
    }

    private void createClient()
    {
        if(this.s_LowClient == null || this.s_HighClient == null)
        {
            System.out.println("Creating client for Search!");

            try
            {
                List<HttpHost> hostArray = new ArrayList<>();
                PzxxCache pzxxCache = ComCache.getInstance().getPzxxCache();
                String[] nodes = pzxxCache.getPzxx("esfwqip").split(";");
                for (String item : nodes) {
                    String[] host = item.split(":");
                    if (host.length == 2 && !host[0].equals("") && !host[1].equals("")) {
                        hostArray.add(new HttpHost(host[0], ComConvert.toInteger(host[1], 9200), "http"));
                    }
                }

                String[] userInfo = pzxxCache.getPzxx("esfwqqx").split(":");
                final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
                if (userInfo.length == 2) {
                    credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(userInfo[0], userInfo[1]));
                }
                s_LowClient = RestClient.builder(hostArray.toArray(new HttpHost[0])).setHttpClientConfigCallback(new RestClientBuilder.HttpClientConfigCallback()
                {
                    @Override
                    public HttpAsyncClientBuilder customizeHttpClient(HttpAsyncClientBuilder httpClientBuilder)
                    {
                        return httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
                    }
                }).setRequestConfigCallback(new RestClientBuilder.RequestConfigCallback() {
                    @Override
                    public RequestConfig.Builder customizeRequestConfig(RequestConfig.Builder builder) {
                        return builder.setConnectTimeout(30000)
                                .setSocketTimeout(50000)
                                .setConnectionRequestTimeout(30000);
                    }
                }).setMaxRetryTimeoutMillis(5 * 60 * 1000).build();

                s_HighClient = new RestHighLevelClient(s_LowClient);
            }
            catch (Exception e)
            {
                e.printStackTrace();
                System.err.println("Error occured while creating search client!");
            }
        }
    }

    @PreDestroy
    protected void destory() {
        System.out.println("destory the client");
        if(this.s_LowClient != null) {
            try {
                this.s_LowClient.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
