<link rel="stylesheet" type="text/css"
      href="<@spring.url '/ezSafe/qyda/aqsggl/aqsgglEdit.css'/>"/>
<script id="sgfjEdit-template" type="text/x-kendo-template">
    <div class="sgfj-row">
        <div class="flex6">
            <div title='#:FJMC#' class="xfzb-content xfzb-content-name" data-bind="text: FJMC"></div>
        </div>
        <div class="flex5">
            <div class="xfzb-content" data-bind="text: FJLX"></div>
        </div>
        <div class="flex6">
            <input type="text" title='#:FJMS#' class="xfzb-content fjms-text" data-bind="value: FJMS">
        </div>
        <div class="flex8">
            <div class=" xfzb-delete" data-bind="events: {click : deleteSgfj}"></div>
        </div>
    </div>
</script>

<script id="zgfjEdit-template" type="text/x-kendo-template">
    <div class="zgfj-row">
        <div class="flex6">
            <div title='#:FJMC#' class="xfzb-content xfzb-content-name" data-bind="text: FJMC"></div>
        </div>
        <div class="flex5">
            <div class="xfzb-content" data-bind="text: FJLX"></div>
        </div>
        <div class="flex6">
            <input type="text" title='#:FJMS#' class="xfzb-content fjms-text" data-bind="value: FJMS">
        </div>
        <div class="flex8">
            <div class=" xfzb-delete" data-bind="events: {click : deleteZgfj}"></div>
        </div>
    </div>
</script>
<div class="aqsgglEdit-title">
    <div class="window-title-background1"></div>
    <div class="window-title-background2"></div>
    <div class="new-window-title" id="xgxz-miniFire"></div>
    <div class="window-close-button" id="new-window-close-button"></div>
</div>
<div id="edit-container">
    <div class="edit-container selected" id="detail-aqsg">
        <label class="required-red">事故名称</label>
        <input type="text" data-bind="value:dataKendo.SGMC" class="long-input must" />

        <label class="required-red">事故编号</label>
        <input type="text" data-bind="value:dataKendo.SGBH" class="long-input must" />

        <label class="required-red">公司编号</label>
        <input type="text" data-bind="value:dataKendo.QYXX.QYBH" class="long-input must" />

        <label class="required-red">公司名称</label>
        <input type="text" data-bind="value:dataKendo.QYXX.QYMC" class="long-input must" />

        <label class="required-red">开始时间</label>
        <input type="text" class="dxal-text-input" id="new-dateStart" data-bind="value:dataKendo.KSSJ"/>

        <label>结束时间</label>
        <input type="text" class="dxal-text-input" id="new-dateEnd" data-bind="value:dataKendo.JSSJ"/>

        <label class="required-red">事故类别</label>
        <div type="text" class="dropdownzdx" id="sglbDropDown"></div>

        <label class="required-red">事故级别</label>
        <div type="text" class="dropdownzdx" id="sgjbDropDown"></div>

        <label>事故原因</label>
        <textarea data-bind="value:dataKendo.SGYY" class="long-input"></textarea>

        <label>事故经过</label>
        <textarea data-bind="value:dataKendo.SGJG" class="long-input"></textarea>

        <label>事故描述</label>
        <textarea data-bind="value:dataKendo.SGMS" class="long-input"></textarea>

        <label>轻伤人数</label>
        <input type="text" data-bind="value:dataKendo.QSRS" />

        <label>重伤人数</label>
        <input type="text" data-bind="value:dataKendo.ZSRS" />

        <label>死亡人数</label>
        <input type="text" data-bind="value:dataKendo.SWRS"/>

        <label>经济损失</label>
        <input type="text" data-bind="value:dataKendo.JJSS.JE"/>

        <label>事故附件</label>
        <div class="xfzb-add" data-bind="events: {click : addSGFJ}"></div>
        <div class="fjxx-style">
            <div class="xfzb-title">
                <div class="flex6">附件名称</div>
                <div class="flex5">附件类型</div>
                <div class="flex6">附件描述</div>
                <div class="flex8">删除</div>
            </div>
            <div class="sgfj-list-wrap" data-template="sgfjEdit-template"
                 data-bind="source: dataKendo.SGFJ">
            </div>
        </div>


        <label>调查人员</label>
        <input type="text" data-bind="value:dataKendo.DCRY"/>
        <label></label><input type="text" class="placeholder"/>

        <label>事故责任</label>
        <textarea data-bind="value:dataKendo.SGZR" class="long-input"></textarea>

        <label>处理建议</label>
        <textarea data-bind="value:dataKendo.CLJY" class="long-input"></textarea>

        <label>整改措施</label>
        <textarea data-bind="value:dataKendo.ZGCS" class="long-input"></textarea>

        <label>整改附件</label>
        <div class="xfzb-add" data-bind="events: {click : addZGFJ}"></div>
        <div class="fjxx-style">
            <div class="xfzb-title">
                <div class="flex6">附件名称</div>
                <div class="flex5">附件类型</div>
                <div class="flex6">附件描述</div>
                <div class="flex8">删除</div>
            </div>
            <div class="zgfj-list-wrap" data-template="zgfjEdit-template"
                 data-bind="source: dataKendo.ZGFJ">
            </div>
        </div>

        <label>整改时间</label>
        <input type="text" class="dxal-text-input" id="new-zgsj" data-bind="value:dataKendo.ZGSJ"/>
        <label></label><input type="text" class="placeholder"/>

        <label class="required-red">所属街镇</label>
        <input type="text" data-bind="value:dataKendo.SSJZ.JZMC"/>

        <label class="required-red">所属辖区</label>
        <input type="text" class="must SsxqPointer" id="aqsg-xzqhSelectIpt" data-bind="value:dataKendo.SSXQ.XZQHMC,events:{click:openXzqh}">

        <label>备注信息</label>
        <textarea data-bind="value:dataKendo.BZXX" class="long-input"></textarea>

    </div>
</div>
<div class="window-button-row">
    <div class="window-one-button" id="saveButton"></div>
    <div class="window-one-button" id="cancelButton"></div>
</div>

<#--行政区划选择-->
<div class="xzqh-window"></div>
</div>


