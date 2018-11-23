<!DOCTYPE html>
<html>
<head>
    <title>企业档案</title>
    <#import "spring.ftl" as spring />
    <#include "/ezSafe/common/template/avatar.ftl" />
    <link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qyxx/page.css'/>"/>
</head>
<body>

<div class="main-title" id="main-title">
    <div class="title-sub selected" id="subtitle-qyxx">
        企业信息
    </div>
    <div class="title-sub" id="subtitle-aqsg">
        安全事故
    </div>
    <div class="title-sub" id="subtitle-aqyh">
        安全隐患
    </div>
    <div class="title-sub" id="subtitle-yjya">
        应急预案
    </div>
</div>

<div class="main-container selected" id="main-qyxx">
    <div class="left-container">
        <#include "/ezSafe/qyda/qyxx/qygk/qygk.ftl" />
    </div>
    <div class="right-container">
        <div class="right-container-switch">
            <div class="switch-button selected" id="switch-qyxq">企业详情</div>
            <div class="switch-button" id="switch-flfg">法律法规</div>
            <div class="switch-button" id="switch-zzjg">组织机构</div>
            <div class="switch-button" id="switch-qydsj">企业大事记</div>
        </div>
        <div class="content-container selected" id="content-qyxq">
            <#include "/ezSafe/qyda/qyxx/qyxq/qyxq.ftl" />
        </div>
        <div class="content-container" id="content-flfg">
            <#include "/ezSafe/qyda/qyxx/flfg/flfg.ftl" />
        </div>
        <div class="content-container" id="content-zzjg">
            <#include "/ezSafe/qyda/qyxx/zzjg/zzjg.ftl" />
        </div>
        <div class="content-container" id="content-qydsj">
            <#include "/ezSafe/qyda/qyxx/qydsj/qydsj.ftl" />
        </div>

    </div>
</div>

<div class="main-container" id="main-aqsg">
    <#include "/ezSafe/qyda/qyxx/aqsg/aqsg.ftl" />
</div>

<div class="main-container" id="main-aqyh">
    <#include "/ezSafe/qyda/qyxx/aqyh/aqyh.ftl" />
</div>

<div class="main-container" id="main-yjya">
    <#include "/ezSafe/qyda/qyxx/yjya/yjya.ftl" />
</div>

<script data-main="<@spring.url '/ezSafe/qyda/qyxx/page.js'/>"
        src="<@spring.url '/ezSafe/lib_js/require.js'/>"></script>
</body>
</html>

