define([CONTEXT_PATH + '/ezSafe/qyda/qyxx/zzjg/zzjgDetail.js'], function (zzjg) {
    function Zzjg(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
    }

    Zzjg.prototype = {
        _init: function () {
            var self = this;
        },

        showData: function (param) {
            var self = this;
            if (self.dataSource == null) {
                self.dataSource = new kendo.data.DataSource({
                    transport: {
                        read:{
                            url: CONTEXT_PATH + "/api/zzjg/getZzjg",
                            dataType: "json",
                            data: param,
                            type: "POST",
                            cache: true,
                            success: function (result) {
                            }
                        }
                    },
                    schema:{
                        data: function (result) {
                            var zzjg = result.data;
                            if (zzjg != null && zzjg.length > 0) {
                                //设置组织机构详情
                                for (var x in zzjg) {
                                    zzjg[x].index = Number(x) + 1;
                                    zzjg[x].JGMC = zzjg[x].JGMC ? zzjg[x].JGMC : "未知";
                                    zzjg[x].CLRQ = zzjg[x].CLRQ ? zzjg[x].CLRQ : "未知";
                                    zzjg[x].JGZZ = zzjg[x].JGZZ ? zzjg[x].JGZZ : "未知";
                                    zzjg[x].JGBH = zzjg[x].JGBH ? zzjg[x].JGBH : "未知";
                                    zzjg[x].BZXX = zzjg[x].BZXX ? zzjg[x].BZXX : "未知";
                                    //zzjg[x].FZRY.RYXM = zzjg[x].FZRY.RYXM ? zzjg[x].FZRY.RYXM : "未知";
                                    //zzjg[x].FZRY.YDDH = zzjg[x].FZRY.YDDH ? zzjg[x].FZRY.YDDH : "未知";
                                    zzjg[x].JGRS = zzjg[x].JGRS ? zzjg[x].JGRS : "未知";
                                    zzjg[x].JGLB.VALUE = zzjg[x].JGLB.VALUE ? zzjg[x].JGLB.VALUE : "未知";
                                }
                            }
                            return zzjg;
                        },
                        total: function(result) {
                            return result.total;
                        }
                    },
                    serverPaging: true,
                    pageSize: 10
                });
            } else {
                self.dataSource.options.transport.read.data = param;
                self.dataSource.page(1);
            }

            if (self.listView == null) {
                self.listView = $("#zzjg-table-content").kendoListView({
                    template: kendo.template($("#zzjgTemplate").html()),
                    dataSource: self.dataSource,
                    /**
                     * 点击查看文件
                     */
                    dataBound: function () {
                        $(".zzjg-detailButton").click(function (e) {
                            var dataItem = self.listView.dataItem(e.currentTarget);
                            $("#zzjg-detail-title").html(dataItem.JGMC);
                            zzjg.zzjgDetail(dataItem);
                        });
                    }
                }).data("kendoListView");
            }

            if (self.pager == null) {
                self.pager = $("#ZzjgPager").kendoPager({
                    dataSource: self.dataSource,
                    buttonCount: 3
                })
            }

            $(".miniFire-div").hover(function (e) {
                $(this).attr("title", e.currentTarget.innerText);
            });
        },
        resize: function () {

        }
    };

    return Zzjg;
});