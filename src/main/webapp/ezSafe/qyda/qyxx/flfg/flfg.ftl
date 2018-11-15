<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qyxx/flfg/flfg.css'/>"/>
<div class="flfg-table">
    <div class="flfgTable-first-line">
        <div class="flfg-xh">序号</div>
        <div class="wjmc">文件名称</div>
        <div class="wjlx">文件类型</div>
        <div class="fbrq">发布日期</div>
        <div class="fbdw">发布单位</div>
        <div class="flfg-cz">操作</div>
    </div>
    <div class="flfg-table-content" id="flfg-table-content"></div>
    <div class="flfg-pager" id="FlfgPager"></div>
</div>

<div class="flfg-detail-window">
<#include "/ezSafe/qyda/qyxx/flfg/flfgDetail.ftl" />
</div>


<script type="text/x-kendo-template" id="flfgTemplate">
    <div class="flfgTable-single-line">
        <div class="flfg-xh"><span class="flfgXh-span">#:index#</span></div>
        <div class="wjmc"><span title="#:WJMC#">#:WJMC#</span></div>
        <div class="wjlx"><span title="#:WJLX.VALUE#">#:WJLX.VALUE#</span></div>
        <div class="fbrq"><span>#:FBRQ#</span></div>
        <div class="fbdw"><span title="#:FBDW#">#:FBDW#</span></div>
        <div class="flfg-cz">
            <div class="flfg-detailButton">
                <div class="flfg-detail-button"></div>
                <span class="flfg-detail flfg-file">详情</span>
            </div>
        </div>
    </div>
</script>