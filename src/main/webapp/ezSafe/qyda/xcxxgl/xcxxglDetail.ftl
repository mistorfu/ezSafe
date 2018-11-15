<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/xcxxgl/xcxxglDetail.css'/>"/>
<script id="miniFire-list-temp" type="text/x-kendo-template">
    <div class="whp-row">
        <div class="whp-query flex_half readOnly">
            <div class="xfry-checkbox-notick single-check"></div>
        </div>
        <div class="whp-query whp1">
            <span title='#:QYXX.QYMC#'>#:QYXX.QYMC ? QYXX.QYMC: "" #</span>
        </div>
        <div class="whp-query whp2">
            <span title='#:XCLB.VALUE#'>#:XCLB.VALUE ? XCLB.VALUE: "" #</span>
        </div>
        <div class="whp-query whp3">
            <span title='#:XCZT.VALUE#'>#:XCZT.VALUE ? XCZT.VALUE: "" #</span>
        </div>
        <div class="whp-query readOnly whp4 whp1">
            <div class="deleteButton">
                <div class="ryxx-delete-button"></div>
                <span class="red">删除</span>
            </div>
        </div>
    </div>
</script>

<div id="detail-container">
    <div class="content-container selected" id="detail-jbxx">
        <label>任务名称</label>
        <input type="text" data-bind="value:dataKendo.RWMC" class="long-input" disabled="disabled" />
        <label>企业名称</label>
        <input type="text" data-bind="value:dataKendo.QYXX.QYMC" class="long-input" disabled="disabled" />

        <label>巡查分类</label>
        <input type="text" data-bind="value:dataKendo.XCFL.VALUE" disabled="disabled" />

        <label>巡查类别</label>
        <input type="text" data-bind="value:dataKendo.XCLB.VALUE" disabled="disabled" />

        <label>巡查状态</label>
        <input type="text" data-bind="value:dataKendo.XCZT.VALUE" disabled="disabled" />

        <label>巡查结果</label>
        <input type="text" data-bind="value:dataKendo.XCJG.VALUE" disabled="disabled" />
        <label>计划巡查内容</label>
        <div id="jhxcnr-list" class="long-input"></div>

        <label>计划巡查说明</label>
        <textarea data-bind="value:dataKendo.JHXCSM" class="long-input" disabled="disabled"></textarea>

        <label>计划开始时间</label>
        <input type="text" data-bind="value:dataKendo.JHKSSJ" disabled="disabled" />

        <label>计划结束时间</label>
        <input type="text" data-bind="value:dataKendo.JHJSSJ" disabled="disabled" />

        <label>计划巡查人员</label>
        <input type="text" data-bind="value:JHXCRY" disabled="disabled" class="xcry"/>

        <label>实际巡查人员</label>
        <input type="text" data-bind="value:SJXCRY" disabled="disabled" class="xcry"/>

        <label>实际开始时间</label>
        <input type="text" data-bind="value:dataKendo.SJKSSJ" disabled="disabled" />

        <label>实际结束时间</label>
        <input type="text" data-bind="value:dataKendo.SJJSSJ" disabled="disabled" />

        <label>实际巡查内容</label>
        <div id="sjxcnr-list" class="long-input"></div>

        <label>实际巡查说明</label>
        <textarea data-bind="value:dataKendo.SJXCSM" class="long-input" disabled="disabled"></textarea>

        <label>所属街镇</label>
        <input type="text" data-bind="value:dataKendo.SSJZ.JZMC" disabled="disabled" />

        <label>所属辖区</label>
        <input type="text" data-bind="value:dataKendo.SSXQ.XZQHMC" disabled="disabled" />

        <label>附件信息</label>
        <div id="fjxx-list" class="long-input"></div>

        <label>隐患信息</label>
        <div id="yhxx-list" class="long-input"></div>

        <label>备注信息</label>
        <textarea data-bind="value:dataKendo.BZXX" class="long-input" disabled="disabled"></textarea>
    </div>
</div>