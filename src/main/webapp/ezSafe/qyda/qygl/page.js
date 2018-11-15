require([CONTEXT_PATH + '/ezSafe/lib_js/avatarConfig.js'], function () {
    require(['jquery'], function () {
        require(['lib/domReady!', 'ezviewCommon', 'comRegionTree'], function () {
            var Page = {
                options: {
                    url: CONTEXT_PATH + "/api/qyda/qygl/getQyjcxx",
                    gridQyxx: null,
                    editWindow: null,
                    qyglEdit: null,
                    qyglDetail: null,
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
                        if (Page.options.qyglDetail)
                            Page.options.qyglDetail.showData(null);
                        if (Page.options.gridQyxx)
                            Page.options.gridQyxx.dataSource.page(0);
                    }
                })
            };

            require([CONTEXT_PATH + '/ezSafe/qyda/qygl/qyglDetail.js',
                CONTEXT_PATH + '/ezSafe/qyda/qygl/qyglEdit.js'], function (QyglDetail, QyglEdit) {
                $.extend(Page, {
                    init: function () {
                        var self = this;
                        this._initSearchArea();
                        this._initGrid();
                        this._createEditWindow();
                        this._bindPageEvent();
                        self.options.qyglDetail = new QyglDetail();
                    },
                    _initSearchArea: function () {
                        var self = this;
                        $("#search-sshyly").kendoDropDownZdx({
                            zdlx: "20012",
                            level: "0",
                            change: function (e) {
                                $("#search-sshyly input").attr("value", e.id);
                            }
                        });
                        $("#search-qyfl").kendoDropDownZdx({
                            zdlx: "20004",
                            level: "0",
                            change: function (e) {
                                $("#search-qyfl input").attr("value", e.id);
                            }
                        });
                    },
                    _initGrid: function () {
                        var self = this;
                        var listContainerHeight = $("#qyxx-list").height();
                        self.options.gridQyxx = $("#qyxx-list").kendoGrid({
                            dataSource: {
                                transport: {
                                    read: {
                                        url: self.options.url,
                                        dataType: "json",
                                        cache: false,
                                        type: "GET",
                                        data: function () {
                                            var params = {};
                                            params["qymc"] = $("#search-qymc").val() ? "*" + $("#search-qymc").val() + "*" : null;
                                            params["sswg.wgmc"] = $("#search-sswg").val() ? "*" + $("#search-sswg").val() + "*" : null;
                                            params["sshyly.id"] = $("#search-sshyly input").attr("value");
                                            params["qyfl.id"] = $("#search-qyfl input").attr("value");
                                            if (self.options.onlySelf) {
                                                params["ssxq.xzqhnbbm"] = $("#search-xznbbm").val();
                                            } else {
                                                params["ssxq.xzqhnbbm"] = $("#search-xznbbm").val() ?
                                                    $("#search-xznbbm").val() + "*" : null;
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
                            autoBind: true,
                            pageable: {
                                buttonCount: 3
                            },
                            dataBound: function (e) {
                                var data = e.sender.dataSource.data();

                                $.each(data, function (index, row) {
                                    var sshyly_cell = $('tr[data-uid="' + row.uid + '"] .sshyly');
                                    if (row.SSHYLY) sshyly_cell.text(row.SSHYLY.VALUE);

                                    var sswg_cell = $('tr[data-uid="' + row.uid + '"] .sswg');
                                    if (row.SSWG) sswg_cell.text(row.SSWG.WGMC);
                                });
                                this.select($("#qyxx-list .k-grid-content").find("tr").eq(0));
                                e.sender.element.find(".k-grid-content input[type=checkbox]").each(function (index, cb) {
                                    $(cb).click(function () {
                                        e.sender.select($(cb).closest("tr"));
                                    });
                                });
                                $(".grid-delete").click(function () {
                                    var dataItem = e.sender.dataItem($(this).closest("tr"));
                                    self._deleteQyjcxx([dataItem.QYBH]);
                                })
                            },
                            change: function (e) {
                                var selectedRows = e.sender.select();
                                var data = e.sender.dataItem(selectedRows[0]);
                                self.options.qyglDetail.showData(data);
                            },
                            columns: [
                                {
                                    template: "<input type='checkbox' />",
                                    title: "<input id='gridQyxx-checkedAll' type='checkbox' onclick='gridQyxxCheckAll()'/>",
                                    width: "6%"
                                }, {
                                    field: "QYBH",
                                    hidden: true
                                }, {
                                    field: "QYMC",
                                    title: "企业名称",
                                    width: "34%",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }, {
                                    field: "SSHYLY",
                                    title: "所属行业",
                                    width: "20%",
                                    template: "<span class='sshyly'></span>"
                                }, {
                                    field: "SSWG",
                                    title: "所属网格",
                                    width: "20%",
                                    template: "<span class='sswg'></span>"
                                }, {
                                    template: "<span class='link-page' data-link='qyxx?qybh=#:QYBH#'>详情</span>" +
                                        "<span class='link-page' data-link='http://cc.119.gov.cn:8090/Safe/WH/WHIndex?org=#:QYBH#'>危化品</span>" +
                                        "<span class='grid-delete'>删除</span>",
                                    title: "操作",
                                    width: "30%"
                                }]
                        }).data("kendoGrid")
                    },
                    _createEditWindow: function () {
                        var self = this;
                        self.options.editWindow = $("#edit-window").kendoWindow({
                            scrollable: false,
                            width: "50%",
                            height: "94%",
                            visible: false,
                            title: false,
                            modal: true,
                            resizable: false,
                            open: function () {
                            }
                        }).data("kendoWindow");

                        self.options.qyglEdit = new QyglEdit({
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
                            self.options.qyglDetail.resize();
                        });

                        $("#onlySelf").click(function () {
                            if ($(this).hasClass("checked")) {
                                self.options.onlySelf = 0;
                            } else {
                                self.options.onlySelf = 1;
                            }
                            $(this).toggleClass("checked");
                        });

                        $("#button-search").click(function () {
                            self.options.qyglDetail.showData(null);
                            if (self.options.gridQyxx)
                                self.options.gridQyxx.dataSource.page(0);
                        });

                        $("#button-reset").click(function () {
                            $("#search-container .input-wrapper input").val("");
                            $("#search-container .search-input input").attr("value", "");
                            $("#onlySelf").removeClass("checked");
                            self.options.onlySelf = 0;

                            self.options.qyglDetail.showData(null);
                            if (self.options.gridQyxx)
                                self.options.gridQyxx.dataSource.page(0);
                        });

                        $("#button-export").click(function () {
                            if (self.options.gridQyxx.dataSource.data().length == 0) {
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
                            if ($("#qyxx-list .k-grid-content input:checked").length > 0) {
                                $("#qyxx-list .k-grid-content input:checked").each(function () {
                                    var dataItem = self.options.gridQyxx.dataItem($(this).closest("tr"));
                                    if (dataItem && dataItem.QYBH) {
                                        ids.push(dataItem.QYBH);
                                    }
                                });
                                self._deleteQyjcxx(ids);
                            } else {
                                kendo.ui.ExtMessageDialog.show({messageType: "warn", message: "至少选择一条数据！"});
                            }
                        });

                        $("#button-add").click(function () {
                            $("#edit-window-title").html("新增企业信息");
                            self.options.qyglEdit.showData(new QyglEdit.prototype._newQyjcxxData(self));
                            self.options.editWindow.center().open();
                        });

                        $("#button-update").click(function () {
                            $("#edit-window-title").html("修改企业信息");
                            var selectedRows = self.options.gridQyxx.select();
                            var data = self.options.gridQyxx.dataItem(selectedRows[0]);
                            data["STATE_TYPE"] = "update";
                            self.options.qyglEdit.showData(data);
                            self.options.editWindow.center().open();
                        });

                        $("#qyxx-list").on("click", ".link-page", function (e) {
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
                            url: CONTEXT_PATH + "/api/qyda/qygl/exportExcel",
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
                            url: CONTEXT_PATH + "/api/qyda/qygl/progress?random=" + Math.random(),
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
                            url: CONTEXT_PATH + "/api/qyda/qygl/stopExport?random=" + Math.random(),
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
                    _deleteQyjcxx: function (ids) {
                        var self = this;
                        $.when(kendo.ui.ExtConfirmDialog.show({
                            title: "提示!",
                            message: ids.length > 1 ? "确定要批量删除吗?" : "确定要删除吗?",
                            icon: 'question'
                        })).done(function (result) {
                            if (result.button == 'OK') {
                                $.ajax({
                                    url: CONTEXT_PATH + "/api/qyda/qygl/delete",
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
                                                    self.options.gridQyxx.dataSource.page(0);
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

function gridQyxxCheckAll() {
    var checked = $("#gridQyxx-checkedAll")[0].checked;
    if (checked) {
        $("#qyxx-list .k-grid-content tr").each(function () {
            $(this).children('td').children('input')[0].checked = true;
        })
    } else {
        $("#qyxx-list .k-grid-content tr").each(function () {
            $(this).children('td').children('input')[0].checked = false;
        })
    }
}