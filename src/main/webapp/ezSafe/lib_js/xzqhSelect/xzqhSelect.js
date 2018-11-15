define(['lib/domReady!', 'jquery', 'kendo', 'lib/text!./xzqhSelect.ftl'], function (dom, jquery, kendo, xzqhSelectHtml) {
    (function ($) {
        $.fn.xzqhSelect = function (config) {
            if (typeof config != "object") {
                config = {};
            }

            var cssUrl = require.toUrl("xzqhSelect/xzqhSelect.css");
            loadCss(cssUrl);

            var context = $(this);
            if(!context.hasClass("xzqh-window")){
                context.addClass("xzqh-window");
            }

            if(context.attr("xzqh-id")==null){
                var randomId =  new Date().getTime();
                context.attr("xzqh-id",randomId);

                context.html(xzqhSelectHtml);
                config.context = context;

                return new XzqhSelect(config,randomId);
            }


        }
    })(jQuery);
    function XzqhSelect(config,randomId) {
        this.filter = "[xzqh-id="+randomId+"]";
        $.extend(this, config);
        this.init();
        this.binddingTreeView();
    }

    XzqhSelect.prototype = {
        context: null,
        change: null,

        value: null,
        text:null,

        treeview: null,

        userInfo: {
            userxzqhnbbm: null,
            userxzqh: null
        },
        /**
         * 根据行政区划编号和行政区划内部编码
         * @param userxzqh 行政区划编号
         * @param userxzqhnbbm  行政区划内部编码
         * @param noHead 有无第一级
         * @param level minlevel
         */
        init:function() {
            this.context.kendoWindow({
                width: "25%",
                height: "70%",
                visible: false,
                title: false,
                modal: true,
                resizable: false
            }).data("kendoWindow");

            this.userInfo.userxzqhnbbm = this.userxzqhnbbm || 1;
            this.userInfo.userxzqh = this.userxzqh || 1;
            this.noHead = this.noHead || false;
            this.level = this.level || 3;
            this.bindClickEvent();
        },

        binddingTreeView: function () {
            var self = this;
            self.text = null;
            self.value = null;
            $(self.filter+" .xzqhSelect-input").val("");
            if (self.treeview == null) {
                var treeSource = new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: CONTEXT_PATH + "/common-api/getXzqhTree",
                            dataType: "json",
                            data: {
                                id: self.userInfo.userxzqh +";first",
                                noHead: self.noHead,
                                minLevel: self.level
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
                self.treeview = $(self.filter+" .xzqhSelect-treeview-container").kendoTreeView({
                    autoBind: true,
                    dataSource: treeSource,
                    dataTextField: "text",
                    dataValueField: "id",
                    loadOnDemand: true,
                    dataBound: function (e) {
                        var tree = $(self.filter+" .xzqhSelect-treeview-container").data("kendoTreeView");
                        var thisTree = this;
                        var $item = $(self.filter+" .xzqhSelect-treeview-container .k-top,.xzqhSelect-treeview-container .k-mid,.xzqhSelect-treeview-container .k-bot");
                        if (e.node == undefined) {
                            if (!self.noHead) {
                                tree.expand(".k-item:first");
                            }
                        }
                        $item.unbind("click");
                        $item.unbind("dblclick");
                        $item.bind("click", function (e) {
                            var dataItem = thisTree.dataItem(e.currentTarget);
                            $(self.filter+" .xzqhSelect-treeview-container .tree-selected").removeClass("tree-selected");
                            $(this).addClass("tree-selected");

                            $(self.filter+" .xzqhSelect-input").val(dataItem.text);
                            if ($(e.target).hasClass("k-icon")) {
                                return;
                            }
                            var treeItem = $(e.currentTarget).parents(".k-item").first();
                            var expand = $(treeItem).attr("aria-expanded");
                            if (expand == undefined || expand == "false") {
                                tree.expand(treeItem);
                            } else {
                                tree.collapse(treeItem);
                            }
                        });
                        $item.dblclick(function (e) {
                            var dataItem = thisTree.dataItem(e.currentTarget);
                            var String = dataItem.innerCode;
                            self.value = String;
                            self.text = String.split(";")[1];
                            if (typeof self.change != 'undefined' && typeof self.change == 'function') {
                                self.change(self.text, self.value);
                            }
                            self.context.data("kendoWindow").close();

                        })

                    }
                }).data("kendoTreeView");
            } else {
                $(self.filter+" .xzqhSelect-treeview-container .tree-selected").removeClass("tree-selected");
                self.treeview.collapse($(self.filter+" .xzqhSelect-treeview-container .k-item:not(:first)"));

            }

        },

        /**
         * 绑定点击事件
         */
        bindClickEvent: function() {
            var self = this;
            $(self.filter+" .xzqhSelect-search-button").click(function() {
                var gjz = $(self.filter+" .xzqhSelect-input").val();
                self.searchXzqh(gjz);
            });

            $(self.filter+" .xzqhSelect-reset-button").click(function() {
                $(self.filter+" .xzqhSelect-input").val(" ");
                self.text = null;
                self.value = null;
                self.binddingTreeView();
            });

            $(self.filter+" .xzqhSelect-input").keypress(function () {
                if (event.keyCode == 13) {
                    $(self.filter+" .xzqhSelect-search-button").click();
                }
            });

            $(self.filter+" .xzqh-close-button").click(function () {
                self.context.data("kendoWindow").close();
            });
        },

        /**
         * 搜索行政区划
         * @param gjz
         */
        searchXzqh: function(gjz) {
            var self = this;
            var params = {
                JSNR: "*"+gjz.toUpperCase()+"*",
                XZNBBM: self.userInfo.userxzqhnbbm+"*"
            };
            $.ajax({
                url: CONTEXT_PATH + "/common-api/getXzqhList",
                type: "GET",
                data: params,
                dataType: "json",
                success: function (data) {
                    for (x in data) {
                        var innerCode = data[x].XZBM + ";" + data[x].XZMC + ";" + data[x].XZNBBM;
                        data[x].SSDW = innerCode;
                    }

                    $(self.filter+" .xzqhSelect-treeview-container").kendoListView({
                        dataSource: data,
                        template: '<div class="xzqhListView">#:XZMC||xzmc#</div>',
                        dataBound: function() {
                            var thisList = this;

                            $(self.filter+" .xzqhListView").click(function(e) {
                                var dataItem = thisList.dataItem(e.currentTarget);
                                $(self.filter+" .xzqhList-select").removeClass("xzqhList-select");
                                $(this).addClass("xzqhList-select");
                                $(self.filter+" .xzqhSelect-input").val(dataItem.DWMC);
                            });

                            $(self.filter+" .xzqhListView").dblclick(function(e) {
                                var dataItem = thisList.dataItem(e.currentTarget);
                                self.value = dataItem.SSDW;
                                self.text = dataItem.xzmc||dataItem.XZMC;
                                if (typeof self.change != 'undefined' && typeof self.change == 'function') {
                                    self.change(self.text , self.value);
                                }
                                self.context.data("kendoWindow").close();
                            })
                        }
                    });
                    if (self.treeview != null) {
                        self.treeview.destroy();
                        self.treeview = null;
                    }
                }
            });
        },

        openXzqh: function () {
            this.context.data("kendoWindow").center().open();
        }

    };

    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
});