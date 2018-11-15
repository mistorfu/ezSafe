define(["jquery"], function () {
    /******************************************************************************************************************
     * 输入框组件
     * options : {
     *  name: "", 组件中input名称，
     *  textTip: "", // 空白提示输入内容
     *  renderTo: "" 渲染位置
     *  appendInvalidationChars: [] 追加不合法字符
     *  appendValidationChars: [] 追加合法字符,
     *   keyup: function() {}, // 按键抬起回调函数
     *  focus: function() {}, // 获取焦点回调函数
     *  blur: function() {}, // 失去焦点回调函数
     *  clear: function() {}, // 清除内容回调函数
     * }
     */
    function AvatarInput(options) {
        this.invalidationChars = [' ', '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
            '\\[', '\\]', '{', '}', '\\', '\/', '|', ':', ';', '.', "\\'", '\\"'
        ];
        this.options = {
            name: "", //组件中input名称
            textTip: "请输入内容", // 空白提示默认输入内容
            keyup: null, // 按键抬起回调函数
            focus: null, // 获取焦点回调函数
            blur: null, // 失去焦点回调函数
            clear: null // 清除内容回调函数
        };

        if (this._isObject(options)) {
            for (var key in options) {
                if (key == "appendInvalidationChars" && this._isArray(options["appendInvalidationChars"])) {
                    this.invalidationChars = this.invalidationChars.concat(options["appendInvalidationChars"]);

                } else if (key == "appendValidationChars" && this._isArray(options["appendValidationChars"])) {
                    if (options["appendValidationChars"].length == 0) continue;
                    var regExp = new RegExp('[' + options["appendValidationChars"].join("") + ']', 'g');
                    for (var i = this.invalidationChars.length - 1; i >= 0; i--) {
                        if (regExp.test(this.invalidationChars[i])) {
                            this.invalidationChars.splice(i, 1);
                        }
                    }
                } else {
                    this.options[key] = options[key];
                }
            }
        }
        this._init();
    }

    AvatarInput.prototype = {
        /*************************************************************************************************************
         * 组件初始化
         */
        _init: function () {
            if (this._create()) {
                $("#" + this.id).css({
                    width: $("#" + this.id).parent().width(), height: $("#" + this.id).parent().height()
                });
                $("#" + this.id + "_input").css({
                    width: $("#" + this.id).width() - $("#" + this.id + "_clear").outerWidth(true),
                    height: $("#" + this.id).parent().height()
                });
                $("#" + this.id + "_input").attr("name", this.options.name);
                $("#" + this.id + "_input").val(this.options.textTip);

                this._bindEvent();
                this.show();
            }
        },

        /*************************************************************************************************************
         * 获取当前组件值
         * @returns {*}
         */
        val: function () {
            if (this._isEmpty($("#" + this.id + "_input")[0])) {
                return "";
            }
            return $("#" + this.id + "_input").val();
        },

        /*************************************************************************************************************
         * 显示组件
         */
        show: function () {
            if (this._isEmpty($("#" + this.id)[0])) {
                return;
            } else {
                $("#" + this.id).show();
            }
        },

        /*************************************************************************************************************
         * 隐藏组件
         */
        hide: function () {
            if (this._isEmpty($("#" + this.id)[0])) {
                return;
            } else {
                $("#" + this.id).hide();
            }
        },

        /*************************************************************************************************************
         * 隐藏组件值清除按钮
         */
        hideClearBtn: function () {
            if (this._isEmpty($("#" + this.id + "_clear")[0])) {
                return;
            } else {
                $("#" + this.id + "_clear").hide();
            }
        },

        /*************************************************************************************************************
         * 显示组件值清除按钮
         */
        showClearBtn: function () {
            if (this._isEmpty($("#" + this.id + "_clear")[0])) {
                return;
            } else {
                $("#" + this.id + "_clear").show();
            }
        },

        /*************************************************************************************************************
         * 创建组件
         * @returns {boolean}
         * @private
         */
        _create: function () {
            this.id = new Date().getTime() + Math.floor(Math.random() * 1000);
            var atInputHtml = '<div id= "' + this.id + '" class="avatar-input-wrapper">'
                + '<input id="' + this.id + '_input" class="avatar-input avatar-input-text-tip"/><span id="' + this.id + '_clear" class="avatar-input-clear"></span>'
                + "</div>";
            var flag = true;
            if ($("#" + this.options["renderTo"])[0]) {
                $("#" + this.options["renderTo"]).empty();
                $("#" + this.options["renderTo"]).append(atInputHtml);
            } else if ($("." + this.options["renderTo"])[0]) {
                $("." + this.options["renderTo"]).empty();
                $("." + this.options["renderTo"]).append(atInputHtml);
            } else {
                flag = false;
            }
            return flag;
        },

        /*************************************************************************************************************
         * 组件事件绑定
         */
        _bindEvent: function () {
            var context = this;
            $("#" + this.id + "_input").keyup(function (e) {
                if ($("#" + context.id + "_clear").is(":hidden")) {
                    $("#" + context.id + "_clear").show();
                }
                var value = $(this).val();
                value = value.replace(new RegExp('[' + context.invalidationChars.join("") + ']', 'g'), '');
                $(this).val(value);

                if (context._isFunction(context.options.keyup)) {
                    context.options.keyup(e, this, context);
                }
            });

            $("#" + this.id + "_input").focus(function (e) {
                if ($("#" + context.id + "_clear").is(":hidden")) {
                    $("#" + context.id + "_clear").show();
                }
                if ($(this).val() == context.options.textTip) {
                    $(this).val("");
                }
                if ($(this).hasClass("avatar-input-text-tip")) {
                    $(this).removeClass("avatar-input-text-tip")
                }
                if (context._isFunction(context.options.focus)) {
                    context.options.focus(e, this, context);
                }
            });

            $("#" + this.id + "_input").blur(function (e) {
                if (context._isEmpty($(this).val())) {
                    $(this).val(context.options.textTip);
                    if (!$(this).hasClass("avatar-input-text-tip")) {
                        $(this).addClass("avatar-input-text-tip")
                    }
                }
                if (context._isFunction(context.options.blur)) {
                    context.options.blur(e, this, context);
                }
            });

            $("#" + this.id + "_clear").click(function (e) {
                $(this).hide();
                $("#" + context.id + "_input").val("");
                if (context._isFunction(context.options.clear)) {
                    context.options.clear(e, this, context);
                }
            });
        },

        _isEmpty: function (target) {
            if (typeof target == "undefined" || target == null || target == "") {
                return true;
            }
            return false;
        },

        _isArray: function (target) {
            if (this._isEmpty(target)) {
                return false;
            }
            if (Object.prototype.toString.call(target) == '[object Array]') {
                return true;
            } else {
                return false;
            }
        },

        _isObject: function (target) {
            if (this._isEmpty(target)) {
                return false;
            }
            for (var key in target) {
                return true;
            }
            return false;
        },

        _isFunction: function(target) {
            if (this._isEmpty(target)) {
                return false;
            }
            if (Object.prototype.toString.call(target) == "[object Function]") {
                return true;
            } else {
                return false;
            }
        }
    }
    return AvatarInput;
});


