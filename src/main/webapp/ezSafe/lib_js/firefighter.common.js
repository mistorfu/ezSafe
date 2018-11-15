define(['jquery' , 'kendo'] , function(jquery , kendo) {
    var selectTree = {
        _defaultStyle : "",
        _inTree: false,

        searchSelectTree: function(element , options) {
            var that = this,
                uid = getUuid(),
                $target = $(element),
                temp;

            temp = kendo.format("<div class='x-search-container' id='x-search-container{0}' tabindex='-1'></div>" , uid);
            $(document.body).append(temp);

            var $treeviewContainer = $(kendo.format("#x-search-container{0}" , uid)),
                treeview = $treeviewContainer.kendoTreeView(options.treeview).data("kendoTreeView");

            this["_treeviewData" + uid] = treeview.dataSource.view().toJSON();


            if (options.multiSelect != true) {
                $target.addClass("x-search-uid" + uid);
                $target.attr("x-search-uid" , uid);
            } else {
                //multi select mode
                var multiInput = kendo.format("<div class='x-multisearch-wrap {0} x-multisearch{2}' tabindex='-1' id='{1}' x-search-uid='{2}'>" +
                    "<ul class='x-multi-listbox listbox{2}' uid='{2}'></ul>" +
                    "<input type='text' class ='x-input x-search-uid{2}' style='outline: none;width: 20px; max-width: 100%' tabindex='0'/>" +
                    "</div>" , $target.attr("class") , $target.attr("id") , uid);
                $target.replaceWith(multiInput);

                this["_multiSelected" + uid] = [];

                $(document.body)
                    .on("click" , ".x-multisearch" + uid , function(){
                        $(".x-search-uid" + uid).get(0).focus();})
                    .on("click" , ".x-button-delete" , function(e) {
                        e.stopPropagation();
                        var index = $(this).parent().index();
                        if (index == -1) {
                            return;
                        }
                        var ul = $(this).parent().parent();
                        var thisUluid = ul.attr("uid");
                        ul.children().eq(index).remove();
                        that["_multiSelected" + thisUluid].splice(index , 1);
                        if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                            options.change(that["_multiSelected" + thisUluid]);
                        }})
                    .on("keydown" , ".x-search-uid" + uid , function(e) {
                        if (event.keyCode == 8 && $(this).val() == "" && that["_multiSelected" + uid].length > 0) {
                            $(this).siblings(".x-multi-listbox").children(":last-child").get(0).remove();
                            that["_multiSelected" + uid].splice(that["_multiSelected" + uid].length - 1 , 1);
                            if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                                options.change(that["_multiSelected" + uid]);
                            }
                        }
                    })
                    .on("keyup" , ".x-search-uid" + uid , function() {
                        var valLength = $(this).val().length;
                        var afterWidth = 25 + 10 * valLength;
                        if (afterWidth < $(this).parent().width()) {
                            $(this).width(afterWidth);
                        }
                    });

                if (options.value != undefined && options.value != null && options.value != "") {
                    var value = options.value;
                    if (Array.isArray(value)) {
                        for (x in value) {
                            if (typeof value[x] == 'object') {
                                that._addTagLabel(uid, recursionFind(this["_treeviewData" + uid], value[x].id));
                            } else if (typeof value[x] == 'string') {
                                that._addTagLabel(uid, recursionFind(this["_treeviewData" + uid], value[x]));
                            }
                        }
                    } else {
                        that._addTagLabel(uid , recursionFind(this["_treeviewData" + uid] , value.id))
                    }
                }
            }
            var field = options.field == undefined ? "text" : options.field;

            this["_treeview" + uid] = treeview;

            treeview.bind("select" , function(e) {
                var dataItem = this.dataItem(e.node);
                if (options.multiSelect != true) {
                    $(element).val(dataItem.text);
                    if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                        options.change(dataItem);
                    }
                    $treeviewContainer.fadeOut(200);
                } else {
                    //multi select mode
                    for (x in that["_multiSelected" + uid]) {
                        if (that["_multiSelected" + uid][x].id == dataItem.id) {
                            $(".listbox" + uid).find(".x-button-delete").get(x).click();
                            return;
                        }
                    }
                    $(".x-search-uid" + uid).val("");
                    that._addTagLabel(uid , dataItem);
                    if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                        options.change(that["_multiSelected" + uid]);
                    }
                    // $treeviewContainer.fadeOut(200);

                    setTimeout(function() {
                        $(".x-search-uid" + uid).get(0).focus();
                    },30);
                }
            });

            $(document.body)
                .on("focus" , ".x-search-uid" + uid , function() {
                    var target = $(this);

                    treeview.dataSource.data(recursionSearch(that["_treeviewData" + uid] , target.val().toUpperCase() , field));

                    $treeviewContainer.attr("style" , that._defaultStyle);
                    if (options.multiSelect == true) {
                        target = $(this).parent();
                    }
                    var top = target.offset().top + target.outerHeight();
                    if (top > $(document.body).height() - $treeviewContainer.height()) {
                        top = top - target.outerHeight();
                        top = $(document.body).height() - top;
                        $treeviewContainer.css("bottom" , top);
                    } else {
                        $treeviewContainer.css("top" , top);
                    }
                    $treeviewContainer.width(target.outerWidth() - 5);
                    $treeviewContainer.css("left" , target.offset().left);
                    $treeviewContainer.stop();
                    $treeviewContainer.fadeIn(200);})
                .on("mouseout" , ".x-search-container" , function() {that._inTree = false;})
                .on("mouseover" , ".x-search-container" , function() {that._inTree = true;})
                .on("blur" , ".x-search-uid" + uid , function() {
                    if (that._inTree == false) {
                        $treeviewContainer.stop();
                        $treeviewContainer.fadeOut(200);
                    }})
                .on("blur" , ".x-search-treeview" , function() {
                    if (that._inTree == false) {
                        $(this).stop();
                        $(this).fadeOut(200);
                    }})
                .on("input propertychagne" , ".x-search-uid" + uid ,function() {
                    var val = $(this).val();
                    val = val.toUpperCase();
                    var dataSource = treeview.dataSource;
                    if (val != "") {
                        var realData = recursionSearch(that["_treeviewData" + uid], val, field);
                        dataSource.data(realData);
                    } else {
                        dataSource.data(that["_treeviewData" + uid]);
                    }});
        },

        clear: function(element) {
            if ($(element)[0].tagName == "DIV") {
                var uid = $(element).attr("x-search-uid");
                $(element).children("ul").html("");
                this["_multiSelected" + uid] = [];
            } else {
                $(element).val("")
            }
        },

        value: function(element , v) {
            var value = v;
            var uid = $(element).attr("x-search-uid");
            if (Array.isArray(value)) {
                for (x in value) {
                    if (typeof value[x] == 'object') {
                        this._addTagLabel(uid, recursionFind(this["_treeviewData" + uid], value[x].id));
                    } else if (typeof value[x] == 'string') {
                        this._addTagLabel(uid, recursionFind(this["_treeviewData" + uid], value[x]));
                    }
                }
            } else {
                this._addTagLabel(uid , recursionFind(this["_treeviewData" + uid] , value.id))
            }

        },

        _addTagLabel: function(uid , dataItem) {
            for (x in this["_multiSelected" + uid]) {
                if (this["_multiSelected" + uid][x].id == dataItem.id) {
                    return;
                }
            }
            var singleTag = kendo.format("<li class='x-button'>" +
                "<span class='x-button-text'>{0}</span>" +
                "<span class='x-button-delete'>x</span>" +
                "</li>" , dataItem.text);
            this["_multiSelected" + uid].push(dataItem);
            $(".listbox" + uid).append(singleTag);


        }
    };


    function recursionSearch(treeData , val , field) {
        var result = [];
        if (treeData == null) {
            return null;
        }
        if (Array.isArray(treeData)) {
            for (x in treeData) {
                (function(index) {
                    var text = treeData[index][field];
                    if (text.indexOf(val) >= 0) {
                        var newParentTreeData = {};
                        for (key in treeData[index]) {
                            newParentTreeData[key] = treeData[index][key];
                        }
                        newParentTreeData["expanded"] = true;
                        result.push(newParentTreeData);
                    } else {
                        var items = recursionSearch(treeData[index].items, val , field);
                        if (items != null && items.length > 0) {
                            var newTreeData = {};
                            for (key in treeData[index]) {
                                newTreeData[key] = treeData[index][key];
                            }
                            newTreeData["items"] = items;
                            newTreeData["expanded"] = true;
                            result.push(newTreeData);
                        }
                    }
                }(x));
            }
        } else {
            var text = treeData[field];
            if (text.indexOf(val) >= 0) {
                result.push(treeData)
            }
        }
        return result;

    }

    function recursionFind(treeData , val) {
        var result = null;
        if (treeData == null) {
            return null;
        }
        if (Array.isArray(treeData)) {
            for (x in treeData) {
                (function(index) {
                    var text = treeData[index].id;
                    if (text == val) {
                        result = treeData[index];
                    } else {
                        result = recursionFind(treeData[index].items, val);
                    }
                }(x));
                if (result != null) {
                    break
                }
            }
        } else {
            var text = treeData.id;
            if (text == val) {
                return treeData;
            }
        }
        return result;
    }

    function getUuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('').replace("-" , "");
    }

    return selectTree;
});