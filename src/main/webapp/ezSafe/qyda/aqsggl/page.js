require([CONTEXT_PATH + '/ezSafe/lib_js/avatarConfig.js'], function () {
    require(['jquery'], function () {
        require(['lib/domReady!', 'ezviewCommon', 'comRegionTree','dateTimePicker'], function () {
            var Page = {
                options: {
                    url: CONTEXT_PATH + "/api/qyda/aqsggl/getAqsg",
                    gridAqsg: null,
                    editWindow: null,
                    aqsgglDetail: null,
                    searchParams: null
                }
            };
            USER_INFO.onSucccess = function () {
                $("#left-treeview").comRegionTree({
                    xzbm: USER_INFO.XZBM,
                    xznbbm: USER_INFO.XZNBBM,
                    showTab: false,
                    click: function (e) {
                        $("#search-xznbbm").val(e.XZQHNBBM);
                        $("#search-sswg").val(e.WGMC);
                        $("#search-sswg").attr("data-value", e.WGBH);
                        if (Page.options.aqsgglDetail)
                            Page.options.aqsgglDetail.showData(null);
                        if (Page.options.gridAqsg)
                            Page.options.gridAqsg.dataSource.page(0);
                    }
                })
            };

            require([CONTEXT_PATH + '/ezSafe/qyda/aqsggl/aqsgglDetail.js',
                CONTEXT_PATH + '/ezSafe/qyda/aqsggl/aqsgglEdit.js'], function (AqsgglDetail, AqsgglEdit) {
                $.extend(Page, {
                    init: function () {
                        var self = this;
                        self.options.aqsgglDetail = new AqsgglDetail();
                        this._initSearchArea();
                        this._initGrid();
                        this._createEditWindow();
                        this._bindPageEvent();
                    },
                    _initSearchArea: function () {
                        var self = this;
                        //时间控件
                        $.datetimepicker.setLocale('ch');
                        $("#search-kssj").datetimepicker({
                            format: "Y-m-d H:i:s",
                        });
                        $(".kssj-button").on("click",function () {
                            $("#search-kssj").datetimepicker('toggle').datetimepicker('reset');
                        });
                        $("#search-jssj").datetimepicker({
                            format:"Y-m-d H:i:s"
                        });
                        $(".jssj-button").on("click",function () {
                            $("#search-jssj").datetimepicker('toggle').datetimepicker('reset');
                        });
                        $("#search-sgjb").kendoDropDownZdx({
                            zdlx: "20031",
                            level: "0",
                            change: function (e) {
                                $("#search-sgjb input").attr("value", e.id);
                            }
                        });
                    },
                    _initGrid: function () {
                        var self = this;
                        var listContainerHeight = $("#aqsg-list").height();
                        self.options.gridAqsg = $("#aqsg-list").kendoGrid({
                            dataSource: {
                                transport: {
                                    read: {
                                        url: self.options.url,
                                        dataType: "json",
                                        cache: false,
                                        type: "GET",
                                        data: function () {
                                            var params = {};
                                            params["sswg.wgmc"] = $("#search-sswg").val() ? "*" + $("#search-sswg").val() + "*" : null;
                                            params["qyxx.qymc"] = $("#search-qymc").val() ? "*" + $("#search-qymc").val() + "*" : null;
                                            params["sgjb.id"] = $("#search-sgjb input").attr("value");
                                            params["KSSJ|GTE"] = $("#search-kssj").val() ? $("#search-kssj").val() : null;
                                            params["JSSJ|LTE"] = $("#search-jssj").val() ? $("#search-jssj").val() : null;
                                            params["sort"] = "rksj";
                                            params["order"] = "desc";
                                            if (self.options.onlySelf) {
                                                params["ssxq.xzqhnbbm"] = $("#search-xznbbm").val();
                                            } else {
                                                params["ssxq.xzqhnbbm"] = $("#search-xznbbm").val() ? $("#search-xznbbm").val() + "*" : null;
                                            }
                                            self.options.searchParams = params;
                                            return params;
                                        }
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
                                pageSize: 20,
                                serverPaging: true
                            },
                            height: listContainerHeight,
                            selectable: "row",
                            pageable: {
                                buttonCount: 3
                            },
                            dataBound: function (e) {
                                var data = e.sender.dataSource.data();
                                $("#gridAqsg-checkedAll")[0].checked = false;
                                $.each(data, function (index, row) {
                                    var sgjb_cell = $('tr[data-uid="' + row.uid + '"] .sgjb');
                                    if (row.SGJB) sgjb_cell.text(row.SGJB.VALUE);

                                    var sfsj_cell = $('tr[data-uid="' + row.uid + '"] .sfsj');
                                    if (row.KSSJ) sfsj_cell.text(row.KSSJ);
                                });
                                this.select($("#aqsg-list .k-grid-content").find("tr").eq(0));
                                e.sender.element.find(".k-grid-content input[type=checkbox]").each(function (index, cb) {
                                    $(cb).click(function () {
                                        $("#gridAqsg-checkedAll")[0].checked = false;
                                        e.sender.select($(cb).closest("tr"));
                                    });
                                });
                                $(".grid-delete").click(function () {
                                    var dataItem = e.sender.dataItem($(this).closest("tr"));
                                    self._deleteAqsg([dataItem.XXBH]);
                                });
                                $(".single-check").click(function () {
                                    var check = true;
                                    if (!$(".single-check").hasClass("checked")) $("#gridAqsg-checkedAll")[0].checked = false;
                                    $("#aqsg-list .k-grid-content tr").each(function () {
                                        if(!$(this).children('td').children('input')[0].checked){
                                            check = false;
                                            return false;
                                        }
                                    });
                                    if (check) $("#gridAqsg-checkedAll")[0].checked = true;
                                });
                            },
                            change: function (e) {
                                var selectedRows = e.sender.select();
                                var data = e.sender.dataItem(selectedRows[0]);
                                self.options.aqsgglDetail.showData(data);
                            },
                            columns: [
                                {
                                    template: "<input type='checkbox' class='single-check'/>",
                                    title: "<input id='gridAqsg-checkedAll' type='checkbox' onclick='gridAqsgCheckAll()'/>",
                                    width: "6%"
                                }, {
                                    field: "QYXX.QYBH",
                                    hidden: true
                                }, {
                                    field: "QYXX.QYMC",
                                    title: "企业名称",
                                    width: "34%",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }, {
                                    field: "SGJB",
                                    title: "事故级别",
                                    width: "20%",
                                    template: "<span class='sgjb'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }, {
                                    field: "KSSJ",
                                    title: "事发时间",
                                    width: "35%",
                                    template: "<span class='sfsj'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }, {
                                    template: "<span class='grid-delete'>删除</span>",
                                    title: "操作",
                                    width: "15%"
                                }]
                        }).data("kendoGrid")
                    },
                    _createEditWindow: function () {
                        var self = this;
                        self.options.editWindow = $("#edit-window").kendoWindow({
                            scrollable: false,
                            width: "45%",
                            height: "94%",
                            visible: false,
                            title: false,
                            modal: true,
                            resizable: false,
                            open: function () {
                            }
                        }).data("kendoWindow");

                        self.options.AqsgglEdit = new AqsgglEdit({
                            onClose: function () {
                                self.options.editWindow.close();
                            },
                            addClick: function () {
                                setTimeout(function () {
                                    self._initGrid();
                                }, 1500);
                            }
                        });
                        $("#export-wait").kendoWindow({
                            scrollable: false,
                            width: "17%",
                            height: "14%",
                            visible: false,
                            title: false,
                            modal: true,
                            resizable: false
                        }).data("kendoWindow");

                        self.options.linkWindow = $("#link-window").kendoWindow({
                            width: "100%",
                            height: "100%",
                            modal: true,
                            visible: false,
                            resizable: false,
                            title: false,
                            draggable: false,
                            scrollable: false,
                            iframe: true,
                            content: "",
                            close: function () {
                                $("#link-window-close").hide();
                            }
                        }).data("kendoWindow");
                    },
                    _bindPageEvent: function () {
                        var self = this;
                        $(window).resize(function () {
                            self.options.aqsgglDetail.resize();
                        });

                        $(".onlySelf").click(function () {
                            self.options.aqsgglDetail.showData(null);
                            $("#gridAqsg-checkedAll")[0].checked = false;
                            if ($("#onlySelf").hasClass("checked")) {
                                self.options.onlySelf = 0;
                            } else {
                                self.options.onlySelf = 1;
                            }
                            $("#onlySelf").toggleClass("checked");
                            self._initGrid();
                        });

                        $("#button-search").click(function () {
                            self.options.aqsgglDetail.showData(null);
                            if (self.options.gridAqsg)
                                self.options.gridAqsg.dataSource.page(0);
                        });

                        $("#button-reset").click(function () {
                            $("#search-container .input-wrapper input").val("");
                            $("#search-container .search-input input").attr("value", "");
                            $("#onlySelf").removeClass("checked");
                            self.options.onlySelf = 0;

                            self.options.aqsgglDetail.showData(null);
                            if (self.options.gridAqsg)
                                self.options.gridAqsg.dataSource.page(0);
                        });

                        $("#button-export").click(function () {
                            if (self.options.gridAqsg.dataSource.data().length == 0) {
                                kendo.ui.ExtMessageDialog.show({messageType: "warn", message: "至少导出一条数据！"});
                                return;
                            }
                            $.when(kendo.ui.ExtConfirmDialog.show({
                                title: "提示!",
                                message: "确定要导出吗?"
                            })).done(function (result) {
                                if (result.button == 'OK') {
                                    $("#export-wait").data("kendoWindow").center().open();
                                    self._export();
                                    self.progressInterval = setInterval(function () {
                                        self._exportProgress()
                                    }, 1000);
                                }
                            });
                        });

                        $(".export-wait-cancel").click(function () {
                            self._exportCancel();
                            self._closeProgressWindow();
                            clearInterval(self.progressInterval);
                        });

                        $("#button-batch-delete").click(function () {
                            var ids = [];
                            if ($("#aqsg-list .k-grid-content input:checked").length > 0) {
                                $("#aqsg-list .k-grid-content input:checked").each(function () {
                                    var dataItem = self.options.gridAqsg.dataItem($(this).closest("tr"));
                                    if (dataItem && dataItem.XXBH) {
                                        ids.push(dataItem.XXBH);
                                    }
                                });
                                self._deleteAqsg(ids);
                            } else {
                                kendo.ui.ExtMessageDialog.show({messageType: "warn", message: "至少选择一条数据！"});
                            }
                        });

                        $("#button-add").click(function () {
                            $("#xgxz-miniFire").html("新增安全事故信息");
                            AqsgglEdit.prototype.miniFireEdit(new AqsgglEdit.prototype.newMiniFire(self));
                            self.options.editWindow.center().open();
                        });

                        $("#button-update").click(function () {
                            var selectedRows = self.options.gridAqsg.select();
                            var data = self.options.gridAqsg.dataItem(selectedRows[0]);
                            if (data) {
                                // data["STATE_TYPE"] = "update";
                                $("#xgxz-miniFire").html("修改安全事故信息");
                                AqsgglEdit.prototype.miniFireEdit(data);
                                self.options.editWindow.center().open();
                            } else {
                                kendo.ui.ExtMessageDialog.show({messageType: "warn", message: "至少选择一条数据！"});
                            }
                        });

                        $("#aqsg-list").on("click", ".link-page", function (e) {
                            self.options.linkWindow.refresh({url: $(this).data("link")});

                            self.options.linkWindow.maximize().open();
                            $("#link-window-close").show();
                        });

                        $("#link-window-close").click(function () {
                            self.options.linkWindow.close();
                        });
                    },
                    _export: function () {
                        var self = this;
                        self.options.searchParams.exportId = $.getUuid();
                        $.ajax({
                            url: CONTEXT_PATH + "/api/qyda/aqsggl/exportExcel",
                            type: "POST",
                            data: self.options.searchParams,
                            traditional: true,
                            success: function (data) {
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                    },
                    _exportProgress: function () {
                        var self = this;
                        $.ajax({
                            url: CONTEXT_PATH + "/api/qyda/aqsggl/progress?random=" + Math.random(),
                            type: "GET",
                            data: {exportId: self.options.searchParams.exportId},
                            success: function (data) {
                                if (data.length < 4) {
                                    $(".progress").animate({width: data + "%"}, 80);
                                    $(".percent-number").text(Math.ceil(data) + "%");
                                } else {
                                    $(".progress").animate({width: "100%"}, 80);
                                    $(".percent-number").text(100 + "%");
                                    clearInterval(self.progressInterval);
                                    if (data != "stop" && data != "failed") {
                                        var url = CONTEXT_PATH + "/" + data;
                                        $("#export-download").attr("href", url);
                                        document.getElementById("export-download").click();
                                    }
                                    setTimeout(function () {
                                        self._closeProgressWindow();
                                    }, 500);
                                }
                            }
                        });
                    },
                    _exportCancel: function () {
                        var self = this;
                        $.ajax({
                            url: CONTEXT_PATH + "/api/qyda/aqsggl/stopExport?random=" + Math.random(),
                            type: "GET",
                            data: {exportId: self.options.searchParams.exportId},
                            traditional: true,
                            success: function (data) {
                            }
                        });

                    },
                    _closeProgressWindow: function () {
                        $("#export-wait").data("kendoWindow").close();
                        $(".progress").css({width: "0%"});
                        $(".percent-number").text("0%");
                    },
                    _deleteAqsg: function (ids) {
                        var self = this;
                        $.when(kendo.ui.ExtConfirmDialog.show({
                            title: "提示!",
                            message: ids.length > 1 ? "确定要批量删除吗?" : "确定要删除吗?",
                            icon: 'question'
                        })).done(function (result) {
                            if (result.button == 'OK') {
                                $.ajax({
                                    url: CONTEXT_PATH + "/api/qyda/aqsggl/delete",
                                    cache: false,
                                    dataType: "json",
                                    type: "POST",
                                    data: {ids: JSON.stringify(ids)},
                                    traditional: true,
                                    success: function (data) {
                                        if (data) {
                                            kendo.ui.ExtMessageDialog.show({
                                                messageType: "info",
                                                message: ids.length > 1 ? "批量删除成功" : "删除成功",
                                                autoDisappearTime: 500,
                                                success: function () {
                                                    self.options.gridAqsg.dataSource.page(0);
                                                }
                                            });
                                        }
                                    },
                                    error: function (result) {
                                        kendo.ui.ExtMessageDialog.show({
                                            messageType: "error",
                                            message: "删除失败",
                                            autoDisappearTime: 500
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

                Page.init();
            });
        });
    });
});

function gridAqsgCheckAll() {
    var checked = $("#gridAqsg-checkedAll")[0].checked;
    if (checked) {
        $("#aqsg-list .k-grid-content tr").each(function () {
            $(this).children('td').children('input')[0].checked = true;
        })
    } else {
        $("#aqsg-list .k-grid-content tr").each(function () {
            $(this).children('td').children('input')[0].checked = false;
        })
    }
}