define([CONTEXT_PATH + '/ezSafe/qyda/whpqygl/whpcl/whpcl.js',
    CONTEXT_PATH + '/ezSafe/qyda/whpqygl/zdwxy/zdwxy.js',
    CONTEXT_PATH + '/ezSafe/qyda/whpqygl/scgy/scgy.js',
    CONTEXT_PATH + '/ezSafe/qyda/whpqygl/aqss/aqss.js',
    CONTEXT_PATH + '/ezSafe/qyda/whpqygl/rcgl/rcgl.js'], function (Whpcl, Zdwxy, Scgy, Aqss, Rcgl) {
    function WhpqyDetail(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
        this.qybh = this.qybh || null;
        this.selectedTab = this.selectedTab || "whpcl";
        this.components = {
            "whpcl": new Whpcl(),
            "zdwxy": new Zdwxy(),
            "scgy": new Scgy(),
            "aqss": new Aqss(),
            "rcgl": new Rcgl()
        }
    }

    WhpqyDetail.prototype = {
        _init: function () {
            this._bindPageEvent();
        },
        showData: function (data) {
            var self = this;
            if (data) {
                self.qybh = data;
                self.components[self.selectedTab].showData({"qyxx.qybh": self.qybh});
            } else {
                self.components[self.selectedTab].clearData();
            }
        },
        resize: function () {
        },
        _bindPageEvent: function () {
            var self = this;
            $("#tab-container .tab-button").click(function () {
                if (!$(this).hasClass("selected")) {
                    $(this).siblings().removeClass("selected");
                    $(this).addClass("selected");
                    var componentID = $(this).attr("id").substring(4);
                    var contentID = "#detail-" + componentID;
                    $(contentID).siblings().removeClass("selected");
                    $(contentID).addClass("selected");
                    if (self.components[componentID])
                        self.components[componentID].showData({"qyxx.qybh": self.qybh});
                }
            })
        }
    };

    return WhpqyDetail;
});