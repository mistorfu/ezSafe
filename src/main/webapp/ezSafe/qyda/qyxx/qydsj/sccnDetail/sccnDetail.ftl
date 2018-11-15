<link rel="stylesheet" type="text/css"
      href="<@spring.url '/ezSafe/qyda/qyxx/qydsj/sccnDetail/sccnDetail.css'/>"/>

<div class="sccn-window-title">
    <div class="sccnWindow-title-background1"></div>
    <div class="sccnWindow-title-background2"></div>
    <span class="detail-title" id="detail-title"></span>
    <div class="window-close-button" id="window-close-button"></div>
</div>

<div class="sccn-container">
    <div class="sccn-row">
        <div class="sccn-line-wrapper">
            <div class="label">所属年度</div>
            <div class="line-content">
                <div data-bind="text:dataKendo.SSND"></div>
            </div>
        </div>
        <div class="sccn-line-wrapper">
            <div class="label">发布日期</div>
            <div class="line-content">
                <label data-bind="text:dataKendo.FBRQ"></label>
            </div>
        </div>
    </div>
    <div class="sccn-row">
        <div class="sccn-line-wrapper-block">
            <div class="label">承诺内容</div>
            <div class="line-content" id="cnnr-detail">
                <#--<span class="cnnr-detail" data-bind="text:dataKendo.CNNR"></span>-->
            </div>
        </div>
    </div>
    <div class="sccn-row">
        <div class="sccn-line-wrapper-block">
            <div class="label">备注信息</div>
            <div class="bzxx-line-content" id="bzxx-detail">
                <#--<span class="cnnr-detail bzxx-detail" data-bind="text:dataKendo.BZXX"></span>-->
            </div>
        </div>
    </div>
    <div class="sccn-row">
        <div class="sccn-line-wrapper-block">
            <div class="label">附件信息</div>
            <div class="fjxx-right" id="sccn-fjxx">

            </div>
        </div>
    </div>

</div>

<script id="sccn-fjxx-template" type="text/x-kendo-template">
    # for (var i = 0; i < data.length; i++) { #
        # if (0 == i%2) {#
            <div class="sccn-left-download" id="downloadButton">
        #} else {#
            <div class="sccn-right-download" id="downloadButton">
        #}#
                <div class="sccn-fjxx-icon">
                    <a class="sccn-fjxx-fjmc" href="#: data[i].FJDZ #" download title="点击下载文件">#: data[i].FJMC#</a>
                </div>
            </div>
    # } #
</script>

<#--<div class="sccn-left-download" id="downloadButton">
        <div class="sccn-fjxx-icon">
            <a class="sccn-fjxx-fjmc" href="#: data[i].FJDZ #" download title="点击下载文件">附件一.pdf</a>
        </div>
    </div>
    <div class="sccn-right-download" id="downloadButton">
        <div class="sccn-fjxx-icon">
            <a class="sccn-fjxx-fjmc" href="#: data[i].FJDZ #" download title="点击下载文件">附件二.doc</a>
        </div>
    </div>
    <div class="sccn-left-download" id="downloadButton">
        <div class="sccn-fjxx-icon">
            <a class="sccn-fjxx-fjmc" href="#: data[i].FJDZ #" download title="点击下载文件">附件三.jpg</a>
        </div>
    </div>-->