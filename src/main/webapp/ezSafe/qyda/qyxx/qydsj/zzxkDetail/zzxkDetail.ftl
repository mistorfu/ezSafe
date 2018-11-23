<link rel="stylesheet" type="text/css"
      href="<@spring.url '/ezSafe/qyda/qyxx/qydsj/zzxkDetail/zzxkDetail.css'/>"/>
<#--<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qyxx/aqyh/xcrw.css'/>"/>-->

<div class="zzxk-miniFireEdit-title">
    <div class="zzxk-window-title-background1"></div>
    <div class="zzxk-window-title-background2"></div>
    <div class="zzxk-new-window-title">
        资质许可详情
    </div>
    <div class="zzxk-window-close-button" id="close-button-zzxk"></div>
</div>



<div class="zzxk-miniFireEdit-wrap">
    <div class="zzxk-detail-content detail-zzxk-content">
        <div class="zzxk-miniFire-row-wrap">
            <div class="zzxk-flex1">证书名称</div>
            <div class="zzxk-miniFire-input zzxk-flex3">
                <div class="zzxk-miniFire-div" data-bind="text:dataKendo.ZSMC"></div>
            </div>
            <div class="zzxk-flex1">证书编号</div>
            <div class="zzxk-miniFire-input zzxk-flex3">
                <div class="zzxk-miniFire-div" data-bind="text:dataKendo.ZSBH"></div>
            </div>
            <div class="zzxk-flex4"></div>

        </div>
        <div class="zzxk-miniFire-row-wrap">
            <div class="zzxk-flex1">资质类型</div>
            <div class="zzxk-miniFire-input zzxk-flex3">
                <div class="zzxk-miniFire-div" data-bind="text:dataKendo.ZZLX.VALUE"></div>
            </div>
            <div class="zzxk-flex1">资质级别</div>
            <div class="zzxk-miniFire-input zzxk-flex3">
                <div class="zzxk-miniFire-div" data-bind="text:dataKendo.ZZJB.VALUE"></div>
            </div>
            <div class="zzxk-flex1">发证机关</div>
            <div class="zzxk-miniFire-input zzxk-flex3">
                <div class="zzxk-miniFire-div" data-bind="text:dataKendo.FZJG"></div>
            </div>
        </div>

        <div class="zzxk-miniFire-row-wrap">
            <div class="zzxk-flex1">发证日期</div>
            <div class="zzxk-miniFire-input zzxk-flex3">
                <div class="zzxk-miniFire-div" data-bind="text:dataKendo.FZRQ"></div>
            </div>
            <div class="zzxk-flex1">变更日期</div>
            <div class="zzxk-miniFire-input zzxk-flex3">
                <div class="zzxk-miniFire-div" data-bind="text:dataKendo.BGRQ"></div>
            </div>
            <div class="zzxk-flex1">有效日期</div>
            <div class="zzxk-miniFire-input zzxk-flex3">
                <div class="zzxk-miniFire-div" data-bind="text:dataKendo.YXRQ"></div>
            </div>

        </div>
        <div id="zzxk-zznr-div"></div>
        <#--<div class="zzxk-miniFire-row-wrap">-->
            <#--<div class="zzxk-flex1">资质内容</div>-->
            <#--<div class="zzxk-miniFire-input zzxk-flex11">-->
                <#--<div class="zzxk-miniFire-div" data-bind="text:dataKendo.ZZNR"></div>-->
            <#--</div>-->
        <#--</div>-->

        <div id="zzxk-ywfw-div"></div>
        <#--<div class="zzxk-miniFire-row-wrap">-->
            <#--<div class="zzxk-flex1">业务范围</div>-->
            <#--<div class="zzxk-miniFire-input zzxk-flex11">-->
                <#--<div class="zzxk-miniFire-div" data-bind="text:dataKendo.YWFW"></div>-->
            <#--</div>-->
        <#--</div>-->

        <div id="zzxk-bzxx-div"></div>
        <#--<div class="zzxk-miniFire-row-wrap">-->
            <#--<div class="zzxk-flex1">备注信息</div>-->
            <#--<div class="zzxk-miniFire-input zzxk-flex11">-->
                <#--<div class="zzxk-miniFire-div" data-bind="text:dataKendo.BZXX"></div>-->
            <#--</div>-->
        <#--</div>-->
        <div id="zzxk-fjxx-div">

        </div>
    </div>
</div>

<script id="zzxkBzxxTemplate" type="text/x-kendo-template">
    #var bzxx = data==null? '': data.BZXX#
    #var len = 64#
    #if(bzxx==''||bzxx==null){#
            <div class="zzxk-miniFire-row-wrap">
                <div class="zzxk-flex1">备注信息</div>
                <div class="zzxk-miniFire-input zzxk-flex11">
                    <div class="zzxk-miniFire-div">
                    </div>
                </div>
            </div>
    #}#

    #if(bzxx!=''&&bzxx!=null){#
    #if(bzxx.length<=len){#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1">备注信息</div>
        <div class="zzxk-miniFire-input zzxk-flex11">
            <div class="zzxk-miniFire-div">
                #:bzxx#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < bzxx.length/len;m++){#
    #if(m==0){#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1">备注信息</div>
        <div class="zzxk-miniFire-input zzxk-flex11">
            <div class="zzxk-miniFire-div">
                #:bzxx.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1"></div>
        <div class="zzxk-miniFire-input zzxk-flex11">
            <div class="zzxk-miniFire-div">
                #:m==bzxx.length/len?bzxx.substring(m*len):bzxx.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#

</script>


<script id="zzxkYwfwTemplate" type="text/x-kendo-template">
    #var ywfw = data==null? '' : data.YWFW#
    #var len = 64#

    #if(ywfw==''||ywfw==null){#
        <div class="zzxk-miniFire-row-wrap">
            <div class="zzxk-flex1">业务范围</div>
            <div class="zzxk-miniFire-input zzxk-flex11">
                <div class="zzxk-miniFire-div">
                </div>
            </div>
        </div>
    #}#

    #if(ywfw!=''&&ywfw!=null){#
    #if(ywfw.length<=len){#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1">业务范围</div>
        <div class="zzxk-miniFire-input zzxk-flex11">
            <div class="zzxk-miniFire-div">
                #:ywfw#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < ywfw.length/len;m++){#
    #if(m==0){#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1">业务范围</div>
        <div class="zzxk-miniFire-input zzxk-flex11">
            <div class="zzxk-miniFire-div">
                #:ywfw.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1"></div>
        <div class="zzxk-miniFire-input zzxk-flex11">
            <div class="zzxk-miniFire-div">
                #:m==ywfw.length/len?ywfw.substring(m*len):ywfw.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#

</script>


<script id="zzxkZznrTemplate" type="text/x-kendo-template">
#var zznr = data==null? '' : data.ZZNR#
#var len = 64#

#if(zznr==''||zznr==null){#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1">资质内容</div>
        <div class="zzxk-miniFire-input zzxk-flex11">
            <div class="zzxk-miniFire-div">
            </div>
        </div>
    </div>
#}#

#if(zznr!=''&&zznr!=null){#
    #if(zznr.length<=len){#
        <div class="zzxk-miniFire-row-wrap">
            <div class="zzxk-flex1">资质内容</div>
            <div class="zzxk-miniFire-input zzxk-flex11">
                <div class="zzxk-miniFire-div">
                    #:zznr#
                </div>
            </div>
        </div>
    #}else{#
            #for(var m=0;m < zznr.length/len;m++){#
                #if(m==0){#
                    <div class="zzxk-miniFire-row-wrap">
                        <div class="zzxk-flex1">资质内容</div>
                        <div class="zzxk-miniFire-input zzxk-flex11">
                            <div class="zzxk-miniFire-div">
                                #:zznr.substring(0,len)#
                            </div>
                        </div>
                    </div>
                #}else{#
                    <div class="zzxk-miniFire-row-wrap">
                        <div class="zzxk-flex1"></div>
                        <div class="zzxk-miniFire-input zzxk-flex11">
                            <div class="zzxk-miniFire-div">
                                #:m==zznr.length/len?zznr.substring(m*len):zznr.substring(m*len,(m+1)*len)#
                            </div>
                        </div>
                    </div>
                    #}#
            #}#
        #}#
#}#

</script>


<script id="zzxkFjxxTemplate" type="text/x-kendo-template">

    #var fjxxs = data==null? '': data.FJXX#

    #if(fjxxs==null){#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1">附件信息</div>
        <div class="zzxk-miniFire-input zzxk-flex11">
            <div class="zzxk-miniFire-div">
            </div>
        </div>
    </div>
    #}else{#
    #if(fjxxs.length==0){#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1">附件信息</div>
        <div class="zzxk-miniFire-input zzxk-flex11">
            <div class="zzxk-miniFire-div">
            </div>
        </div>
    </div>
    #}#

    #if(fjxxs.length>0){#

    #if(fjxxs.length==1){#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1">附件信息</div>
        <div class="zzxk-miniFire-input zzxk-flex5">
            <div class="zzxk-miniFire-div zzxk-download-css" data-url="#:fjxxs[0].FJDZ#" data-filename="#:fjxxs[0].FJMC#">

                <a download="" class="zzxk-fj-download-icon" ></a>
                #if(fjxxs[0].FJHZ=='PNG'||fjxxs[0].FJHZ=='JPG'){#
                    <a class="zzxk-qyda-file-icon"></a>
                #}#
                <span class="zzxk-tpfjxx zzxk-tpcss"> #:fjxxs[0].FJMC#</span>

            </div>
        </div>
        <div class="zzxk-flex6"></div>
    </div>
    #}#
    #if(fjxxs.length%2==0){#
    #for(var k = 0;k < fjxxs.length-1;k=k+2){#
    <div class="zzxk-miniFire-row-wrap">
        #if(k == 0){#
        <div class="zzxk-flex1">附件信息</div>
        <div class="zzxk-miniFire-input zzxk-flex5">
            <div class="zzxk-miniFire-div zzxk-download-css" data-url="#:fjxxs[k].FJDZ#" data-filename="#:fjxxs[k].FJMC#">

                <a download="" class="zzxk-fj-download-icon" ></a>
                #if(fjxxs[k].FJHZ=='PNG'||fjxxs[k].FJHZ=='JPG'){#
                    <a class="zzxk-qyda-file-icon"></a>
                #}#
                <span class="zzxk-tpfjxx zzxk-tpcss"> #:fjxxs[k].FJMC#</span>
            </div>
        </div>
        #}else{#
        <div class="zzxk-flex1"></div>
        <div class="zzxk-miniFire-input zzxk-flex5">
            <div class="zzxk-miniFire-div zzxk-download-css" data-url="#:fjxxs[k].FJDZ#" data-filename="#:fjxxs[k].FJMC#">
                <a download="" class="zzxk-fj-download-icon" ></a>
                #if(fjxxs[k].FJHZ=='PNG'||fjxxs[k].FJHZ=='JPG'){#
                    <a class="zzxk-qyda-file-icon"></a>
                #}#
                <span class="zzxk-tpfjxx zzxk-tpcss"> #:fjxxs[k].FJMC#</span>
            </div>
        </div>
        #}#
        <div class="zzxk-flex1"></div>
        <div class="zzxk-miniFire-input zzxk-flex5">
            <div class="zzxk-miniFire-div zzxk-download-css" data-url="#:fjxxs[k+1].FJDZ#" data-filename="#:fjxxs[k+1].FJMC#">
                <a download="" class="zzxk-fj-download-icon"></a>
                #if(fjxxs[k+1].FJHZ=='PNG'||fjxxs[k+1].FJHZ=='JPG'){#
                    <a class="zzxk-qyda-file-icon"></a>
                #}#
                <span class="zzxk-tpfjxx zzxk-tpcss"> #:fjxxs[k+1].FJMC#</span>
            </div>
        </div>
    </div>
    #}#
    #}#

    #if(fjxxs.length%2==1&&fjxxs.length!=1){#
        #for(var k = 0;k < fjxxs.length-2;k=k+2){#
            <div class="zzxk-miniFire-row-wrap">
                #if(k == 0){#
                <div class="zzxk-flex1">附件信息</div>
                <div class="zzxk-miniFire-input zzxk-flex5">
                    <div class="zzxk-miniFire-div zzxk-download-css"  data-url="#:fjxxs[k].FJDZ#" data-filename="#:fjxxs[k].FJMC#">
                        <a download="" class="zzxk-fj-download-icon"></a>
                        #if(fjxxs[k].FJHZ=='PNG'||fjxxs[k].FJHZ=='JPG'){#
                            <a class="zzxk-qyda-file-icon"></a>
                        #}#
                        <span class="zzxk-tpfjxx zzxk-tpcss"> #:fjxxs[k].FJMC#</span>
                    </div>
                </div>
                #}else{#
                <div class="zzxk-flex1"></div>
                <div class="zzxk-miniFire-input zzxk-flex5">
                    <div class="zzxk-miniFire-div zzxk-download-css" data-url="#:fjxxs[k].FJDZ#" data-filename="#:fjxxs[k].FJMC#">
                        <a download="" class="zzxk-fj-download-icon" ></a>
                        #if(fjxxs[k].FJHZ=='PNG'||fjxxs[k].FJHZ=='JPG'){#
                            <a class="zzxk-qyda-file-icon"></a>
                        #}#
                        <span class="zzxk-tpfjxx zzxk-tpcss"> #:fjxxs[k].FJMC# </span>
                    </div>
                </div>
                #}#
                <div class="zzxk-flex1"></div>
                <div class="zzxk-miniFire-input zzxk-flex5">
                    <div class="zzxk-miniFire-div zzxk-download-css" data-url="#:fjxxs[k+1].FJDZ#" data-filename ="#:fjxxs[k+1].FJMC#">
                        <a download="" class="zzxk-fj-download-icon" ></a>
                        #if(fjxxs[k+1].FJHZ=='PNG'||fjxxs[k+1].FJHZ=='JPG'){#
                            <a class="zzxk-qyda-file-icon"></a>
                        #}#
                        <span class="zzxk-tpfjxx zzxk-tpcss"> #:fjxxs[k+1].FJMC# </span>
                    </div>
                </div>
            </div>
        #}#
    <div class="zzxk-miniFire-row-wrap">
        <div class="zzxk-flex1"></div>
        <div class="zzxk-miniFire-input zzxk-flex5">
            <div class="zzxk-miniFire-div zzxk-download-css" data-url="#:fjxxs[fjxxs.length-1].FJDZ#" data-filename="#:fjxxs[fjxxs.length-1].FJMC#">

                <a download="" class="zzxk-fj-download-icon" ></a>
                #if(fjxxs[fjxxs.length-1].FJHZ=='PNG'||fjxxs[fjxxs.length-1].FJHZ=='JPG'){#
                <a class="zzxk-qyda-file-icon"></a>
                #}#
                <span class="zzxk-tpfjxx zzxk-tpcss"> #:fjxxs[fjxxs.length-1].FJMC#</span>

            </div>
        </div>
        <div class="zzxk-flex6"></div>
    </div>
    #}#
    #}#

    #}#


</script>