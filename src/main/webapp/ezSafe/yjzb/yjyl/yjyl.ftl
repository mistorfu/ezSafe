<!DOCTYPE html>
<html>
<head>
    <title>应急演练录入页面</title>

<#import "spring.ftl" as spring />
<#include "/ezSafe/common/template/avatar.ftl" />
    <link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/yjzb/yjyl/yjyl.css'/>"/>
</head>

<body>

<div class="main-container">
    <div class="dxal-left float-left">
        <div class="dxal-left-top">
            <div class="dxal-common-title">
                应急演练
            </div>
            <div class="szyl-add-button" id="normalAdd"></div>
        </div>
        <div class="dxal-content">
            <div class="dxal-content-searchParams">
                <div class="dxal-content-searchParams-row">
                    <div class="row-text">
                        演练名称
                    </div>
                    <div class="single-input">
                        <input type="text" class="dxal-text-input" id="key-word"/>
                        <#--<span class="clear-input"></span>-->
                    </div>
                </div>
                <div class="single-text">
                    演练时段
                </div>
                <div class="dxal-content-searchParams-singleParam">
                    <div class="single-input">
                        <input type="text" class="dxal-text-input" id="dateStart"/>
                    </div>
                </div>
                <div class="time-split2 float-left">~</div>
                <div class="dxal-content-searchParams-singleParam">
                    <div class="single-input">
                        <input type="text" class="dxal-text-input" id="dateEnd"/>
                    </div>
                </div>
                <div class="dxal-content-searchParams-searchButtons">
                    <div class="searchButton" id="searchButton"></div>
                    <div class="resetButton" id="resetButton"></div>
                    <div class="exportButton" id="exportButton"></div>
                </div>
            </div>
            <div class="dxal-content-spliter">
                <div class="dxal-content-line float-left"></div>
                <div class="dxal-content-spliter-button float-left" id="spliter-button"></div>
                <div class="dxal-content-line float-left"></div>
            </div>
            <div class="dxal-content-lists">
                <div class="dxal-content-lists-innerdiv" id="lists-container">

                </div>
            </div>
            <div class="dxal-content-lists-pager" id="lists-pager">
            </div>
        </div>
    </div>
    <div class="alsp-right float-left">
        <div class="alsp-view">
            <div class="alsp-title">
                <span>演练资料</span>
                <div class="addVideo-btn"></div>
            </div>
            <div class="video-play" id="playOCXWindow"></div>
            <div class="trp-window-img" id="trp-window-trp"></div>
            <div class="file-play" id="file-play">
                <div class="file-img"></div>
                <div class="file-title"></div>
                <div class="file-tip">非预览型文件，请点击打开！</div>
            </div>
            <div class="video-list" id="video-list">
            </div>
        </div>
    </div>


    <div class="window-modal"></div>

    <div class="new-window" id="new-window">
        <div class="new-window-container">
            <div class="window-title">
                <div class="window-title-background1"></div>
                <div class="window-title-background2"></div>
                <span class="new-window-title">新增应急演练</span>
                <div class="window-close-button" id="new-window-close-button"></div>
            </div>
            <div class="new-window-content">
                <div class="new-window-one-row">
                    <div class="new-window-one-row-text"><span class="needed">*</span>演练名称</div>
                    <div class="new-window-one-row-input new-long-input">
                        <input type="text" class="dxal-text-input" id="new-ylmc"/>
                    </div>
                </div>
                <div class="new-window-one-row timeParam">
                    <div class="new-window-one-row-text">
                        演练时段
                    </div>
                    <div class="new-window-one-row-input">
                        <input type="text" class="dxal-text-input" id="new-dateStart"/>
                    </div>
                    <div class="time-split float-left">~</div>
                    <div class="new-window-one-row-input">
                        <input type="text" class="dxal-text-input" id="new-dateEnd"/>
                    </div>
                </div>
                <div class="new-window-one-row">
                    <div class="new-window-one-row-text">
                      演练单位
                    </div>
                    <div class="new-window-one-row-input new-long-input">
                        <input type="text" class="dxal-text-input" id="new-yldw"/>
                    </div>
                </div>
                <div class="new-window-one-row">
                    <div class="new-window-one-row-text">
                       演练地点
                    </div>
                    <div class="new-window-one-row-input new-long-input">
                        <input type="text" class="dxal-text-input" id="new-yldd"/>
                    </div>
                </div>
                <div class="new-window-one-row" style="height: 7.7vh;">
                    <div class="new-window-one-row-text">
                       演练内容
                    </div>
                    <div class="new-window-one-row-input new-long-input">
                        <textarea type="text" class="dxal-text-input" id="new-ylnr"></textarea>
                    </div>
                </div>
                <#--<div class="new-window-one-row">-->
                    <#--<div class="new-window-one-row-text">-->
                        <#--<span class="needed">*</span>消防机构-->
                    <#--</div>-->
                    <#--<div class="new-window-one-row-input new-long-input">-->
                        <#--<div class="dxal-text-input" id="new-ssdw"></div>-->
                    <#--</div>-->
                <#--</div>-->
                <div class="window-button-row">
                    <div class="window-one-button" id="saveButton"></div>
                    <div class="window-one-button" id="cancelButton"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="xfdw-window">

    </div>

    <div class="delete-window">
        <div class="window-title">
            <div class="window-title-background1"></div>
            <div class="window-title-background2"></div>
            <span class="xfdw-window-title">提示</span>
            <div class="window-close-button" id="delete-window-close-button"></div>
        </div>
        <div class="delete-text">确定删除已选信息？</div>
        <div class="window-button-row">
            <div class="window-one-button" id="checkButton-delete"></div>
            <div class="window-one-button" id="cancelButton-delete"></div>
        </div>
    </div>

    <div class="info-window" id="info-window">
        <div class="info-pic success-pic"></div>
        <div class="info-text">
            <span id="info-text">删除成功</span>
            <div class="info-close-button" id="info-close-button">×</div>
        </div>

    </div>
</div>
<input name="files" id="files" type="file"/>
<script type="text/x-kendo-template" id="dxalTemplate">
    <div class="lists-one-single float-left #:jiou#">
        <div class="list-single-title float-left">
            <img src="../ezSafe/icons/common-treelist-collapse.png"/>
            <div class="list-single-title-text">
                <span title="#:YLMC#">#:YLMC#</span>
            </div>
            <div class="list-edit-buttons-bar">
                <div class="single-edit-button button-delete" title="删除"></div>
                <div class="single-edit-button button-edit" title="修改"></div>
            </div>
        </div>
        <div class="list-single-content float-left">
            <div class="list-details-one-row">
                <div class="details-text two-characters">演练时段</div>
                # if (data.KSSJ==""&&data.JSSJ=="") { #
                <div class="details-content"></div>
                # } else { #
                <div class="details-content">#:KSSJ# ~ #:JSSJ#</div>
                #} #

            </div>
            <div class="list-details-one-row">
                <div class="details-text">演练单位</div>
                <div class="details-content">#:YLDW#</div>
            </div>
            <div class="list-details-one-row">
                <div class="details-text">演练地点</div>
                <div class="details-content">#:YLDD#</div>
            </div>
            <div class="list-details-one-row">
                <div class="details-text">演练内容</div>
                <div class="details-content">#:YLNR#</div>
            </div>
            <#--<div class="list-details-one-row">-->
                <#--<div class="details-text">消防机构</div>-->
                <#--<div class="details-content">#:SSDW#</div>-->
            <#--</div>-->
        </div>
    </div>

</script>


<script id="FileTemplate" type="text/x-kendo-template">
    # if(data.ResourceID) { #
    <div class="file-table-row" id="#:ResourceID#"  data-type="#:ResourceType#"  style="background:transparent">
        <div class="file-cell" title="#:WJMC#">#:WJMC#</div>
        # if(data.hasOwnProperty("SLTP")) { #

        # if(data.SLTP) { #
        <img src="#:SLTP#" class="file-thumbnail"/>
        # } else { #
        <img src="../ezSafe/icons/xtwy-allr-file-n.png" class="file-thumbnail"/>
        # } #

        # } else { #
        <img src="" class="file-thumbnail"/>
        # } #
        <div class="bar" style="width: 0%;"></div>
        <div class="delete-img"></div>
        <input type="text" value="#:XSSX#" class="file-order" />
    </div>
    # } else { #
    <div class="file-table-row"  data-type="#:WJLX#"  style="background:transparent">
        <div class="file-cell" title="#:WJMC#">#:WJMC#</div>
        # if(data.SLTP) { #
        <img src="#:SLTP#" class="file-thumbnail"/>
        # } else { #
        <img src="../ezSafe/icons/xtwy-allr-file-n.png" class="file-thumbnail"/>
        # } #
        <div class="bar" style="width: 0%;"></div>
        <div class="delete-img"></div>
        <input type="text" value="#:XSSX#" class="file-order" />
    </div>
    # } #
</script>

<object id="commonCPlugin" classid="CLSID:C500D9B3-2134-4915-9752-FAB7BD97641B" class="hidden"></object>
<a id="export-download" download="" style="display: none"></a>
<script data-main="<@spring.url '/ezSafe/yjzb/yjyl/yjyl.js'/>"
        src="<@spring.url '/ezSafe/lib_js/require.js'/>"></script>
</body>
</html>

