<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qyxx/zzjg/zzjg.css'/>"/>

    <div class="zzjg-table">
        <div class="zzjgTable-first-line">
            <div class="zzjg-xh">序号</div>
            <div class="jgmc">机构名称</div>
            <div class="zyfzr">主要负责人</div>
            <div class="lxfs">联系方式</div>
            <div class="rs">人数</div>
            <div class="jglb">机构类别</div>
            <div class="cz">操作</div>
        </div>
        <div class="zzjg-table-content" id="zzjg-table-content"></div>
        <div class="zzjg-pager" id="ZzjgPager"></div>
    </div>
    <div class="zzjg-detail-window">
        <#include "/ezSafe/qyda/qyxx/zzjg/zzjgDetail.ftl" />
    </div>



<script type="text/x-kendo-template" id="zzjgTemplate">
    <div class="zzjgTable-single-line">
        <div class="zzjg-xh"><span class="zzjgXh-span">#:index#</span></div>
        <div class="jgmc"><span title="#:JGMC#">#:JGMC#</span></div>
        <div class="zyfzr"><span>#:FZRY.RYXM#</span></div>
        <div class="lxfs"><span>#:FZRY.YDDH#</span></div>
        <div class="rs"><span>#:JGRS#</span></div>
        <div class="jglb"><span>#:JGLB.VALUE#</span></div>
        <div class="cz">
            <div class="zzjg-detailButton">
                <div class="zzjg-detail-button"></div>
                <span class="zzjg-detail">详情</span>
            </div>
        </div>
    </div>
</script>