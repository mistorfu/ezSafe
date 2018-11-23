
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qyxx/aqsg/aqsgEdit.css'/>"/>
<script id="aqsgyyTemplate" type="text/x-kendo-template">
    #var sgyy = data#
    #var len = 100#

    #if(sgyy==''){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故原因</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
            </div>
        </div>
    </div>
    #}#

    #if(sgyy!=''){#
    #if(sgyy.length<=len){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故原因</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:sgyy#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < sgyy.length/len;m++){#
    #if(m==0){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故原因</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:sgyy.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1"></div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:m==sgyy.length/len?sgyy.substring(m*len):sgyy.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#

</script>

<script id="aqsgjgTemplate" type="text/x-kendo-template">
    #var sgjg = data#
    #var len = 100#

    #if(sgjg==''){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故经过</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
            </div>
        </div>
    </div>
    #}#

    #if(sgjg!=''){#
    #if(sgjg.length<=len){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故经过</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:sgjg#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < sgjg.length/len;m++){#
    #if(m==0){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故经过</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:sgjg.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1"></div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:m==sgjg.length/len?sgjg.substring(m*len):sgjg.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#

</script>

<script id="aqsgmsTemplate" type="text/x-kendo-template">
    #var sgms = data#
    #var len = 100#

    #if(sgms==''){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故描述</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
            </div>
        </div>
    </div>
    #}#

    #if(sgms!=''){#
    #if(sgms.length<=len){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故描述</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:sgms#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < sgms.length/len;m++){#
    #if(m==0){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故描述</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:sgms.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1"></div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:m==sgms.length/len?sgms.substring(m*len):sgms.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#

</script>

<script id="aqsgzgcsTemplate" type="text/x-kendo-template">
    #var zgcs = data#
    #var len = 100#

    #if(zgcs==''){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故描述</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
            </div>
        </div>
    </div>
    #}#

    #if(zgcs!=''){#
    #if(zgcs.length<=len){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故描述</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:zgcs#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < zgcs.length/len;m++){#
    #if(m==0){#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故描述</div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:zgcs.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="sgminiFire-row-wrap">
        <div class="sgflex1"></div>
        <div class="sgminiFire-input sgflex11">
            <div class="sgminiFire-div">
                #:m==zgcs.length/len?zgcs.substring(m*len):zgcs.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#

</script>

<div class="sgminiFireEdit-title">
    <div class="sgwindow-title-background1"></div>
    <div class="sgwindow-title-background2"></div>
    <div class="sgnew-window-title" id="sgzzjg-detail-title">安全事故详情</div>
    <div class="sgwindow-close-button" id="sgnew-window-close-button" style="cursor:pointer"></div>
</div>


<div class="sgminiFireEdit-wrap">
    <div class="sgdetail-content" >
        <div class="sgminiFire-row-wrap">
        <div class="sgflex12"><span class="sgnew-window-title sgemcbk">故事详情</span></div>
    </div>
        <div class="sgminiFire-row-wrap">
        <div class="sgflex1">事故名称</div>
        <div class="sgminiFire-input sgflex3">
            <div class="sgminiFire-div" data-bind="text:dataKendo[0].SGMC"></div>
        </div>
        <div class="sgflex1">事故编号</div>
        <div class="sgminiFire-input sgflex3">
            <div class="sgminiFire-div" data-bind="text:dataKendo[0].SGBH"></div>
        </div>
            <div class="sgflex1">事故时间</div>
            <div class="sgminiFire-input sgflex3">
                <div class="sgminiFire-div" data-bind="text:dataKendo[0].KSSJ"></div>
            </div>

    </div>

        <div class="sgminiFire-row-wrap" style="width: 50%">
            <div class="sgflex1">事故类别</div>
            <div class="sgminiFire-input sgflex5">
            <div  class="sgminiFire-div" data-bind="text:dataKendo[0].SGLB.VALUE"></div>
            </div>
        </div>

        <div class="sgminiFire-row-wrap sgjjss" >
            <div class="sgflex1" style="margin-top: -6%">损失情况</div>
            <div class="sgminiFire-input sgflex5" >
                <div class="sgminiFire-table">
                    <div class="sgminiFire-tr" style="flex: 1;">
                        <div class="sgminiFire-td sgflex2 sgth">
                            <div class="sgminiFire-yellow-th">死亡<span class="swdwys" data-bind="text:dataKendo[0].SWRS">0</span></div>
                        </div>
                        <div class="sgminiFire-td sgflex2 sgth">
                            <div class="sgminiFire-yellow-th">重伤<span class="dwys" data-bind="text:dataKendo[0].ZSRS">0</span></div>
                        </div>
                        <div class="sgminiFire-td sgflex2 sgth">
                            <div class="sgminiFire-yellow-th">轻伤<span class="dwys" data-bind="text:dataKendo[0].QSRS">0</span></div>
                        </div>
                    </div>
                    <div class="sgminiFire-tr" style="flex: 1;">
                        <div class="sgminiFire-td sgflex2 sgth" colspan="3">
                            <div class="sgminiFire-yellow-th ">经济损失<span class="dwys" data-bind="text:dataKendo[0].JJSS.JE">0</span>万元</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="sgminiFire-row-wrap" style="width: 50%">
            <div class="sgflex1">事故级别</div>
            <div class="sgminiFire-input sgflex5">
            <div class="sgminiFire-div" data-bind="text:dataKendo[0].SGJB.VALUE"></div>
            </div>
        </div>

        <div data-template="aqsgyyTemplate" data-bind="source:dataKendo[0].SGYY"></div>

        <div data-template="aqsgjgTemplate" data-bind="source:dataKendo[0].SGJG"></div>

        <div data-template="aqsgmsTemplate" data-bind="source:dataKendo[0].SGMS"></div>


        <div class="sgminiFire-row-wrap">
            <div class="sgflex1">附件信息</div>
            <div class="sgminiFire-fjxx" id="sgFJxx"></div>
        </div>


        <div class="sgminiFire-row-wrap">
            <div class="sgflex12"></div>

        </div>

        <div class="sgminiFire-row-wrap">
        <div class="sgflex12"><span class="sgnew-window-title sgemcbk">处理详情</span></div>

        </div>
        <div class="sgminiFire-row-wrap">
        <div class="sgflex1">调查人员</div>
        <div class="sgminiFire-input sgflex3">
            <div class="sgminiFire-div" data-bind="text:dataKendo[0].DCRY"></div>
        </div>
        <div class="sgflex1">事故责任</div>
        <div class="sgminiFire-input sgflex7">
            <div class="sgminiFire-div" data-bind="text:dataKendo[0].SGZR"></div>
        </div>
    </div>
        <div class="sgminiFire-row-wrap">
        <div class="sgflex1">整改时间</div>
        <div class="sgminiFire-input sgflex3">
            <div class="sgminiFire-div" data-bind="text:dataKendo[0].ZGSJ"></div>
        </div>
        <div class="sgflex1">处理建议</div>
        <div class="sgminiFire-input sgflex7">
            <div class="sgminiFire-div" data-bind="text:dataKendo[0].CLJY"></div>
        </div>
    </div>

        <div data-template="aqsgzgcsTemplate" data-bind="source:dataKendo[0].ZGCS"></div>

        <div class="sgminiFire-row-wrap" >
            <div class="sgflex1">整改附件</div>
            <div class="sgminiFire-fjxx" id="sgZGFjxx"></div>
        </div>

    </div>
</div>

<script id="zgjavascriptTemplate" type="text/x-kendo-template">

    <div class="sgflfgFjxx-container sgrelative">
        <a download="" class="sgqyda-img-icon"></a>
        <span  style="margin-left: 6%;">#:FJMC #</span>
        <a download="#:FJMC#" id="xcrwDownload-a-label" class="sgfj-download-icon"></a>
    </div>




</script>
<script id="fjjavascriptTemplate" type="text/x-kendo-template">
    <div class="sgflfgFjxx-container sgrelative">
        <a download="" class="sgqyda-img-icon"></a>
        <span  style="margin-left: 6%;">#:FJMC #</span>
        <a download="#:FJMC#" id="xcrwDownload-a-label" class="sgfj-download-icon"></a>
    </div>

</script>

