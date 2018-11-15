define([], function () {
    var Page = {
        init: function () {
            var self = this;
            self.uiInit();
            self.bindEvent();
        },
        aqsgDetail: function (data) {
            var self = this;
            $("#bdzyWindow").data("kendoWindow").center().open();
            console.log(data);
            $.ajax({
                url: CONTEXT_PATH + "/api/aqsg/getaqsgxq",
                type: "POST",
                cache: false,
                dataType: "json",
                data: {
                    "XXBH": data
                },
                success:function (data) {
                    self.MiniFireMore(data);

                }
            });


        },
        MiniFireMore: function (data) {
            var self = this;
            if (!self.mvvmInit) {
                self.viewModel = kendo.observable({
                    dataKendo: data,
                    JGLB: function () {
                        var JGLB = this.get("dataKendo").JGLB;
                        return JGLB ? JGLB.VALUE : ""
                    }
                });
                kendo.bind($(".sgminiFireEdit-wrap"), self.viewModel);
                self.mvvmInit = true;
            } else {
                self.viewModel.set("dataKendo", data);
            }
            $("#sgFJxx").kendoListView({
                dataSource: data[0].SGFJ,
                template: kendo.template($("#fjjavascriptTemplate").html()),
                dataBound: function (e) {
                    $(".sgflfgFjxx-container").click(function (e) {
                        //获取当前对象
                        var dataItem = $("#sgFJxx").data("kendoListView").dataItem(e.currentTarget);
                        self.imgDownload(dataItem.FJDZ,dataItem.FJMC+dataItem.FJHZ);
                        //self._addIsOpen(dataItem.FJDZ);
                        //self.downloadFile(dataItem.FJDZ,dataItem.FJMC,"image/octet-stream");
                    })
                    $(".sgflfgFjxx-container").hover(function (e) {
                        $(this).attr("title", e.currentTarget.innerText);
                    });
                }
            })
            $("#sgZGFjxx").kendoListView({
                dataSource: data[0].ZGFJ,
                template: kendo.template($("#zgjavascriptTemplate").html()),
                dataBound: function (e) {
                    $(".sgflfgFjxx-container").click(function (e) {
                        var dataItem = $("#sgZGFjxx").data("kendoListView").dataItem(e.currentTarget);
                        self.imgDownload(dataItem.FJDZ,dataItem.FJMC+dataItem.FJHZ);
                        //self._addIsOpen(dataItem.FJDZ);
                        //self.downloadFile(dataItem.FJDZ,dataItem.FJMC,"image/octet-stream");
                    })
                    $(".sgflfgFjxx-container").hover(function (e) {
                        $(this).attr("title", e.currentTarget.innerText);
                    });
                }
            })


        },

        uiInit: function () {
            var self = this;
            $("#bdzyWindow").kendoWindow({
                scrollable: false,
                width: "75%",
                height: "85%",
                visible: false,
                title: false,
                modal: true,
                resizable: false
            }).data("kendoWindow");
        },

        bindEvent: function () {
            var self = this;
            $("#sgnew-window-close-button").click(function () {
                $("#bdzyWindow").data("kendoWindow").close();
            });


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

    };

    Page.init();
    return Page;
});