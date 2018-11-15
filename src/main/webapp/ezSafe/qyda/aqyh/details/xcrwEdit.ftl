
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/aqyh/xcrw.css'/>"/>

<script id="xcrwFjxxTemplate" type="text/x-kendo-template">
    <div class="aqyh-fjxx-item flfgFjxx-container relative" >
        <a download class="qyda-img-icon"></a>
        <span  style="margin-left: 6%;">#:FJMC #</span>
        <a download id="xcrwDownload-a-label" class="fj-download-icon"></a>
    </div>
</script>

<script id="xcrwYhxxTemplate" type="text/x-kendo-template">
    <div class="yhnr-item flfgFjxx-container relative" >
        <span >#:YHNR #</span>
        <a download id="xcrwDownload-a-label" class="qyda-detail-icon"></a>
    </div>
</script>

<script id="jhxcnrTemplate" type="text/x-kendo-template">
    #var zznr =data#
    #var len = 20#

    #if(zznr==''){#
        <div class="miniFire-row-wrap">
            <div class="flex1">计划巡查内容</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div">
                </div>
            </div>
        </div>
    #}else{#
        #if(zznr.length<=len){#
        <div class="miniFire-row-wrap">
            <div class="flex1">计划巡查内容</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div">
                    #:zznr#
                </div>
            </div>
        </div>
        #}else {#
            #for(var m=0;m < zznr.length/len;m++){#
                #if(m==0){#
                <div class="miniFire-row-wrap">
                    <div class="flex1">计划巡查内容</div>
                    <div class="miniFire-input flex3">
                        <div class="miniFire-div">
                            #:zznr.substring(0,len)#
                        </div>
                    </div>
                </div>
                #}else{#
                <div class="miniFire-row-wrap">
                    <div class="flex1"></div>
                    <div class="miniFire-input flex3">
                        <div class="miniFire-div">
                            #:m==zznr.length/len?zznr.substring(m*len):zznr.substring(m*len,(m+1)*len)#
                        </div>
                    </div>
                </div>
                #}#
            #}#
        #}#
    #}#
</script>

<script id="sjxcnrTemplate" type="text/x-kendo-template">
    #var zznr =data#
    #var len = 20#

    #if(zznr==''){#
    <div class="miniFire-row-wrap">
        <div class="flex1">实际巡查内容</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
            </div>
        </div>
    </div>
    #}#

    #if(zznr!=''){#
    #if(zznr.length<=len){#
    <div class="miniFire-row-wrap">
        <div class="flex1">实际巡查内容</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
                #:zznr#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < zznr.length/len;m++){#
    #if(m==0){#
    <div class="miniFire-row-wrap">
        <div class="flex1">实际巡查内容</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
                #:zznr.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="miniFire-row-wrap">
        <div class="flex1"></div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
                #:m==zznr.length/len?zznr.substring(m*len):zznr.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#

</script>

<script id="sjxcsmTemplate" type="text/x-kendo-template">
    #var zznr = data?data:''#
    #var len = 15#

    #if(zznr==''){#
    <div class="miniFire-row-wrap">
        <div class="flex1">实际巡查说明</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
            </div>
        </div>
    </div>
    #}#

    #if(zznr!=''){#
    #if(zznr.length<=len){#
    <div class="miniFire-row-wrap">
        <div class="flex1">实际巡查说明</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
                #:zznr#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < zznr.length/len;m++){#
    #if(m==0){#
    <div class="miniFire-row-wrap">
        <div class="flex1">实际巡查说明</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
                #:zznr.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="miniFire-row-wrap">
        <div class="flex1"></div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
                #:m==zznr.length/len?zznr.substring(m*len):zznr.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#

</script>
<script id="jhxcsmTemplate" type="text/x-kendo-template">
    #var zznr = data.JHCXSM?data.JHXCSM:''#
    #var len = 15#

    #if(zznr==''){#
    <div class="miniFire-row-wrap">
        <div class="flex1">计划巡查说明</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
            </div>
        </div>
    </div>
    #}else{#
    #if(zznr.length<=len){#
    <div class="miniFire-row-wrap">
        <div class="flex1">计划巡查说明</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
                #:zznr#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < zznr.length/len;m++){#
    #if(m==0){#
    <div class="miniFire-row-wrap">
        <div class="flex1">计划巡查说明</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
                #:zznr.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="miniFire-row-wrap">
        <div class="flex1"></div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div">
                #:m==zznr.length/len?zznr.substring(m*len):zznr.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#

</script>


<div class="miniFireEdit-title">
    <div class="window-title-background1"></div>
    <div class="window-title-background2"></div>
    <div class="new-window-title" id="xcrw-detail-title"></div>
    <div class="window-close-button" id="xcrw-new-window-close-button"></div>
</div>
<div class="miniFireEdit-wrap" id="xcrw">
    <div class="detail-content">

    <div class="miniFire-row-wrap">
        <div class="flex1">任务名称</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div" data-bind="text:dataKendo.RWMC"></div>
        </div>
        <div class="flex1">任务编号</div>
        <div class="miniFire-input flex7">
            <div class="miniFire-div" data-bind="text:dataKendo.RWBH"></div>
        </div>


    </div>
    <div class="miniFire-row-wrap">
        <div class="flex1">巡查分类</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div" data-bind="text:xcfl"></div>
        </div>
        <div class="flex1">巡查类别</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div" data-bind="text:dataKendo.XCLB.VALUE"></div>
        </div>
        <div class="flex1">巡查状态</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-div" data-bind="text:dataKendo.XCZT.VALUE"></div>
        </div>
    </div>
    <div class="miniFire-row-wrap" style="
    height: auto
">
        <div class="miniFire-table">
            <div class="miniFire-tr"">
                <div class="miniFire-td flex5 th">
                    <div class="miniFire-yellow-th">计划巡查情况</div>
                </div>
                <div class="miniFire-td flex5 th">
                    <div class="miniFire-yellow-th">实际巡查情况</div>
                </div>
            </div>
            <div class="miniFire-tr" style="
    flex: 1;
">
                <div class="miniFire-td flex1">
                    <div data-template="jhxcnrTemplate" data-bind="source:jhcxnr" style="width: 100%">
                </div>
                    <div data-template="jhxcsmTemplate" data-bind="source:dataKendo" style="width: 100%">
                    </div>

                    <div class="miniFire-row-wrap">
                        <div class="flex1">计划巡查时间</div>
                        <div class="miniFire-input flex3">
                            <div class="miniFire-div" data-bind="text:dataKendo.JHKSSJ"></div>
                        </div>
                    </div>
                    <div class="miniFire-row-wrap">
                        <div class="flex1">计划巡查人员</div>
                        <div class="miniFire-input flex3">
                            <div class="miniFire-div" data-bind="text:dataKendo.JHXCRY.RYXM"></div>
                        </div>
                    </div>
                </div>
                <div class="miniFire-td flex1">
                    <div data-template="sjxcnrTemplate" data-bind="source:sjxcnr" style="width: 100%">
                    </div>
                    <div data-template="sjxcsmTemplate" data-bind="source:dataKendo.SJXCSM" style="width: 100%">
                    </div>
                    <div class="miniFire-row-wrap">
                        <div class="flex1">实际巡查时间</div>
                        <div class="miniFire-input flex3">
                            <div class="miniFire-div" data-bind="text:dataKendo.SJKSSJ"></div>
                        </div>
                    </div>
                    <div class="miniFire-row-wrap">
                        <div class="flex1">实际巡查人员</div>
                        <div class="miniFire-input flex3">
                            <div class="miniFire-div" data-bind="text:dataKendo.SJXCRY.RYXM"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="miniFire-row-wrap" style=" height: auto;align-items: flex-start;">
        <div class="flex1">隐患信息</div>
        <div class="miniFire-fjxx" id="xcrwYhxx"></div>
    </div>
    <div class="miniFire-row-wrap">
        <div class="flex1">备注信息</div>
        <div class="miniFire-input flex11">
            <div class="miniFire-div" data-bind="text:dataKendo.BZXX"></div>
        </div>
    </div>
        <div class="miniFire-row-wrap">
            <div class="flex1">附件信息</div>
            <div class="miniFire-fjxx" id="xcrwFjxx"></div>
        </div>
    </div>
</div>


