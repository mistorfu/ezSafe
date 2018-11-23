define([], function () {
    function Yjya(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this.options = {
            jzlx: '',
            dwid: ''
        };
        this.textReservePlan = [];
        this._init();
    }

    Yjya.prototype = {
        _init: function () {
            this._bindPageEvent();
        },
        showData: function (data) {
            if (!data) return;
            var self = this;
            //文本预案
            if (data.WBYA != null) {
                if (data.WBYA.YAWJ != null) {
                    self.textReservePlan = [data.WBYA];
                } else if (data.WBYA.length > 0) {
                    self.textReservePlan = data.WBYA;
                }
            }
            if (self.textReservePlan.length == 0) {
                if (data.MHTSYA != null && data.MHTSYA.YAWJ != null && data.MHTSYA.YAWJ != "") {
                    data.MHTSYA.WJLX = "3";
                    if (self.textReservePlan != null) {
                        self.textReservePlan = [data.MHTSYA].concat(self.textReservePlan);
                    } else {
                        self.textReservePlan = [data.MHTSYA];
                    }
                } else if (data.MHTSYA != null && data.MHTSYA.length > 0) {
                    for (i in data.MHTSYA) {
                        data.MHTSYA[i].WJLX = "3";
                    }
                    if (self.textReservePlan != null) {
                        self.textReservePlan = data.MHTSYA.concat(self.textReservePlan);
                    } else {
                        self.textReservePlan = data.MHTSYA;
                    }
                }
            }
            $("#wbya-size").text(self.textReservePlan.length);

            for (var x = 0, l = self.textReservePlan.length; x < l; x++) { //图片提前
                var trp = self.textReservePlan[x];
                if (trp.WJLX == "2") {
                    self.textReservePlan.splice(x, 1);
                    self.textReservePlan = [trp].concat(self.textReservePlan);
                }
            }
            if (data.JGHYA != null && data.JGHYA.YAWJ) {
                $("#mid-size").text(1);
                $(".mhya-jghya").click(function () {
                    $(".iframe-content").attr("src", data.JGHYA.YAWJ);
                    $(".mhya-iframe-container").fadeIn();
                    $(".mhya-container").fadeOut();
                });
            } else {
                $(".mhya-jghya").click(function () {
                    kendo.ui.ExtMessageDialog.show({
                        message: "暂无预案",
                        messageType: "error"
                    })
                });
            }
            if (data.SZHYA != null && (data.SZHYA.length > 0 || data.SZHYA.YAWJ)) {
                $("#szhya-size").text(1);
                $(".mhya-szhya").click(function () {
                    if (Array.isArray(data.SZHYA)) {
                        if (data.SZHYA.length > 0) {
                            window.Application.sendMessage("StartProcess|" + data.SZHYA[0].YAWJ);
                        }
                    } else {
                        window.Application.sendMessage("StartProcess|" + data.SZHYA.YAWJ);
                    }
                });
            } else {
                $(".mhya-szhya").click(function () {
                    kendo.ui.ExtMessageDialog.show({
                        message: "暂无数字化预案",
                        messageType: "error"
                    })
                });
            }

        },
        resize: function () {

        },
        _addIsOpen: function (href) {
            if (href.indexOf("?") > 0) {
                href += "&isopen=true";
            } else {
                href += "?isopen=true";
            }
            $("#download-a-label").attr("href", href);
            document.getElementById("download-a-label").click();
        },
        _bindPageEvent: function () {
            var self = this;
            $(".mhya-wbya").on("click", function () {
                if ($(this).hasClass("trp-window-open")) {
                    return;
                }
                var trp = self.textReservePlan;
                if (trp.length == 0) {
                    kendo.ui.ExtMessageDialog.show({
                        message: "暂无文本预案",
                        messageType: "error"
                    })
                } else {
                    if (trp.length == 1) {
                        if (trp[0].WJLX == "3") { //只有一个且是嵌入式网页，直接打开网页窗口
                            $(".iframe-content").attr("src", trp[0].YAWJ);
                            $(".mhya-iframe-container").fadeIn();
                            $(".mhya-container").fadeOut();
                        } else if (trp[0].WJLX == "1") { //只有一个且是文件，直接下载打开
                            self._addIsOpen(trp[0].YAWJ);
                        } else if (trp[0].WJLX == "2") { //只有一个图片，打开图片窗口
                            $(".pic-content").setImg(trp[0].YAWJ);
                            $(".mhya-pic-container").fadeIn();
                            $(".mhya-container").fadeOut();
                        }
                    } else { //多个的情况
                        var tmp = kendo.template($("#trp-tmp").html());
                        $(".trp-window-content-right").html(tmp(trp));
                        $("#text-reserve-plan-window").fadeIn();
                        $(this).addClass("trp-window-open");
                        //自动点击第一个内容
                        $(".trp-single-reality")[0].click();
                    }
                }
            });
            //关闭按钮
            $(".iframe-close-button").click(function () {
                $(this).parent().fadeOut();
                $(".mhya-container").fadeIn();
                $(".iframe-content").attr("src", "");
            });

            $("#trp-window-close").on("click", function () {
                $("#text-reserve-plan-window").fadeOut(200, function () {
                    $(".trp-window-content-right").html("");
                    $(".trp-window-open").removeClass("trp-window-open");
                    $(".trp-window-img").hide();
                    $(".trp-inner-iframe").hide();
                });
            });

            $(".trp-window-content-right").on("click", ".trp-single-reality", function () {
                var index = $(this).index();
                $(".trp-selected").removeClass("trp-selected");
                $(this).addClass("trp-selected");
                var trp = self.textReservePlan[index];
                if (trp.WJLX == "3") { //嵌入式网页
                    $(".trp-download-container").hide();
                    $(".trp-window-img").hide();
                    $(".trp-inner-iframe").show().attr("src", trp.YAWJ);
                } else if (trp.WJLX == "2") { //图片
                    $(".trp-download-container").hide();
                    $(".trp-inner-iframe").hide();
                    $(".trp-window-img").show().setImg(trp.YAWJ);
                } else { //文件
                    var href = trp.YAWJ;
                    if (href.indexOf("?") > 0) {
                        href += "&isopen=true";
                    } else {
                        href += "?isopen=true";
                    }
                    $(".trp-inner-iframe").hide();
                    $(".trp-window-img").hide();
                    $(".trp-download-container").css({"display": "flex"});
                    $(".download-tip").attr("href", href);
                    $(".trp-download-link").text(trp.YAMC);
                }
            }).on("dblclick", "[file-type=1]", function () {
                var index = $(this).index();
                var trp = self.textReservePlan[index];
                self._addIsOpen(trp.YAWJ);
            });
        }
    };

    return Yjya;
});