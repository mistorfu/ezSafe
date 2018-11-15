<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/yjzb/yjsc/xxbj/xxbj.css'/>"/>

<#--图片文件-->
<script type="text/kendo-ui-template" id="pic-template">
    <div class="list-pic-item" tabindex="0">
        <div class="pic-content">
            #if (WJLX == "2") {#
            <img src="#:SLTP#"/>
            # } else if(WJLX == "1") {#
            <img src="<@spring.url '/ezSafe/icons/yjya-sp-n.png'/>"/>
            # } else {#
            <img src="<@spring.url '/ezSafe/icons/dxal-filed-n.png'/>"/>
            #}#
            <div class="pic-remove" data-bind="events:{click: event.removeFile}"></div>
        </div>
        <div class="pic-desc"><input type="text" data-bind="value:WJMS"/></div>
    </div>
</script>

<div class="xxbj-container">
    <div class="text-container">
        <div class="xxbj-title-row">
            <div class="xxbj-title flex1 must-input">标题</div>
            <div class="xxbj-input flex12"><input type="text" data-bind="value:data.BT"/></div>
        </div>
        <div class="xxbj-content-row">
            <div class="xxbj-title flex1">正文</div>
            <div class="xxbj-input flex12"><textarea data-bind="value:data.NR"></textarea></div>
        </div>
        <div class="xxbj-attachment-row">
            <div class="xxbj-attachment-title flex1">
                <div>附件</div>
                <div class="upload-button" data-bind="events:{click: event.uploadFile}"></div>
            </div>
            <div class="list-pic" data-bind="source:data.FJ"
                 data-role="listview" data-template="pic-template"></div>
        </div>
        <div class="xxbj-desc-row">
            <div class="xxbj-title flex1">备注</div>
            <div class="xxbj-input flex12"><textarea data-bind="value:data.BZ"></textarea></div>
        </div>
    </div>
    <div class="button-container">
        <div class="save-button"></div>
        <div class="cancel-button"></div>
    </div>
</div>

