<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/yjzb/yjsc/sczs/sczs.css'/>"/>
<div class="sczs-container" id="sczs-container">
    <div class="sczs-display-wrapper">
        <div class="sczs-zsk-container" id="sczs-zsk-container">
        </div>
        <div class="sczs-fa-container" id="sczs-fa-container">
        </div>
        <div class="sczs-blank"></div>
    </div>
    <div class="sczs-fa-edit-wrapper">
        <div class="sczs-fa-edit-title">
            <span>方案名称</span>
            <span class="sczs-fa-edit-title-text"></span>
        </div>
        <div class="sczs-fa-edit-selection"></div>
        <div class="sczs-fa-edit-content" id="sczs-fa-edit-content"></div>
    </div>
</div>
<script type="text/x-kendo-template" id="sczs-single-template">
    <div class="sczs-common-wrapper" mark="#=data['mark']#">
        <div class="sczs-common-title" id="lockon-#=data['id']#" target="#=data['target']#">
            <span class="sczs-common-triangle" state="collapse"></span>
            <span class="sczs-common-icon"></span>
            <span class="sczs-title-text" title="#=data['name']#">#=data['name']#</span>
            #if (!data.readOnly) {#
            <div class="sczs-edit-bar">
                <span class="sczs-button-edit"></span>
                <span class="sczs-button-delete"></span>
            </div>
            # } #
        </div>
        <div class="sczs-common-content">
            <div class="sczs-main-content"></div>
            <div class="sczs-children-content"></div>
        </div>
    </div>
</script>

<script type="text/x-kendo-template" id="sczs-single-details">
<div class="sczs-details-wrapper">
    # if (data['text']) {#
    <div class="sczs-details-main-text">#:data['text']#</div>
    #}#
    <div class="sczs-details-files-wrapper-wrapper">
    <div class="sczs-details-files-wrapper" style="width: #=data['files'].length > 3 ? 100+(data['files'].length-3)*33+'%': '100%' #">
        #for (var x = 0 ; x < data['files'].length ; x++) { var file = data['files'][x];#
        <div class="sczs-single-file-wrapper">
            <div class="sczs-single-img-wrapper" relate="#=data['id']#" mark="#=data['mark']#">
                #if (file['WJLX'] == 2) { #
                <img src="#=file['WLLJ']#" class="sczs-pic">
                # } else {#
                #if (file['WJLX'] == 1) { #
                <img src="../ezSafe/icons/yjya-sp-n.png" class="sczs-file">
                #} else {#
                <img src="../ezSafe/icons/yjya-text-file-pic.png" class="sczs-file">
                #}#
                <a download="" href="#=file['WLLJ'].indexOf('?') > 0 ? file['WLLJ'] + '&isopen=true' : file['WLLJ'] + '?isopen=true'#">
                    <span>#=file['WJMC']#</span>
                </a>
                # } #
            </div>
            <div class="sczs-single-file-description">
                <span title="#=file['WJMS'] || ''#">#=file['WJMS'] || ''#</span>
            </div>
        </div>
        #}#
    </div>
    </div>
    # if (data['remark']) {#
    <div class="sczs-details-remarks">备注：<br>#:data['remark']#</div>
    # } #
</div>
</script>
<script type="text/x-kendo-template" id="zdx-template">
# for (x in data) {#
<div class="sczs-single-zdx-block sczs-single-zdx-state-#=data[x].state# sczs-zdx-code-#=data[x].code#">
    <span style="display: none;">#=data[x].text#</span>
</div>
#}#
</script>