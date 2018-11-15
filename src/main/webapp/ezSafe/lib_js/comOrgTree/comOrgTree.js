define(['lib/domReady!', 'jquery', 'lib/text!./comOrgTree.ftl'], function (dom, jquery, orgTreeHtml) {

    /*
     * 必填属性：
     *          dwbh：消防机构编号
     *          dwnbbm：消防机构内部编码
     * 其它属性：
     *          defaultSelected：是否默认选中第一项，默认true
     *          unknownAgency：是否显示未知消防机构，默认false
     *          minLevel：树最大展开级别（0-部局,1-总队,2-支队,3-大队,4-中队）
     * 支持事件：
     *          click：树点击事件
     * */
    $.fn.extend({
        comOrgTree: function (config) {
            if (typeof config != "object") {
                config = {};
            }
            //加载css文件
            var cssUrl = require.toUrl("comOrgTree.css");
            loadCss(cssUrl);

            var current = $(this);
            if (current.attr("orgTree-id") == null) {
                var randomId = new Date().getTime();
                current.attr("orgTree-id", randomId);
                current.html(orgTreeHtml);

                bindEvent(config, randomId);
                initTree(config, randomId);
            }
        }
    });

    function initTree(config, randomId) {
        var filter = "[orgTree-id=" + randomId + "] .comOrgTree-treeview";
        var treeview = $(filter).data("kendoTreeView");
        if (treeview == undefined || treeview == null) {
            var treeSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: {
                        url: CONTEXT_PATH + "/common-api/getXfdwTree",
                        dataType: "json",
                        data: {
                            id: config.dwbh + ";first",
                            unknownAgency: config.unknownAgency || false,
                            minLevel: config.minLevel || "",
                            imgUrl: config.imgUrl || ''
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
                }
            }).data("kendoTreeView");
        }
    }

    function searchOrg(config, randomId) {
        var filter = "[orgTree-id=" + randomId + "]";
        var params = {
            gjz: $.trim($(filter + " .comOrgTree-input").val().toUpperCase()),
            dwnbbm: config.dwnbbm,
            minLevel: '5' //config.minLevel || '5'
        };
        $.ajax({
            url: CONTEXT_PATH + "/api/allr/searchXfdwByJsnr?random=" + Math.random(),
            type: "GET",
            data: params,
            dataType: "json",
            success: function (data) {
                for (x in data) {
                    var innerCode = data[x].DWBH + ";" + data[x].DWMC + ";" + data[x].DWNBBM + ";" + data[x].DWSX;
                    innerCode += ";" + data[x].SZDXZQH.XZQHBH + ";" + data[x].SZDXZQH.XZQHMC
                        + ";" + data[x].SZDXZQH.XZQHNBBM;
                    data[x].SSDW = innerCode;
                }

                var listview = $(filter + " .comOrgTree-listview").data("kendoListView");
                if (listview == undefined || listview == null) {
                    listview = $(filter + " .comOrgTree-listview").kendoListView({
                        dataSource: data,
                        template: "<div class='orgListItem'>#:DWMC#</div>"
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
            if ($.trim($(filter + " .comOrgTree-input").val()) == '') {
                kendo.ui.ExtMessageDialog.show({
                    messageType: "warn",
                    message: "请输入关键字"
                });
                return;
            }
            searchOrg(config, randomId);
            $(filter + " .comOrgTree-treeview").hide();
            $(filter + " .comOrgTree-listview").show();
        });

        $(filter + " .reset-button").click(function () {
            $(filter + " .comOrgTree-input").val("");
            $(filter + " .comOrgTree-treeview").show();
            $(filter + " .comOrgTree-listview").hide();
            $(filter + " .reset-button").hide();
            $(filter + " .comOrgTree-input").removeClass('comOrgTree-input-color');
        });

        $(filter + " input.comOrgTree-input").keypress(function () {
            if (event.keyCode == 13) {
                $(filter + " .search-button").trigger("click");
            }
        });

        $(filter + " input.comOrgTree-input").on("input", function (e) {
            var inputText = $.trim($(filter + " .comOrgTree-input").val());
            if (inputText == "") {
                $(filter + " .comOrgTree-treeview").show();
                $(filter + " .comOrgTree-listview").hide();
                $(filter + " .reset-button").hide();
            }
            else {
                $(filter + " .reset-button").show();
            }
        }).focus(function () {
            $(this).addClass('comOrgTree-input-color');
        }).blur(function () {
            var input = $(this);
            if (input.val() == "") {
                $(this).removeClass('comOrgTree-input-color');
            }
        });

        $(filter).on("click", ".k-in", function (e) {
            var treeview = $(filter + " .comOrgTree-treeview").data("kendoTreeView");
            $(filter).find(".tree-selected").removeClass("tree-selected");
            $(e.currentTarget).parent().addClass("tree-selected");

            var treeItem = $(e.currentTarget).parents(".k-item").first();
            var expand = $(treeItem).attr("aria-expanded");
            if (expand == undefined || expand == "false") {
                treeview.expand(treeItem);
            } else {
                treeview.collapse(treeItem);
            }
            var dataItem = treeview.dataItem(e.currentTarget);
            if (typeof config.click != 'undefined' && typeof config.click == 'function') {
                var dataTemp = dataItem.innerCode.split(";");
                config.click({
                    DWBH: dataTemp[0],
                    DWMC: dataTemp[1],
                    DWNBBM: dataTemp[2],
                    DWSX: dataTemp[3],
                    XZQHBH: dataTemp[4],
                    XZQHMC: dataTemp[5],
                    XZQHNBBM: dataTemp[6]
                });
            }
        });

        $(filter).on("click", ".orgListItem", function (e) {
            var listview = $(filter + " .comOrgTree-listview").data("kendoListView");
            var dataItem = listview.dataItem(e.currentTarget);
            $(filter + " .orgList-select").removeClass("orgList-select");
            $(this).addClass("orgList-select");
            if (typeof config.click != 'undefined' && typeof config.click == 'function') {
                config.click({
                    DWBH: dataItem.DWBH,
                    DWMC: dataItem.DWMC,
                    DWNBBM: dataItem.DWNBBM,
                    DWSX: dataItem.DWSX,
                    XZQHBH: dataItem.SZDXZQH.XZQHBH,
                    XZQHMC: dataItem.SZDXZQH.XZQHMC,
                    XZQHNBBM: dataItem.SZDXZQH.XZQHNBBM
                });
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
});