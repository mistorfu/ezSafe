<link rel="stylesheet" type="text/css"
      href="<@spring.url '/ezSafe/qyda/qyxx/zzjg/zzjgDetail.css'/>"/>

<div class="miniZzjgEdit-title">
    <div class="zzjgwindow-title-background1"></div>
    <div class="zzjgwindow-title-background2"></div>
    <div class="new-zzjgwindow-title" id="zzjg-detail-title"></div>
    <div class="window-close-button" id="new-window-close-button"></div>
</div>
<div class="main-wrap">
    <div class="zzjg-new-content">
        <div class="zzjg-text-row">
            <div class="zzjg-text-row-td">
                <div class="zzjg-td-title">机构名称</div>
                <div class="zzjg-td-text" data-bind="text:dataKendo.JGMC"></div>
            </div>
            <div class="zzjg-text-row-td">
                <div class="zzjg-td-title">机构编号</div>
                <div class="zzjg-td-text" data-bind="text:dataKendo.JGBH">4739739374</div>
            </div>
            <div class="zzjg-text-row-td jgrs-short">
                <div class="zzjg-td-title jgrs-title">机构人数</div>
                <div class="zzjg-td-text jgrs-number" data-bind="text:dataKendo.JGRS"></div>
            </div>
        </div>
        <div class="zzjg-text-row none-bottom">
            <div class="zzjg-text-row-td">
                <div class="zzjg-td-title">机构类别</div>
                <div class="zzjg-td-text" data-bind="text:dataKendo.JGLB.VALUE"></div>
            </div>
            <div class="zzjg-text-row-td">
                <div class="zzjg-td-title">成立日期</div>
                <div class="zzjg-td-text" data-bind="text:dataKendo.CLRQ"></div>
            </div>
        </div>
        <div id="zzjgJgzz"></div>
        <div class="zzjg-table-row">
            <div class="zzjg-td-title title-1">人员信息</div>
            <div class="zzjg-td-table">
                <div class="zzjgDetailTable-first-line">
                    <div class="line-title ryxm">人员姓名</div>
                    <div class="line-title rylb">人员类别</div>
                    <div class="line-title ryzw">人员职务</div>
                    <div class="line-title gddh">固定电话</div>
                    <div class="line-title yddh">移动电话</div>
                    <div class="line-title dzyx">电子邮箱</div>
                </div>
                <div class="zzjg-detail-table-content" id="zzjg-detail-table-content"></div>
            </div>
        </div>
        <div class="zzjg-text-row">
            <div class="zzjg-td-title title-1">备注信息</div>
            <div class="zzjg-td-text text-1" data-bind="text:dataKendo.BZXX"></div>
        </div>
      <#--  <div class="zzjg-text-row">
            <div class="zzjg-td-title title-1">附件信息</div>
            <div class="zzjg-td-text fj-1">
                <span class="fjmc">办公室照片.png</span>
                <div class="zzjg-datail-fj-download" id="zzjg-datail-fj-download"></div>
            </div>
        </div>-->
        <div class="zzjgDetail-row-wrap">
            <div class="zzjg-td-title title-1">附件信息</div>
            <div  class="zzjgMiniFire-fjxx" id="zzjgFjxx"></div>
        </div>

    </div>
</div>

<#--人员信息kendoUi-->
<script type="text/x-kendo-template" id="ryxxTemplate">
    <div class="ryxxTable-nomal-line">
            <div class="line-title ryxm"><span>#:RYXM#</span></div>
            <div class="line-title rylb"><span>#:RYLB#</span></div>
            <div class="line-title ryzw"><span>#:RYZW#</span></div>
            <div class="line-title gddh"><span>#:GDDH#</span></div>
            <div class="line-title yddh"><span>#:YDDH#</span></div>
            <div class="line-title dzyx"><span>#:DZYX#</span></div>
    </div>
</script>

<#--附件信息-->
<script id="zzjgFjxxTemplate" type="text/x-kendo-template">
    <div class="zzjgFjxx-container">
        <div class="zzjg-fjxx-img"></div>
        <div class="zzjgFjxx-fjmc">#:FJMC #</div>
        <a download class="zzjg-download-icon"></a>
    </div>
</script>

<#--机构职责换行-->
<script id="zzjgJgzzTemplate" type="text/x-kendo-template">
    #var jgzz =data.JGZZ#
    #var len = 59#

    #if(jgzz==''){#
    <div class="miniFire-jgzz-wrap">
        <div class="miniFire-jgzz-title">机构职责</div>
        <div class="miniFire-jgzz-content">
            <div class="miniFire-jgzz-text">
            </div>
        </div>
    </div>
    #}#

    #if(jgzz!=''){#
    #if(jgzz.length<=len){#
    <div class="miniFire-jgzz-wrap">
        <div class="miniFire-jgzz-title">机构职责</div>
        <div class="miniFire-jgzz-content">
            <div class="miniFire-jgzz-text">
                #:jgzz#
            </div>
        </div>
    </div>
    #}else{#
    #for(var m=0;m < jgzz.length/len;m++){#
    #if(m==0){#
    <div class="miniFire-jgzz-wrap">
        <div class="miniFire-jgzz-title">机构职责</div>
        <div class="miniFire-jgzz-content">
            <div class="miniFire-jgzz-text">
                #:jgzz.substring(0,len)#
            </div>
        </div>
    </div>
    #}else{#
    <div class="miniFire-jgzz-wrap">
        <div class="miniFire-jgzz-title"></div>
        <div class="miniFire-jgzz-content">
            <div class="miniFire-jgzz-text">
                #:m==jgzz.length/len?jgzz.substring(m*len):jgzz.substring(m*len,(m+1)*len)#
            </div>
        </div>
    </div>
    #}#
    #}#
    #}#
    #}#
</script>






