define([] ,function () {
    var Page = {
        addClick: null,

        mark: 0,

        aqyhxqc: function (data) {
            var self = this;
            $("#aqyhdetil-window").data("kendoWindow").center().open();
            self.editInfo(data);

        },

        init: function () {
            var self = this;
            self.uiInit();
            self.bindEvent();
        },

        uiInit: function () {
            var self = this;
            $("#aqyhdetil-window").kendoWindow({
                scrollable: false,
                width: "60%",
                height: "75%",
                visible: false,
                title: false,
                modal: true,
                resizable: false
            }).data("kendoWindow");


        },

        bindEvent: function () {
            var self = this;
            $("#aqyh-window-close-button").click(function () {
                $("#aqyhdetil-window").data("kendoWindow").close();
            });
            /*$("#flfgDownloadButton").click(function (e) {
                var flfgDetail = self.viewModel.get("dataKendo");
                self.CCLJ = flfgDetail.FJXX[0].FJDZ;
                self._addIsOpen(self.CCLJ);
            });*/
        },

        editInfo: function (data) {
            var self = this;
            if (!self.mvvmInit) {
                self.viewModel = kendo.observable({
                    dataKendo: data,
                });
                kendo.bind($("#aqyhEdit"), self.viewModel);
                self.mvvmInit = true;
            } else {
                self.viewModel.set("dataKendo",data);
            }

            $("#aqyhFjxx").kendoListView({
                dataSource: data.FJXX,
                template: kendo.template($("#aqyhFjxxTemplate").html()),
                dataBound: function () {
                    $(".aqyh-fjxx").click(function (e) {
                        var dataItem = $("#aqyhFjxx").data("kendoListView").dataItem(e.currentTarget);
                        self._addIsOpen(dataItem.FJDZ,dataItem.FJMC+dataItem.FJHZ);
                    });
                    $(".aqyh-fjxx").hover(function (e) {
                        $(this).attr("title", e.currentTarget.innerText);
                    });
                }
            })

            $("#zgfjFjxx").kendoListView({
                dataSource: data.JCFJ,
                template: kendo.template($("#aqyhFjxxTemplate").html()),
                dataBound: function (e) {
                    $(".aqyh-fjxx").click(function (e) {
                        var dataItem = $("#zgfjFjxx").data("kendoListView").dataItem(e.currentTarget);
                        self._addIsOpen(dataItem.FJDZ,dataItem.FJMC+dataItem.FJHZ);
                    })
                    $(".aqyh-fjxx").hover(function (e) {
                        $(this).attr("title", e.currentTarget.innerText);
                    });
                }
            })
        },
//
        //图片url
        _addIsOpen: function (url, filename) {
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