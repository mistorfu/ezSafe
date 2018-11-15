<link rel="stylesheet" type="text/css"
      href="<@spring.url '/ezSafe/qyda/aqyh/xcrw.css'/>"/>
<link rel="stylesheet" type="text/css"
      href="<@spring.url '/ezSafe/qyda/qyxx/flfg/flfgDetail.css'/>"/>
<script id="flfgFjxxTemplate" type="text/x-kendo-template">
    <div class="flfgFjxx-container">
        <div class="flfgFjxx-fjmc">#:FJMC #</div>
        <a download id="flfgDownload-a-label" class="flfg-download-icon"></a>
    </div>
</script>

<div class="miniFireEdit-title">
    <div class="window-title-background1"></div>
    <div class="window-title-background2"></div>
    <div class="new-window-title" id="flfg-detail-title"></div>
    <div class="window-close-button" id="new-flfgWindow-close-button"></div>
</div>

<div class="flfgMiniFireEdit-wrap">
    <div class="detail-content">
        <div class="miniFire-row-wrap">
            <div class="flex1">文件名称</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div" data-bind="text:dataKendo.WJMC"></div>
            </div>
            <div class="flex1">文件编号</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div" data-bind="text:dataKendo.WJBH"></div>
            </div>
            <div class="flex1">发布单位</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div" data-bind="text:dataKendo.FBDW"></div>
            </div>
        </div>

        <div class="miniFire-row-wrap">
            <div class="flex1">文件类型</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div" data-bind="text:dataKendo.WJLX.VALUE"></div>
            </div>
            <div class="flex1">文件内容</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div" data-bind="text:dataKendo.WJNR"></div>
            </div>
            <div class="flex1">发布日期</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div" data-bind="text:dataKendo.FBRQ"></div>
            </div>
        </div>

        <div class="miniFire-row-wrap">
            <div class="flex1">起草人员</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div" data-bind="text:dataKendo.QCRY"></div>
            </div>
            <div class="flex1">批准人员</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div" data-bind="text:dataKendo.PZRY"></div>
            </div>
            <div class="flex1">有效日期</div>
            <div class="miniFire-input flex3">
                <div class="miniFire-div" data-bind="text:dataKendo.YXRQ"></div>
            </div>
        </div>
        <div class="miniFire-row-wrap">
            <div class="flex1">备注信息</div>
            <div class="miniFire-input flex11">
                <div class="miniFire-div" data-bind="text:dataKendo.BZXX"></div>
            </div>
        </div>
        <div class="miniFire-row-wrap">
            <div class="flex1">附件信息</div>
            <div class="flfg-fjxx" id="flfgFjxx"></div>
        </div>
    </div>
</div>



