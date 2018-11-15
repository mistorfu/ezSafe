<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/yjya/yjya.css'/>"/>
<div class="mhya-container">
    <div class="mhya-wbya">
        <div class="wbya-size" id="wbya-size">0</div>
    </div>
    <div class="mhya-jghya">
        <div class="mhya-mid-text"></div>
        <div class="mid-size" id="mid-size">0</div>
    </div>
    <div class="mhya-szhya">
        <div class="szhya-size" id="szhya-size">0</div>
    </div>
    <a download id="download-a-label"></a>
</div>
<div class="mhya-iframe-container">
    <div class="iframe-close-button"></div>
    <iframe class="iframe-content"></iframe>
</div>
<div class="mhya-pic-container">
    <div class="iframe-close-button"></div>
    <div class="pic-content"></div>
</div>
<div id="text-reserve-plan-window" class="trp-window">
    <div class="trp-before"></div>
    <div class="trp-window-reality">

        <div class="trp-window-title">
            <div class="trp-window-title-text">文本预案</div>
        </div>
        <div class="trp-corner">
            <div class="corner-west-north"></div>
            <div class="corner-west-south"></div>
            <div class="corner-east-south"></div>
            <div class="trp-window-close-button" id="trp-window-close"></div>
        </div>
        <div class="trp-window-content-container">
            <div class="trp-window-content-left">
                <div class="trp-window-img" id="trp-window-trp"></div>
                <iframe class="trp-inner-iframe"></iframe>
                <div class="trp-download-container">
                    <img src="../ezSafe/icons/yjya-text-file-pic.png">
                    <span class="trp-download-link"></span>
                    <a class="download-tip" download title="点击打开文件">非预览型文件，请点击打开！</a>
                </div>
            </div>
            <div class="trp-window-content-right">
            </div>
        </div>
    </div>
</div>
<script id="trp-tmp" type="text/x-kendo-template">
    # for (var i = 0 , l = data.length ; i < l ; i++) { #
    <div class="trp-single-reality" file-type="#:data[i].WJLX||1#"
         style="#if (data[i].WJLX == '2') {# background-image:url('#:data[i].YAWJ#') #}#">
        <div class="single-file-name">
            <span title="#:data[i].YAMC#">
                #if (data[i].YAMC.length > 20) {# #:data[i].YAMC.substr(0,20)+'...'# #} else {# #:data[i].YAMC# #}#
            </span>
        </div>
    </div>
    # } #
</script>
