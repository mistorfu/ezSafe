define([], function () {
    function Qygk(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this.yjya = this.yjya || null;
        this.qyxq = this.qyxq || null;
        this._imageLength = 0;
        this._slideWidth = $("#qygk-multi-images").width();
        this._imageIndex = 0;
        this._picContainers = [];
        this._init();
    }

    Qygk.prototype = {
        _init: function () {
            this._bindPageEvent();
        },
        showData: function (params) {
            var self = this;
            $.ajax({
                url: CONTEXT_PATH + "/api/qyda/qyxx/qygk",
                type: "GET",
                cache: false,
                data: {
                    "qybh": params
                },
                dataType: "json",
                success: function (data) {
                    if (data && data.length > 0) {
                        for (var key in data[0]) {
                            if (typeof data[0][key] == "string") {
                                $("#detail-" + key).html(data[0][key].substring(0, 18));
                            } else if (key == "FRDB") { // 法人代表
                                $("#detail-" + key + "-RYXM").html(data[0][key]["RYXM"]);
                                $("#detail-" + key + "-GDDH").html(data[0][key]["GDDH"]);
                            } else if (key == "SSJZ") { // 所属街镇
                                $("#detail-" + key).html(data[0][key]["JZMC"]);
                            } else if (key == "SSXQ") { // 所属辖区
                                $("#detail-" + key).html(data[0][key]["XZQHMC"]);
                            } else if (key == "QYTP") { // 企业图片
                                if (typeof data[0][key].length != "number")
                                    data[0][key] = [data[0][key]];
                                // var template = kendo.template($("#qygkImageTemplate").html());
                                // $("#qygk-multi-images ul").html(template(data[0][key]));
                                self._imageLength = data[0][key].length;
                                $("#qygk-multi-images ul").width(self._slideWidth * self._imageLength);
                                $("#qygk-multi-images ul li").width(self._slideWidth);
                                self._picContainers = [];
                                for (var i = 0; i < data[0][key].length; i++) {
                                    self._picContainers.push($("#qygk-multi-images ul li:nth-child(" + (i + 1) + ")").setImg(data[0][key][i].TPDZ));
                                }
                                if (self._imageLength > 0) self._slideOne(0);
                            }
                        }
                        self.yjya.showData(data[0]);
                        self.qyxq.showData(data[0]);
                    }
                }
            });

        },
        resize: function () {
            this._slideWidth = $("#qygk-multi-images").width();
            $("#qygk-multi-images ul").width(this._slideWidth * this._imageLength);
            $("#qygk-multi-images ul li").width(this._slideWidth);
            if (document.webkitFullscreenElement || document.fullscreenElement || document.msFullscreenElement)
                $("#qygk-multi-images ul li").width("100%");
        },
        _bindPageEvent: function () {
            var self = this;

            $("#btn-next").click(function () {
                if (self._imageIndex < (self._imageLength - 1)) self._imageIndex++;
                self._slideOne(self._imageIndex);
            })

            $("#btn-prev").click(function () {
                if (self._imageIndex != 0) self._imageIndex--;
                self._slideOne(self._imageIndex);
            })
        },
        _slideOne: function (i) {
            var scrollVal = i * this._slideWidth;
            $("#qygk-multi-images").stop().animate({
                scrollLeft: scrollVal
            }, 300);
            $("#qygk-multi-images .index").html(this._imageLength + "-" + (i + 1));
            this._picContainers[i].reset();

            if (i <= 0)
                $("#btn-prev").hide();
            else
                $("#btn-prev").show();

            if (i >= this._imageLength - 1)
                $("#btn-next").hide();
            else
                $("#btn-next").show();
        }
    };

    return Qygk;
});