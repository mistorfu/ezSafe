<script id="scmbTemplate" type="text/x-kendo-template">
    <div class="scmb-head">
        <div class="scmbWindow-title-background1"></div>
        <div class="scmbWindow-title-background2"></div>
        <div class="scmb-detail-title">生产目标-#:data.SSND#</div>
        <div class="scmb-detail-close" id="scmbDetailClose"></div>
    </div>
    <div class="scmb-detail-xq">
        <ul class="scmb-detail-form">
            <li class="scmb-s-container">
                <div class="scmb-sub-title">所属年度</div>
                <div class="limit-content">#:data.SSND#</div>
            </li>
            <li class="scmb-s-container">
                <div class="scmb-sub-title">发布日期</div>
                <div class="limit-content">#:data.FBRQ#</div>
            </li>
            <li class="scmb-l-container">
                <div class="scmb-sub-title">总体目标</div>
                <div class="no-limit-content border-bottom" id="ztmb-detail">
                    <#--<span class="content-border-bottom">#:data.ZTMB#</span>-->
                </div>
            </li>
            <li class="scmb-l-container">
                <div class="scmb-sub-title">年度目标</div>
                <div class="no-limit-content border-bottom" id="ndmb-detail">
                    <#--<span class="content-border-bottom">#:data.NDMB#<span>-->
                </div>
            </li>
            <li class="scmb-l-container">
                <div class="scmb-sub-title">附件信息</div>
                <div class="no-limit-content">
                    # if (data.FJXX ) {#
                    # for (var fileIndex = 0; fileIndex < data.FJXX.length; fileIndex++){ #
                        # if (0 == fileIndex%2) {#
                    <div class="scmb-sub-file border-bottom left" data-url="#:data.FJXX[fileIndex].FJDZ#" data-filename="#:data.FJXX[fileIndex].FJMC#">
                        #} else {#
                    <div class="scmb-sub-file border-bottom right" data-url="#:data.FJXX[fileIndex].FJDZ#" data-filename="#:data.FJXX[fileIndex].FJMC#">
                        #}#
                        <img class="png-mid" src="<@spring.url '/ezSafe/icons/qyda-tab-qyxx-n.png'/>">
                        <span>#: data.FJXX[fileIndex].FJMC #</span>
                        <a class="scmb-download-icon" data-url="#:data.FJXX[fileIndex].FJDZ#" data-filename="#:data.FJXX[fileIndex].FJMC#">
                            <#--<img class="png-mid" src="<@spring.url '/ezSafe/icons/qyda-tab-qyxx-n.png'/>">-->
                        </a>
                    </div>
                    #}#
                    #}#
                </div>
            </li>
        </ul>
    </div>
</script>