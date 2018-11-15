/**
 * CopyRight ©1995-2015: 苏州科达科技股份有限公司
 * Project：     maintenance
 * Module：      avatar_maintenance
 * Description： 带有格式的textArea控件
 * Author：      liwei
 * Create Date： 2015-05-20 09:54
 * Version：     V0.1
 * History：
 * */

define(['jquery','avatarCodeMirror'],function(jquery,avatarCodeMirror)
{
    var defaultOpts =
    {
        mode: "application/xml",
        styleActiveLine: true,
        lineNumbers: true,
        matchTags: {bothTags: true}
    };

    $.extend($.fn,{
        codeTextArea: function (option) {
            var options = $.extend({},defaultOpts,option)
            var editor = CodeMirror.fromTextArea(this.get(0),options);
            $.data(this.get(0),"codeTextArea",editor);
        }
    })

});