define([], function () {
    function AqyhglDetail(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
        this.viewModel = this.viewModel || null;
    }

    AqyhglDetail.prototype = {
        _init: function () {
            this.bind();
            this._bindMVVM();
        },
        bind: function () {
            //关闭安全隐患详情的弹窗
            $("#zgjl-xq-close-button").click(function () {
                $("#aqyhgl-zgjl-xq-win").data("kendoWindow").close();
            });
        },
        options: {
            gridJcfj: null,
            gridZgjl: null
        },
        columnsJcfj: [
            {
                field: "FJMC",
                title: "附件名称",
                width: "50%",
                template: "<a class='fjxx-fjmc' title='点击下载文件'></a>",
                headerAttributes: {
                    "class": "table-header-cell fj-title",
                    "style": "color: #d4edff; font-weight:unset; font-size: 0.93vw;"
                }
            }, {
                field: "FJLX",
                title: "附件类型",
                width: "20%",
                template: "<span class='fjxx-fjlx'></span>",
                headerAttributes: {
                    "class": "table-header-cell fj-title",
                    "style": "color: #d4edff; font-weight:unset; font-size: 0.93vw;"
                }
            }, {
                field: "FJMS",
                title: "附件描述",
                width: "30%",
                template: "<span class='fjxx-fjms'></span>",
                headerAttributes: {
                    "class": "table-header-cell",
                    "style": "color: #d4edff; font-weight:unset; font-size: 0.93vw;"
                }
            }],
        columnsZgjl: [
            {
                field: "ZGJL.ZGSJ",
                title: "整改时间",
                width: "40%",
                template: "<span class='zgjl-zgsj'></span>",
                headerAttributes: {
                    "class": "table-header-cell",
                    "style": "color: #d4edff; font-weight:unset; font-size: 0.93vw;"
                }
            }, {
                field: "ZGJL.ZGJG.VALUE",
                title: "整改结果",
                width: "43%",
                template: "<span class='zgjl-zgjg'></span>",
                headerAttributes: {
                    "class": "table-header-cell",
                    "style": "color: #d4edff; font-weight:unset; font-size: 0.93vw;"
                }
            }, {
                template: "<span class='grid-zgjl-detail'>详情</span>",
                title: "操作",
                width: "17%",
                headerAttributes: {
                    "class": "table-header-cell",
                    "style": "color: #d4edff; font-weight:unset; font-size: 0.93vw; text-align: center;"
                }
            }],
        initGrid: function(){
            var self = this;
            self.options.gridJcfj = $(".fjxx-list").kendoGrid({
                dataSource: [],
                columns: self.columnsJcfj
            });
            self.options.gridZgjl = $(".zgjl-list").kendoGrid({
                dataSource: [],
                columns: self.columnsZgjl
            });
        },
        _bindMVVM: function () {
            this.viewModel = kendo.observable({
                dataKendo: null
            });
            kendo.bind($("#detail-container"), this.viewModel);
        },
        showData: function (data) {
            if (data) {
                this.initGrid();
                this.detailData(data);
                this.viewModel.set("dataKendo", data);
            } else {
                this.initGrid();
                this.viewModel.set("dataKendo", null);
            }
        },
        detailData: function(data){
            var self = this;
            if (data.JCFJ) {
                self.options.gridJcfj = $("#jcfj-list").kendoGrid({
                    dataSource: data.JCFJ,
                    dataBound: function (e) {
                        fjxx(data.JCFJ);
                        $(".fjxx-fjmc").click(function () {
                            var dataItem = e.sender.dataItem($(this).closest("tr"));
                            $(".fjxx-fjmc").attr('href', dataItem.FJDZ)
                        })
                    },
                    columns: self.columnsJcfj
                });
            }
            if (data.ZGJL) {
                self.options.gridZgjl= $("#zgjl-list").kendoGrid({
                    dataSource: data.ZGJL,
                    dataBound: function (e) {
                        zgjl(data.ZGJL);
                       /* var data = e.sender.dataSource.data();*/
                        $(".grid-zgjl-detail").click(function (){
                            var dataItem = e.sender.dataItem($(this).closest("tr"));
                            var zgjlTemplate = kendo.template($("#zgjl-xq-template").html());
                            var result = zgjlTemplate(dataItem);
                            $("#zgjl-xq").html(result);
                            $("#zgjl-xq-title").html("整改记录详情");
                            $("#aqyhgl-zgjl-xq-win").data("kendoWindow").center().open();
                        });
                    },
                    columns: self.columnsZgjl
                });
            }

            function fjxx(data) {
                $.each(data, function (index, row) {
                    var fjmc_cell = $('tr[data-uid="' + row.uid + '"] .fjxx-fjmc');
                    if (row.FJMC) fjmc_cell.text(row.FJMC);

                    var fjlx_cell = $('tr[data-uid="' + row.uid + '"] .fjxx-fjlx');
                    if (row.FJLX) fjlx_cell.text(row.FJLX);

                    var fjms_cell = $('tr[data-uid="' + row.uid + '"] .fjxx-fjms');
                    if (row.FJMS) fjms_cell.text(row.FJMS);
                });
            }

            function zgjl(data) {
                $.each(data, function (index, row) {
                    var zgsj_cell = $('tr[data-uid="' + row.uid + '"] .zgjl-zgsj');
                    if (row.ZGSJ) zgsj_cell.text(row.ZGSJ);

                    var zgjg_cell = $('tr[data-uid="' + row.uid + '"] .zgjl-zgjg');
                    if (row.ZGJG.VALUE) zgjg_cell.text(row.ZGJG.VALUE);
                });
            }
        },
        resize: function () {

        }

    };

    return AqyhglDetail;
});