/**
 * CopyRight ©1995-2015: 苏州科达科技股份有限公司
 * Project：     EZView
 * Module：      EZView-Portal
 * Description： 测试引入RequireJs 和 angularJs
 * Author：      yefei
 * Create Date： 2015-01-06 13:54
 * Version：     V0.1
 * History：
 *      2015-01-06  Modified By yefei Comment:*****
 *      2015-01-09  Modified By yefei Comment: 调整 KendoUI JQuery KendoUI Culture 、Message 库依赖关系
 *      2015-02-10  Modified By liwei Comment:将config代码提取到common.js文件中及简化模块名称
 *      2015-03-04  Modified By YeFei Comment:将写死的context改成读取全局变量 CONTEXT_PATH;
 *      2015-03-17  Modified By YeFei Comment:增加jQuery Hightlight 插件
 *      2015-03-19  Modified By YeFei Comment:增加 JQuery Websocket 库
 *      2015-03-23   Modified By liwei Comment:增加orgTree模块 ,增加响应式布局js
 *      2015-03-25   Modified By YeFei Comment:规范模块化写法
 *      2015-04-09  Modified By liwei Comment :增加 JQuery EnScroll 插件
 *      2015-05-13  Modified By liwei Comment :引入codemirror相关组件，并重构require引用路径
 */


define(function () {

    requirejs.config({
        baseUrl: CONTEXT_PATH + '/ezSafe/lib_js',
        paths: {
            app: '../../../',
            lib: './',
            jszip: 'jszip',
            ezviewCommon: 'ezview.common',
            jquery: 'jquery.min',
            jqueryJson: 'jquery.json.min',
            culture: 'kendoui/js/cultures/kendo.culture.zh-CN.min',
            messages: 'kendoui/js/messages/kendo.messages.zh-CN.min',
            kendo: 'kendoui/js/kendo.all.min',
            websocket: 'websocket',
            scrollbar: 'jquery.scrollbar.min',
            respond: 'respond.min',
            bowser: 'bowser.min',
            corner: 'jquery.corner',
            CodeMirror: 'codemirror/lib/codemirror',
            avatarCodeMirror: 'avatar.codemirror',
            mergely: 'codemirror/lib/mergely',
            codeTextArea: 'codeTextArea',
            kendoUIExt: 'kendoext/kendo.ui.ext',
            coverMask: 'coverMask/coverMask',
            avatarInput: 'avatarInput/avatarInput',
            ztree: 'ztree/jquery.ztree.core-3.5.min',
            echarts: 'echarts/echarts.min',
            countUp: 'countUp',
            flexslider: 'jquery.flexslider',
            fireCommon: 'firefighter.common',
            dateTimePicker: 'dateTimePicker/dateTimePicker',
            canvasTools:'canvasTools/canvasTools',
            commonCPlugin: 'commonCPlugin/commonCPlugin',
            uploadXmlrpc: 'fileUpload/uploadXmlrpc',
            picUtil: 'picUtil',
            videoExt:'videoExt',
            jqueryExt:"jqueryExt",
            comOrgTree: 'comOrgTree/comOrgTree',
            comRegionTree: 'comRegionTree/comRegionTree'
        },

        waitSeconds: 15,

        shim: {

            'kendo': {
                deps: ['jquery', 'jszip'],
                exports: 'kendo'
            },

            'culture': {
                deps: ['kendo'],
                exports: 'culture'
            },

            'messages': {
                deps: ['kendo'],
                exports: 'messages'
            },

            'websocket': {
                deps: ['jquery']
            },
            'jqueryJson': {
                deps: ['jquery']
            },
            'corner': {
                deps: ['jquery']
            },
            'mergely': {
                deps: ['jquery', 'CodeMirror']
            },
            'scrollbar': {
                deps: ['jquery']
            },
            'ztree': {
                deps: ['jquery']
            }
        }
    });

});


