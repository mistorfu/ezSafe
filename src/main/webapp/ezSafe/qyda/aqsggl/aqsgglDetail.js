define([], function () {
    function AqsgglDetail(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
        this.viewModel = this.viewModel || null;
    }

    AqsgglDetail.prototype = {
        _init: function () {
            this._bindMVVM();
        },
        columns: [
            {
                field: "FJMC",
                title: "附件名称",
                width: "50%",
                template: "<span class='fjxx-fjmc'></span>",
                headerAttributes: {
                    "class": "table-header-cell"
                }
            }, {
                field: "FJLX",
                title: "附件类型",
                width: "20%",
                template: "<span class='fjxx-fjlx'></span>",
                headerAttributes: {
                    "class": "table-header-cell"
                }
            }, {
                field: "FJMS",
                title: "附件描述",
                width: "30%",
                template: "<span class='fjxx-fjms'></span>",
                headerAttributes: {
                    "class": "table-header-cell"
                }
            }],

        _bindMVVM: function () {
            this.viewModel = kendo.observable({
                dataKendo: null
            });
            kendo.bind($("#detail-container"), this.viewModel);
        },
        showData: function (data) {
            if (data) {
                this.detailData(data);
                this.viewModel.set("dataKendo", data);
            } else {
                this.initGrid();
                this.viewModel.set("dataKendo", null);
            }
        },
        detailData: function(data){
            var self = this;
            if (data.SGFJ) {
                $("#sgfj-list").kendoGrid({
                    dataSource: data.SGFJ,
                    dataBound: function () {
                        fjxx(data.SGFJ);
                    },
                    columns: self.columns
                }).data("kendoGrid")
            }
            if (data.ZGFJ) {
                $("#zgfj-list").kendoGrid({
                    dataSource: data.ZGFJ,
                    dataBound: function () {
                        fjxx(data.ZGFJ);
                    },
                    columns: self.columns
                }).data("kendoGrid")
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
        },
        initGrid: function(){
            var self = this;
            $(".fjxx-list").kendoGrid({
                dataSource: [],
                columns: self.columns
            });
        },
        resize: function () {

        }

    };

    return AqsgglDetail;
});