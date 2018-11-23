<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/whpqygl/detailTab/detailTab.css'/>"/>
<div id="tab-container">
    <div class="tab-button selected" id="tab-whpcl">危化品储量</div>
    <div class="tab-button" id="tab-zdwxy">重大危险源</div>
    <div class="tab-button" id="tab-scgy">生产工艺</div>
    <div class="tab-button" id="tab-aqss">安全设施</div>
    <div class="tab-button" id="tab-rcgl">日常管理</div>
</div>
<div id="detail-container">
    <div class="content-container selected" id="detail-whpcl">
        <#include "/ezSafe/qyda/whpqygl/whpcl/whpcl.ftl" />
    </div>
    <div class="content-container" id="detail-zdwxy">
        <#include "/ezSafe/qyda/whpqygl/zdwxy/zdwxy.ftl" />
    </div>
    <div class="content-container" id="detail-scgy">
        <#include "/ezSafe/qyda/whpqygl/scgy/scgy.ftl" />
    </div>
    <div class="content-container" id="detail-aqss">
        <#include "/ezSafe/qyda/whpqygl/aqss/aqss.ftl" />
    </div>
    <div class="content-container" id="detail-rcgl">
        <#include "/ezSafe/qyda/whpqygl/rcgl/rcgl.ftl" />
    </div>
</div>