<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/aqyhgl/aqyhglDetail.css'/>"/>
<div id="detail-container">
<#--整改详情弹窗模板-->
    <script id="zgjl-xq-template" type="text/x-kendo-template">
        <div class="flex4" style="margin-bottom: 1%">
            <div class="miniFire-form">
                <div  id="detail-FRDB">
                    <span class="frdb-field">整改时间</span>
                    <span class="frdb-value1"><nobr>#:data.ZGSJ#</nobr></span>
                    <span class="frdb-field">整改结果</span>
                    <span class="frdb-value1 no-right-border">#:data.ZGJG.VALUE ? data.ZGJG.VALUE : ''#</span>
                    <span class="frdb-field">整改措施</span>
                    <span class="frdb-value2 no-right-border">#:data.ZGCS#</span>
                    <span class="frdb-field">整改资金</span>
                    <span class="frdb-value2 no-right-border">#:data.ZGZJ.JE##:data.ZGZJ.DW#</span>
                    <span class="frdb-field">整改说明</span>
                    <span class="frdb-value2 no-right-border">#:data.ZGSM#</span>
                    <span class="frdb-field">验收人员</span>
                    <span class="frdb-value1"><nobr></nobr>#:data.YSRY#</span>
                    <span class="frdb-field">验收时间</span>
                    <span class="frdb-value1 no-right-border">#:data.YSSJ#</span>
                </div>
                <div class="xfzb-title">
                    <div class="flex6 ">附件名称</div>
                    <div class="flex5">附件类型</div>
                    <div class="flex5">附件描述</div>
                </div>
                <div class="zgjl-xq-list-wrap">
                    #if(data.ZGFJ){#
                    #for(var j=0; j< data.ZGFJ.length; j++){#
                    <div class="xfzb-row">
                        <div class="flex6">
                            <div class="xfzb-content xfzb-file-name">#:data.ZGFJ[j].FJMC#</div>
                        </div>
                        <div class="flex5">
                            <div class="xfzb-content">#:data.ZGFJ[j].FJLX#</div>
                        </div>
                        <div class="flex5">
                            <div class="xfzb-content">#:data.ZGFJ[j].FJMS#</div>
                        </div>
                    </div>
                    #}}#
                </div>
            </div>
        </div>
    </script>
    <div class="content-container selected" id="detail-jbxx">
        <label>企业名称</label>
        <input type="text" data-bind="value:dataKendo.QYXX.QYMC" class="long-input" disabled="disabled" />

        <label>隐患类型</label>
        <input type="text" data-bind="value:dataKendo.YHLX.VALUE" class="long-input" disabled="disabled" />

        <label>隐患级别</label>
        <input type="text" data-bind="value:dataKendo.YHJB.VALUE" disabled="disabled" />

        <label>隐患来源</label>
        <input type="text" data-bind="value:dataKendo.YHLY.VALUE" disabled="disabled" />

        <label>隐患位置</label>
        <input type="text" data-bind="value:dataKendo.YHWZ" class="long-input" disabled="disabled" />

        <label>隐患部位</label>
        <input type="text" data-bind="value:dataKendo.YHBW" class="long-input" disabled="disabled" />

        <label>隐患内容</label>
        <textarea data-bind="value:dataKendo.YHNR" class="long-input" disabled="disabled"></textarea>

        <label>检查人员</label>
        <input type="text" data-bind="value:dataKendo.JCRY.RYXM" disabled="disabled" />

        <label>检查时间</label>
        <input type="text" data-bind="value:dataKendo.JCSJ" disabled="disabled" />

        <label>检查附件</label>
        <div id="jcfj-list" class="long-input fjxx-list"></div>

        <label>整改期限</label>
        <input type="text" data-bind="value:dataKendo.ZGQX" disabled="disabled" />

        <label>责任部门</label>
        <input type="text" data-bind="value:dataKendo.ZRBM" disabled="disabled" />

        <label>责任人员</label>
        <input type="text" data-bind="value:dataKendo.ZRRY" disabled="disabled" />

        <label>联系电话</label>
        <input type="text" data-bind="value:dataKendo.LXDH" disabled="disabled" />

        <label>所属街镇</label>
        <input type="text" data-bind="value:dataKendo.SSJZ.JZMC" disabled="disabled" />

        <label>所属辖区</label>
        <input type="text" data-bind="value:dataKendo.SSXQ.XZQHMC" disabled="disabled" />

        <label>整改记录</label>
        <div id="zgjl-list" class="long-input zgjl-list"></div>

        <label>备注信息</label>
        <textarea data-bind="value:dataKendo.BZXX" class="long-input" disabled="disabled"></textarea>
    </div>
</div>

<div class="miniFire-edit-window hidden" id="aqyhgl-zgjl-xq-win">
    <div class="miniFireEdit-title" style="height: 5vh">
        <div class="window-title-background1"></div>
        <div class="window-title-background2"></div>
        <div class="new-window-title" id="zgjl-xq-title"></div>
        <div class="window-close-button" id="zgjl-xq-close-button"></div>
    </div>
    <div class="miniFireEdit-wrap" id="zgjl-xq">
    </div>
</div>