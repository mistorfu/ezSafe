<link rel="stylesheet" type="text/css"
      href="<@spring.url '/ezSafe/qyda/xcxxgl/xcxxglEdit.css'/>"/>
<script id="sgfjEdit-template" type="text/x-kendo-template">
    #if(data.FJMC||data.FJMC==""){#
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
            <div class=" xfzb-delete" data-bind="events: {click : deleteFjxx}"></div>
        </div>

    </div>
    #}#
</script>


<script id="jhxcryEdit-template" type="text/x-kendo-template">
    #if(data.RYBH||data.RYBH==""){#
    <div class="jhxcry-row">

        <div class="flex6">
            <input type="text" class="xfzb-content fjms-text" data-bind="value: RYBH">
        </div>
        <div class="flex5">
            <input type="text" class="xfzb-content fjms-text" data-bind="value: RYXM">
        </div>
        <div class="flex8">
            <div class=" jhxcry-delete" data-bind="events: {click : deleteJhxcry}"></div>
        </div>
    </div>
    #}#
</script>


<script id="sjxcryEdit-template" type="text/x-kendo-template">
    #if(data.RYBH||data.RYBH==""){#
    <div class="sjxcry-row">

        <div class="flex6">
            <input type="text" class="xfzb-content fjms-text" data-bind="value: RYBH">
        </div>
        <div class="flex5">
            <input type="text" class="xfzb-content fjms-text" data-bind="value: RYXM">
        </div>
        <div class="flex8">
            <div class=" sjxcry-delete" data-bind="events: {click : deleteSjxcry}"></div>
        </div>
    </div>
    #}#
</script>

<script id="jhxcnrEdit-template" type="text/x-kendo-template">
    #if(data.XJDW||data.XJDW==""){#
    <div class="jhxcnr-row">

        <div class="flex6">
            <input type="text" class="xfzb-content fjms-text" data-bind="value: XJDW">
        </div>
        <div class="flex5">
            <input type="text" class="xfzb-content fjms-text" data-bind="value: XJSM">
        </div>
        <div class="flex8">
            <div class=" jhxcnr-delete" data-bind="events: {click : deleteJhxcnr}"></div>
        </div>
    </div>
    #}#
</script>

<script id="sjxcnrEdit-template" type="text/x-kendo-template">
    #if(data.XJDW||data.XJDW==""){#
    <div class="sjxcnr-row">

        <div class="flex6">
            <input type="text" class="xfzb-content fjms-text" data-bind="value: XJDW">
        </div>
        <div class="flex5">
            <input type="text" class="xfzb-content fjms-text" data-bind="value: XJSM">
        </div>
        <div class="flex8">
            <div class=" sjxcnr-delete" data-bind="events: {click : deleteSjxcnr}"></div>
        </div>
    </div>
    #}#
</script>




<div class="xcxxglEdit-title">
    <div class="window-title-background1"></div>
    <div class="window-title-background2"></div>
    <div class="new-window-title" id="edit-window-title"></div>
    <div class="window-close-button" id="new-window-close-button"></div>
</div>

<div id="edit-container">
    <div class="edit-container selected" id="detail-xcxxgl">
        <label class="required-red">任务名称</label>
        <input type="text" data-bind="value:dataKendo.RWMC" class="must long-input" />
        <label class="required-red">任务编号</label>
        <input type="text" data-bind="value:dataKendo.RWBH" class="must long-input" />
        <label class="required-red">企业名称</label>
        <input type="text" data-bind="value:dataKendo.QYXX.QYMC" class="must long-input" />
        <label class="required-red">巡查分类</label>
        <div type="text" class="dropdownzdx nsearch-XCFL" id="nsearch-XCFL" data-bind="value:dataKendo.XCFL"></div>
        <label class="required-red">巡查类别</label>
        <div type="text" class="dropdownzdx nsearch-XCLB" id="nsearch-XCLB" data-bind="value:dataKendo.XCLB"></div>
        <label class="required-red">巡查状态</label>
        <div type="text" class="dropdownzdx nsearch-XCZT" id="nsearch-XCZT" data-bind="value:dataKendo.XCZT"></div>
        <label class="required-red">巡查结果</label>
        <div type="text" class="dropdownzdx nsearch-XCJG" id="nsearch-XCJG" data-bind="value:dataKendo.XCJG"></div>

        <label>计划巡查内容</label>
        <div class="xfzb-add" data-bind="events: {click : addJxxcnr}"></div>
        <div class="fjxx-style">
            <div class="xfzb-title">
                <div class="flex6">巡检点位</div>
                <div class="flex5">巡检说明</div>
                <div class="flex8">删除</div>
            </div>
            <div id="addjhxcnr" class="sgfj-list-wrap" data-template="jhxcnrEdit-template"
                 data-bind="source: dataKendo.JHXCNR">
            </div>
        </div>

        <label class="required">计划巡查说明</label>
        <input type="text" data-bind="value:dataKendo.JHXCSM" class="long-input" />

        <label class="required">计划开始时间</label>
        <input type="text" class="dxal-text-input" id="jhks-dateStart" data-bind="value:dataKendo.JHKSSJ"/>

        <label>计划结束时间</label>
        <input type="text" class="dxal-text-input" id="jhjs-dateEnd" data-bind="value:dataKendo.JHJSSJ"/>

        <label class="required">实际开始时间</label>
        <input type="text" class="dxal-text-input" id="sjks-dateStart" data-bind="value:dataKendo.SJKSSJ"/>

        <label>实际结束时间</label>
        <input type="text" class="dxal-text-input" id="sjjs-dateEnd" data-bind="value:dataKendo.SJJSSJ"/>



        <label>计划巡查人员</label>
        <div class="xfzb-add" data-bind="events: {click : addJhxcry}"></div>
        <div class="fjxx-style">
            <div class="xfzb-title">
                <div class="flex6">人员编号</div>
                <div class="flex5">人员姓名</div>
                <div class="flex8">删除</div>
            </div>
            <div id="addjhxcry" class="sgfj-list-wrap" data-template="jhxcryEdit-template"
                 data-bind="source: dataKendo.JHXCRY">
            </div>
        </div>

        <label>实际巡查人员</label>
        <div class="xfzb-add" data-bind="events: {click : addSjxcry}"></div>
        <div class="fjxx-style">
            <div class="xfzb-title">
                <div class="flex6">人员编号</div>
                <div class="flex5">人员姓名</div>
                <div class="flex8">删除</div>
            </div>
            <div id="addsjxcry" class="sgfj-list-wrap" data-template="sjxcryEdit-template"
                 data-bind="source: dataKendo.SJXCRY">
            </div>
        </div>

        <label>实际巡查内容</label>
        <div class="xfzb-add" data-bind="events: {click : addSjxcnr}"></div>
        <div class="fjxx-style">
            <div class="xfzb-title">
                <div class="flex6">巡检点位</div>
                <div class="flex5">巡检说明</div>
                <div class="flex8">删除</div>
            </div>
            <div id="addsjxcnr" class="sgfj-list-wrap" data-template="sjxcryEdit-template"
                 data-bind="source: dataKendo.SJXCNR">
            </div>
        </div>

        <label class="required">实际巡查说明</label>
        <input type="text" data-bind="value:dataKendo.SJXCSM" class="long-input" />

        <label>附件信息</label>
        <div class="xfzb-add" data-bind="events: {click : addFJXX}"></div>
        <div class="fjxx-style">
            <div class="xfzb-title">
                <div class="flex6">附件名称</div>
                <div class="flex5">附件类型</div>
                <div class="flex6">附件描述</div>
                <div class="flex8">删除</div>
            </div>
            <div class="sgfj-list-wrap" data-template="sgfjEdit-template"
                 data-bind="source: dataKendo.FJXX">
            </div>
        </div>


        <label class="required-red">所属街镇</label>
        <input type="text" class="must" data-bind="value:dataKendo.SSJZ.JZMC"/>

        <label class="required-red">所属辖区</label>
        <input type="text" class="must SsxqPointer" id="xcxx-xzqhSelectIpt" data-bind="value:dataKendo.SSXQ.XZQHMC,events:{click:openXzqh}">

        <label>备注信息</label>
        <textarea data-bind="value:dataKendo.BZXX" class="long-input"></textarea>

    </div>
</div>

<#--行政区划选择-->
<div class="xzqh-window">

</div>


<div class="window-button-row">
    <div class="window-one-button" id="saveButton"></div>
    <div class="window-one-button" id="cancelButton"></div>
</div>
