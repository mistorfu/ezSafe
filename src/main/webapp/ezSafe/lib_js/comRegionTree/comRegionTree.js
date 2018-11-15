define(['lib/domReady!', 'jquery', 'lib/text!./comRegionTree.ftl'], function (dom, jquery, orgTreeHtml) {

    /*
     * 必填属性：
     *          xzbm：行政区划编号,
     *          xznbbm: 行政区划内部编码
     * 其它属性：
     *          defaultSelected：是否默认选中第一项，默认true
     *          minLevel：树最大展开级别（0-部局,1-总队,2-支队,3-大队,4-中队）
     * 支持事件：
     *          click：树点击事件
     * */
    $.fn.extend({
        comRegionTree: function (config) {
            if (typeof config != "object") {
                config = {};
            }
            config.showTab = config.showTab || false;

            //加载css文件
            var cssUrl = require.toUrl("comRegionTree.css");
            loadCss(cssUrl);

            var current = $(this);
            if (current.attr("orgTree-id") == null) {
                var randomId = new Date().getTime();
                current.attr("orgTree-id", randomId);
                current.html(orgTreeHtml);

                if (config.showTab) {
                    $(this).find(".comRegionTree-tab-container").removeClass("hidden");
                }

                bindEvent(config, randomId);
                initTree(config, randomId);
                if (config.showTab) searchWgxx(config, randomId);
            }
        }
    });

    function initTree(config, randomId) {
        var filter = "[orgTree-id=" + randomId + "] .comRegionTree-treeview";
        var treeview = $(filter).data("kendoTreeView");
        if (treeview == undefined || treeview == null) {
            var treeSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: {
                        url: CONTEXT_PATH + "/common-api/getXzqhTree",
                        dataType: "json",
                        data: {
                            id: config.xzbm + ";first",
                            minLevel: config.minLevel || ""
                        }
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        hasChildren: "hasChildren"
                    }
                }
            });

            treeview = $(filter).kendoTreeView({
                autoBind: true,
                dataSource: treeSource,
                dataTextField: "text",
                dataValueField: "id",
                loadOnDemand: true,
                dataBound: function (e) {
                    if (e.node == undefined) {
                        treeview.expand(".k-item:first");
                        if (config.defaultSelected != false) {
                            treeview.select(".k-item:first");
                            $(".k-item:first").find(".k-top").addClass("tree-selected");
                        }
                    }
                },
                change: function (e) {
                    var dataItem = e.sender.dataItem(e.sender.select())
                    if (typeof config.click != 'undefined' && typeof config.click == 'function') {
                        var dataTemp = dataItem.innerCode.split(";");
                        if (dataTemp.length == 3) {
                            config.click({
                                XZQHBH: dataTemp[0],
                                XZQHMC: dataTemp[1],
                                XZQHNBBM: dataTemp[2]
                            });
                        } else if (dataTemp.length == 2) {
                            config.click({
                                WGBH: dataTemp[0],
                                WGMC: dataTemp[1]
                            });
                        }
                    }
                }
            }).data("kendoTreeView");
        }
    }

    function searchWgxx(config, randomId) {
        var filter = "[orgTree-id=" + randomId + "]";
        $.ajax({
            url: CONTEXT_PATH + "/common-api/getWgxx",
            type: "GET",
            data: {
                wgmc: "*" + $.trim($(filter + " .comRegionTree-input").val().toUpperCase()) + "*",
                fields: "WGBH,WGMC",
                limit: 100
            },
            dataType: "json",
            success: function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].FJBH = "0";
                }
                data.data.push({WGMC: "苏州市高新区", FJBH: "-1", WGBH: "0"});

                var treeview = $(filter + " .comRegionTree-wgxx").data("kendoTreeView");
                if (treeview == undefined || treeview == null) {
                    treeview = $(filter + " .comRegionTree-wgxx").kendoTreeView({
                        dataSource: getWgxxTreeData(data.data)
                    }).data("kendoTreeView");
                }
                else {
                    treeview.setDataSource(getWgxxTreeData(data.data));
                }
            }
        });
    }

    function searchOrg(config, randomId) {
        var filter = "[orgTree-id=" + randomId + "]";
        var params = {
            xzmc: "*" + $.trim($(filter + " .comRegionTree-input").val().toUpperCase()) + "*",
            xznbbm: config.xznbbm + "*",
            fields: "XZBM,XZMC,XZNBBM",
            limit: 100
        };
        $.ajax({
            url: CONTEXT_PATH + "/common-api/getXzqhList",
            type: "GET",
            data: params,
            dataType: "json",
            success: function (data) {
                for (x in data) {
                    if (data[x].XZBM) {
                        var innerCode = data[x].XZBM + ";" + data[x].XZMC + ";" + data[x].XZNBBM;
                        data[x].innerCode = innerCode;
                    } else if (data[x].WGMC) {
                        var innerCode = data[x].WGBH + ";" + data[x].WGMC;
                        data[x].innerCode = innerCode;
                        data[x].XZMC = data[x].WGMC;
                    }
                }

                var listview = $(filter + " .comRegionTree-listview").data("kendoListView");
                if (listview == undefined || listview == null) {
                    listview = $(filter + " .comRegionTree-listview").kendoListView({
                        dataSource: data,
                        template: "<div class='orgListItem'>#:XZMC#</div>"
                    }).data("kendoListView");
                }
                else {
                    var dataSource = new kendo.data.DataSource({
                        data: data
                    });
                    listview.setDataSource(dataSource);
                }
            }
        });
    }

    function bindEvent(config, randomId) {
        var filter = "[orgTree-id=" + randomId + "]";

        $(filter + " .search-button").click(function () {
            if ($.trim($(filter + " .comRegionTree-input").val()) == '') {
                kendo.ui.ExtMessageDialog.show({
                    messageType: "warn",
                    message: "请输入关键字"
                });
                return;
            }
            searchOrg(config, randomId);
            if (config.showTab) searchWgxx(config, randomId);
            $(filter + " .comRegionTree-treeview").hide();
            $(filter + " .comRegionTree-listview").show();
        });

        $(filter + " .reset-button").click(function () {
            $(filter + " .comRegionTree-input").val("");
            $(filter + " .comRegionTree-treeview").show();
            $(filter + " .comRegionTree-listview").hide();
            $(filter + " .reset-button").hide();
            $(filter + " .comRegionTree-input").removeClass('comRegionTree-input-color');
            // searchOrg(config, randomId);
        });

        $(filter + " input.comRegionTree-input").keypress(function () {
            if (event.keyCode == 13) {
                $(filter + " .search-button").trigger("click");
            }
        });

        $(filter + " input.comRegionTree-input").on("input", function (e) {
            var inputText = $.trim($(filter + " .comRegionTree-input").val());
            if (inputText == "") {
                $(filter + " .comRegionTree-treeview").show();
                $(filter + " .comRegionTree-listview").hide();
                $(filter + " .reset-button").hide();
            }
            else {
                $(filter + " .reset-button").show();
            }
        }).focus(function () {
            $(this).addClass('comRegionTree-input-color');
        }).blur(function () {
            var input = $(this);
            if (input.val() == "") {
                $(this).removeClass('comRegionTree-input-color');
            }
        });

        $(filter).on("click", ".comRegionTree-treeview .k-in", function (e) {
            var treeview = $(filter + " .comRegionTree-treeview").data("kendoTreeView");
            $(filter).find(".tree-selected").removeClass("tree-selected");
            $(e.currentTarget).parent().addClass("tree-selected");

            var treeItem = $(e.currentTarget).parents(".k-item").first();
            var expand = $(treeItem).attr("aria-expanded");
            if (expand == undefined || expand == "false") {
                treeview.expand(treeItem);
            } else {
                treeview.collapse(treeItem);
            }
        });

        $(filter).on("click", ".comRegionTree-wgxx .k-in", function (e) {
            var treeview = $(filter + " .comRegionTree-wgxx").data("kendoTreeView");
            $(filter).find(".tree-selected").removeClass("tree-selected");
            $(e.currentTarget).parent().addClass("tree-selected");

            var dataItem = treeview.dataItem(e.currentTarget);
            if (typeof config.click != 'undefined' && typeof config.click == 'function') {
                config.click({
                    WGBH: dataItem.WGBH,
                    WGMC: dataItem.WGMC
                });
            }
        });

        $(filter).on("click", ".orgListItem", function (e) {
            var listview = $(filter + " .comRegionTree-listview").data("kendoListView");
            var dataItem = listview.dataItem(e.currentTarget);
            $(filter + " .orgList-select").removeClass("orgList-select");
            $(this).addClass("orgList-select");
            if (typeof config.click != 'undefined' && typeof config.click == 'function') {
                var dataTemp = dataItem.innerCode.split(";");
                if (dataTemp.length == 3) {
                    config.click({
                        XZQHBH: dataTemp[0],
                        XZQHMC: dataTemp[1],
                        XZQHNBBM: dataTemp[2]
                    });
                } else if (dataTemp.length == 2) {
                    config.click({
                        WGBH: dataTemp[0],
                        WGMC: dataTemp[1]
                    });
                }
            }
        });

        $(filter).on("click", ".wgxxListItem", function (e) {
            var listview = $(filter + " .comRegionTree-wgxx").data("kendoListView");
            var dataItem = listview.dataItem(e.currentTarget);
            $(filter + " .orgList-select").removeClass("orgList-select");
            $(this).addClass("orgList-select");
            if (typeof config.click != 'undefined' && typeof config.click == 'function') {
                config.click({
                    WGBH: dataItem.WGBH,
                    WGMC: dataItem.WGMC
                });
            }
        });

        $(filter).on("click", ".tab-button", function () {
            if (!$(this).hasClass("selected")) {
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected");
                var content = filter + " .content-" + $(this).data("content");
                $(content).siblings().removeClass("selected");
                $(content).addClass("selected");
            }
        });
    }

    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    function getWgxxTreeData(wgxxListData) {
        var dataList = [];
        var temp = {};
        for (var i = 0; i < wgxxListData.length; i++) {
            temp[wgxxListData[i].WGBH] = {
                "id": wgxxListData[i].WGBH,
                "text": wgxxListData[i].WGMC,
                "expanded": false,
                "WGBH": wgxxListData[i].WGBH,
                "WGMC": wgxxListData[i].WGMC,
                "items": []
            }
        }
        for (var i = 0; i < wgxxListData.length; i++) {
            if (wgxxListData[i].FJBH == "-1") {
                dataList.push(temp[wgxxListData[i].WGBH]);
                temp[wgxxListData[i].WGBH].expanded = true;
                temp[wgxxListData[i].WGBH].WGMC = "";
            } else {
                temp[wgxxListData[i].FJBH].items.push(temp[wgxxListData[i].WGBH]);
            }
        }
        return dataList;
    }
});