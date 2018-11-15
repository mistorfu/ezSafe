define(['lib/domReady!flfgDetail', 'ezviewCommon'], function (dom, common) {
    var Page = {

        flfgDetail: function (data) {
            var self = this;
            if (data.FJXX === undefined || data.FJXX === null || data.FJXX.length === 0) {
                $("#flfgDownloadButton").hide();
            } else if (data.FJXX[0].FJDZ === undefined || data.FJXX[0].FJDZ === "" ||  data.FJXX[0].FJDZ === null) {
                $("#flfgDownloadButton").hide();
            } else {
                $("#flfgDownloadButton").show();
            }
            data.WJBH = data.WJBH ? data.WJBH : "未知";
            data.QCRY = data.QCRY ? data.QCRY : "未知";
            data.PZRY = data.PZRY ? data.PZRY : "未知";
            data.FBRQ = data.FBRQ ? data.FBRQ : "未知";
            data.YXRQ = data.YXRQ ? data.YXRQ : "未知";
            data.BZXX = data.BZXX ? data.BZXX : "未知";
            data.WJNR = data.WJNR ? data.WJNR : "未知";
            $("#flfg-detail-title").html(data.WJMC+"详情");
            $(".flfg-detail-window").data("kendoWindow").center().open();
            self.editInfo(data);

        },

        init: function () {
            var self = this;
            self.uiInit();
            self.bindEvent();
        },

        uiInit: function () {
            var self = this;
            $(".flfg-detail-window").kendoWindow({
                scrollable: false,
                width: "70%",
                height: "80%",
                visible: false,
                title: false,
                modal: true,
                resizable: false
            }).data("kendoWindow");

            $(".miniFire-div").hover(function (e) {
                $(this).attr("title", e.currentTarget.innerText);
            });
        },

        bindEvent: function () {
            var self = this;
            $("#new-flfgWindow-close-button").click(function () {
                $(".flfg-detail-window").data("kendoWindow").close();
            });
        },

        editInfo: function (data) {
            var self = this;
            if (!self.mvvmInit) {
                self.viewModel = kendo.observable({
                    dataKendo: data
                });
                kendo.bind($(".flfgMiniFireEdit-wrap"), self.viewModel);
                self.mvvmInit = true;
            } else {
                self.viewModel.set("dataKendo", data);
            }
            $("#flfgFjxx").kendoListView({
                dataSource: data.FJXX,
                template: kendo.template($("#flfgFjxxTemplate").html()),
                dataBound: function (e) {
                    $(".flfgFjxx-container").click(function (e) {
                        var dataItem = $("#flfgFjxx").data("kendoListView").dataItem(e.currentTarget);
                        self._addIsOpen(dataItem.FJDZ);
                    })
                    $(".flfgFjxx-container").hover(function (e) {
                        $(this).attr("title", e.currentTarget.innerText);
                    });
                }
            })
        },

        _addIsOpen: function (href) {
            if (href.indexOf("?") > 0) {
                href += "&isopen=true";
            } else {
                href += "?isopen=true";
            }
            $("#download-a-label").attr("href", href);
            document.getElementById("download-a-label").click();
        }
    };

    Page.init();
    return Page;
});