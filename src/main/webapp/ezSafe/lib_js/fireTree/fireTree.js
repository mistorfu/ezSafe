define(['jquery'], function () {
    /**
     * @isRemote: true/false 是否远程数据
     * 远程：
     * @read:{
     * @url  远程地址
     * @dataType 默认json
     * @data 参数
     *  }
     *
     * @model:{
     *  @id             远程获取数据id
     *  @hasChildren   远程数据是否有孩子
     *  }
     *  本地：
     *  @dataSource
     *
     *  @edit:{
     *   @mode   是否开启编辑模式 默认false
     *   @deep    可新增层数 接受数组
     *   @delete 可删除层数 接受数组
     *   @swap    可上下移动节点层数 接受数组
     *   }
     *  @search: true/false 开启搜索模式
     *  @$dom.data("treeview") 方法
     *
     *
     *
     * 亲爱的维护者：
     *
     * 如果你尝试了对这段程序进行'优化'
     * 下面这个计数器用来对后来人进行警告
     *
     * 浪费在这里的总时间 = 82h
     * @Autoer fengshen
     */



    var Page = {
        params: {
            dataItem: {},
            el: {}
        },
        init: function () {
            var self = this;
            $.fn.extend({
                setTree: function (obj) {
                    var $dom = this;
                    if (obj.search.mode) {
                        var el = self.appendSearch($dom);
                        $dom = el.$dom;
                        var $input = el.$input;
                    }
                    self.renderTree(obj, $dom, $input);
                }
            });
        },

        getData: function (obj) {
            var dataSource = null;
            obj.edit = obj.edit || {mode: false};
            if (obj.isRemote) {
                var transport = {
                    read: {
                        url: obj.read.url,
                        dataType: obj.read.dataType || "json",
                        data: obj.read.data
                    }
                };
                var schema = {
                    model: {
                        id: obj.model.id || "id",
                        hasChildren: obj.model.hasChildren || "hasChildren"
                    }
                };
                dataSource = new kendo.data.HierarchicalDataSource({
                    transport: transport,
                    schema: schema
                })
            } else {
                dataSource = obj.dataSource;
            }
            return dataSource;
        },

        /**
         * 渲染树
         * **/
        renderTree: function (obj, $dom, $input) {
            var self = this;
            var dataSource = self.getData(obj);
            var treeview;
            var imgTemplate = "#if(typeof(item.img)!='undefined'&&item.img){# #: item.img # #}else{# ../ezSafe/icons/common-treeview-zzjg.png#}#";
            var titleTemplate = "title='#:item." + obj.dataTextField + "#'";
            var editWrap;
            if (obj.edit && obj.edit.method === "hover") {
                editWrap = "#if(" + obj.edit.mode + "){#<div class='fire-tree-button-wrap'>" +
                    "#if($.inArray(item.deep," + JSON.stringify(obj.edit.deep) + ")!=-1){#<div class='fire-tree-button fire-tree-add-button' title='新增'></div>#}#" +
                    "#if($.inArray(item.deep," + JSON.stringify(obj.edit.swap) + ")!=-1){#<div class='fire-tree-button fire-tree-up-button' title='上移'></div>#}#" +
                    "#if($.inArray(item.deep," + JSON.stringify(obj.edit.swap) + ")!=-1){#<div class='fire-tree-button fire-tree-down-button' title='下移'></div>#}#" +
                    "#if($.inArray(item.deep," + JSON.stringify(obj.edit.delete) + ")!=-1){#<div class='fire-tree-button fire-tree-delete-button' title='删除'></div>#}#" +
                    "</div>#}#"
            } else if (obj.edit && obj.edit.method === "click") {
                editWrap = "#if(" + obj.edit.mode + "){#<div class='fire-tree-button-click-wrap'>" +
                    "#if($.inArray(item.deep," + JSON.stringify(obj.edit.deep) + ")!=-1){#<div class='fire-tree-button fire-tree-add-button'><div class='fire-tree-icon fire-tree-add-icon'></div>新增子项</div>#}#" +
                    "#if($.inArray(item.deep," + JSON.stringify(obj.edit.swap) + ")!=-1){#<div class='fire-tree-button fire-tree-up-button'><div class='fire-tree-icon  fire-tree-up-icon'></div>上移</div>#}#" +
                    "#if($.inArray(item.deep," + JSON.stringify(obj.edit.swap) + ")!=-1){#<div class='fire-tree-button fire-tree-down-button'><div class='fire-tree-icon  fire-tree-down-icon'></div>下移</div>#}#" +
                    "#if($.inArray(item.deep," + JSON.stringify(obj.edit.delete) + ")!=-1){#<div class='fire-tree-button fire-tree-delete-button'><div class='fire-tree-icon  fire-tree-delete-icon'></div>删除</div>#}#" +
                    "</div>#}#"
            }
            $dom.kendoTreeView({
                template: "<div class='fire-tree-row-wrap'>" +
                "<img class='fire-tree-img' src='" + imgTemplate + "'>" +
                "<input class='fire-tree-title fire-tree-title-input hide' value='#:item." + obj.dataTextField + "#' type='text'/>" +
                "<div class='fire-tree-title fire-tree-title-div'" + titleTemplate + ">#:item." + obj.dataTextField + "#</div>" +
                editWrap +
                "</div>",
                dataSource: dataSource,
                dataTextField: obj.dataTextField || "text",
                dataValueField: obj.dataValueField || "id",
            });
            treeview = $dom.data("kendoTreeView");
            if (obj.search.mode) {
                $dom.parent().data("treeview", self.methods($dom, obj, treeview));
            } else {
                $dom.data("treeview", self.methods($dom, obj, treeview));
            }
            if (obj.order && obj.order.mode) {
                self.sort(treeview, obj.order.dataOrderField, obj.order.dataOrderType);
            }
            self.bindEvents($dom, treeview, obj, $input);
        },

        /**
         **绑定事件
         * **/
        bindEvents: function ($dom, treeview, obj, $input) {
            var self = this;
            var doubelList = false;

            /**
             * 单击展开
             * **/
            if (obj.clickType === "click") {
                $dom.unbind("dblclick");
                $dom.on("click", ".k-in", function (e) {
                    var timer = "";
                    var flag = true;
                    return function (e) {
                        if (flag && !$(e.target).closest(".fire-tree-title-input").is(":focus")) {
                            treeview.toggle($(e.target).closest(".k-item"));
                            flag = false;
                            timer = setTimeout(function () {
                                flag = true;
                            }, 200)
                        }
                    };
                }());
            }
            /**
             * 增加树
             * **/
            $dom.on("click", ".fire-tree-add-button", function (e) {
                clickPrevent(e);
                var newData;
                if (obj.method && typeof obj.method.add === 'function') {
                    var nowItem = treeview.dataItem(this);
                    newData = obj.method.add(nowItem);
                }
                var el = treeview.append(newData, $(this));
                setTimeout(function () {
                    self.change(el, $dom, obj, treeview);
                    el.find(".fire-tree-title-div").each(function () {
                        var dataItem = treeview.dataItem(this);
                        if ($.inArray(dataItem.deep, obj.edit.rename) !== -1) {
                            disabled($(this), false);
                        }
                    });
                }, 0);
                var newItem = treeview.dataItem(el);
                if (obj.method && typeof obj.method.addCallBack === 'function') {
                    obj.method.addCallBack(newItem, e);
                }
            });
            /**
             * 删除树
             * **/
            $dom.on("click", ".fire-tree-delete-button", function (e, flag) {
                clickPrevent(e);
                var dataItem = treeview.dataItem(this);
                var el = this;
                if (!flag) {
                    $.when(kendo.ui.ExtConfirmDialog.show({
                        title: "提示!",
                        message: "确定要删除吗？",
                        icon: 'question',
                        className:"fire-tree-alert"
                    })).done(function (result) {
                        if (result.button == 'OK') {
                            remove();
                        }
                    });
                } else {
                    remove();
                }

                function remove() {
                    preDom($(el));
                    setTimeout(function () {
                        treeview.remove(el);
                    }, 0);
                    if (obj.method && typeof obj.method.delete === 'function') {
                        obj.method.delete(dataItem, e);
                    }
                }
            });
            /**
             * 可修改
             * **/
            $dom.on("dblclick", ".fire-tree-title-div", function (e) {
                var dataItem = treeview.dataItem(this);
                if ($.inArray(dataItem.deep, obj.edit.rename) !== -1 && obj.edit.mode) {
                    doubelList = true;
                    disabled($(this), false);
                } else {
                    return
                }
            });

            /**
             * 修改保存
             * **/
            $dom.on("blur", ".fire-tree-title-input", function (e) {
                var dataItem = treeview.dataItem(this);
                var oldText = treeview.text(this);
                var newText = $(this).val();
                treeview.text(this, $(this).val());
                disabled($(this), true);
                if (obj.method && typeof obj.method.save === 'function') {
                    if (oldText === newText && doubelList) {
                    } else {
                        obj.method.save(dataItem, e);
                    }
                }
                if (obj.method && typeof obj.method.change === 'function') {
                    obj.method.change(dataItem, e);
                }
                doubelList = false
            }).on("keypress", ".fire-tree-title-input", function (e) {
                if (e.keyCode === 13) {
                    $(this).trigger('blur');
                }
            });

            /**
             * 上移树
             * **/
            $dom.on("click", ".fire-tree-up-button", function (e) {
                clickPrevent(e);
                var dataItem = treeview.dataItem(this);
                var index = dataItem.index;
                if (index === 0) {
                    return
                }
                dataItem.parent().sort(function (a, b) {
                    return a.index - b.index;
                });
                dataItem.parent()[index - 1].index++;
                dataItem.index--;
                var downItem = dataItem.parent()[index - 1];
                var upItem = dataItem.parent().splice(index, 1)[0];
                dataItem.parent().splice(index - 1, 0, upItem);
                if (obj.method && typeof obj.method.swap === 'function') {
                    var el = treeview.findByUid(upItem.uid);
                    obj.method.swap(upItem, downItem);
                    self.change(el, $dom, obj, treeview);
                }
            });

            /**
             * 下移树
             * **/
            $dom.on("click", ".fire-tree-down-button", function (e) {
                clickPrevent(e);
                var dataItem = treeview.dataItem(this);
                var index = dataItem.index;
                if (index === dataItem.parent().length - 1) {
                    return
                }
                dataItem.parent().sort(function (a, b) {
                    return a.index - b.index;
                });
                dataItem.parent()[index + 1].index--;
                dataItem.index++;
                var upItem = dataItem.parent()[index + 1];
                var downItem = dataItem.parent().splice(index, 1)[0];
                dataItem.parent().splice(index + 1, 0, downItem);
                if (obj.method && typeof obj.method.swap === 'function') {
                    var el = treeview.findByUid(downItem.uid);
                    obj.method.swap(upItem, downItem);
                    self.change(el, $dom, obj, treeview);
                }
            });

            /**
             * 选择效果
             * **/
            $dom.on("click", ".fire-tree-row-wrap", function (e) {
                var flag = true;
                var timer = "";
                return function (e) {
                    if (flag) {
                        self.change(this, $dom, obj, treeview);
                        flag = false;
                        timer = setTimeout(function () {
                            flag = true;
                        }, 300)
                    }
                }
            }());

            /**
             * 右键修改
             * **/
            $dom.on("contextmenu", ".fire-tree-row-wrap", function (e) {
                self.change($(this), $dom, obj, treeview);
                var $el = $(this).find(".fire-tree-button-click-wrap");
                e.preventDefault();
                $(".fire-tree-button-click-wrap").hide();
                $el.css("display", "flex");
                var x = e.pageX;
                var y = e.pageY;
                $el.css({"left": x, "top": y});
            });

            window.onclick = function () {
                $(".fire-tree-button-click-wrap").hide();
            };

            /**
             * 搜索
             * **/
            if (obj.search.mode && $input) {
                $input.on("input", function () {
                    var content = $(this).val().toLowerCase();
                    var dataSource = treeview.dataSource;
                    var result = [];
                    var doms = [];
                    $dom.find(".search-high").removeClass("search-high");
                    filter(dataSource, content, result);
                    if (content === "") {
                        if (obj.search.filter) {
                            treeview.collapse(".k-item");
                        }
                        $dom.find(".fire-tree-up-button, .fire-tree-down-button").show();
                    } else {
                        treeview.expand(".k-item");
                        $dom.find(".fire-tree-up-button, .fire-tree-down-button").hide();
                    }
                    if (typeof obj.method.search === 'function') {
                        for (var i = 0; i < result.length; i++) {
                            var el = treeview.findByUid(result[i].uid);
                            $(el).children(".k-top,.k-mid,.k-bot").addClass("search-high");
                            doms.push(el);
                        }
                        obj.method.search(result, content, doms);
                    }

                    function filter(dataSource, query, result) {
                        var hasVisibleChildren = false;
                        var data = dataSource instanceof kendo.data.HierarchicalDataSource && dataSource.data();
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            var text = strText(item, obj.dataSearchFields);
                            var contains = false;
                            if (content !== "" && typeof obj.method.search === 'function' && text.indexOf(query) >= 0) {
                                contains = true;
                                result.push(item);
                            }
                            var itemVisible =
                                query === true
                                || query === ""
                                || contains || text.indexOf(query) >= 0;

                            var anyVisibleChildren = filter(item.children, itemVisible || query, result);

                            hasVisibleChildren = hasVisibleChildren || anyVisibleChildren || itemVisible;

                            item.hidden = !itemVisible && !anyVisibleChildren;
                        }

                        if (data && obj.search.filter) {
                            dataSource.filter({field: "hidden", operator: "neq", value: true});
                        }

                        return hasVisibleChildren;
                    }

                    function strText(item, lists) {
                        var text = "";
                        for (var i = 0; i < lists.length; i++) {
                            text += item[lists[i]] && item[lists[i]].toString().toLowerCase() || "";
                        }
                        return text;
                    }
                }).on("keypress", function (e) {
                    if (typeof obj.method.searchKeyPress === 'function') {
                        obj.method.searchKeyPress(e);
                    }
                });
            }


            /**
             * 是否修改
             * **/
            function disabled(el, flag) {
                if (flag) {
                    el.addClass("hide").siblings(".fire-tree-title-div").removeClass("hide")
                } else {
                    el.addClass("hide").siblings(".fire-tree-title-input").removeClass("hide").focus();
                }
            }

            self.disabled = disabled;
            /**
             * 选中第一项
             * **/
            if (obj.choosFirst && treeview.dataSource.view().length > 0) {
                self.change(0, $dom, obj, treeview);
            }

            /**
             * 找查上一个节点
             * **/
            function preDom(el) {
                var item = el.closest(".k-item");
                if (item.prev(".k-item").length !== 0) {
                    self.change(item.prev(".k-item"), $dom, obj, treeview)
                } else if (item.next(".k-item").length !== 0) {
                    self.change(item.next(".k-item"), $dom, obj, treeview)
                } else {
                    self.change(item.parents(".k-item").first(), $dom, obj, treeview)
                }
            }

            /**
             * 通用点击 阻止冒泡
             * **/
            function clickPrevent(e) {
                e.stopPropagation();
                $(".fire-tree-button-click-wrap").hide();
            }
        },
        /**
         * 触发obj.method.change
         * **/
        change: function (el, $dom, obj, treeview) {
            var self = this;
            if (el instanceof jQuery) {
                el = el[0];
            } else {
                el = el || $dom.find(".k-top").first();
            }
            var className = ".k-top,.k-mid,.k-bot";
            var dataItem = treeview.dataItem(el) || "";
            var choosedItem = treeview.dataItem($dom.find(".fire-tree-selected")[0]);
            if (dataItem === choosedItem) {
                return;
            }
            $dom.find(".fire-tree-selected").removeClass("fire-tree-selected");
            if ($(el).is(".k-top,.k-mid,.k-bot")) {
                $(el).addClass("fire-tree-selected");
            } else {
                $(el).parents(className).addClass("fire-tree-selected");
                $(el).children(className).addClass("fire-tree-selected");
            }
            self.params.dataItem = dataItem;
            self.params.el = el;
            if (obj.method && typeof obj.method.change === 'function') {
                obj.method.change(dataItem, el);
            }
        },

        /**
         * 方法接口
         * **/
        methods: function ($dom, obj, treeview) {
            var self = this;
            return {
                /**
                 * 增加节点
                 * **/
                add: function (uid, callBack) {
                    var oldDom = treeview.findByUid(uid);
                    var newData;
                    if (obj.method && typeof obj.method.add === 'function') {
                        var nowItem = treeview.dataItem(oldDom);
                        newData = callBack(nowItem);
                    }
                    var el = treeview.append(newData, $(oldDom));
                    setTimeout(function () {
                        self.change(el, $dom, obj, treeview);
                        el.find(".fire-tree-title-div").each(function () {
                            var dataItem = treeview.dataItem(this);
                            if ($.inArray(dataItem.deep, obj.edit.rename) !== -1) {
                                self.disabled($(this), false);
                            }
                        });
                    }, 0);
                    var newItem = treeview.dataItem(el);
                    if (obj.method && typeof obj.method.addCallBack === 'function') {
                        obj.method.addCallBack(newItem, oldDom);
                    }
                },
                /**
                 * 增加根节点
                 * **/
                addRoot: function (dataItem) {
                    var el = treeview.append(dataItem);
                    setTimeout(function () {
                        self.change(el, $dom, obj, treeview);
                        el.find(".fire-tree-title-div").each(function () {
                            var dataItem = treeview.dataItem(this);
                            if ($.inArray(dataItem.deep, obj.edit.rename) !== -1) {
                                self.disabled($(this), false);
                            }
                        });
                    }, 0);
                    var newItem = treeview.dataItem(el);
                    if (obj.method && typeof obj.method.addCallBack === 'function') {
                        obj.method.addCallBack(newItem, el);
                    }
                },
                /**
                 * 获取数据
                 * **/
                data: function () {
                    return treeview.dataSource.data();
                },
                /**
                 * 重置树
                 * **/
                reset: function (data) {
                    data = data || treeview.dataSource.data();
                    treeview.setDataSource(data);
                    if (obj.order && obj.order.mode) {
                        self.sort(treeview, obj.order.dataOrderField, obj.order.dataOrderType);
                    }
                },
                /**
                 * 选择节点
                 * **/
                select: function (el) {
                    self.change(el, $dom, obj, treeview);
                },

                /**
                 * 更改节点名字
                 * **/
                rename: function (name, el, uid, isSave) {
                    el = el || treeview.findByUid(uid);
                    var dataItem = treeview.dataItem(el);
                    treeview.text(el, name);
                    if (isSave && obj.method && typeof obj.method.save === 'function') {
                        obj.method.save(dataItem, el);
                    }
                    return dataItem;
                },
                /**
                 * 扩展至某节点
                 * **/
                expandTo: function (uid, isChange, isScroll) {
                    var el = treeview.findByUid(uid);
                    var dataItem = treeview.dataItem(el);
                    treeview.expandTo(dataItem);
                    var className = ".k-top,.k-mid,.k-bot";
                    $dom.find(className).removeClass("fire-tree-selected");
                    if ($(el).is(".k-top,.k-mid,.k-bot")) {
                        $(el).addClass("fire-tree-selected");
                    } else {
                        $(el).parents(className).addClass("fire-tree-selected");
                        $(el).children(className).addClass("fire-tree-selected");
                    }
                    if (isChange) {
                        self.params.dataItem = dataItem;
                        self.params.el = el;
                        if (obj.method && typeof obj.method.change === 'function') {
                            obj.method.change(dataItem, el);
                        }
                    }
                    if (isScroll && el && dataItem) {
                        var offsetOut = $dom.offset().top;
                        var offsetIn = $(el).offset().top;
                        var distanceTop = offsetIn - offsetOut;
                        $dom.stop(true, true);
                        $dom.animate({"scrollTop": $dom.scrollTop() + distanceTop - 100}, 100);
                    }

                },
                /**
                 * 移除节点方法
                 * **/
                remove: function (uid, isDialog) {
                    var el = uid ? treeview.findByUid(uid) : self.params.el;
                    $(el).find(".fire-tree-delete-button").trigger("click", [isDialog]);
                }
            }
        },

        /**
         * 添加搜索框
         * **/
        appendSearch: function ($dom) {
            var input = document.createElement("input");
            input.className = "fire-tree-search";
            input.type = 'search';
            $dom.append("<div class='fire-tree-search-wrap'></div>");
            $dom.find(".fire-tree-search-wrap").append(input).append("<img src='../ezSafe/icons/sksdz-search-n.png'/>");
            var div = document.createElement("div");
            div.className = "fire-tree";
            $dom.append(div);
            return {
                $dom: $(div),
                $input: $(input)
            }
        },

        /**
         * 排序
         * **/
        sort: function (treeview, sortText, sortType) {
            treeview.dataSource.sort({field: sortText, dir: sortType});
            setSort(treeview.dataSource.view());

            function setSort(items) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].hasChildren) {
                        items[i].children.sort({field: sortText, dir: sortType});
                        setSort(items[i].children.view());
                    }
                }
            }
        }
    };


    Page.init()
});