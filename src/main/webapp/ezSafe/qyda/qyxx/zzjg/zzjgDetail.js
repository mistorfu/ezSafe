define([], function () {
    var Page = {
        init: function () {
            var self = this;
            self.uiInit();
            self.bindEvent();
        },
        zzjgDetail: function (data) {
            var self = this;
            self.MiniFireMore(data);
            $(".zzjg-detail-window").data("kendoWindow").center().open();

        },
        MiniFireMore: function (data) {
            var self = this;
            if (!self.mvvmInit) {
                self.viewModel = kendo.observable({
                    dataKendo: data,
                    JGLB: function () {
                        var JGLB = this.get("dataKendo").JGLB;
                        return JGLB ? JGLB.VALUE : "暂无"
                    }
                });
                kendo.bind($(".main-wrap"), self.viewModel);
                //人员信息
                var fzry = data.FZRY ? data.FZRY : {};
                var zxry = data.ZXRY ? data.ZXRY : {}

                var jgcy = data.JGCY ? data.JGCY : [];
                var newData = [];

                fzry.RYLB = "负责人员";
                zxry.RYLB = "执行人员";
                newData.push(fzry);
                newData.push(zxry);
                for(var i=0;i<jgcy.length;i++){
                    jgcy[i].RYLB = "机构成员";
                    newData.push(jgcy[i]);
                }
                for (var i = 0; i < newData.length; i++) {
                    newData[i].RYLB = newData[i].RYLB ? newData[i].RYLB : "未知";
                    newData[i].RYXM = newData[i].RYXM ? newData[i].RYXM : "未知";
                    newData[i].RYZW = newData[i].RYZW ? newData[i].RYZW : "未知";
                    newData[i].GDDH = newData[i].GDDH ? newData[i].GDDH : "未知";
                    newData[i].YDDH = newData[i].YDDH ? newData[i].YDDH : "未知";
                    newData[i].DZYX = newData[i].DZYX ? newData[i].DZYX : "未知";
                }

                /*数据表格*/
                $("#zzjg-detail-table-content").kendoListView({
                    dataSource: newData,
                    template: kendo.template($("#ryxxTemplate").html())
                });
                /*div内容换行*/
                var template = kendo.template($("#zzjgJgzzTemplate").html());
                $("#zzjgJgzz").html(template(data));


            } else {
                self.viewModel.set("dataKendo", data);
            }
            $("#zzjgFjxx").kendoListView({
                dataSource: data.FJXX,
                template: kendo.template($("#zzjgFjxxTemplate").html()),
                dataBound: function (e) {
                    $(".zzjgFjxx-container").click(function (e) {
                        var dataItem = $("#zzjgFjxx").data("kendoListView").dataItem(e.currentTarget);
                        self.imgDownload(dataItem.FJDZ,dataItem.FJMC + dataItem.FJHZ);
                    })
                }
            })

        },

        uiInit: function () {
            var self = this;
            $(".zzjg-detail-window").kendoWindow({
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
            $("#new-window-close-button").click(function () {
                $(".zzjg-detail-window").data("kendoWindow").close();
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