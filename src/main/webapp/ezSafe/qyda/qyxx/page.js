require([CONTEXT_PATH + '/ezSafe/lib_js/avatarConfig.js'], function () {
    require(['jquery'], function () {
        require(['lib/domReady!', 'ezviewCommon'], function (domReady, common) {
            require([CONTEXT_PATH + '/ezSafe/qyda/qyxx/qygk/qygk.js',
                CONTEXT_PATH + '/ezSafe/qyda/qyxx/flfg/flfg.js',
                CONTEXT_PATH + '/ezSafe/qyda/qyxx/qyxq/qyxq.js',
                CONTEXT_PATH + '/ezSafe/qyda/qyxx/zzjg/zzjg.js',
                CONTEXT_PATH + '/ezSafe/qyda/qyxx/qydsj/qydsj.js',
                CONTEXT_PATH + '/ezSafe/qyda/qyxx/aqyh/aqyh.js',
                CONTEXT_PATH + '/ezSafe/qyda/qyxx/aqsg/aqsg.js',
                CONTEXT_PATH + '/ezSafe/qyda/qyxx/yjya/yjya.js'
            ], function (Qygk, Flfg, Qyxq, Zzjg, Qydsj, Aqyh, Aqsg, Yjya) {
                var Page = {
                    components: {},
                    qybh: $.getUrlParams().qybh || "2c9080345fa04a7e015fa052018e20d3",
                    init: function () {
                        var yjya = new Yjya();
                        var qyxq = new Qyxq();
                        var qygk = new Qygk({yjya: yjya, qyxq: qyxq});
                        qygk.showData(this.qybh);

                        this.components.flfg = new Flfg();
                        this.components.zzjg = new Zzjg();
                        this.components.qydsj = new Qydsj();
                        this.components.aqyh = new Aqyh();
                        this.components.aqsg = new Aqsg();

                        this._bindPageEvent();

                        window.addEventListener("resize", function () {
                            qygk.resize();
                        })
                    },
                    _bindPageEvent: function () {
                        var self = this;
                        /*  主标题切换 */
                        $(".title-sub").click(function () {
                            if (!$(this).hasClass("selected")) {
                                $(this).siblings().removeClass("selected");
                                $(this).addClass("selected");
                                var componentID = $(this).attr("id").substring(9);
                                var mainID = "#main-" + componentID;
                                $(mainID).siblings().removeClass("selected");
                                $(mainID).addClass("selected");
                                if (self.components[componentID])
                                    self.components[componentID].showData({"qyxx.qybh": self.qybh});
                            }
                        })

                        /*  副标题切换 */
                        $(".switch-button").click(function () {
                            if (!$(this).hasClass("selected")) {
                                $(this).siblings().removeClass("selected");
                                $(this).addClass("selected");
                                var componentID = $(this).attr("id").substring(7);
                                var contentID = "#content-" + componentID;
                                $(contentID).siblings().removeClass("selected");
                                $(contentID).addClass("selected");
                                if (self.components[componentID])
                                    self.components[componentID].showData({"qyxx.qybh": self.qybh});
                            }
                        })
                    }
                };

                Page.init();
            });
        });
    });
});