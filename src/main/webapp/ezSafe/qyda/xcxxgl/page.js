require([CONTEXT_PATH + '/ezSafe/lib_js/avatarConfig.js'], function () {
    require(['jquery'], function () {
        require(['lib/domReady!', 'ezviewCommon', 'comRegionTree'], function () {
            var Page = {
                options: {
                    url: CONTEXT_PATH + "/api/qyda/xcxxgl/getXcxx",
                    gridXcxx: null,
                    editWindow: null,
                    xcxxglEdit: null,
                    xcxxglDetail: null,
                    searchParams: null
                },

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
                        if (Page.options.xcxxglDetail)
                            Page.options.xcxxglDetail.showData(null);
                        if (Page.options.gridXcxx)
                            Page.options.gridXcxx.dataSource.page(0);
                    }
                })
            };

            require([CONTEXT_PATH + '/ezSafe/qyda/xcxxgl/xcxxglDetail.js',
                CONTEXT_PATH + '/ezSafe/qyda/xcxxgl/xcxxglEdit.js'], function (XcxxglDetail, XcxxglEdit) {
                $.extend(Page, {
                    init: function () {
                        var self = this;
                        this._initSearchArea();
                        this._initGrid();
                        this._createEditWindow();
                        this._bindPageEvent();
                        self.options.xcxxglDetail = new XcxxglDetail();
                    },
                    _initSearchArea: function () {
                        var self = this;
                        //巡查分类下拉框
                        $("#search-XCFL").kendoDropDownZdx({
                            zdlx:"20022",
                            level:"0",
                            change: function (e) {
                                $("#search-XCFL input").attr("value", e.id);
                            }
                        });
                        //巡查类别
                        $("#search-XCLB").kendoDropDownZdx({
                            zdlx:"20023",
                            level:"0",
                            change: function (e) {
                                $("#search-XCLB input").attr("value", e.id);
                            }
                        });
                        //巡查状态
                        $("#search-XCZT").kendoDropDownZdx({
                            zdlx:"20024",
                            level:"0",
                            change: function (e) {
                                $("#search-XCZT input").attr("value", e.id);
                            }
                        });
                    },
                    _initGrid: function () {
                        var self = this;
                        var listContainerHeight = $("#xcxx-list").height();
                        self.options.gridXcxx = $("#xcxx-list").kendoGrid({
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
                                            params["xcfl.id"] = $("#search-XCFL input").attr("value");
                                            params["xclb.id"] = $("#search-XCLB input").attr("value");
                                            params["xczt.id"] = $("#search-XCZT input").attr("value");
                                            params["sort"]="rksj";
                                            params["order"]="desc";
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
                            pageable: {
                                buttonCount: 3
                            },
                            dataBound: function (e) {
                                var data = e.sender.dataSource.data();
                                $("#gridXcxx-checkedAll")[0].checked=false;
                                $.each(data, function (index, row) {
                                    var xclb_cell = $('tr[data-uid="' + row.uid + '"] .XCLB');
                                    if (row.XCLB) xclb_cell.text(row.XCLB.VALUE);

                                    var xczt_cell = $('tr[data-uid="' + row.uid + '"] .XCZT');
                                    if (row.XCZT) xczt_cell.text(row.XCZT.VALUE);
                                });
                                this.select($("#xcxx-list .k-grid-content").find("tr").eq(0));
                                e.sender.element.find(".k-grid-content input[type=checkbox]").each(function (index, cb) {
                                    $(cb).click(function () {
                                        e.sender.select($(cb).closest("tr"));
                                    });
                                });
                                $(".grid-delete").click(function () {
                                    var dataItem = e.sender.dataItem($(this).closest("tr"));
                                    self._deleteQyjcxx([dataItem.XXBH]);
                                });
                                $(".single-check").click(function () {
                                    var check = true;
                                    if (!$("single-check").hasClass("checked")) $("#gridXcxx-checkedAll")[0].checked = false;
                                    $("#xcxx-list .k-grid-content tr").each(function () {

                                        if(!$(this).children('td').children('input')[0].checked){
                                            check = false;
                                            return false;
                                        }
                                    });
                                    if (check) $("#gridXcxx-checkedAll")[0].checked = true;
                                })

                            },
                            change: function (e) {
                                var selectedRows = e.sender.select();
                                var data = e.sender.dataItem(selectedRows[0]);
                                self.options.xcxxglDetail.showData(data);
                            },
                            columns: [
                                {
                                    template: "<input type='checkbox' class='single-check'/>",
                                    title: "<input id='gridXcxx-checkedAll' type='checkbox' onclick='gridxcxxCheckAll()'/>",
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
                                    field: "XCLB",
                                    title: "巡查类别",
                                    width: "20%",
                                    template: "<span class='XCLB'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }, {
                                    field: "XCZT",
                                    title: "巡查状态",
                                    width: "20%",
                                    template: "<span class='XCZT'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }, {
                                    template:
                                        "<span class='grid-delete'>删除</span>",
                                    title: "操作",
                                    width: "20%",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
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

                        self.options.xcxxglEdit = new XcxxglEdit({
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
                        $(".onlySelf").click(function () {
                            self.options.xcxxglDetail.showData(null);
                            $("#gridXcxx-checkedAll")[0].checked=false;
                            if ($("#onlySelf").hasClass("checked")) {
                                self.options.onlySelf = 0;
                            } else {
                                self.options.onlySelf = 1;
                            }
                            $("#onlySelf").toggleClass("checked");
                            self._initGrid();
                        });

                        $("#button-search").click(function () {
                            self.options.xcxxglDetail.showData(null);
                            if (self.options.gridXcxx)
                                self.options.gridXcxx.dataSource.page(0);
                        });

                        $("#button-reset").click(function () {
                            $("#search-container #search-qymc").val("");
                            $("#search-container .search-input input").attr("value", "");
                            $("#search-container #search-XCFL input").val("");
                            $("#search-container .search-input input").attr("value", "");
                            $("#search-container #search-XCLB input").val("");
                            $("#search-container .search-input input").attr("value", "");
                            $("#search-container #search-XCZT input").val("");
                            $("#onlySelf").removeClass("checked");
                            self.options.onlySelf = 0;

                            self.options.xcxxglDetail.showData(null);
                            if (self.options.gridXcxx)
                                self.options.gridXcxx.dataSource.page(0);
                        });

                        $("#button-export").click(function () {
                            if (self.options.gridXcxx.dataSource.data().length == 0) {
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
                            if ($("#xcxx-list .k-grid-content input:checked").length > 0) {
                                $("#xcxx-list .k-grid-content input:checked").each(function () {
                                    var dataItem = self.options.gridXcxx.dataItem($(this).closest("tr"));
                                    if (dataItem && dataItem.XXBH) {
                                        ids.push(dataItem.XXBH);
                                    }
                                });
                                self._deleteQyjcxx(ids);
                            } else {
                                kendo.ui.ExtMessageDialog.show({messageType: "warn", message: "至少选择一条数据！"});
                            }
                        });

                        $("#button-add").click(function () {
                            $("#edit-window-title").html("新增巡查信息");
                            if(self.options.xcxxglEdit){
                                self.options.xcxxglEdit.showData(new XcxxglEdit.prototype._newQyjcxxData(self));
                            }
                            self.options.editWindow.center().open();
                        });


                        $("#button-update").click(function () {
                            $("#edit-window-title").html("修改巡查信息");
                            var selectedRows = self.options.gridXcxx.select();
                            var data = self.options.gridXcxx.dataItem(selectedRows[0]);
                            data["STATE_TYPE"] = "update";
                            self.options.xcxxglEdit.showData(data);
                            self.options.editWindow.center().open();
                        });

                        $("#xcxx-list").on("click", ".link-page", function (e) {
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
                            url: CONTEXT_PATH + "/api/qyda/xcxxgl/exportExcel",
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
                            url: CONTEXT_PATH + "/api/qyda/xcxxgl/progress?random=" + Math.random(),
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
                            url: CONTEXT_PATH + "/api/qyda/xcxxgl/stopExport?random=" + Math.random(),
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
                                    url: CONTEXT_PATH + "/api/qyda/xcxxgl/delete",
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
                                                    self.options.gridXcxx.dataSource.page(0);
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

function gridxcxxCheckAll() {
    var checked = $("#gridXcxx-checkedAll")[0].checked;
    if (checked) {
        $("#xcxx-list .k-grid-content tr").each(function () {
            $(this).children('td').children('input')[0].checked = true;
        })
    } else {
        $("#xcxx-list .k-grid-content tr").each(function () {
            $(this).children('td').children('input')[0].checked = false;
        })
    }
}