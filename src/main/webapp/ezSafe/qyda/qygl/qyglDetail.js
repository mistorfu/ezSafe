define([], function () {
    function QyglDetail(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
        this.viewModel = this.viewModel || null;
        this._imageLength = 0;
        this._slideWidth = $("#detail-QYTP").width();
        this._imageIndex = 0;
        this._picContainers = [];
    }

    QyglDetail.prototype = {
        _init: function () {
            this._bindMVVM();
            this._bindPageEvent();
        },
        showData: function (data) {
            if (data) {
                this.viewModel.set("dataKendo", data);
                $("#detail-QYTP ul li").html("");
                if (data["QYTP"]) {
                    if (typeof data["QYTP"].length != "number")
                        data["QYTP"] = [data["QYTP"]];

                    this._imageLength = data["QYTP"].length;
                    $("#detail-QYTP ul").width(this._slideWidth * this._imageLength);
                    $("#detail-QYTP ul li").width(this._slideWidth);
                    this._picContainers = [];
                    for (var i = 0; i < data["QYTP"].length; i++) {
                        this._picContainers.push($("#detail-QYTP ul li:nth-child(" + (i + 1) + ")").setImg(data["QYTP"][i].TPDZ));
                    }
                    if (this._imageLength > 0) this._slideOne(0);
                }
            } else {
                $("#detail-QYTP ul li").html("");
                this.viewModel.set("dataKendo", null);
            }
        },
        resize: function () {
            this._slideWidth = $("#detail-QYTP").width();
            $("#detail-QYTP ul").width(this._slideWidth * this._imageLength);
            $("#detail-QYTP ul li").width(this._slideWidth);
            if (document.webkitFullscreenElement || document.fullscreenElement || document.msFullscreenElement)
                $("#detail-QYTP ul li").width("100%");
        },
        _bindMVVM: function () {
            this.viewModel = kendo.observable({
                dataKendo: null
            });
            kendo.bind($("#detail-container"), this.viewModel);
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
                    if (componentID == "jbxx") {
                        setTimeout(function () {
                            for (var i = 0; i < self._picContainers.length; i++) {
                                self._picContainers[i].reset();
                            }
                        }, 100);
                    }
                }
            })

            $("#btn-next").click(function () {
                if (self._imageIndex < (self._imageLength - 1)) self._imageIndex++;
                self._slideOne(self._imageIndex);
            })

            $("#btn-prev").click(function () {
                if (self._imageIndex != 0) self._imageIndex--;
                self._slideOne(self._imageIndex);
            })
        },
        _slideOne: function (i) {
            var scrollVal = i * this._slideWidth;
            $("#detail-QYTP .image-container").stop().animate({
                scrollLeft: scrollVal
            }, 300);
            $("#detail-QYTP .index").html(this._imageLength + "-" + (i + 1));
            this._picContainers[i].reset();

            if (i <= 0)
                $("#btn-prev").hide();
            else
                $("#btn-prev").show();

            if (i >= this._imageLength - 1)
                $("#btn-next").hide();
            else
                $("#btn-next").show();
        }
    };

    return QyglDetail;
});