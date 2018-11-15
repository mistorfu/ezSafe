define(["jquery"], function () {
    /**
     *  网页图片放大器
     * @param options
     * @constructor
     */
    function Magnifier(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this.reactorRegion = this.reactorRegion || ""; // 响应放大镜的文档区域
        this.images = this.images || [];
        this.rate = this.rate && this.rate > 1 ? this.rate : 5;
        this.id = this.id || "magnifierPlugin";
        this.threshold_move_value = this.threshold_move_value || 5; // 5px
        this._init();
    }

    Magnifier.prototype = {
        _init: function () {
            this._create();
        },

        _create: function () {
            if ($(document.body).css("position") != "relative" || $(document.body).css("position") != "absolute") {
                $(document.body).css("position", "relative");
            }

            var fragment = '<div id="' + this.id + '" class="magnifier-wrapper">'
                + '<div class="magnifier-image-wrapper"><img src="" class="magnifier-image"></div>'
                + '</div>';
            if (!$(this.id)[0]) {
                $(document.body).append(fragment);
            }

            var renderObject;
            if (this._isEmpty(this.reactorRegion)) {
                renderObject = $(document.body);
            } else if ($("#" + this.reactorRegion)[0]) {
                renderObject = $("#" + this.reactorRegion);
            } else if ($("." + this.reactorRegion)[0]) {
                renderObject = $("." + this.reactorRegion);
            } else {
                renderObject = $(document.body);
            }

            var context = this;
            renderObject.mousemove(function (e) {
                context._magnifyPicture(e, this);
            });
            renderObject.mouseleave(function (e) {
                for (var i = 0; i < context.images.length; i++) {
                    if (e.target == context.images[i]) {
                        $("#" + context.id).hide();
                        break;
                    }
                }
            });
            renderObject = null;
        },

        /***************************************************************************
         * 清除指定图片
         * @param images
         */
        deleteImages: function (images) {
            if (!images || !this.images) {
                return;
            }
            var array = [];
            if (images.length != null) {
                array = images;
            } else {
                array.push(images);
            }
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < this.images.length; j++) {
                    if (array[i] == this.images[j]) {
                        this.images.splice(j, 1);
                        break;
                    }
                }
            }
        },

        /***************************************************************************
         * 重置放大镜 主要用于数据重新加载后，重新设置放大镜相关属性，而不用重新new一个对象
         */
        reset: function (images) {
            var self = this;
            self.setImages(images, false);
        },

        /***************************************************************************
         * 资源销毁
         */
        destroy: function () {
            this.images = [];
        },
        /***************************************************************************
         * 设置图片，提供给外部用的，为this.images赋值
         * @param images 要添加的图片
         * @param append 是否以追加的方式加入， true: 为追加，false: 整个替换this.images
         */
        setImages: function (images, append) {
            var self = this;
            if (!images) {
                return;
            }
            self.images = this._isEmpty(self.images) || !append ? [] : self.images;
            if (images.length != null) {
                for (var i = 0; i < images.length; i++) {
                    self.images.push(images[i]);
                }
            } else {
                if (images.src != null) {
                    self.images.push(images);
                }
            }
        },

        _magnifyPicture: function (event, renderDomObject) {
            if (event.target.tagName != "IMG") {
                $("#" + this.id).hide();
                //if (typeof console != "undefined") {
                //    console.log("dom: " + this.id + " mouse out.");
                //}
                return;
            }
            var flag;
            for (var i = 0; i < this.images.length; i++) {
                if (event.target == this.images[i]) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                return;
            }
            var src = this._isEmpty(event.target.originalSrc) ? event.target.src : event.target.originalSrc;
            $("#" + this.id + " .magnifier-image").attr("src", src);
            var magnifierWrapperSize = {
                height: $("#" + this.id).outerHeight(true), width: $("#" + this.id).outerWidth(true)
            };
            $("#" + this.id).css({
                top: Math.abs(event.clientY - Math.floor(magnifierWrapperSize.height)),
                left: Math.abs(event.clientX - Math.floor(magnifierWrapperSize.width))
            });

            var imgWrapperSize = {
                height: $("#" + this.id + " .magnifier-image-wrapper").height(),
                width: $("#" + this.id + " .magnifier-image-wrapper").width()
            }
            if (!$("#" + this.id).is(":visible")) {
                //if (typeof console != "undefined") {
                //    console.log("dom: " + this.id + " is invisible.");
                //}
                var imgWrapperPosition = {};
                var temp = Math.floor(imgWrapperSize.height / 2);
                imgWrapperPosition.top = event.clientY >= temp ? (-temp + "px") : "0px";
                temp = imgWrapperSize.width + 20;
                imgWrapperPosition.left = (event.clientX >= temp) ? (-temp + "px") : (($("#" + this.id).width() + 20) + "px");
                $("#" + this.id + " .magnifier-image-wrapper").css(imgWrapperPosition);
            }

            var imageSize = {
                height: $(event.target).height(),  width: $(event.target).width()
            };
            var magnifierCss = {
                height: imageSize.height * this.rate, width: imageSize.width * this.rate,
                top: 0, left: 0
            }
            if (this._isEmpty(this.offsetX) || this._isEmpty(this.offsetY)
              || (event.offsetX - this.offsetX) > this.threshold_move_value
                || (event.offsetX - this.offsetX) > this.threshold_move_value) {
                temp = Math.floor(event.offsetX / imageSize.width * magnifierCss.width) - imgWrapperSize.width;
                magnifierCss.left = temp > 0 ? -temp : 0;
                temp = Math.floor(event.offsetY / imageSize.height * magnifierCss.height) - imgWrapperSize.height;
                magnifierCss.top = temp > 0 ? -temp : 0;
            } else {
                delete magnifierCss.top;
                delete magnifierCss.left;
            }
            //if (typeof console != "undefined") {
            //    console.log("top: " + magnifierCss.top + ", left: " + magnifierCss.left);
            //}
            $("#" + this.id + " .magnifier-image").css(magnifierCss);
            $("#" + this.id).show();
        },

        _isEmpty: function (object) {
            if (typeof object == "undefined" || object === null || object === "") {
                return true;
            }
            return false;
        }
    }

    return Magnifier;
});