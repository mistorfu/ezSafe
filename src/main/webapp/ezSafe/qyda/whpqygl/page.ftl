<!DOCTYPE html>
<html>
<head>
    <title>危化品企业管理</title>
<#import "spring.ftl" as spring />
<#include "/ezSafe/common/template/avatar.ftl" />
    <link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/whpqygl/page.css'/>"/>
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
        <div class="details-title">危化品企业信息</div>
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
                <label>行业类别</label>
                <div id="search-sshyly" class="search-input"></div>
            </div>
            <input type="hidden" id="search-xznbbm" name="xznbbm" value=""/>
            <input type="hidden" id="search-sswg" name="sswg" value="" />
            <div class="buttons-wrapper">
                <div class="custom-button" id="button-search"></div>
                <div class="custom-button" id="button-reset"></div>
                <div class="custom-button" id="button-export"></div>
            </div>
        </div>
        <div id="qyxx-list"></div>
    </div>
    <div id="right-container">
        <div class="details-title">危化品企业详情</div>
        <#include "/ezSafe/qyda/whpqygl/detailTab/detailTab.ftl" />
    </div>
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

<script data-main="<@spring.url '/ezSafe/qyda/whpqygl/page.js'/>"
        src="<@spring.url '/ezSafe/lib_js/require.js'/>"></script>
</body>
</html>