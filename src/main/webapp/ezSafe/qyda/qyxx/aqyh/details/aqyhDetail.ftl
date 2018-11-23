
        <link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qyxx/aqyh/xcrw.css'/>"/>


<script id="zgjlTemplate" type="text/x-kendo-template">
    <div class="miniFire-table" style="margin: 1% 0">
        <div class="miniFire-tr" style="">
            <div class="miniFire-td flex5">
                <div class="miniFire-yellow-th">第#:ZGCX?ZGCX:1#次整改记录</div>
            </div>
        </div>
        <div class="miniFire-tr" style="flex: 1;">
            <div class="miniFire-td flex1">
                <div class="miniFire-row-wrap">
                    <div class="flex1">整改时间</div>
                    <div class="miniFire-input flex3">
                        <div class="miniFire-div" data-bind="text:ZGSJ"></div>
                    </div>
                    <div class="flex1">整改资金</div>
                    <div class="miniFire-input flex3">
                        <div class="miniFire-div" data-bind="text:ZGZJ.JE"></div>
                    </div>
                </div>
                <div class="miniFire-row-wrap">
                    <div class="flex1">整改结果</div>
                    <div class="miniFire-input flex3">
                        <div class="miniFire-div" data-bind="text:ZGJG.VALUE"></div>
                    </div>
                    <div class="flex1">验收人员</div>
                    <div class="miniFire-input flex3">
                        <div class="miniFire-div" data-bind="text:YSRY"></div>
                    </div>
                </div>
                <div class="miniFire-row-wrap">
                    <div class="flex1">整改措施</div>
                    <div class="miniFire-input flex7">
                        <div class="miniFire-div" data-bind="text:ZGCS"></div>
                    </div>
                </div>
                <div class="miniFire-row-wrap">
                    <div class="flex1">整改说明</div>
                    <div class="miniFire-input flex7">
                        <div class="miniFire-div" data-bind="text:ZGSM"></div>
                    </div>
                </div>
                <div class="miniFire-row-wrap">
                    <div class="flex1">整改附件</div>
                    <div class="flex7 miniFire-fjxx" id="zgfjFjxx"></div>
                </div>
            </div>
        </div>
    </div>
</script>

        <script id="aqyhFjxxTemplate" type="text/x-kendo-template">
            <div class="aqyh-fjxx flfgFjxx-container relative" >
                <a download class="qyda-img-icon"></a>
                <span  style="margin-left: 6%;">#:FJMC #</span>
                <a download id="xcrwDownload-a-label" class="fj-download-icon"></a>
            </div>
        </script>


        <div class="miniFireEdit-title">
            <div class="window-title-background1"></div>
            <div class="window-title-background2"></div>
            <div class="new-window-title" id="aqyh-miniFirec-title">隐患详情</div>
            <div class="window-close-button" id="aqyh-window-close-button"></div>
        </div>
        <div class=" miniFireEdit-wrap" id="aqyhEdit">
        <div class="detail-content">
            <div class="miniFire-wrap">
            <div class="miniFire-row-wrap">
                <div class="flex1">隐患名称</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.YHMC"></div>
                </div>
                <div class="flex1">隐患编号</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.YHBH"></div>
                </div>
                <div class="flex1">所属街道</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.SSJZ.JZMC"></div>
                </div>
            </div>
            <div class="miniFire-row-wrap">
                <div class="flex1">隐患类型</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.YHLX.VALUE"></div>
                </div>
                <div class="flex1">隐患级别</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.YHJB.VALUE"></div>
                </div>
                <div class="flex1">所属辖区</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.SSXQ.XZQHMC"></div>
                </div>
            </div>
            <div class="miniFire-row-wrap">
                <div class="flex1">隐患来源</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.YHLY.VALUE"></div>
                </div>
                <div class="flex1">隐患位置</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.YHWZ"></div>
                </div>
                <div class="flex1">隐患部位</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.YHBW"></div>
                </div>
            </div>
            <div class="miniFire-row-wrap">
                <div class="flex1">检查人员</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.JCRY.RYXM"></div>
                </div>
                <div class="flex1">检查时间</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.JCSJ"></div>
                </div>
                <div class="flex1">整改期限</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.ZGQX"></div>
                </div>
            </div>
            <div class="miniFire-row-wrap">
                <div class="flex1">责任部门</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.ZRBM"></div>
                </div>
                <div class="flex1">责任人员</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.ZRRY"></div>
                </div>
                <div class="flex1">联系电话</div>
                <div class="miniFire-input flex3">
                    <div class="miniFire-div" data-bind="text:dataKendo.LXDH"></div>
                </div>
            </div>
            <div class="miniFire-row-wrap">
                <div class="flex1">隐患内容</div>
                <div class="miniFire-input flex11">
                    <div class="miniFire-div" data-bind="text:dataKendo.YHNR"></div>
                </div>
            </div>
            <div class="miniFire-row-wrap">
                <div class="flex1">备注信息</div>
                <div class="miniFire-input flex11">
                    <div class="miniFire-div" data-bind="text:dataKendo.BZXX"></div>
                </div>
            </div>
            <div class="miniFire-row-wrap">
                <div class="flex1">附件信息</div>
                <div class="miniFire-fjxx" id="aqyhFjxx"></div>
            </div>
            <div class="miniFire-row-wrap"  >
                <div data-template="zgjlTemplate" style="width: 100%;" data-bind="source:dataKendo.ZGJL"></div>
            </div>
        </div>
        </div>
        </div>





