define([], function () {
    function XcxxglDetail(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
        this.viewModel = this.viewModel || null;
    }

    XcxxglDetail.prototype = {
        _init: function () {
            this.viewModel = kendo.observable({
                dataKendo : null
            });
            kendo.bind($("#detail-container"), this.viewModel);
        },
        options: {
            gridJhxcnr: null,
            gridSjxcnr: null,
            gridFjxx:null,
            gridYhxx:null
        },
        showData: function (data) {
            if (data) {
                this._bindMVVM(data);
                this.viewModel.set("dataKendo", data);
            } else {
                $("#jhxcnr-list").html("");
                $("#sjxcnr-list").html("");
                $("#fjxx-list").html("");
                $("#yhxx-list").html("");
                $(".xcry").val("");
                this.viewModel.set("dataKendo", null);
            }
        },
        _bindMVVM: function (data) {
            var self = this;
            if(data) {
                if(data.JHXCNR){
                    if (!data.JHXCNR[0]) {
                        var arr = new Array();
                        arr.push(data.JHXCNR);
                        self.options.gridJhxcnr = $("#jhxcnr-list").kendoGrid({
                            dataSource: arr,
                            dataBound: function () {
                                jhxcnr(arr);
                            },
                            columns: [
                                {
                                    field: "XJDW",
                                    title: "巡检点位",
                                    width: "50%",
                                    template: "<span class='jhxjdw'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                },
                                {
                                    field: "XJSM",
                                    title: "巡检说明",
                                    width: "50%",
                                    template: "<span class='jhxjsm'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }
                            ]
                        });
                    } else {
                        self.options.gridJhxcnr = $("#jhxcnr-list").kendoGrid({
                            dataSource: data.JHXCNR,
                            dataBound: function () {
                                jhxcnr(data.JHXCNR);
                            },
                            columns: [
                                {
                                    field: "XJDW",
                                    title: "巡检点位",
                                    width: "50%",
                                    template: "<span class='jhxjdw'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                },
                                {
                                    field: "XJSM",
                                    title: "巡检说明",
                                    width: "50%",
                                    template: "<span class='jhxjsm'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }
                            ]
                        });
                    }
                }else {
                    var a=[];
                    self.options.gridJhxcnr = $("#jhxcnr-list").kendoGrid({
                        dataSource: a,
                        dataBound: function () {
                            jhxcnr(a);
                        },
                        columns: [
                            {
                                field: "XJDW",
                                title: "巡检点位",
                                width: "50%",
                                template: "<span class='jhxjdw'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            },
                            {
                                field: "XJSM",
                                title: "巡检说明",
                                width: "50%",
                                template: "<span class='jhxjsm'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            }
                        ]
                    });
                }

                if(data.SJXCNR){
                    if (!data.SJXCNR[0]) {
                        var sj = new Array();
                        sj.push(data.SJXCNR);
                        self.options.gridSjxcnr = $("#sjxcnr-list").kendoGrid({
                            dataSource: sj,
                            dataBound: function () {
                                sjxcnr(sj);
                            },
                            columns: [
                                {
                                    field: "XJDW",
                                    title: "巡检点位",
                                    width: "50%",
                                    template: "<span class='sjxjdw'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                },
                                {
                                    field: "XJSM",
                                    title: "巡检说明",
                                    width: "50%",
                                    template: "<span class='sjxjsm'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }
                            ]
                        });
                    } else {
                        self.options.gridSjxcnr = $("#sjxcnr-list").kendoGrid({
                            dataSource: data.SJXCNR,
                            dataBound: function () {
                                sjxcnr(data.SJXCNR);
                            },
                            columns: [
                                {
                                    field: "XJDW",
                                    title: "巡检点位",
                                    width: "50%",
                                    template: "<span class='sjxjdw'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                },
                                {
                                    field: "XJSM",
                                    title: "巡检说明",
                                    width: "50%",
                                    template: "<span class='sjxjsm'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }
                            ]
                        });
                    }
                }else {
                    var b=[];
                    self.options.gridSjxcnr = $("#sjxcnr-list").kendoGrid({
                        dataSource: b,
                        dataBound: function () {
                            sjxcnr(b);
                        },
                        columns: [
                            {
                                field: "XJDW",
                                title: "巡检点位",
                                width: "50%",
                                template: "<span class='sjxjdw'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            },
                            {
                                field: "XJSM",
                                title: "巡检说明",
                                width: "50%",
                                template: "<span class='sjxjsm'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            }
                        ]
                    });
                }

                if (data) {
                    var rwbh = data.RWBH;
                    self.options.gridYhxx = $("#yhxx-list").kendoGrid({
                        dataSource: {
                            transport: {
                                read: {
                                    url: CONTEXT_PATH + "/api/qyda/xcxxgl/getYhxx?rwbh=" + rwbh,
                                    dataType: "json",
                                    cache: false,
                                    type: "GET"
                                }
                            },
                            requestEnd: function (e) {

                            },
                            schema: {
                                data: function (d) {
                                    return d.data;
                                },
                                total: function (d) {
                                    return d.total;
                                }
                            },
                            serverPaging: true
                        },
                        dataBound: function (e) {
                            var a = e.sender.dataSource.data();
                            yhxx(a);
                        },
                        columns: [
                            {
                                field: "YHNR",
                                title: "隐患内容",
                                width: "50%",
                                template: "<span class='yhnr'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            },
                            {
                                field: "YHJB.VALUE",
                                title: "隐患级别",
                                width: "50%",
                                template: "<span class='yhjb'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            }
                        ]
                    });
                }

                if (data.FJXX) {
                    self.options.gridFjxx = $("#fjxx-list").kendoGrid({
                        dataSource: data.FJXX,
                        dataBound: function () {
                            fjxx(data.FJXX);
                        },
                        columns: [
                            {
                                field: "FJMC",
                                title: "附件名称",
                                width: "50%",
                                template: "<span class='fjmc'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            }, {
                                field: "FJLX",
                                title: "附件类型",
                                width: "20%",
                                template: "<span class='fjlx'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            }, {
                                field: "FJMS",
                                title: "附件描述",
                                width: "30%",
                                template: "<span class='fjms'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            }]
                    });
                } else {
                    var d=[];
                    self.options.gridFjxx = $("#fjxx-list").kendoGrid({
                        dataSource: d,
                        dataBound: function () {
                            fjxx(d);
                        },
                        columns: [
                            {
                                field: "FJMC",
                                title: "附件名称",
                                width: "50%",
                                template: "<span class='fjmc'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            }, {
                                field: "FJLX",
                                title: "附件类型",
                                width: "20%",
                                template: "<span class='fjlx'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            }, {
                                field: "FJMS",
                                title: "附件描述",
                                width: "30%",
                                template: "<span class='fjms'></span>",
                                headerAttributes: {
                                    "class": "table-header-cell"
                                }
                            }]
                    });
                }

                this.viewModel = kendo.observable({
                    JHXCRY: function () {
                        var JHXCRY = data.JHXCRY;
                        var jhry = [];
                        for (var i = 0; i < JHXCRY.length; i++) {
                            jhry.push(JHXCRY[i].RYXM);
                        }
                        return jhry;
                    },
                    SJXCRY: function () {
                        var SJXCRY = data.SJXCRY;
                        var sjry = [];
                        for (var i = 0; i < SJXCRY.length; i++) {
                            sjry.push(SJXCRY[i].RYXM);
                        }
                        return sjry;
                    },
                });
                kendo.bind($("#detail-container"), this.viewModel);

                function fjxx(data) {
                    $.each(data, function (index, row) {
                        var fjmc_cell = $('tr[data-uid="' + row.uid + '"] .fjmc');
                        if (row.FJMC) fjmc_cell.text(row.FJMC);

                        var fjlx_cell = $('tr[data-uid="' + row.uid + '"] .fjlx');
                        if (row.FJLX) fjlx_cell.text(row.FJLX);

                        var fjms_cell = $('tr[data-uid="' + row.uid + '"] .fjms');
                        if (row.FJMS) fjms_cell.text(row.FJMS);
                    });
                }

                function jhxcnr(data) {
                    $.each(data, function (index, row) {
                        var xjdw_cell = $('tr[data-uid="' + row.uid + '"] .jhxjdw');
                        if (row.XJDW) xjdw_cell.text(row.XJDW);

                        var xjsm_cell = $('tr[data-uid="' + row.uid + '"] .jhxjsm');
                        if (row.XJSM) xjsm_cell.text(row.XJSM);
                    });
                }

                function sjxcnr(data) {
                    $.each(data, function (index, row) {
                        var xjdw_cell = $('tr[data-uid="' + row.uid + '"] .sjxjdw');
                        if (row.XJDW) xjdw_cell.text(row.XJDW);

                        var xjsm_cell = $('tr[data-uid="' + row.uid + '"] .sjxjsm');
                        if (row.XJSM) xjsm_cell.text(row.XJSM);
                    });
                }

                function yhxx(data) {
                    $.each(data, function (index, row) {
                        var yhnr_cell = $('tr[data-uid="' + row.uid + '"] .yhnr');
                        if (row.YHNR) yhnr_cell.text(row.YHNR);

                        var yhjb_cell = $('tr[data-uid="' + row.uid + '"] .yhjb');
                        if (row.YHJB) yhjb_cell.text(row.YHJB.VALUE);
                    });
                }
            }
        },
    };
    return XcxxglDetail;
});