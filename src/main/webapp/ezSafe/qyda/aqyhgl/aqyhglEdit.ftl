<link rel="stylesheet" type="text/css"
      href="<@spring.url '/ezSafe/qyda/aqyhgl/aqyhglEdit.css'/>"/>
<script id="jcfjEdit-template" type="text/x-kendo-template">
    <div class="jcfj-row">
        <div class="flex6">
            <div title='#:FJMC#' class="xfzb-content" data-bind="text: FJMC"></div>
        </div>
        <div class="flex5">
            <div class="xfzb-content" data-bind="text: FJLX"></div>
        </div>
        <div class="flex5">
            <input type="text" title='#:FJMS#' class="xfzb-content" data-bind="value: FJMS">
        </div>
        <div class="flex8">
            <div class=" xfzb-delete" data-bind="events: {click : deleteJcfj}"></div>
        </div>
    </div>
</script>

<script id="zgjlEdit-list-template" type="text/x-kendo-template">
    <div class="zgfj-row">
        <div class="flex6">
            <div class="xfzb-content">#:data.ZGSJ#</div>
        </div>
        <div class="flex5">
            <div class="xfzb-content">#:data.ZGJG.VALUE#</div>
        </div>
        <div class="flex5">
            <div class="xfzb-content list-zgjl-edit">修改</div>
        </div>
        <div class="flex8">
            <div class=" xfzb-delete deleteSingleZGJL" <#--data-bind="events: {click : deleteSingleZGJL}"-->></div>
        </div>
    </div>
</script>

<script id="zgjlEdit-list-xq-template" type="text/x-kendo-template">
    <div class="flex4" style="margin-bottom: 1%">
        <div class="miniFire-input miniFire-form zgjl-edit-form">
            <div  id="xj-detail-FRDB">
                <div class="xj-detail-row">
                    <span class="frdb-field required-red">整改时间</span>
                    <input class="frdb-value1 timer" data-bind="value:singleZGJL.ZGSJ" id="singleZGSJ">
                    <span class="frdb-field required-red">整改结果</span>
                    <input class="frdb-value1 no-right-border" data-bind="value:singleZGJL.ZGJG.VALUE"></input>
                </div>
                <div class="xj-detail-row">
                    <span class="frdb-field required-red">整改措施</span>
                    <input class="frdb-value2 no-right-border" data-bind="value:singleZGJL.ZGCS"></input>
                </div>
                <div class="xj-detail-row">
                <span class="frdb-field">整改资金</span>
                    <input class="frdb-value3" data-bind="value:singleZGJL.ZGZJ.JE">
                    <input class="frdb-value3" data-bind="value:singleZGJL.ZGZJ.DW">
                </div>
                <div class="xj-detail-row">
                    <span class="frdb-field">整改说明</span>
                    <input class="frdb-value2 no-right-border" data-bind="value:singleZGJL.ZGSM"></input>
                </div>
                <div class="xj-detail-row">
                    <span class="frdb-field required-red" >验收人员</span>
                    <input class="frdb-value1" data-bind="value:singleZGJL.YSRY"></input>
                    <span class="frdb-field required-red">验收时间</span>
                    <input class="frdb-value1 no-right-border timer" data-bind="value:singleZGJL.YSSJ" id="singleYSSJ"></input>
                </div>
            </div>
            <div class="xfzb-title">
                <div class="flex6 ">附件名称</div>
                <div class="flex5">附件类型</div>
                <div class="flex5">附件描述</div>
                <div class="flex8 zgfj-add" data-bind="events:{click: addSingleZGFJ}"></div>
            </div>
            <div class="zgjl-xq-list-wrap" data-template="zgjlEdit-fjsc-template"
                 data-bind="source: singleZGJL.ZGFJ">
            </div>
        </div>
    </div>
</script>
<script id="zgjlEdit-fjsc-template" type="text/x-kendo-template">
        <div class="zgfj-single-row">
                    <div class="flex6">
                    <div class="xfzb-content xfzb-file-name" data-bind="text: FJMC"></div>
            </div>
            <div class="flex5">
                    <div class="xfzb-content" data-bind="text: FJLX"></div>
            </div>
            <div class="flex5">
                    <input class="xfzb-content" data-bind="value: FJMS"></input>
            </div>
            <div class="flex8">
                <div class=" xfzb-delete delete-single-ZGFJ" data-bind="events: {click : deleteSingleZGFJ}"></div>
            </div>
            </div>
</script>
<div class="miniFireEdit-title">
    <div class="window-title-background1"></div>
    <div class="window-title-background2"></div>
    <div class="new-window-title" id="edit-window-title"></div>
    <div class="window-close-button" id="edit-window-close"></div>
</div>
<div class="miniFireEdit-wrap">
    <div class="miniFire-row-wrap">
        <div class="flex2 required-red">隐患名称</div>
        <div class="miniFire-input flex4">
            <input type="text"  data-bind="value:dataKendo.YHMC" class="must">
        </div>
    </div>
    <div class="miniFire-row-wrap">
        <div class="flex2 required-red">隐患编号</div>
        <div class="miniFire-input flex4">
            <input type="text"  data-bind="value:dataKendo.YHBH" class="must">
        </div>
    </div>
    <div class="miniFire-row-wrap">
        <div class="flex1 required-red">隐患类型</div>
        <div class="miniFire-input flex3">
            <div type="text" class="dropdownzdx" id="yhlxDropDown"></div>
        </div>

        <div class="flex1 required-red">隐患级别</div>
        <div class="miniFire-input flex3">
            <div type="text" class="dropdownzdx" id="yhjbDropDown"></div>
        </div>
    </div>
    <div class="miniFire-row-wrap">
        <div class="flex1">隐患来源</div>
        <div class="miniFire-input flex3">
            <div type="text" class="dropdownzdx" id="yhlyDropDown"></div>
        </div>
        <div class="flex1 required-red">企业名称</div>
        <div class="miniFire-input flex3">
            <input type="text" data-bind="value:dataKendo.QYXX.QYMC" class="must">
        </div>
    </div>

    <div class="miniFire-row-wrap">
        <div class="flex2 ">隐患位置</div>
        <div class="miniFire-input flex4">
            <input type="text"  data-bind="value:dataKendo.YHWZ">
        </div>
    </div>
    <div class="miniFire-row-wrap">
        <div class="flex2">隐患部位</div>
        <div class="miniFire-input flex4">
            <input type="text"  data-bind="value:dataKendo.YHBW">
        </div>
    </div>
    <div class="miniFire-row-wrap">
        <div class="flex2">隐患内容</div>
        <div class="miniFire-input flex4">
            <input type="text"  data-bind="value:dataKendo.YHNR">
        </div>
    </div>
    <div class="miniFire-row-wrap">
        <div class="flex1 required-red">检查时间</div>
        <div class="miniFire-input flex3">
            <input type="text" class="jcsj-input" id="jcsj-date" data-bind="value:dataKendo.JCSJ"/>
        </div>
        <#--<div class="miniFire-input flex3">
            <div class="miniFire-input flex3">
                <input type="text" class="kssj" id="jcsj" data-bind="value:dataKendo.JCSJ"
                       data-format="yyyy-MM-dd HH:mm:ss" data-role="datepicker" class="must">
            </div>
        </div>-->
        <div class="flex1 required-red">检查人员</div>
        <div class="miniFire-input flex3">
            <input type="text" data-bind="value:dataKendo.JCRY.RYXM" class="must">
        </div>
    </div>
    <div class="miniFire-row-wrap-1 miniFire-row-wrap-11">
        <div class="flex2 flex7">
            <div>检查附件</div>
            <div class="xfzb-add" data-bind="events: {click : addJCFJ}"></div>
        </div>
        <div class="miniFire-input flex4">
            <div class="miniFire-div miniFire-div-special">
                <div class="xfzb-title">
                    <div class="flex6">附件名称</div>
                    <div class="flex5">附件类型</div>
                    <div class="flex5">附件描述</div>
                    <div class="flex8">删除</div>
                </div>
                <div class="jcfj-list-wrap" data-template="jcfjEdit-template"
                     data-bind="source: dataKendo.JCFJ">
                </div>
            </div>
        </div>
    </div>
    <div class="miniFire-row-wrap">
        <div class="flex1 ">整改期限</div>
        <div class="miniFire-input flex3">
            <div class="miniFire-input flex3">
                <input type="text" class="kssj" data-bind="value:dataKendo.ZGQX" id="zgqx-date"
                       data-format="yyyy-MM-dd" data-role="datepicker">
            </div>
        </div>
        <div class="flex1 required-red">责任部门</div>
        <div class="miniFire-input flex3">
            <input type="text" data-bind="value:dataKendo.ZRBM" class="must">
        </div>
    </div>
    <div class="miniFire-row-wrap">
        <div class="flex1 required-red">责任人员</div>
        <div class="miniFire-input flex3">
            <input type="text" data-bind="value:dataKendo.ZRRY" class="must">
        </div>
        <div class="flex1 required-red">联系电话</div>
        <div class="miniFire-input flex3">
            <input type="text" data-bind="value:dataKendo.LXDH" class="must">
        </div>
    </div>

    <div class="miniFire-row-wrap">
        <div class="flex1 required-red">所属街道</div>
        <div class="miniFire-input flex3">
            <input type="text" data-bind="value:dataKendo.SSJZ.JZMC" class="must">
        </div>
        <div class="flex1 required-red">所属辖区</div>
        <div class="miniFire-input flex3 SsxqPointer">
            <input type="text" id="aqyh-xzqhSelectIpt" data-bind="value:dataKendo.SSXQ.XZQHMC,events:{click:openXzqh}" class="must">
        </div>
    </div>
    <div class="miniFire-row-wrap-zgjl">
        <div class="flex2 flex7">
            <div>整改记录</div>
        <div id="zgjlEdit-list-add" class="xfzb-add" data-bind="events: {click : addSingleZGJL}"></div>
        </div>
        <div class="miniFire-input flex4">
            <div class="miniFire-div miniFire-div-special">
                <div class="xfzb-title">
                    <div class="flex6">整改时间</div>
                    <div class="flex5">整改结果</div>
                    <div class="flex5">操作</div>
                    <div class="flex8">删除</div>
                </div>
                <div class="xfzb-list-wrap" id="zgjlEdit-list">
                </div>
            </div>
        </div>
    </div>
    <div class="miniFire-row-wrap-2">
        <div class="flex2 flex7">备注信息</div>
        <div class="miniFire-input flex4">
            <textarea class="miniFire-div miniFire-big-div" data-bind="value:dataKendo.BZXX,attr:{title:dataKendo.BZXX}"></textarea>
        </div>
    </div>
</div>

<div class="window-button-row">
    <div class="window-one-button" id="saveButton"></div>
    <div class="window-one-button" id="cancelButton"></div>
</div>

<#--行政区划选择-->
<div class="xzqh-window"></div>
</div>
<div id="moTai">
    <div id="moTai_img">
        <img src=<@spring.url '/ezSafe/icons/zysx-upload.gif'/>>
        <p>文件正在上传请等待...</p>
    </div>
</div>

<#--新建/修改整改记录弹窗-->
<div class="miniFire-edit-window hidden"  id="aqyhglEdit-zgjl-xj-win">
    <div class="miniFireEdit-title" style="height: 5vh">
        <div class="window-title-background1"></div>
        <div class="window-title-background2"></div>
        <div class="new-window-title" id="zgjl-edit-window-title"></div>
        <div class="window-close-button" id="zgjl-edit-close-button"></div>
    </div>
    <div class="miniFireEdit-wrap" style="height: 76%" id="zgjlEditContent">
    </div>
    <div class="window-button-row">
        <div class="window-one-button save-button" id="zgjlEditSaveButton"></div>
        <div class="window-one-button cancel-button" id="zgjlEditCancelButton"></div>
    </div>
</div>





