<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qyxx/qydsj/qydsj.css'/>"/>
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qyxx/qydsj/scmbDetail/qydsjDetail.css'/>"/>
<div class="sub-left-page">
    <div class="sub-page-switchs">
        <div class="sub-page-switch selected" id="switch-qbsj" value="5">全部事记</div>
        <div class="sub-page-switch" id="switch-zzxk" value="1">资质许可</div>
        <div class="sub-page-switch" id="switch-rybz" value="2">荣誉表彰</div>
        <div class="sub-page-switch" id="switch-scmb" value="3">生产目标</div>
        <div class="sub-page-switch" id="switch-sccn" value="4">生产承诺</div>
    </div>
</div>
<div class="sub-page-container">
    <div class="time-bar" id="time-bar">
        <div class="button-to-top" id="button-to-top">
        </div>
        <div class="button-to-bottom" id="button-to-bottom">
        </div>
    </div>

</div>
<div id="scmbWindow" style="overflow: hidden">
</div>
<#include "/ezSafe/qyda/qyxx/qydsj/scmbDetail/qydsjDetail.ftl"/>

<div class="sccnWindow" id="sccnWindow">
    <#include "/ezSafe/qyda/qyxx/qydsj/sccnDetail/sccnDetail.ftl" />
</div>
<div id="zzxkWindow">
    <#include "/ezSafe/qyda/qyxx/qydsj/zzxkDetail/zzxkDetail.ftl" />
</div>

<script id="timelineTemp" type="text/x-kendo-template">
    <div class="history" id="history">
        <div class="history-date" id="history-date">
            <ul>
                #for(i in data){#
                #for(k in data[i]){#
                <li class="year">
                    <h3>
                        #: k #
                    </h3>
                    <div class="qydsj-line"></div>
                    <div class="qydsj-cicle"></div>
                </li>
                #for(j in data[i][k]){#
                #var single = data[i][k][j]#
                #if(single.TYPE == 1) {#
                <#--资质许可-->
                <li class="date">
                    <h3>#:single.FZRQ#</h3>
                    <div class="qydsj-line"></div>
                    <div class="qydsj-cicle"></div>
                    <dl class="content-zzxk">
                        <dt>
                            <div class="right-info-zzxk">
                                <div class="title-zzxk">#:single.ZSMC? single.ZSMC:''#</div>
                                <div class="backgroundImg-zzxk">
                                    <div class="imgcss-zzxk">

                                        #var fjxx = single.FJXX#

                                        #if (fjxx!=null){#
                                        #if (typeof fjxx =='object' && typeof fjxx.length == "number"){#
                                        #if (fjxx[0].FJHZ=="PNG"||fjxx[0].FJHZ=="JPG"){#
                                        <img  style="width: 100%" src="#:fjxx[0].FJDZ#">
                                        #}else{#
                                        <img src="<@spring.url '/ezSafe/icons/qyda-default-image.png' />">
                                        #}#

                                        #} #
                                        #} else{#
                                        <img src="<@spring.url '/ezSafe/icons/qyda-default-image.png' />">
                                        #}#
                                    </div>

                                    <div class="text-zzxk">
                                        <div class="content1-zzxk content2-zzxk">
                                            #: single.ZSBH? single.ZSBH:''#
                                        </div>

                                        <div class="content1-zzxk content3-zzxk">
                                            #: single.ZZLX.VALUE? single.ZZLX.VALUE:''#
                                        </div>
                                        <div class="content1-zzxk content3-zzxk">
                                            #: single.YXQQSRQ? single.YXQQSRQ:''#~#: single.YXQJZRQ? single.YXQJZRQ:''#
                                        </div>
                                    </div>
                                    <div class="detail-zzxk" id="#:single.XXBH#">
                                        <label class="detail-zzxk-lable">详情</label>
                                    </div>
                                </div>

                            </div>
                        </dt>

                    </dl>

                </li>
                #} else if (single.TYPE == 2) {#
                <#--荣誉表彰-->
                <li class="date">
                    <h3>#:single.BZRQ#</h3>
                    <div class="qydsj-line"></div>
                    <div class="qydsj-cicle"></div>
                    <dl class="qydsj-content rybz-xqxx">
                        #if(single.BZNR){#
                        <span>#:single.BZNR#</span>
                        #}#
                        #var eventObj = single.FJXX#
                        #if (eventObj != null){#
                        <div class="rybz-image">
                            # for(s in eventObj){#
                            #if (eventObj[s].FJHZ == "PNG" || eventObj[s].FJHZ == "JPG") {#
                            <image src="#:eventObj[s].FJDZ#"></image>
                            #}#
                            # }#
                        </div>
                        #}#
                    </dl>
                </li>
                #} else if (single.TYPE == 3){#
            <#--生产目标-->
                <li class="date">
                    <h3>#: single.FBRQ #</h3>
                    <div class="qydsj-line"></div>
                    <div class="qydsj-cicle"></div>
                    <dl class="qydsj-content" id="scmb-right">
                        <dt>
                            <div class="">
                                <div class="ztscmb">
                                    <span class="scmb-title">总体生产目标</span>
                                    <span class="scmb-detail">详情
                                        <span style="display: none">#:single.XXBH#</span>
                                    </span>
                                    <p class="ztscmb-data">#: single.ZTMB#</p>
                                </div>
                            </div>
                            <div class="ndscmb">
                                <span class="scmb-title">年度生产目标</span>
                                <p class="ndscmb-data">#: single.NDMB#</p>
                            </div>
                            # if (single.FJXX ) {#

                            <div class="dotted"></div>
                            # for (var fileIndex = 0; fileIndex < single.FJXX.length; fileIndex++){ #
                            <div class="fjxx-icon">
                                <a class="scmb-fjxx" href="#: single.FJXX[fileIndex].FJDZ #" download title="点击下载文件">#: single.FJXX[fileIndex].FJMC#</a>
                            </div>
                            # } #
                            # } #
                        </dt>
                    </dl>

                </li>
                #} else if(single.TYPE == 4) {#
            <#--生产承诺-->
                <li class="date">
                    <h3>#: single.FBRQ #</h3>
                    <div class="qydsj-line"></div>
                    <div class="qydsj-cicle"></div>
                    <dl class="qydsj-content" id="scmb-right">
                        <dt>
                            <div class="aqsccn">
                                <div>
                                    <span class="sccn-title">生产承诺</span>
                                    <span class="sccn-detail">
                                        详情
                                        <span style="display: none">#:single.XXBH#</span>
                                    </span>
                                </div>
                                <p class="ndscmb-data">#: single.CNNR#</p>
                            </div>
                            # if (single.FJXX ) {#

                            <div class="dotted"></div>
                            # for (var fileIndex = 0; fileIndex < single.FJXX.length; fileIndex++){ #
                            <div class="fjxx-icon">
                                <a class="sccn-fjxx" href="#: single.FJXX[fileIndex].FJDZ #" download title="点击下载文件">#: single.FJXX[fileIndex].FJMC #</a>
                            </div>
                            # } #
                            # } #
                        </dt>
                    </dl>
                </li>
                # } #
              #}} } #
            </ul>
        </div>
    </div>
</script>

