define([CONTEXT_PATH + '/ezSafe/qyda/qyxx/flfg/flfgDetail.js'], function (flfgDetail) {
    function Flfg(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
    }

    Flfg.prototype = {
        _init: function () {
        },
        showData: function (params) {
            var self = this;
            if (self.dataSource == null) {
                self.dataSource = new kendo.data.DataSource({
                    transport: {
                        read:{
                            url: CONTEXT_PATH + "/api/flfg/getFlfg",
                            dataType: "json",
                            data: params,
                            type: "POST",
                            cache: true,
                            success: function (result) {
                            }
                        }

                    },
                    schema:{
                        data: function (result) {
                            var flfg = result.data;
                            if (flfg != null && flfg.length > 0) {
                                //设置法律法规详情
                                for (var x in flfg) {
                                    flfg[x].index = Number(x) + 1;
                                    flfg[x].WJMC = flfg[x].WJMC ? flfg[x].WJMC : "未知";
                                    flfg[x].WJLX.VALUE = flfg[x].WJLX.VALUE ? flfg[x].WJLX.VALUE : "未知";
                                    flfg[x].FBRQ = flfg[x].FBRQ ? flfg[x].FBRQ : "未知";
                                    flfg[x].FBDW = flfg[x].FBDW ? flfg[x].FBDW : "未知";
                                }
                            }
                            return flfg;
                        },
                        total: function(result) {
                            self.JGDM = result.JGDM?result.JGDM:"未知";
                            return result.total;
                        }
                    },
                    serverPaging: true,
                    pageSize: 10
                });
            } else {
                self.dataSource.options.transport.read.data = params;
                self.dataSource.page(1);
            }

           if (self.listView == null) {
                self.listView = $("#flfg-table-content").kendoListView({
                template: kendo.template($("#flfgTemplate").html()),
                dataSource: self.dataSource,
                    /**
                     * 点击查看文件
                     */
                dataBound: function () {
                    $(".flfg-detailButton").click(function (e) {
                        var dataItem = self.listView.dataItem(e.currentTarget);
                        flfgDetail.flfgDetail(dataItem);
                    });
                }
                }).data("kendoListView");
            }

            if (self.pager == null) {
                self.pager = $("#FlfgPager").kendoPager({
                    dataSource: self.dataSource,
                    buttonCount: 3
                })
            }
        },
        resize: function () {

        }
    };

    return Flfg;
});