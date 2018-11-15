<!DOCTYPE html>
<html>
<head>
    <title>安全事故</title>
    <#import "spring.ftl" as spring />
    <#include "/ezSafe/common/template/avatar.ftl" />
    <link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/aqsggl/page.css'/>"/>
</head>
<body>
    <div id="main">
        <div id="left-container">
            <div class="left-title">
                区域网格
            </div>
            <div class="left-content">
                <div id="left-treeview"></div>
            </div>
        </div>
        <div id="middle-container">
            <div class="details-title">安全事故</div>
            <div class="onlySelf">
                <div class="custom-checkbox" id="onlySelf"></div>
                <div class="onlySelf-text">仅显示本级</div>
            </div>
            <div id="search-container">
                <div class="input-wrapper">
                    <label for="search-qymc">企业名称</label>
                    <input type="text" id="search-qymc" name="qymc" />
                </div>
                <div class="input-wrapper">
                    <label>事故级别</label>
                    <div id="search-sgjb" class="search-input"></div>
                </div>
                <div class="input-wrapper">
                    <label for="search-kssj">开始时间</label>
                    <input type="text" id="search-kssj"/>
                    <div class="kssj-button time-button"></div>
                </div>
                <div class="input-wrapper">
                    <label for="search-jssj">结束时间</label>
                    <input type="text" id="search-jssj"/>
                    <div class="jssj-button time-button"></div>
                </div>
                <input type="hidden" id="search-xznbbm" name="xznbbm" value=""/>
                <input type="hidden" id="search-sswg" name="sswg" value=""/>
                <div class="buttons-wrapper">
                    <div class="custom-button" id="button-search"></div>
                    <div class="custom-button" id="button-reset"></div>
                    <div class="custom-button" id="button-export"></div>
                    <div class="custom-button readOnly" id="button-batch-delete"></div>
                </div>
            </div>
            <div id="aqsg-list"></div>
        </div>
        <div id="right-container">
            <div class="details-title">安全事故详情</div>
            <div class="custom-button readOnly" id="button-add"></div>
            <div class="custom-button readOnly" id="button-update"></div>
            <#include "/ezSafe/qyda/aqsggl/aqsgglDetail.ftl" />
        </div>
    </div>
    <div id="edit-window" class="hidden">
            <#include "/ezSafe/qyda/aqsggl/aqsgglEdit.ftl" />
    </div>

    <div class="export-wait" id="export-wait">
        正在导出，请稍候...
        <div class="progress-background">
            <div class="progress"></div>
        </div>
        <div class="percent-number">0%</div>
        <div class="export-wait-cancel"></div>
    </div>
    <a id="export-download" class="hidden" download=""></a>

    <div id="link-window" class="hidden"></div>
    <div id="link-window-close"></div>

    <script data-main="<@spring.url '/ezSafe/qyda/aqsggl/page.js'/>"
            src="<@spring.url '/ezSafe/lib_js/require.js'/>"></script>
</body>
</html>
