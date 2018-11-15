define(["jquery"], function() {
    /*******************************************************************************************************
     * 页面加载遮罩
     * @param options
     * @constructor
     */
    function CoverMask(options) {
        this.options = {
            renderTo: "",
            message: "努力加载中...",
            isShow: false
        };

        if (!this._isEmpty(options)) {
            for (var key in options) {
                this.options[key] = options[key];
            }
        }
        this.init();
    }

    CoverMask.prototype = {
        /************************************************************************************************************
         * 遮罩组件初始化
         */
        init: function () {
            this._create();
            this.target.css({width: this.target.parent().width(), height: this.target.parent().height()});
            if (this.options.isShow) {
                this.target.show();
            }
        },
        /************************************************************************************************************
         * 显示遮罩组件
         * @param message 要显示的遮罩层信息
         */
        show: function (message) {
            if (this._isEmpty(this.target) || this._isEmpty(this.target[0])) {
                return;
            }
            if (!this._isEmpty(message)) {
                this.target.find(".at-cover-mask-msg-text").text(message);
            } else {
                this.target.find(".at-cover-mask-msg-text").text(this.options.message);
            }
            if(!this.target.is(":visible")) {
                this.target.css({width: this.target.parent().width(), height: this.target.parent().height()});
                this.target.show();
            }
        },
        /************************************************************************************************************
         * 隐藏遮罩组
         */
        hide: function () {
            if (this._isEmpty(this.target) || this._isEmpty(this.target[0])) {
                return;
            }
            this.target.hide();
        },
        /************************************************************************************************************
         * 遮罩组件创建
         */
        _create: function () {
            var renderObject;
            if (this._isEmpty(this.options.renderTo)) {
                renderObject = $(document.body);
            } else if (!this._isEmpty($("#" + this.options.renderTo)[0])) {
                renderObject = $("#" + this.options.renderTo);
            } else if (!this._isEmpty($("." + this.options.renderTo)[0])) {
                renderObject = $("." + this.options.renderTo);
            } else {
                renderObject = $(document.body);
            }
            if (renderObject.css("position") != "relative" || renderObject.css("position") != "absolute"
                || renderObject.css("position") != "fixed") {
                renderObject.css("position", "relative");
            }
            this.id = "atCoverMask_" + new Date().getTime() + Math.floor(Math.random() * 1000);
            var maskHtml = '<div id="'+ this.id +'" class="at-cover-mask">'
                + '<div class="at-cover-mask-msg-wrapper"><div class="at-cover-mask-msg"><div class="at-cover-mask-msg-img"></div><div class="at-cover-mask-msg-text">' + this.options.message + '</div></div></div>'
                + '</div>';
            renderObject.append(maskHtml);
            this.target = $("#" + this.id);
        },

        _isEmpty: function (obj) {
            if (typeof obj == "undefined" || obj == null || obj == "") {
                return true;
            }
            return false;
        }
    }

    return CoverMask;
});