<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/aqsggl/aqsgglDetail.css'/>"/>
<div id="detail-container">
    <div class="content-container selected" id="detail-jbxx">
        <label>事故名称</label>
        <input type="text" data-bind="value:dataKendo.SGMC" class="long-input" disabled="disabled" />

        <label>公司名称</label>
        <input type="text" data-bind="value:dataKendo.QYXX.QYMC" class="long-input" disabled="disabled" />

        <label>开始时间</label>
        <input type="text" data-bind="value:dataKendo.KSSJ" disabled="disabled" />

        <label>结束时间</label>
        <input type="text" data-bind="value:dataKendo.JSSJ" disabled="disabled" />

        <label>事故类别</label>
        <input type="text" data-bind="value:dataKendo.SGLB.VALUE" disabled="disabled" />

        <label>事故级别</label>
        <input type="text" data-bind="value:dataKendo.SGJB.VALUE" disabled="disabled" />

        <label>事故原因</label>
        <textarea data-bind="value:dataKendo.SGYY" class="long-input" disabled="disabled"></textarea>

        <label>事故经过</label>
        <textarea data-bind="value:dataKendo.SGJG" class="long-input" disabled="disabled"></textarea>

        <label>事故描述</label>
        <textarea data-bind="value:dataKendo.SGMS" class="long-input" disabled="disabled"></textarea>

        <label>轻伤人数</label>
        <input type="text" data-bind="value:dataKendo.QSRS" disabled="disabled" />

        <label>重伤人数</label>
        <input type="text" data-bind="value:dataKendo.ZSRS" disabled="disabled" />

        <label>死亡人数</label>
        <input type="text" data-bind="value:dataKendo.SWRS" disabled="disabled" />

        <label>经济损失</label>
        <input type="text" data-bind="value:dataKendo.JJSS.JE" disabled="disabled" />

        <label>事故附件</label>
        <div id="sgfj-list" class="long-input fjxx-list"></div>

        <label>调查人员</label>
        <input type="text" data-bind="value:dataKendo.DCRY" disabled="disabled" />

        <label></label>
        <input type="text" class="placeholder" disabled="disabled" />

        <label>事故责任</label>
        <textarea data-bind="value:dataKendo.SGZR" class="long-input" disabled="disabled"></textarea>

        <label>处理建议</label>
        <textarea data-bind="value:dataKendo.CLJY" class="long-input" disabled="disabled"></textarea>

        <label>整改附件</label>
        <div id="zgfj-list" class="long-input fjxx-list"></div>

        <label>整改时间</label>
        <input type="text" data-bind="value:dataKendo.ZGSJ" disabled="disabled" />

        <label></label>
        <input type="text" class="placeholder" disabled="disabled" />

        <label>所属街镇</label>
        <input type="text" data-bind="value:dataKendo.SSJZ.JZMC" disabled="disabled" />

        <label>所属辖区</label>
        <input type="text" data-bind="value:dataKendo.SSXQ.XZQHMC" disabled="disabled" />

        <label>备注信息</label>
        <textarea data-bind="value:dataKendo.BZXX" class="long-input" disabled="disabled"></textarea>
    </div>
</div>

