/**
 * CopyRight ©1995-2015: 苏州科达科技股份有限公司
 * Project：     maintenance
 * Module：      avatar_maintenance
 * Description： kendo ui 扩展
 * Author：      liwei
 * Create Date： 2015-07-03 15:00
 * Version：     V1.0
 * History：
 * */

(function(mod)
{
    define(['jquery','kendo'], mod);
})(function($,kendo)
{

    var getMessageIcon = function(messageType)
    {
        if(messageType === 'info')
        {
            return "k-ext-information";
        }
        else if(messageType === 'warn')
        {
            return "k-ext-warning";
        }
        else if(messageType === 'question')
        {
            return "k-ext-question";
        }
        else if(messageType === 'error')
        {
            return "k-ext-error";
        }
        else
        {
            return "k-ext-information";
        }
    }

    var ExtDialog = kendo.ui.Window.extend({
        _buttonTemplate: kendo.template('<div class="k-ext-dialog-buttons" style="position:absolute; bottom:10px; text-align:center; width:#= parseInt(width) #px;"><div style="display:inline-block"># $.each (buttons, function (idx, button) { # <button class="k-button button-#: idx #" style="margin-right:5px; width:100px;"><!--#= button.name #--></button> # }) # </div></div>'),
        _contentTemplate: kendo.template('<div class="k-ext-dialog-content" style="height:#= parseInt(height) - 55 #px;; width:#= parseInt(width) - 14 #px;overflow:auto;">'),

        init: function (element, options) {
            /// <signature>
            ///   <summary>
            ///   Initialize the dialog.
            ///   </summary>
            /// </signature>

            var that = this;

            options.visible = options.visible || false;

            kendo.ui.Window.fn.init.call(that, element, options);
            $(element).data("kendoWindow", that);

            var html = $(element).html();
            $(element).html(that._contentTemplate(options));
            $(element).find("div.k-ext-dialog-content").append(html);

            $(element).after(that._buttonTemplate(options));

            $.each(options.buttons, function (idx, button) {
                if (button.click) {
                    $($(element).parent().find(".k-ext-dialog-buttons .k-button")[idx]).on("click", { handler: button.click }, function (e) {
                        e.data.handler({ button: this, dialog: that });
                    });
                }
            });

            that.bind("resize", function (e) {
                that.resizeDialog();
            });
        },

        resizeDialog: function () {
            var that = this;
            var $dialog = $(that.element);
            var width = $dialog.width();
            var height = $dialog.height();
            $dialog.parent().find(".k-ext-dialog-buttons").width(width);
            $dialog.parent().find(".k-ext-dialog-content").width(width).height(height - 39);
        },

        options: {
            name: "ExtDialog"
        }
    });
    kendo.ui.plugin(ExtDialog);

    kendo.ui.ExtAlertDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                var dialog = null;

                if ($("#extAlertDialog").length > 0) {
                    $("#extAlertDialog").parent().remove();
                }

                var top=0,left=0;
                if(options.position&&options.position.left&&options.position.top)
                {
                    top=options.position.top;
                    left=options.position.left;
                }
                else{
                    left = Math.floor(Math.abs(document.documentElement.clientWidth - 310) / 2);
                    top = Math.floor(Math.abs(document.documentElement.clientHeight - 120) / 2);
                }

                options = $.extend({
                    width: "310px",
                    height: "120px",
                    position: {
                        top: top,
                        left:left
                    },
                    buttons: [{
                        name: "确定",
                        click: function (e) {
                            dialog.close();
                            deferred.resolve({ button: "OK" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    icon: "k-ext-information"
                }, options);

                $(document.body).append(kendo.format("<div id='extAlertDialog' style='position:relative;'><div style='position:absolute;left:30px;top:17px;' class='{0}'></div><div style='display:inline-block;margin-top:10px;margin-left:45px;width:200px;text-align: center'>{1}</div></div>", getMessageIcon(options.messageType), options.message));
                dialog = $("#extAlertDialog").kendoExtDialog(options).data("kendoExtDialog");
                $("#extAlertDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                dialog.open();
            });
        },

        hide: function () {
            $("#extAlertDialog").data("kendoExtDialog").close();
        }
    };

    kendo.ui.ExtConfirmDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                if ($("#extConfirmDialog").length > 0) {
                    $("#extConfirmDialog").parent().remove();
                }
                var top=0,left=0;
                if(options.position&&options.position.left&&options.position.top)
                {
                    top=options.position.top;
                    left=options.position.left;
                }
                else{
                    left = Math.floor(Math.abs(document.documentElement.clientWidth - 310) / 2);
                    top = Math.floor(Math.abs(document.documentElement.clientHeight - 120) / 2);
                }

                options = $.extend({
                    width: "310px",
                    height: "120px",
                    position: {
                        top: top,
                        left:left
                    },
                    buttons: [{
                        name: "确定",
                        click: function (e) {
                            $("#extConfirmDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "OK" });
                        }
                    }, {
                        name: "取消",
                        click: function (e) {
                            $("#extConfirmDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "Cancel" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    icon: "k-ext-information"
                }, options);

                $(document.body).append(kendo.format("<div id='extConfirmDialog' style='position:relative;'><div style='position:absolute;left:30px;top:17px;' class='{0}'></div><div style='display:inline-block;margin-top:10px;margin-left:45px;width:200px;text-align: center'>{1}</div></div>", getMessageIcon(options.messageType), options.message));
                $("#extConfirmDialog").kendoExtDialog(options);
                $("#extConfirmDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                $("#extConfirmDialog").data("kendoExtDialog").open();
            });
        },
        hide:function(){
            $("#extConfirmDialog").data("kendoExtDialog").close();
        }
    };

    kendo.ui.ExtMessageDialog = {
        show: function (options) {
            if ($("#extMessageDialog").length > 0) {
                $("#extMessageDialog").parent().remove();
            }
            var width = 312, height = 90, left, top;
            if (options.align == "left") {
                left = top = 0;
            } if (options.align == "right") {
                top = 0;
                left = Math.abs(document.documentElement.clientWidth - width);
            } else {
                left = Math.floor(Math.abs(document.documentElement.clientWidth - width) / 2);
                top = Math.floor(Math.abs(document.documentElement.clientHeight - height) / 2);
            }

            if (!options.fadeOutTime) {
                options.fadeOutTime = 500;
            }

            if (!options.autoDisappearTime) {
                options.autoDisappearTime = 1000;
            }

            if(options.position&&options.position.left&&options.position.top)
            {
                top=options.position.top;
                left=options.position.left;
            }

            options = $.extend({
                width: width,
                height: height,
                position: {
                    top: top,
                    left:left
                },
                modal: false,
                visible: false,
                buttons:[],
                message: "",
                icon: "k-ext-information",
                autoFocus: false,
                title:false

            }, options);

            var extMessageClass;
            if(options.messageType === 'error')
            {
                extMessageClass = "ext-message-error";
            }
            else if(options.messageType === 'success')
            {
                extMessageClass = "ext-message-success";
            }
            else if(options.messageType === 'warn')
            {
                extMessageClass = "ext-message-warn";
            } else {
                extMessageClass = "ext-message-success";
            }
            $(document.body).append(kendo.format("<div id='extMessageDialog' class='{0}' style='position:relative;padding:0px;'><div  style='float: left' class='state-icon-wrapper'><div class='state-icon'></div></div><div class='messageContent' style='position: relative;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;' title='{1}'>{1}</div></div>", extMessageClass, options.message));
            $("#extMessageDialog").kendoExtDialog(options);
            $("#extMessageDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
            $("#extMessageDialog").find(".k-ext-dialog-content").css("height","auto").css("width",310);
            $("#extMessageDialog").data("kendoExtDialog").open();

            $("#extMessageDialog").parent().click(function() {
                $("#extMessageDialog").data("kendoExtDialog").close();
            });

            setTimeout(function(){
                $("#extMessageDialog").parent().fadeOut(options.fadeOutTime, function () {
                    if (typeof (options.success) == "function") {
                        options.success();
                    }
                    $("#extMessageDialog").data("kendoExtDialog").close();
                });
            },options.autoDisappearTime);
        }
    }

    var DropDownTreeView = kendo.ui.Widget.extend({
        _uid: null,
        _treeview: null,
        _dropdown: null,
        _v: null,

        init: function (element, options) {
            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            that._uid = new Date().getTime();

            $(element).append(kendo.format("<input id='extDropDown{0}' class='k-ext-dropdown'/>", that._uid));
            $(element).append(kendo.format("<div id='extTreeView{0}' class='k-ext-treeview' style='z-index:1;'/>", that._uid));

            // Create the dropdown.
            that._dropdown = $(kendo.format("#extDropDown{0}", that._uid)).kendoDropDownList({
                dataSource: [{ text: "", value: "" }],
                dataTextField: "text",
                dataValueField: "value",
                open: function (e) {
                    //to prevent the dropdown from opening or closing. A bug was found when clicking on the dropdown to
                    //"close" it. The default dropdown was visible after the treeview had closed.
                    e.preventDefault();
                    // If the treeview is not visible, then make it visible.
                    if (!$treeviewRootElem.hasClass("k-custom-visible")) {
                        // Position the treeview so that it is below the dropdown.
                        $treeviewRootElem.css({
                            "top": $dropdownRootElem.position().top + $dropdownRootElem.height(),
                            "left": $dropdownRootElem.position().left
                        });
                        // Display the treeview.
                        $treeviewRootElem.slideToggle('fast', function () {
                            that._dropdown.close();
                            $treeviewRootElem.addClass("k-custom-visible");
                        });
                    }
                }
            }).data("kendoDropDownList");

            if (element.hasAttribute("disabled")) {
                that.enable(false);
            }
            if (options.dropDownWidth) {
                that._dropdown._inputWrapper.width(options.dropDownWidth);
            }

            var $dropdownRootElem = $(that._dropdown.element).closest("span.k-dropdown");

            // Create the treeview.
            that._treeview = $(kendo.format("#extTreeView{0}", that._uid)).kendoTreeView(options.treeview).data("kendoTreeView");

            //支持多选
            if(options.treeview.checkboxes) {
                that._treeview.bind("select", function (e) {
                    e.preventDefault();
                    var dataItem = that._treeview.dataItem(e.node);
                    var checked = $(e.node).find("input").first().prop("checked");
                    dataItem.checked = !checked;
                    $(e.node).find("input").first().prop("checked", !checked);
                    checked ? $(e.node).find(".k-in").first().removeClass("k-state-dropDwonList-selected") : $(e.node).find(".k-in").first().addClass("k-state-dropDwonList-selected");
                    that._treeview.trigger("check");
                    if (typeof options.check == "function") {
                        var checkedNodes = [];
                        checkedNodeIds(that._treeview.dataSource.view(), checkedNodes);
                        options.check(dataItem, checkedNodes);
                    }
                });
                that._treeview.bind("check", function (e) {
                    e.preventDefault();
                    var dataItem = that._treeview.dataItem(e.node);
                    if (dataItem != undefined) {
                        !dataItem.checked ? $(e.node).find(".k-in").first().removeClass("k-state-dropDwonList-selected") : $(e.node).find(".k-in").first().addClass("k-state-dropDwonList-selected");
                        if (typeof options.check == "function") {
                            var checkedNodes = [];
                            checkedNodeIds(that._treeview.dataSource.view(), checkedNodes);
                            options.check(dataItem, checkedNodes);
                        }
                    }
                });

                function checkedNodeIds(nodes, checkedNodes) {
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].checked) {
                            checkedNodes.push(nodes[i]);
                        }
                        if (nodes[i].hasChildren) {
                            if (!options.exceptChildren || !nodes[i].checked) {
                                checkedNodeIds(nodes[i].children.view(), checkedNodes);
                            }
                        }
                    }
                }
            }
            else{
                that._treeview.bind("select", function (e) {
                    // When a node is selected, display the text for the node in the dropdown and hide the treeview.
                    $dropdownRootElem.find("span.k-input").text($(e.node).children("div").text());

                    var treeValue = this.dataItem(e.node);
                    var valueName = options.dataValueField;
                    treeValue[valueName]=treeValue[valueName]?treeValue[valueName]:"";
                    element.setAttribute("value", treeValue[valueName]);
                    that._v = treeValue[options.valueField];

                    //触发change事件
                    if (typeof options.change == "function") {
                        options.change(treeValue);
                    }
                    $treeviewRootElem.removeClass("k-custom-visible");
                    $(that._treeview.element).closest("div.k-treeview").hide();
                });
            }



            if (options.dropDownWidth) {
                $(that._treeview.element).first().css({
                    "min-width": that._dropdown._inputWrapper.width() + 23,
                    "max-width": that._dropdown._inputWrapper.width() * 2,
                    "max-height": that._dropdown._inputWrapper.width() * 3,
                    "overflow": "auto",
                });
            }

            var $treeviewRootElem = $(that._treeview.element).closest("div.k-treeview");

            // Hide the treeview.
            $treeviewRootElem
                .css({
                    "border"   : "1px solid #dbdbdb",
                    "display"  : "none",
                    "position" : "absolute",
                    "background-color": that._dropdown.list.css("background-color")
                });

            $(document).click(function (e) {
                // Ignore clicks on the treetriew.
                if ($(e.target).closest("div.k-treeview").length === 0) {
                    // If visible, then close the treeview.
                    if ($treeviewRootElem.hasClass("k-custom-visible")) {
                        $treeviewRootElem.slideToggle('fast', function () {
                            $treeviewRootElem.removeClass("k-custom-visible");
                        });
                    }
                }
            });
        },
        value: function(v){
            var that = this;
            if(v !== undefined){
                var n = that._treeview.dataSource.get(v);
                if(n != undefined) {
                    var selectNode = that._treeview.findByUid(n.uid);
                    that._treeview.select(selectNode);
                    that._treeview.trigger('select', {node: selectNode});
                    var $treeviewRootElem = $(that._treeview.element).closest("div.k-treeview");
                    $treeviewRootElem.hide();
                }
                else{
                    that._treeview.select($());
                    that._dropdown.select($());
                    that._dropdown.text("");
                }
            }
            else{
                return that._v;
            }
        },

        //初始化多选树
        initCheckboxes:function (data, field) {
            var that = this;
            if(data == undefined) {
                return;
            }
            if (field == undefined) {
                field = "VALUE";
            }
            //清空之前数据及状态
            that._treeview.select($());
            that._dropdown.select($());
            that._dropdown.text("");
            $(that._treeview.element).find(".k-in").removeClass("k-state-dropDwonList-selected");
            $(that._treeview.element).find("input").prop("checked", false);
            clearTreeviewData(that._treeview.dataSource.view());
            for (var i = 0; i < data.length; i++) {
                if (typeof data[i] == "object") {
                    if (field == "ID") {
                        var n = that._treeview.dataSource.get(data[i][field]);
                        if (n != undefined) {
                            var $node = that._treeview.findByUid(n.uid);
                        }
                    }
                    else {
                        var $node = that._treeview.findByText(data[i][field]);
                    }
                }
                else {
                    if (field == "ID") {
                        var n = that._treeview.dataSource.get(data[i]);
                        if (n != undefined) {
                            var $node = that._treeview.findByUid(n.uid);
                        }
                    }
                    else {
                        var $node = that._treeview.findByText(data[i]);
                    }
                }
                that._treeview.select($node);
                that._treeview.trigger('select', {node: $node});
                var $treeviewRootElem = $(that._treeview.element).closest("div.k-treeview");
                $treeviewRootElem.hide();
            }
            $(that._treeview.element).find(".k-in").removeClass("k-state-selected");

            function clearTreeviewData(data) {
                for (var i = 0 , length = data.length ; i < length ; i++) {
                    data[i].checked = false;
                    if (data[i].hasChildren) {
                        clearTreeviewData(data[i].children.view());
                    }
                }
            }
        },

        dropDownList: function () {
            return this._dropdown;
        },
        enable: function(bool) {
            return this._dropdown.enable(bool);
        },
        treeview: function () {
            return this._treeview;
        },
        refresh: function () {
            return this._treeview.dataSource.read();
        },
        options: {
            name: "DropDownTreeView"
        },
    });
    kendo.ui.plugin(DropDownTreeView);

    var SearchSelectTree = kendo.ui.Widget.extend({
        _defaultStyle : "",
        _mode:"",
        _inTree: false,
        _element : null,
        _dataSource: null,
        _contain: null,
        _multiSelected: [],
        _field: null,
        _searchFilter: null,
        _textField: null,

        init: function(element , options) {
            var that = this,
                uid = getUuid(),
                $target = this._element = $(element),
                temp;

            kendo.ui.Widget.fn.init.call(that, element, options);

            temp = kendo.format("<div class='x-search-container' id='x-search-container{0}' tabindex='-1'></div>", uid);
            $(document.body).append(temp);
            this._mode = options.contain.mode;
            this._searchFilter = options.filter || "contains";
            this._textField = options.textField || "text";
            this._field = options.searchField || this._textField;

            var $Container = $(kendo.format("#x-search-container{0}" , uid)),
                contain;
            if (this._mode == "treeview") {
                contain = $Container.kendoTreeView(options.contain).data("kendoTreeView");
            } else if (this._mode == "listview") {
                options.contain.template = options.contain.template || kendo.format("<div class='x-list-single'>#:{0}#</div>" , this._textField);
                options.contain.selectable = options.contain.selectable || "single";
                contain = $Container.kendoListView(options.contain).data("kendoListView");
            } else {
                console.log("Please choose contain mode between treeview and listview");
                return;
            }

            this._contain = contain;
            this._dataSource = contain.dataSource.view().toJSON();

            if (options.multiSelect != true) {
                var singleInput = kendo.format("<div class='x-singlesearch-wrap {0} x-singlesearch{2}' tabindex='-1' id='{1}'>" +
                    "<input title type='text' class='x-input x-search-uid{2}' x-search-uid='{2}'>" +
                    "<span class='x-dropdown-icon x-dropdown-{2}'></span>" +
                    "</div>" , $target.attr("class") , $target.attr("id") , uid);
                $target.replaceWith(singleInput);
                $(document.body)
                    .on("click" , ".x-dropdown-" + uid , function() {
                        $(this).siblings("input")[0].focus();
                    })
            } else {
                //multi select mode
                var multiInput = kendo.format("<div class='x-multisearch-wrap {0} x-multisearch{2}' tabindex='-1' id='{1}' x-search-uid='{2}'>" +
                    "<ul class='x-multi-listbox listbox{2}' uid='{2}'></ul>" +
                    "<input type='text' class ='x-input x-search-uid{2}' style='outline: none;width: 20px; max-width: 100%' tabindex='0'/>" +
                    "</div>" , $target.attr("class") , $target.attr("id") , uid);
                $target.replaceWith(multiInput);

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
                        ul.children().eq(index).remove();
                        that._multiSelected.splice(index , 1);
                        if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                            options.change(that._multiSelected);
                        }})
                    .on("keydown" , ".x-search-uid" + uid , function(e) {
                        if (event.keyCode == 8 && $(this).val() == "" && that._multiSelected.length > 0) {
                            $(this).siblings(".x-multi-listbox").children(":last-child").get(0).remove();
                            that._multiSelected.splice(that._multiSelected.length - 1 , 1);
                            if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                                options.change(that._multiSelected);
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
                                that._addTagLabel(uid, that._find(this._dataSource, value[x].id));
                            } else if (typeof value[x] == 'string') {
                                that._addTagLabel(uid, that._find(this._dataSource, value[x]));
                            }
                        }
                    } else {
                        that._addTagLabel(uid , that._find(this._dataSource , value.id))
                    }
                }
            }
            var event = this._mode == "treeview" ? "select" : "change";
            contain.bind(event , function(e) {
                var node = that._mode == "treeview" ? e.node : e.sender.select();
                var dataItem =  this.dataItem(node);
                if (options.multiSelect != true) {
                    $(".x-search-uid" + uid).val(dataItem[that._textField]);
                    if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                        options.change(dataItem);
                    }
                    $Container.fadeOut(200);
                } else {
                    //multi select mode
                    for (x in that._multiSelected) {
                        if (that._multiSelected[x][that._field] == dataItem[that._field]) {
                            $(".listbox" + uid).find(".x-button-delete").get(x).click();
                            return;
                        }
                    }
                    $(".x-search-uid" + uid).val("");
                    that._addTagLabel(uid , dataItem);
                    if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                        options.change(that._multiSelected);
                    }

                    setTimeout(function() {
                        $(".x-search-uid" + uid).get(0).focus();
                    },30);
                }
            });

            $(document.body)
                .on("focus" , ".x-search-uid" + uid , function() {
                    var target = $(this);
                    // treeview.dataSource.cancelChanges();
                    target.val("");
                    if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                        options.change({});
                    }
                    contain.dataSource.data(that._search(that._dataSource , "", that._field));

                    $Container.attr("style" , that._defaultStyle);
                    if (options.multiSelect == true) {
                        target = $(this).parent();
                    }
                    var top = target.offset().top + target.outerHeight();
                    if (top > $(document.body).height() - $Container.height()) {
                        top = top - target.outerHeight();
                        top = $(document.body).height() - top;
                        $Container.css("bottom" , top);
                    } else {
                        $Container.css("top" , top);
                    }
                    $Container.width(target.outerWidth() - 5);
                    $Container.css("left" , target.offset().left);
                    $Container.stop();
                    $Container.fadeIn(200);})
                .on("mouseout" , ".x-search-container" , function() {that._inTree = false;})
                .on("mouseover" , ".x-search-container" , function() {that._inTree = true;})
                .on("blur" , ".x-search-uid" + uid , function() {
                    if (that._inTree == false) {
                        $Container.stop();
                        $Container.fadeOut(200);
                    }})
                .on("blur" , ".x-search-container" , function() {
                    if (that._inTree == false) {
                        $(this).stop();
                        $(this).fadeOut(200);
                    }})
                .on("input propertychagne" , ".x-search-uid" + uid ,function() {
                    var val = $(this).val();
                    val = val.toUpperCase();
                    var dataSource = contain.dataSource;
                    if (val != "") {
                        var realData = that._search(that._dataSource, val, that._field);
                        dataSource.data(realData);
                    } else {
                        dataSource.data(that._dataSource);
                    }
                    if ($Container.css("display") == "none") {
                        $Container.fadeIn(200);
                    }
                })
                .on("keydown" , ".x-search-uid" + uid , function(e) {
                    var selected = $Container.find(".x-list-selected");
                    if (e.keyCode == 40) { //方向键↓
                        if (that._mode == "listview") {
                            if (selected.length == 0) {
                                $Container.children().eq(0).addClass("x-list-selected");
                            } else {
                                selected.removeClass("x-list-selected").next().addClass("x-list-selected");
                            }
                        } else if (that._mode == "treeview") {

                        }
                    } else if (e.keyCode == 38) { //方向键↑
                        if (that._mode == "listview") {
                            if (selected.length == 0) {
                                $Container.children().last().addClass("x-list-selected");
                            } else {
                                selected.removeClass("x-list-selected").prev().addClass("x-list-selected");
                            }
                        } else if (that._mode == "treeview") {

                        }
                    } else if (e.keyCode == 13) { //回车键
                        if (selected.length > 0) {
                            var dataItem = that._contain.dataItem(selected);
                            $(".x-search-uid" + uid).val(dataItem[that._textField]);
                            if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                                options.change(dataItem);
                            }
                            $Container.fadeOut(200);
                        }
                    }
                });
        },

        clear: function() {
            var element = this._element;
            if ($(element)[0].tagName == "DIV") {
                var uid = $(element).attr("x-search-uid");
                $(element).children("ul").html("");
                this._multiSelected = [];
            } else {
                $(element).val("")
            }
        },

        value: function(v) {
            var element = this._element;
            var that = this;
            var value = v;
            var uid = $(element).attr("x-search-uid");
            if (Array.isArray(value)) {
                for (x in value) {
                    if (typeof value[x] == 'object') {
                        this._addTagLabel(uid, that._find(this._dataSource, value[x].id));
                    } else if (typeof value[x] == 'string') {
                        this._addTagLabel(uid, that._find(this._dataSource, value[x]));
                    }
                }
            } else {
                this._addTagLabel(uid , that._find(this._dataSource , value.id))
            }
        },

        findByText: function(v) {
            return this._find(this._dataSource , v , this._textField);
        },

        _addTagLabel: function(uid , dataItem) {
            for (x in this._multiSelected) {
                if (this._multiSelected[x][this._field] == dataItem[this._field]) {
                    return;
                }
            }
            var singleTag = kendo.format("<li class='x-button'>" +
                "<span class='x-button-text'>{0}</span>" +
                "<span class='x-button-delete'>x</span>" +
                "</li>" , dataItem[this._textField]);
            this._multiSelected.push(dataItem);
            $(".listbox" + uid).append(singleTag);
        },

        _search: function(dataSource , val) {
            var that = this;
            var result = [];
            if (dataSource == null) {
                return null;
            }
            var field = that._field;
            if (Array.isArray(dataSource)) {
                if (that._mode == "treeview") {
                    for (x in dataSource) {
                        (function(index) {
                            var text = dataSource[index][field];
                            if (that._compare(val , text)) {
                                var newParentTreeData = {};
                                for (key in dataSource[index]) {
                                    newParentTreeData[key] = dataSource[index][key];
                                }
                                newParentTreeData["expanded"] = true;
                                result.push(newParentTreeData);
                            } else {
                                var items = that._search(dataSource[index].items, val);
                                if (items != null && items.length > 0) {
                                    var newTreeData = {};
                                    for (key in dataSource[index]) {
                                        newTreeData[key] = dataSource[index][key];
                                    }
                                    newTreeData["items"] = items;
                                    newTreeData["expanded"] = true;
                                    result.push(newTreeData);
                                }
                            }
                        }(x));
                    }
                } else if (that._mode == "listview") {
                    for (x in dataSource) {
                        var text = dataSource[x][field];
                        if (that._compare(val , text)) {
                            result.push(dataSource[x]);
                        }
                    }
                }
            } else {
                var text = dataSource[field];
                if (text.indexOf(val) >= 0) {
                    result.push(dataSource)
                }
            }
            return result;
        },

        _find: function(dataSource , val , field) {
            var that = this;
            var result = null;
            if (dataSource == null) {
                return null;
            }
            field = field || "id";
            if (Array.isArray(dataSource)) {
                if (that._mode == "treeview") {
                    for (x in dataSource) {
                        (function(index) {
                            var text = dataSource[index][field];
                            if (text == val) {
                                result = dataSource[index];
                            } else {
                                result = that._find(dataSource[index].items, val , field);
                            }
                        }(x));
                        if (result != null) {
                            break
                        }
                    }
                } else if (that._mode == "listview") {
                    for (x in dataSource) {
                        var text = dataSource[x][field];
                        if (text == val) {
                            result = dataSource[x];
                            break;
                        }
                    }
                }
            } else {
                var text = dataSource[field];
                if (text == val) {
                    return dataSource;
                }
            }
            return result;
        },

        _compare: function(val , source) {
            var filter = this._searchFilter;
            if (filter == "contains") {
                return source.indexOf(val) >= 0;
            } else {
                return source.indexOf(val) >= 0;
            }
        },
        options: {
            name: "DropDownSearch"
        }
    });
    kendo.ui.plugin(SearchSelectTree);

    var DropDownZdx = kendo.ui.Widget.extend({
        _multiSelect: false,
        _multiSelected:[],
        _inTree: false,
        _enable: true,
        _searchFilter: "contains",
        _field: 'zdpy',
        _textField: "text",
        _searchSize: 100,
        _tmp: "<div class='x-search-container x-uid{0}' id='x-search-container{0}' tabindex='-1'>" +
        "<div class='x-container-treeview'></div><div class='x-container-listview'></div>" +
        "</div>",
        _emptyObj:{id:"",text:"",nbbm:""},

        init: function(element , options) {
            var that = this;
            var uid = that._uuid = getUuid();
            var $target = that._e = $(element);
            kendo.ui.Widget.fn.init.call(that, element, options);
            options = that.options;
            if ($target[0].hasAttribute("disabled") || options.disable == true) {
                that._enable = false;
            }
            that._multiSelect = options.multiSelect || false;
            if (that._multiSelect != true) {
                var singleInput = kendo.format("<input title type='text' class='x-input x-search-uid{0}' x-search-uid='{0}'>" +
                    "<span class='x-dropdown-icon x-dropdown-{0}'></span>",
                    uid);
                $target.addClass("x-singlesearch-wrap x-singlesearch"+ uid + " x-search-outer-" + uid).html(singleInput);
                that.enable(that._enable);
                $(document.body)
                    .on("click" , ".x-dropdown-" + uid , function(e) {
                        e.stopPropagation();
                        $(this).parent().trigger("click");
                    })
            } else {
                //multi select mode
                var multiInput = kendo.format(
                    "<ul class='x-multi-listbox listbox{0}' uid='{0}'></ul>" +
                    "<input type='text' class ='x-input x-search-uid{0}' style='outline: none;width: 20px; max-width: 100%' tabindex='0'/>", uid);
                $target.addClass("x-multisearch-wrap x-multisearch"+ uid + " x-search-outer-" + uid).html(multiInput);
                $(document.body)
                    .on("click" , ".x-button-delete" , function(e) {
                        e.stopPropagation();
                        var index = $(this).parent().index();
                        if (index == -1) {
                            return;
                        }
                        that._deleteTagLabel(index);
                    })
                    .on("keydown" , ".x-search-uid" + uid , function(e) {
                        if (event.keyCode == 8 && $(this).val() == "" && that._multiSelected.length > 0) {
                            $(this).siblings(".x-multi-listbox").children(":last-child").get(0).remove();
                            that._multiSelected.splice(that._multiSelected.length - 1 , 1);
                            if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                                options.change(that._multiSelected);
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
            }

            if ($.isEmptyString(options.zdlx)) {
                that._render([]);
            } else {
                that._zdlx = options.zdlx;
                $.ajax({
                    url: CONTEXT_PATH + "/common-api/getZdx?random=" + Math.random(),
                    type: "GET",
                    data: {zdlx: that._zdlx},
                    success: function(res) {
                        if (res != null && res.length > 0) {
                            that._realTimeData = that._oData = res;
                            that._render(res);
                        }
                        that.trigger("dataBound");
                    },
                    error: function(err) {
                        console.log("字典项加载错误！");
                    }
                })
            }
        },

        _render: function(data) {
            var that = this,
                uid = that._uuid;
            $(document.body).append(kendo.format(that._tmp , uid));

            that._generateTreeview(data);
            that._generateListview([]);

            that._bindCommonEvents();
        },

        _generateTreeview:function(data) {
            var that = this,
                uid = that._uuid,
                container = $(kendo.format("#x-search-container{0}" , uid)),
                level = that.options.level || "1",
                dataSource = that._initTreeData = that._setLevelToTreeData(data , level , 0);

            that._treeview = container.children(".x-container-treeview").kendoTreeView({
                dataSource: dataSource,
                loadOnDemand: true
            }).data("kendoTreeView");
            that._bindChangeEvents(that._treeview);
        },

        _generateListview:function(data) {
            var that = this,
                uid = that._uuid,
                container = $(kendo.format("#x-search-container{0}" , uid));

            that._listview = container.children(".x-container-listview").kendoListView({
                dataSource: data,
                selectable: 'single',
                template: kendo.format("<div class='x-list-single'>#:{0}#</div>" , that._textField)
            }).data("kendoListView");

            that._bindChangeEvents(that._listview);
        },

        _bindChangeEvents: function(obj){
            var that = this,
                uid = that._uuid,
                options = that.options,
                container = $(kendo.format("#x-search-container{0}" , uid));
            obj.bind("change" , function(e) {
                var node = e.sender.select();
                var dataItem =  this.dataItem(node);
                dataItem = dataItem.toJSON();
                if (options.multiSelect != true) {
                    that._change(dataItem);
                    container.fadeOut(200);
                    $(".x-search-outer-" + uid).removeClass('x-state-focused');
                    that._clickControll = 0;
                } else {
                    //multi select mode
                    for (x in that._multiSelected) {
                        if (that._multiSelected[x][that._field] == dataItem[that._field]) {
                            $(".listbox" + uid).find(".x-button-delete").get(x).click();
                            setTimeout(function() {
                                $(".x-search-uid" + uid).get(0).focus();
                            },30);
                            return;
                        }
                    }
                    $(".x-search-uid" + uid).val("");
                    that._addTagLabel(dataItem);
                    setTimeout(function() {
                        $(".x-search-uid" + uid).get(0).focus();
                    },30);
                }
            })

        },

        _bindCommonEvents: function() {
            var that = this,
                uid = that._uuid;

            $(document.body)
                .on("click" , ".x-search-outer-" + uid , $.proxy(that._outerClick , that))
                .on("focus" , ".x-search-uid" + uid , $.proxy(that._focusIn , that))
                .on("mouseout" , ".x-search-container" , function() {that._inTree = false;})
                .on("mouseover" , ".x-search-container" , function() {that._inTree = true;})
                .on("mouseout" , ".x-search-outer-" + uid , function() {that._inTree = false;})
                .on("mouseover" , ".x-search-outer-" + uid , function() {that._inTree = true;})
                .on("mousewheel" , $.proxy(that._blur , that))
                .on("blur" , ".x-search-uid" + uid , $.proxy(that._blur , that))
                .on("blur" , ".x-search-container" , $.proxy(that._blur , that))
                .on("input propertychange" , ".x-search-uid" + uid ,$.proxy(that._inputPropertyChange , that))
                .on("keydown" , ".x-search-uid" + uid , $.proxy(that._keydown , that));
        },
        _outerClick: function() {
            var that = this,
                uid = that._uuid,
                $Container = $(kendo.format("#x-search-container{0}" , uid)),
                target = $(".x-search-outer-" + uid),
                isFocus = $(target).children("input").is(":focus"),
                isShow = $Container.css("display") == "block" && $Container.css("opacity") == "1";

            if (that._clickControll == 1) {
                if (isShow) {
                    that._inTree = false;
                    that._selectVal();
                    $Container.fadeOut(200);
                    target.removeClass('x-state-focused');
                    that._clickControll = 0;
                }
            } else {
                that._clickControll = 1;
                if (!isFocus) {
                    that._inTree = true;
                    $(target).children("input").trigger("focus");
                }
                if (!isShow) {
                    $Container.fadeIn(200);
                    target.addClass('x-state-focused');
                }
            }
        },
        _blur: function() {
            var that = this,
                uid = that._uuid,
                $Container = $(kendo.format("#x-search-container{0}" , uid));

            if ($Container.length == 0) {
                return;
            }
            if (that._inTree == false && $Container.css("display") == "block") {
                that._selectVal();
            }
        },
        _focusIn: function() {
            var that = this,
                uid = that._uuid,
                $Container = $(kendo.format("#x-search-container{0}" , uid)),
                treeContainer = $Container.children(".x-container-treeview"),
                listContainer = $Container.children(".x-container-listview"),
                target = $(".x-search-uid" + uid);
            target.val("");
            if (!that._multiSelect) {
                that._change();
            }
            listContainer.hide();
            that._treeview.dataSource.data(that._initTreeData);
            treeContainer.show().scrollTop(0);

            if (that.options.multiSelect) {
                target = $(target).parent();
            }
            var top = target.offset().top + target.outerHeight();
            if (top >  $(document.body).height() - $Container.height()) {
                top = top - target.outerHeight();
                top = $(document.body).height() - top;
                $Container.css("bottom" , top);
            } else {
                $Container.css("top" , top);
            }
            $Container.width(target.outerWidth() - 10);
            $Container.css("left" , target.offset().left);
            $Container.stop(true,true);
            $Container.fadeIn(200);
            target.parent().addClass('x-state-focused');
        },
        _selectVal: function() {
            var that = this,
                uid = that._uuid,
                $Container = $(kendo.format("#x-search-container{0}" , uid)),
                target = $(".x-search-uid" + uid),
                val = $(target).val().toUpperCase();
            $Container.stop(true , true);
            $Container.fadeOut(200);
            target.parent().removeClass('x-state-focused');
            that._clickControll = 0;
            if ((that._currentItem.id == null || that._currentItem.id == "")
                && (that._currentItem.ID == null || that._currentItem.ID == "")) {
                if (val != "") {
                    if (that._listview.dataSource.view().length > 0) {
                        that._change(that._listview.dataSource.view()[0]);
                    }
                }
            } else {
                $(target).val("");
            }
        },
        _inputPropertyChange: function(){
            var that = this,
                uid = that._uuid,
                $Container = $(kendo.format("#x-search-container{0}" , uid)),
                treeContainer = $Container.children(".x-container-treeview"),
                listContainer = $Container.children(".x-container-listview"),
                target = $(".x-search-uid" + uid);

            var val = $(target).val().toUpperCase();
            if (val != "") {
                var realData = that._search(that._oData, val);
                listContainer.show();
                treeContainer.hide();
                that._listview.dataSource.data(realData);
            } else {
                listContainer.hide();
                treeContainer.show();
                that._treeview.dataSource.data(that._initTreeData);
            }
            if ($Container.css("display") == "none") {
                $Container.fadeIn(200);
                target.parent().addClass('x-state-focused');
            }
        },

        _keydown: function(){
            var that = this,
                uid = that._uuid,
                $Container = $(kendo.format("#x-search-container{0}" , uid)),
                listContainer = $Container.children(".x-container-listview"),
                selectedClass = 'x-list-selected',
                selected = listContainer.find("." + selectedClass);
            if (event.keyCode == 40) { //方向键↓
                selected.removeClass(selectedClass);
                if (selected.length == 0) {
                    listContainer.children().eq(0).addClass(selectedClass);
                    $Container.scrollTop(0);
                } else {
                    if ((selected.offset().top - $Container.offset().top) >=
                        ($Container.height() - selected.outerHeight() * 2)) {
                        $Container.scrollTop($Container.scrollTop() + selected.outerHeight());
                    }
                    selected.next().addClass(selectedClass);
                }
            } else if (event.keyCode == 38) { //方向键↑
                selected.removeClass(selectedClass);
                if (selected.length == 0) {
                    listContainer.children().last().addClass(selectedClass);
                    $Container.scrollTop(listContainer.height())
                } else {
                    if (selected.offset().top - $Container.offset().top < selected.outerHeight() * 2) {
                        $Container.scrollTop($Container.scrollTop() - selected.outerHeight());
                    }
                    selected.prev().addClass(selectedClass);
                }
            } else if (event.keyCode == 13) { //回车键
                if (selected.length > 0) {
                    var dataItem = that._listview.dataItem(selected);
                    if (that._multiSelect) {
                        that._addTagLabel(dataItem);
                    } else {
                        that._change(dataItem);
                    }
                    $Container.fadeOut(200);
                    $(".x-search-outer-" + uid).removeClass('x-state-focused');
                }
            }
        },

        enable: function(bool) {
            var that = this;
            that._enable = bool;
            if (bool) {
                $(that._e).find("input").removeAttr("disabled");
            } else {
                $(that._e).find("input").attr("disabled" , true);
            }
        },
        value: function(obj) {
            var that = this,
                item = null;
            if (obj == undefined) {
                return that._value;
            }
            if (that._oData == null) {
                that._valueInterval = setTimeout(function() {
                    that.value(obj);
                } , 100);
            } else {
                clearTimeout(that._valueInterval);
                if (!isArray(obj)) {
                    if (typeof obj == "string") {
                        item = that.findById(obj);
                        if (item == null) {
                            item = that.findByText(obj);
                        }
                        that._change(item , true);
                    } else if (obj != null) {
                        if (obj.ID != null) {
                            item = that.findById(obj.ID);
                            if (item == null) {
                                item = that.findByText(obj.VALUE);
                            }
                            that._change(item , true);
                        }
                    } else {
                        that._change(null , true);
                    }
                } else {
                    that._multiClear();
                    for (var x = 0 ; x < obj.length ; x++) {
                        item = that.findById(obj[x].ID);
                        if (item == null) {
                            item = that.findByText(obj[x].VALUE);
                        }
                        that._addTagLabel(item , true);
                    }

                }
                that._update(item);
            }
        },

        _itemRender: function(obj) {
            var that = this,
                options = that.options,
                item = {};
            if (options.doubleBind) {
                if (options.multiSelect) {
                    item = [];
                    for (i in obj) {
                        item.push(that._formatItem(obj[i] , options.hasChain));
                    }
                } else {
                    item = that._formatItem(obj , options.hasChain);
                }
            } else {
                item = obj;
            }
            return item;
        },

        _formatItem: function(obj , chain) {
            var that = this,
                options = that.options,
                item = {};
            if (options.valuePrimitive) {
                return obj[options.valueProperty];
            } else {
                item.ID = obj.id;
                item.VALUE = obj.text;
                if (chain) {
                    item.CHAIN = obj.nbbm;
                }
            }

            return item;
        },

        _update: function(v) {
            var that = this;
            that._currentItem = v;
            that._value = v;
            that._old = v;
        },

        _valueInterval: 0,

        findByText: function(v) {
            return this._find(this._oData , v , this._textField);
        },

        findById: function(v) {
            return this._find(this._oData , v , "id");
        },

        getCurrentItem: function() {
            var that = this;
            if (that.options.multiSelect) {
                return this._multiSelected;
            } else {
                return this._currentItem || this._emptyObj;
            }
        },
        getUuid: function() {
            return this._uuid;
        },
        _addTagLabel: function(dataItem , stay) {
            var that = this,
                uid = that._uuid;
            if (dataItem == null) return;
            for (x in that._multiSelected) {
                if (that._multiSelected[x]["id"] == dataItem["id"]) {
                    return;
                }
            }
            var singleTag = kendo.format("<li class='x-button'>" +
                "<span class='x-button-text' title='{0}'>{0}</span>" +
                "<span class='x-button-delete'>x</span>" +
                "</li>" , dataItem[this._textField]);
            that._multiSelected.push(dataItem);
            $(".listbox" + uid).append(singleTag);
            that._update(that._itemRender(that._multiSelected));
            if (!stay) {
                if (that.options.doubleBind) {
                    that.trigger("change");
                } else {
                    if (typeof that.options.change != 'undefined' && typeof that.options.change == 'function') {
                        that.options.change(that._multiSelected);
                    }
                }
            }
        },
        _deleteTagLabel: function(index) {
            var that = this,
                uid = that._uuid,
                target = $(".listbox" + uid);
            target.children().eq(index).remove();
            that._multiSelected.splice(index , 1);
            that._update(that._itemRender(that._multiSelected));
            if (that.options.doubleBind) {
                that.trigger("change");
            } else {
                if (typeof that.options.change != 'undefined' && typeof that.options.change == 'function') {
                    that.options.change(that._multiSelected);
                }
            }
        },

        _find: function(dataSource , val , field) {
            var that = this;
            var result = [];
            if (dataSource == null) {
                return null;
            }
            field = field || "id";
            for (x in dataSource) {
                (function(index) {
                    var text = dataSource[index][field];
                    if (text == val) {
                        result = dataSource[index];
                    } else {
                        result = that._find(dataSource[index].items, val , field);
                    }
                }(x));
                if (result != null) {
                    break
                }
            }
            return result;
        },
        _search: function(dataSource , val , res) {
            var that = this;
            res = res || [];
            if (dataSource == null) {
                return res;
            }
            var field = that._field;
            for (x in dataSource) {
                (function(index) {
                    if (res.length >= that._searchSize) {
                        return res;
                    } else {
                        var text = dataSource[index][field];
                        if (that._compare(val , text)) {
                            res.push(dataSource[index]);
                        }
                        res = that._search(dataSource[index].items, val , res);
                    }

                }(x));
            }
            return res;
        },
        _setLevelToTreeData: function(data , level , iterator) {
            var that = this;
            if (level < iterator) {
                return data;
            }
            if (data != null && data.length > 0) {
                for (x in data) {
                    (function(index) {
                        if (level == iterator) {
                            data[index].expanded = false;
                        } else {
                            data[index].expanded = true;
                            that._setLevelToTreeData(data[index].items , level , iterator + 1)
                        }
                    })(x);
                }
            }
            return data;
        },

        _change: function(dataItem , stay) {
            var that = this,
                uid = that._uuid;

            if (dataItem == null) {
                dataItem = that._emptyObj;
            }
            dataItem.getTarget = function() {return that._e};
            $(".x-search-uid" + uid).val(dataItem["text"]);
            dataItem = that._itemRender(dataItem);
            that._update(dataItem);
            if (!stay) {
                if (that.options.doubleBind) {
                    that.trigger("change");
                } else {
                    that.trigger("change" , dataItem);
                }
            }
        },
        clear: function(){
            var that = this;
            if (that.options.multiSelect) {
                that._multiClear();
            } else {
                this._change();
            }
        },
        _multiClear: function() {
            var that = this;
            that._multiSelected = [];
            $(".listbox" + that._uuid).html("");

        },
        _compare: function(val , source) {
            var that = this;
            val = val.split(" ");
            var res = 0;
            var length = val.length;
            for (var i in val) {
                if (that._filterCompare(val[i] , source)) {
                    res++;
                }

            }
            return length == res;
        },

        _filterCompare: function(val , source) {
            var filter = this.options._searchFilter || "contains";
            if (filter == 'contains') {
                return source.indexOf(val) >= 0;
            } else if (filter == 'startWith') {
                return source.indexOf(val) == 0;
            } else {
                return source.indexOf(val) >= 0;
            }
        },
        destroy: function() {
            var that = this,
                uid = that._uuid,
                e = that._e;

            $("#x-search-container" + uid)[0].remove();
            $(".x-search-outer-" + uid).replaceWith(e);
            kendo.ui.Widget.fn.destroy.call(that);
        },

        options: {
            name: "DropDownZdx",
            zdlx: "",
            multiSelect: false,
            value: null,
            doubleBind: false,
            hasChain: false,
            valueProperty: 'id',
            valuePrimitive: false
        },
        events: ['change', 'dataBound']
    });
    kendo.ui.plugin(DropDownZdx);

    var ZdxWindow = kendo.ui.Widget.extend({
        _windowTmp :"<div class='x-window x-window-uid-{0}'>" +
            "<div class='x-window-title'></div>" +
            "<div class='x-window-searchBar'>" +
            "<input title class='x-window-searchInput'>" +
            "<span class='x-window-clearButton'></span>"+
            "<span class='x-window-resetButton'></span>" +
            "<span class='x-window-closeButton'></span></div> " +
            "<div class='x-window-container'>" +
            "<div class='x-container-treeview'></div> " +
            "<div class='x-container-listview'></div> " +
        "</div></div>",
        _wrapperTmp: "<span class='x-zdx-text'></span><span class='x-zdx-reset'></span>",
        _window: null,
        _searchFilter: "contains",
        _field: 'zdpy',
        _textField: "text",
        _searchSize: 100,
        _currentItem:"",
        init: function(element , options) {
            var that = this;

            that._uuid = getUuid();
            that._e = $(element);
            kendo.ui.Widget.fn.init.call(that, element, options);
            that._options = options;
            that._initWindow();
            that._wrapper();
            if ($.isEmptyString(options.zdlx)) {
                that._render([]);
            } else {
                that._zdlx = options.zdlx;
                $.ajax({
                    url: CONTEXT_PATH + "/common-api/getZdx?random=" + Math.random(),
                    type: "GET",
                    data: {zdlx: that._zdlx},
                    success: function(res) {
                        if (res != null && res.length > 0) {
                            that._realTimeData = that._oData = res;
                            that._render(res);
                        }
                    },
                    error: function(err) {

                    }
                })
            }

        },
        _render: function(data) {
            var that = this;
            that._generateTreeview(data);
            that._generateListview([]);
        },
        _generateTreeview: function(data) {
            var that = this,
                uid = that._uuid,
                container = $(kendo.format(".x-window-uid-{0}" , uid)),
                level = that._options.level || "1",
                dataSource = that._initTreeData = that._setLevelToTreeData(data , level , 0);

            that._treeview = container.find(".x-container-treeview").kendoTreeView({
                dataSource: dataSource,
                loadOnDemand: true
            }).data("kendoTreeView");
            that._bindChangeEvents(that._treeview);
        },
        _generateListview: function(data) {
            var that = this,
                uid = that._uuid,
                container = $(kendo.format(".x-window-uid-{0}" , uid));

            that._listview = container.find(".x-container-listview").kendoListView({
                dataSource: data,
                selectable: 'single',
                template: kendo.format("<div class='x-list-single'>#:{0}#</div>" , that._textField)
            }).data("kendoListView");

            that._bindChangeEvents(that._listview);
        },
        _bindChangeEvents: function(obj){
            var that = this,
                uid = that._uuid,
                options = that._options,
                window = that._window;
            obj.bind("change" , function(e) {
                var node = e.sender.select();
                var dataItem =  this.dataItem(node);
                that._change(dataItem);
                window.close();
            })

        },
        getCurrentItem: function() {
            return this._currentItem;
        },
        _initWindow: function() {
            $(document.body).append(kendo.format(this._windowTmp , this._uuid));
            var that = this,
                container = that._windowContainer =  $(".x-window-uid-" + this._uuid),
                listContainer = container.find(".x-container-listview"),
                treeContainer = container.find(".x-container-treeview");
            that._window = container.kendoWindow({
                width: 400,
                height: 500,
                modal: true,
                visible: false,
                resizable: false,
                title: false,
                draggable: false,
                scrollable: false
            }).data("kendoWindow");

            container.on("input propertychange" , ".x-window-searchInput" ,function(){
                    var val = $(this).val();
                    val = val.toUpperCase();
                    if (val != "") {
                        var realData = that._search(that._oData, val);
                        listContainer.show();
                        treeContainer.hide();
                        that._listview.dataSource.data(realData);
                        $(this).siblings(".x-window-clearButton").show();
                    } else {
                        that._reset();
                    }
                })
                .on("keydown" , ".x-window-searchInput" , function(e) {
                    var selected = listContainer.find(".x-list-selected");
                    if (e.keyCode == 40) { //方向键↓
                        if (selected.length == 0) {
                            listContainer.children().eq(0).addClass("x-list-selected");
                        } else {
                            selected.removeClass("x-list-selected").next().addClass("x-list-selected");
                        }
                    } else if (e.keyCode == 38) { //方向键↑
                        if (selected.length == 0) {
                            listContainer.children().last().addClass("x-list-selected");
                        } else {
                            selected.removeClass("x-list-selected").prev().addClass("x-list-selected");
                        }
                    } else if (e.keyCode == 13) { //回车键
                        if (selected.length > 0) {
                            var dataItem = that._listview.dataItem(selected);
                            that._change(dataItem);
                            that._close();
                        }
                    }
                })
                .on("click" , ".x-window-clearButton" , function() {
                    that._reset();
                })
                .on("click" , ".x-window-closeButton" , function() {
                    that._close();
                });
                // .on("click" , ".x-window-resetButton" , function() {
                //     that._change();
                //     that._close();
                // });

            $(document.body).on("click",".k-overlay" , function(){
                that._close();
            });
        },
        _wrapper: function() {
            var that = this;
            that._e.addClass("x-zdx-wrapper").addClass("x-zdx-wrapper-" + that._uuid).html(that._wrapperTmp);
            that._e
                .on("click" , ".x-zdx-text", function() {
                    that._window.center().open();
                    that._reset();
                }).
                on("click" , ".x-zdx-reset" , function() {
                    $(this).siblings(".x-zdx-text").text("");
                    that._change();
                })
        },
        _find: function(dataSource , val , field) {
            var that = this;
            var result = [];
            if (dataSource == null) {
                return null;
            }
            field = field || "id";
            for (x in dataSource) {
                (function(index) {
                    var text = dataSource[index][field];
                    if (text == val) {
                        result = dataSource[index];
                    } else {
                        result = that._find(dataSource[index].items, val , field);
                    }
                }(x));
                if (result != null) {
                    break
                }
            }
            return result;
        },
        _search: function(dataSource , val , res) {
            var that = this;
            res = res || [];
            if (dataSource == null) {
                return res;
            }
            var field = that._field;
            for (x in dataSource) {
                (function(index) {
                    if (res.length >= that._searchSize) {
                        return res;
                    } else {
                        var text = dataSource[index][field];
                        if (that._compare(val , text)) {
                            res.push(dataSource[index]);
                        }
                        res = that._search(dataSource[index].items, val , res);
                    }

                }(x));
            }
            return res;
        },
        _setLevelToTreeData: function(data , level , iterator) {
            var that = this;
            if (level < iterator) {
                return data;
            }
            if (data != null && data.length > 0) {
                for (x in data) {
                    (function(index) {
                        if (level == iterator) {
                            data[index].expanded = false;
                        } else {
                            data[index].expanded = true;
                            that._setLevelToTreeData(data[index].items , level , iterator + 1)
                        }
                    })(x);
                }
            }
            return data;
        },
        _change:function(dataItem) {
            var that = this,
                uid = that._uuid,
                options = that._options,
                container = $(".x-zdx-wrapper-" + uid).children(".x-zdx-text");
            if (dataItem == null) {
                dataItem = "";
                container.text("");
            } else {
                dataItem.domUuid = uid;
                container.text(dataItem["text"]);
            }
            that._currentItem = dataItem;
            if (typeof options.change != 'undefined' && typeof options.change == 'function') {
                options.change(dataItem);
            }
        },
        _compare: function(val , source) {
            var that = this;
            val = val.split(" ");
            var res = 0;
            var length = val.length;
            for (var i in val) {
                if (that._filterCompare(val[i] , source)) {
                    res++;
                }
            }
            return length == res;
        },
        _filterCompare: function(val , source) {
            var filter = this._options.searchFilter || 'contains';
            if (filter == 'contains') {
                return source.indexOf(val) >= 0;
            } else if (filter == 'startWith') {
                return source.indexOf(val) == 0;
            } else {
                return source.indexOf(val) >= 0;
            }
        },
        _close: function(){
            this._window.close();
        },
        _reset: function() {
            var that = this,
                container = that._windowContainer;
            container.find(".x-window-searchInput").val("")[0].focus();
            container.find(".x-window-clearButton").hide();
            container.find(".x-container-listview").hide();
            container.find(".x-container-treeview").show().scrollTop(0);
            that._treeview.dataSource.data(that._initTreeData);
        },
        options:{
            name: 'ZdxWindow'
        }
    });
    kendo.ui.plugin(ZdxWindow);

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
        return uuid.join('').replace(/-/g , "");
    }

    function isArray(obj) {
        return Array.isArray(obj) || (obj instanceof Object && obj.length);
    }

});