define([CONTEXT_PATH + '/ezSafe/qyda/qyxx/qydsj/scmbDetail/qydsjDetail.js',
    CONTEXT_PATH + '/ezSafe/qyda/qyxx/qydsj/sccnDetail/sccnDetail.js',
    CONTEXT_PATH + '/ezSafe/qyda/qyxx/qydsj/zzxkDetail/zzxkDetail.js'], function (scmb,sccn,zzxkDetail) {
            function Qydsj(options) {
                if (options) {
                    for (var key in options) {
                        this[key] = options[key];
                    }
                }
                this._init();
            }

            var qybh;

            Qydsj.prototype = {

                _init: function () {
                    this.bind();
                    this.initWindows("#zzxkWindow");
                    this.initWindows("#scmbWindow");
                    this.initWindows("#sccnWindow");
                },
                //初始化弹窗
                initWindows: function (str) {
                    $(str).kendoWindow({
                        scrollable: false,
                        width: "70%",
                        height: "80%",
                        visible: false,
                        title: false,
                        modal: true,
                        resizable: false
                    }).data("kendoWindow");
                },
                showData:function (param) {
                    this.qybh = param["qyxx.qybh"];
                    $("#switch-qbsj").click();
                },
                queryData: function (type) {
                    var self = this;
                    $("#history").remove();
                    $("#button-to-bottom").css("visibility","" +
                        "" +
                        "hidden");
                    $("#button-to-top").css("visibility","hidden");
                    $.ajax({
                        url: CONTEXT_PATH + "/api/qyda/qyxx/getQydsj",
                        type: "GET",
                        cache: false,
                        data:{
                            /* "QYBH": self.params.QYBH*/
                            //"QYXX.QYBH":"2c9080345fa04a7e015fa052018e20d3",
                            "QYXX.QYBH":self.qybh,
                            "take": type
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.length > 0) {
                                self.createLine(data);
                                self.bindLine();
                                var totalHeight = $("#history-date")[0].scrollHeight;
                                var height = $("#history").height();
                                if (totalHeight > height) {
                                    $("#button-to-bottom").css("visibility", "visible");
                                }
                            }
                        }
                    });
                },

                createLine: function (data) {
                    var template = kendo.template($("#timelineTemp").html());
                    if (data.length === 0) {
                        /* $("#down_bar").children().hide();*/
                    } else {
                        $("#button-to-top").after(template(data));
                    }
                },
                bindLine:function () {
                    /*滚动*/
                    $("#history-date").scroll(function() {
                        var totalHeight = $('#history-date')[0].scrollHeight;
                        var viewHeight = $('#history-date').height();
                        var top = $("#history-date")[0].scrollTop;
                        if (totalHeight > viewHeight) {
                            if (top <= 0) {
                                $("#button-to-top").css("visibility","hidden");
                            }
                            if (top > 0) {
                                $("#button-to-top").css("visibility","visible");
                            }
                            if (top + viewHeight + 1 >= totalHeight) {
                                $("#button-to-bottom").css("visibility","hidden");
                            } else {
                                $("#button-to-bottom").css("visibility","visible");
                            }
                        }
                    });

                    //资质许可弹窗
                    $(".detail-zzxk").click(function (e) {
                        zzxkDetail.prototype.showZzxkDetail(e);
                        $(".zzxk-download-css").click(function (e) {
                            var target = e.currentTarget;
                            var url = target.dataset.url;
                            var filename = target.dataset.filename;
                            self.imgDownload(url,filename);
                        })
                    });

                    //生产目标弹窗
                    $(".scmb-detail").click(function () {
                        //self.initWindows("#scmbWindow");
                        var xxbh = $(this).children('span')[0].innerText;
                        scmb.scmbDetail(xxbh);
                        $(".scmb-sub-file").bind("click", function (e) {
                            var dataUrl = e.currentTarget.dataset.url;
                            var fileName = e.currentTarget.dataset.filename;
                            self.imgDownload(dataUrl, fileName);
                        })


                    })

                    //生产承诺弹窗
                    $(".sccn-detail").click(function () {
                        //self.initWindows("#sccnWindow");
                        var xxbh = $(this).children('span')[0].innerText;
                        sccn.sccnDetail(xxbh);
                    });
                },
                resize: function () {

                },
                bind: function () {
                    self = this;
                    $(".sub-page-switch").click(function () {
                        if (!$(this).hasClass("selected")) {
                            $(this).siblings().removeClass("selected");
                            $(this).addClass("selected");
                            var subPageId = "#content-" + $(this).attr("id").substring(7);
                            $(subPageId).siblings().removeClass("selected");
                            $(subPageId).addClass("selected");
                        }
                    })
                    $(".sub-page-switch").click(function () {
                        var type = $(this).attr("value");
                        self.queryData(type);
                    })

                    /*点击标记*/
                    $("#button-to-top").click(function () {
                        var viewHeight = $('#history-date').height();
                        var top = $("#history-date")[0].scrollTop;
                        $("#history-date").scrollTop(top-viewHeight);

                    })
                    $("#button-to-bottom").click(function () {
                        var viewHeight = $('#history-date').height();
                        var top = $("#history-date")[0].scrollTop;
                        $("#history-date").scrollTop(top+viewHeight);
                    })
                },

                //图片url
                imgDownload: function (url, filename) {
                    var browserIsIe = this.browserIsIe();

                    if (browserIsIe) {
                        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                        save_link.href = url;
                        save_link.download = filename;
                        var event = document.createEvent('MouseEvents');
                        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        save_link.dispatchEvent(event);
                    } else {
                        window.location.href = CONTEXT_PATH + "/api/qyda/qyxx/downLoadQyxxPic?dataUrl=" + url + "&fileName=" + filename;
                    }
                },

                //判断是否为Trident内核浏览器(IE等)函数
                browserIsIe: function () {
                    if (!!window.ActiveXObject || "ActiveXObject" in window) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            return Qydsj;
});