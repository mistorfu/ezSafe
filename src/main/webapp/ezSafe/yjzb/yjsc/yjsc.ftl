<!DOCTYPE html>
<html>
<head>
    <title>应急手册</title>
<#import "spring.ftl" as spring />
<#include "/ezSafe/common/template/avatar.ftl" />
    <link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/yjzb/yjsc/yjsc.css'/>"/>
    <link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/lib_js/fireTree/fireTree.css'/>"/>
</head>

<body>

<div class="yjsc-container">
    <div class="left-column">
        <div class="left-up-title">
            应急手册
            <div class="add-button"></div>
        </div>
        <div class="left-content">
        <#include "/ezSafe/yjzb/yjsc/yjdx/yjdx.ftl" />
        </div>
    </div>

    <div class="right-column">
        <div class="right-up-title">
            知识库
        </div>
        <div class="right-content">
            <div class="right-tree">
            <#include "/ezSafe/yjzb/yjsc/zsfaTree/zsfaTree.ftl" />
            </div>
            <div class="right-detail">
            <#include "/ezSafe/yjzb/yjsc/sczs/sczs.ftl" />
            </div>
        </div>
    </div>
</div>

<#--文件展示模板-->
<script type="text/kendo-ui-template" id="file-template">
    <div class="file-content">
        #if(WJLX == "1") {#
        <img u-url="#:WLLJ#" src="<@spring.url '/ezSafe/icons/yjya-sp-n.png'/>"/>
        #} else {#
        <img u-url="#:WLLJ#" src="<@spring.url '/ezSafe/icons/dxal-filed-n.png'/>"/>
        #}#
        <a href="#:WLLJ#?isopen=true" download title="#:WJMC#">#:WJMC#</a>
    </div>
</script>

<#--图片大图详情-->
<div class="bigImg-window">
    <div class="miniFireEdit-title">
        <div class="window-title-background1"></div>
        <div class="window-title-background2"></div>
        <div class="new-window-title">图片展示</div>
        <div class="window-close-button bigImg-close"></div>
    </div>
    <div class="bigImg-window-container">
        <div class="image-up"></div>
        <div class="bigImg-container"></div>
        <div class="image-down"></div>
    </div>
    <div class="bigImg-window-button">
        <div class="rotate-left"></div>
        <div class="rotate-right"></div>
        <div class="bigImg-colose-btn bigImg-close"></div>
    </div>
</div>

<#--信息编辑-->
<div class="info-editor-window">
    <div class="miniFireEdit-title">
        <div class="window-title-background1"></div>
        <div class="window-title-background2"></div>
        <div class="new-window-title">信息编辑</div>
        <div class="window-close-button info-editor-close"></div>
    </div>
    <div class="info-editor-container">
    <#include "/ezSafe/yjzb/yjsc/xxbj/xxbj.ftl" />
    </div>
</div>

<script data-main="<@spring.url '/ezSafe/yjzb/yjsc/app.js'/>"
        src="<@spring.url '/ezSafe/lib_js/require.js'/>"></script>
</body>
</html>