define(['lib/domReady!', 'jquery', 'kendo', 'lib/text!./wgxxSelect.ftl'], function (dom, jquery, kendo, wgxxHtml) {
    (function ($) {
        $.fn.wgxxSelect = function (config) {
            if (typeof config != "object") {
                config = {};
            }

            var cssUrl = require.toUrl("wgxxSelect/wgxxSelect.css");
            loadCss(cssUrl);

            var context = $(this);

            if(!context.hasClass("wgxx-window")){
                context.addClass("wgxx-window");
            }

            if(context.attr("wgxx-id")==null){
                var randomId =  new Date().getTime();
                context.attr("wgxx-id",randomId);


                context.html(wgxxHtml);
                config.context = context;

                return new WgxxSelect(config,randomId);
            }


        }
    })(jQuery);

    function WgxxSelect(config,randomId) {
        this.filter = "[wgxx-id="+randomId+"]";
        $.extend(this, config);
        this.init();
    }

    WgxxSelect.prototype = {
        context: null,
        change: null,
        value: null,
        text:null,

        init:function() {
            this.context.kendoWindow({
                width: "28%",
                height: "70%",
                visible: false,
                title: false,
                modal: true,
                resizable: false
            }).data("kendoWindow");

            this.bindClickEvent();
            this.searchWgxx("*");
        },

        /**
         * 绑定点击事件
         */
        bindClickEvent: function() {
            var self = this;

            /**
             * 绑定查询事件
             */
            $(self.filter+" .wgxxSelect-search-button").click(function() {
                var gjz = $(self.filter+" .wgxxSelect-input").val();
                self.searchWgxx(gjz);
            });

            /**
             * 重置
             */
            $(self.filter+" .wgxxSelect-reset-button").click(function() {
                $(self.filter+" .wgxxSelect-input").val(" ");
                self.text = null;
                self.value = null;
                self.searchWgxx("*");
            });

            /**
             * 回车
             */
            $(self.filter+" .wgxxSelect-input").keypress(function () {
                if (event.keyCode == 13) {
                    $(self.filter+" .wgxxSelect-search-button").click();
                }
            });
            $(self.filter+" .wgxx-close-button").click(function () {
                self.context.data("kendoWindow").close();
            })


        },

        /**
         * 搜索网格信息
         * @param gjz
         */
        searchWgxx: function(gjz) {
            var self = this;
            var params = {
                WGMC: "*"+gjz+"*"
            };
            $.ajax({
                url: CONTEXT_PATH + "/common-api/getWgxx",
                type: "GET",
                data: params,
                dataType: "json",
                success: function (result) {
                    var data = result.data;
                    $(self.filter+" .wgxxSelect-listview-container").kendoListView({
                        dataSource: data,
                        template: '<div class="wgxxListView" >#:data.WGMC#</div>',
                        dataBound: function() {
                            var thisList = this;

                            $(self.filter+" .wgxxListView").click(function(e) {
                                var dataItem = thisList.dataItem(e.currentTarget);
                                $(self.filter+" .wgxxList-select").removeClass("wgxxList-select");
                                $(this).addClass("wgxxList-select");
                                $(self.filter+" .wgxxSelect-input").val(dataItem.WGMC);
                            });

                            $(self.filter+" .wgxxListView").dblclick(function(e) {
                                var dataItem = thisList.dataItem(e.currentTarget);
                                self.value = dataItem.WGBH;
                                self.text = dataItem.WGMC;
                                if (typeof self.change != 'undefined' && typeof self.change == 'function') {
                                    self.change(self.text , self.value);
                                }
                                self.context.data("kendoWindow").close();

                            })
                        }
                    });
                }
            });
        },

        openWgxx: function () {
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