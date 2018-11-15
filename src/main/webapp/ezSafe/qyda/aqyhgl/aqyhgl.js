require([CONTEXT_PATH + '/ezSafe/lib_js/avatarConfig.js'], function () {
    require(['jquery'], function () {
        require(['lib/domReady!', 'ezviewCommon', 'comRegionTree'], function () {
            var Page = {
                options: {
                    url: CONTEXT_PATH + "/api/qyda/aqyhgl/getAqyh",
                    gridAqyh: null,
                    editWindow: null,
                    aqyhglEdit: null,
                    aqyhglDetail: null,
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
                        if (Page.options.aqyhglDetail)
                            Page.options.aqyhglDetail.showData(null);

                        if (Page.options.gridAqyh)
                            Page.options.gridAqyh.dataSource.page(0);
                    }
                })
            };

            require([CONTEXT_PATH + '/ezSafe/qyda/aqyhgl/aqyhglDetail.js',
                CONTEXT_PATH + '/ezSafe/qyda/aqyhgl/aqyhglEdit.js'], function (AqyhglDetail, AqyhglEdit) {
                $.extend(Page, {
                    init: function () {
                        var self = this;
                        self.options.aqyhglDetail = new AqyhglDetail();
                        this._initSearchArea();
                        this._initGrid();
                        this._createEditWindow();
                        this._bindPageEvent();
                    },
                    _initSearchArea: function () {
                        var self = this;
                        //隐患类型下拉框
                        $("#search-yhlx").kendoDropDownZdx({
                            zdlx:"20026",
                            level:"0",
                            change: function (e) {
                                $("#search-yhlx input").attr("value", e.id);
                            }
                        });

                        //隐患级别下拉框
                        $("#search-yhjb").kendoDropDownZdx({
                            zdlx:"20027",
                            level:"0",
                            change: function (e) {
                                $("#search-yhjb input").attr("value", e.id);
                            }
                        });
                        //隐患来源下拉框
                        $("#search-yhly").kendoDropDownZdx({
                            zdlx:"20029",
                            level:"0",
                            change: function (e) {
                                $("#search-yhly input").attr("value", e.id);
                            }
                        });
                    },
                    _initGrid: function () {
                        var self = this;
                        var listContainerHeight = $("#aqyh-list").height();
                        self.options.gridAqyh = $("#aqyh-list").kendoGrid({
                            dataSource: {
                                transport: {
                                    read: {
                                        url: self.options.url,
                                        dataType: "json",
                                        cache: false,
                                        type: "GET",
                                        data: function () {
                                            var params = {};
                                            params["qyxx.qymc"] = $("#search-qymc").val() ? "*" + $("#search-qymc").val() + "*" : null;
                                            params["sswg.wgmc"] = $("#search-sswg").val() ? "*" + $("#search-sswg").val() + "*" : null;
                                            params["yhlx.id"] = $("#search-yhlx input").attr("value");
                                            params["yhjb.id"] = $("#search-yhjb input").attr("value");
                                            params["yhly.id"] = $("#search-yhly input").attr("value");
                                            params["sort"] = "rksj";
                                            params["order"] = "desc";
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
                                $("#gridAqyh-checkedAll")[0].checked = false;

                                $(".single-check").click(function () {
                                    var check = true;
                                    if (!$(".single-check").hasClass("checked")) $("#gridAqyh-checkedAll")[0].checked = false;
                                    $("#aqyh-list .k-grid-content tr").each(function () {
                                        if(!$(this).children('td').children('input')[0].checked){
                                            check = false;
                                            return false;
                                        }
                                    });
                                    if (check) $("#gridAqyh-checkedAll")[0].checked = true;
                                });

                                $.each(data, function (index, row) {
                                    var yhwz_cell = $('tr[data-uid="' + row.uid + '"] .yhwz');
                                    if (row.YHWZ) yhwz_cell.text(row.YHWZ);

                                    var yhjb_cell = $('tr[data-uid="' + row.uid + '"] .yhjb');
                                    if (row.YHJB) yhjb_cell.text(row.YHJB.VALUE);
                                });
                                this.select($("#aqyh-list .k-grid-content").find("tr").eq(0));
                                e.sender.element.find(".k-grid-content input[type=checkbox]").each(function (index, cb) {
                                    $(cb).click(function () {
                                        e.sender.select($(cb).closest("tr"));
                                    });
                                });
                                $(".grid-delete").click(function () {
                                    var dataItem = e.sender.dataItem($(this).closest("tr"));
                                    self._deleteAqyh([dataItem.XXBH]);
                                })
                            },
                            change: function (e) {
                                var selectedRows = e.sender.select();
                                var data = e.sender.dataItem(selectedRows[0]);
                                self.options.aqyhglDetail.showData(data);
                            },
                            columns: [
                                {
                                    template: "<input type='checkbox' class='single-check'/>",
                                    title: "<input id='gridAqyh-checkedAll' type='checkbox' onclick='gridAqyhCheckAll()'/>",
                                    width: "6%"
                                }, {
                                    field: "XXBH",
                                    hidden: true
                                }, {
                                    field: "QYXX.QYMC",
                                    title: "企业名称",
                                    width: "34%",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }, {
                                    field: "YHWZ",
                                    title: "隐患位置",
                                    width: "25%",
                                    template: "<span class='yhwz'></span>",
                                    headerAttributes: {
                                        "class": "table-header-cell"
                                    }
                                }, {
                                    field: "YHJB",
                                    title: "隐患级别",
                                    width: "20%",
                                    template: "<span class='yhjb'></span>",
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
                        //新增弹窗or修改弹窗初始化
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

                        //安全隐患-整改记录详情弹窗初始化
                        $("#aqyhgl-zgjl-xq-win").kendoWindow({
                            scrollable: false,
                            width: "35%",
                            height: "38%",
                            visible: false,
                            title: false,
                            modal: true,
                            resizable: false
                        }).data("kendoWindow");

                        // self.options.aqyhglEdit = new aqyhglEdit({
                        //     onClose: function () {
                        //         self.options.editWindow.close();
                        //     },
                        //     addClick: function () {
                        //         setTimeout(function () {
                        //             self._initGrid();
                        //         }, 1500);
                        //     }
                        // });

                        AqyhglEdit.addClick = function (id) {
                            setTimeout(function () {
                                self._initGrid();
                            }, 1500);
                        };

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
                            self.options.aqyhglDetail.resize();
                        });

                        $("#onlySelf").click(function () {
                            $("#gridAqyh-checkedAll")[0].checked = false;
                            self.options.aqyhglDetail.showData(null);
                            if ($(this).hasClass("checked")) {
                                self.options.onlySelf = 0;
                            } else {
                                self.options.onlySelf = 1;
                            }
                            $(this).toggleClass("checked");
                            if (self.options.gridAqyh)
                                self.options.gridAqyh.dataSource.page(0);
                        });

                        $("#button-search").click(function () {
                            self.options.aqyhglDetail.showData(null);
                            if (self.options.gridAqyh)
                                self.options.gridAqyh.dataSource.page(0);
                        });

                        $("#button-reset").click(function () {
                            $("#search-container .input-wrapper input").val("");
                            $("#search-container .search-input input").attr("value", "");
                            $("#onlySelf").removeClass("checked");
                            self.options.onlySelf = 0;

                            self.options.aqyhglDetail.showData(null);
                            if (self.options.gridAqyh)
                                self.options.gridAqyh.dataSource.page(0);
                        });

                        $("#button-export").click(function () {
                            if (self.options.gridAqyh.dataSource.data().length == 0) {
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
                            if ($("#aqyh-list .k-grid-content input:checked").length > 0) {
                                $("#aqyh-list .k-grid-content input:checked").each(function () {
                                    var dataItem = self.options.gridAqyh.dataItem($(this).closest("tr"));
                                    if (dataItem && dataItem.XXBH) {
                                        ids.push(dataItem.XXBH);
                                    }
                                });
                                self._deleteAqyh(ids);
                            } else {
                                kendo.ui.ExtMessageDialog.show({messageType: "warn", message: "至少选择一条数据！"});
                            }
                        });

                        $("#button-add").click(function () {
                            $("#edit-window-title").html("新增安全隐患");
                            AqyhglEdit.aqyhEdit(new AqyhglEdit.newMiniFire(self));
                            self.options.editWindow.center().open();
                        });

                        $("#button-update").click(function () {
                            var selectedRows = self.options.gridAqyh.select();
                            var data = self.options.gridAqyh.dataItem(selectedRows[0]);
                            //data["STATE_TYPE"] = "update";
                            if(data){
                                $("#edit-window-title").html("修改安全隐患");
                                AqyhglEdit.aqyhEdit(data);
                                self.options.editWindow.center().open();
                            }else {
                                kendo.ui.ExtMessageDialog.show({messageType: "warn", message: "至少选择一条数据！"});
                            }

                        });

                        $("#aqyh-list").on("click", ".link-page", function (e) {
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
                            url: CONTEXT_PATH + "/api/qyda/aqyhgl/exportExcel",
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
                            url: CONTEXT_PATH + "/api/qyda/aqyhgl/progress?random=" + Math.random(),
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
                            url: CONTEXT_PATH + "/api/qyda/aqyhgl/stopExport?random=" + Math.random(),
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
                    _deleteAqyh: function (ids) {
                        var self = this;
                        $.when(kendo.ui.ExtConfirmDialog.show({
                            title: "提示!",
                            message: ids.length > 1 ? "确定要批量删除吗?" : "确定要删除吗?",
                            icon: 'question'
                        })).done(function (result) {
                            if (result.button == 'OK') {
                                $.ajax({
                                    url: CONTEXT_PATH + "/api/qyda/aqyhgl/delete",
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
                                                    self.options.gridAqyh.dataSource.page(0);
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

function gridAqyhCheckAll() {
    var checked = $("#gridAqyh-checkedAll")[0].checked;
    if (checked) {
        $("#aqyh-list .k-grid-content tr").each(function () {
            $(this).children('td').children('input')[0].checked = true;
        })
    } else {
        $("#aqyh-list .k-grid-content tr").each(function () {
            $(this).children('td').children('input')[0].checked = false;
        })
    }
}