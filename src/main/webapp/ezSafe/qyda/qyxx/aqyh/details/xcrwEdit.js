define([CONTEXT_PATH + '/ezSafe/qyda/qyxx/aqyh/details/aqyhDetail.js'], function (aqyhContent) {
    var Page = {
        init: function () {
            var self = this;
            self.uiInit();
            self.bindEvent();
        },
        xcrwDetail: function (data) {
            var self = this;
            $("#aqyhWindow").data("kendoWindow").center().open();
            self.editInfo(data);
        },
        MiniFireMore: function (data) {
            var self = this;

        },

        uiInit: function () {
            var self = this;
            $("#aqyhWindow").kendoWindow({
                scrollable: false,
                width: "70%",
                height: "80%",
                visible: false,
                title: false,
                modal: true,
                resizable: false
            }).data("kendoWindow");
        },

        bindEvent: function () {
            var self = this;
            $("#xcrw-new-window-close-button").click(function () {
                $("#aqyhWindow").data("kendoWindow").close();
            });
            $(".miniFire-input").click(function (e) {

            });

        },

        editInfo: function (data) {
            var self = this;

            var sjxcnr = "";
            var jhxcnr = "";
            if(data.SJXCNR){
                sjxcnr = data.SJXCNR instanceof Array?data.SJXCNR.map(obj=>{return ("巡检点位："+obj.XJDW+"巡检说明:"+obj.XJSM)}).join(";"):!data.SJXCNR.XJDW?"":"巡检点位："+data.SJXCNR.XJDW+"巡检说明："+data.SJXCNR.XJSM;
            }
            if(data.JHXCNR){
                jhxcnr = data.JHXCNR instanceof Array?data.JHXCNR.map(obj=>{return ("巡检点位："+obj.XJDW+"巡检说明:"+obj.XJSM)}).join(";"):!data.JHXCNR.XJDW?"":"巡检点位："+data.JHXCNR.XJDW+"巡检说明："+data.JHXCNR.XJSM;
            }
           $("#xcrw-detail-title").text(data && data.RWMC?data.RWMC:"巡查任务");
            if (!self.mvvmInit) {

                self.viewModel = kendo.observable({
                    dataKendo: data,
                    sjxcnr:sjxcnr,
                    jhcxnr: jhxcnr,
                    xcfl:data.XCFL?data.XCFL.VALUE:"网格巡查"
                });
                kendo.bind($("#xcrw"), self.viewModel);
                self.mvvmInit = true;
            } else {
                self.viewModel.set("dataKendo", data);
                self.viewModel.set("xcfl", data.XCFL?data.XCFL.VALUE:"网格巡查");
            }

            $("#xcrwFjxx").kendoListView({
                dataSource: data.FJXX,
                template: kendo.template($("#xcrwFjxxTemplate").html()),
                dataBound: function (e) {
                    $(".aqyh-fjxx-item").click(function (e) {
                        var dataItem = $("#xcrwFjxx").data("kendoListView").dataItem(e.currentTarget);
                        self._addIsOpen(dataItem.FJDZ,dataItem.FJMC+dataItem.FJHZ);
                    })
                    $(".aqyh-fjxx-item").hover(function (e) {
                        $(this).attr("title", e.currentTarget.innerText);
                    });
                }
            });

            $("#xcrwYhxx").kendoListView({
                dataSource: data.YHXQ,
                template: kendo.template($("#xcrwYhxxTemplate").html()),
                dataBound: function (e) {
                    $(".yhnr-item").click(function (e) {
                        var dataItem = $("#xcrwYhxx").data("kendoListView").dataItem(e.currentTarget);
                        //打開隱患詳情
                         aqyhContent.aqyhxqc(dataItem);

                    })
                    $(".yhnr-item").hover(function (e) {
                        $(this).attr("title", e.currentTarget.innerText);
                    });
                }
            })

            if(data.YHXQ!=null){

            }


        },


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