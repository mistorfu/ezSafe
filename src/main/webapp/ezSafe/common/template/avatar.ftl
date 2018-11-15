<meta name="renderer" content="webkit">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">

<link rel="shortcut icon" href="<@spring.url '/ezSafe/common/template/favicon.ico' />"/>

<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/lib_js/kendoui/styles/kendo.common.min.css'/>"/>
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/lib_js/kendoui/styles/kendo.blueopal.min.css'/>"/>
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/common/styles/jquery.scrollbar.css' />"/>
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/lib_js/coverMask/coverMask.css' />"/>
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/lib_js/dateTimePicker/dateTimePicker.css' />"/>
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/lib_js/waterMark/waterMark.css'/>"/>
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/lib_js/videoExt/videoExt.css'/>"/>

<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/common/styles/at.base.css'/>">
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/common/styles/at.default.css'/>">
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/lib_js/kendoext/kendo.ui.ext.css' />"/>
<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/common/styles/firefighter.common.css' />"/>
<#--<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/common/styles/at-tree.css'/>">-->

<script>
    var CONTEXT_PATH = "<@spring.url "" />";
    CONTEXT_PATH = CONTEXT_PATH.split(";")[0];

    var USER_INFO = {};
    /**
     * 接收消息接口（插件调用）
     * */
    function handleMessage(message) {
        try {
            if (typeof window.receiveMsgInfo != 'undefined' && typeof window.receiveMsgInfo == 'function') {
                window.receiveMsgInfo(message);
            }
            else {
                var count = 10;
                if (this.timer != undefined && this.timer != null) {
                    clearInterval(this.timer);
                }
                this.timer = setInterval(function () {
                    count--;
                    if (count < 0 || window.receiveMsgInfo) {
                        clearInterval(this.timer);
                        if (typeof window.receiveMsgInfo != 'undefined' && typeof window.receiveMsgInfo == 'function') {
                            window.receiveMsgInfo(message);
                        }
                    }
                }, 600);
            }
        } catch (e) {

        }
    }

    /**
     * 发送消息接口
     * */
    window.sendMsgInfo = function (message) {
        try {
            var isChrome = navigator.userAgent.indexOf("Chrome") > -1;
            if (isChrome) {
                window.Application.sendMessage(message);
            }
            else {
                window.external.sendMessage(message);
            }
        } catch (e) {

        }
    };

    /**
     * 点位地图定位消息
     * */
    window.pointMapLocation = function (jd, wd, top) {
        try {
            if ((jd > 70.0 && jd < 140.0) && (wd > 3.0 && wd < 60.0)) {
                var message = "GIS|MapLocation;" + jd + "," + wd + ";1|" + (top ? "top" : "untop");
                var isChrome = navigator.userAgent.indexOf("Chrome") > -1;
                if (isChrome) {
                    window.Application.sendMessage(message);
                }
                else {
                    window.external.sendMessage(message);
                }
            }
        } catch (e) {

        }
    };

</script>

<!--[if lt IE 9]>
<script src="<@spring.url '/ezSafe/lib_js/html5shiv.js' />"></script>
<script src="<@spring.url '/ezSafe/lib_js/respond.min.js' />"></script>
<![endif]-->

<!--[if IE]>
<script src="<@spring.url '/ezSafe/lib_js/excanvas.js' />"></script>
<![endif]-->