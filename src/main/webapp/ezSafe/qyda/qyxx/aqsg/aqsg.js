define([CONTEXT_PATH + '/ezSafe/qyda/qyxx/aqsg/aqsgEdit.js'], function (aqsgEdit) {
    function Aqsg(options) {
        this.tab = document.getElementById("aqsg-center");
        this.len = 0;
        this.leftR = 0;
        this.rightR = 0;
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();

    }

    Aqsg.prototype = {
        _init: function () {
            var self = this;
            //A 是起始位置 B是结束为止 rate是速率
            Math.easeout = function (A, B, rate, callback) {
                if (A == B || typeof A != 'number') {
                    return;
                }
                B = B || 0;
                rate = rate || 2;

                var step = function () {
                    A = A + (B - A) / rate;

                    if (Math.abs(A - B) < 1) {
                        callback(B, true);
                        return;
                    }
                    callback(A, false);
                    requestAnimationFrame(step);
                };
                step();
            };
            document.getElementById("next").onclick = function (ev) {
                self.moveRight();
            };
            document.getElementById("prev").onclick = function (ev) {
                self.moveLeft();
            };


        },

        /*bindEvent: function () {
            $("#aaaa").click(function (e) {
                var dataItem = "";
                aqsgEdit.aqsgDetail(dataItem);

            })
        },*/

        showData: function (param) {
            var self = this;
            self.params = param;
            var nowdate = new Date;
            var nowyear = nowdate.getFullYear();
            $("#dqyear").html(nowyear);
            $("#preyear").html(nowyear + 1);
            $.ajax({
                url: CONTEXT_PATH + "/api/aqsg/getaqsg",
                type: "POST",
                cache: false,
                dataType: "json",
                data: {
                    KSSJ: nowyear,
                    QYBH: param["qyxx.qybh"]
                },
                success: function (data) {
                    var template = kendo.template($("#javascriptTemplate").html());
                    var result = template(data);
                    $("#template").html(result);
                    self.len = $(".aqsg-span").length;
                    self.leftR = self.len - 4;
                    self.tab.scrollLeft = 0;
                    self.moveLefto();
                    if (data.length > 0) {
                        $(".sgxq").click(function (e) {
                            var detail = e.currentTarget;
                            var xxbh = detail.id;
                            aqsgEdit.aqsgDetail(xxbh);
                        });
                    }
                }
            })

        },
        resize: function () {

        }
        ,
        moveLefto: function () {
            var self = this;
            var size = $(".aqsg-span").size();
            self.length = $(".aqsg-span").eq(0).width() * (size - 4);
            Math.easeout(self.tab.scrollLeft, self.tab.scrollLeft + self.length, 2, function (value) {
                self.tab.scrollLeft = value;
            });

            self.leftR = 0;
            self.rightR = size - 4;
        }


        ,
        moveLeft: function () {
            var self = this;
            self.length = $(".aqsg-span").eq(0).width();
            if (self.leftR < 1) {

                var preyear = $("#preyear").text();
                if (parseInt(preyear) > new Date().getFullYear()) {
                    return;
                }
                $("#preyear").text(parseInt(preyear) + 1);
                $("#dqyear").text(parseInt(preyear));
                self.nextyear(preyear);
                return;


            }
            Math.easeout(self.tab.scrollLeft, self.tab.scrollLeft + self.length, 2, function (value) {
                self.tab.scrollLeft = value;
            });
            self.leftR--;
            self.rightR++;
        },
        moveRight: function () {
            var self = this;
            self.length = $(".aqsg-span").eq(0).width();
            if (self.rightR < 1) {

                //上一年
                var dqyear = $("#dqyear").text();
                $("#preyear").text(dqyear);
                $("#dqyear").text(parseInt(dqyear) - 1);
                self.nextyear(dqyear - 1);

                return;
            }
            Math.easeout(self.tab.scrollLeft, self.tab.scrollLeft - self.length, 2, function (value) {
                self.tab.scrollLeft = value;
            });
            self.rightR--;
            self.leftR++;
        },

        bindEvent: function () {
            var self = this;
            $("#bdzyWindow").click(function () {
                aqsgEdit.zzjgDetail();
            });


        },

        nextyear: function (nowyear) {
            var self = this;
            $.ajax({
                url: CONTEXT_PATH + "/api/aqsg/getaqsg",
                type: "POST",
                cache: false,
                dataType: "json",
                data: {
                    KSSJ: nowyear,
                    QYBH: self.params["qyxx.qybh"]
                },
                success: function (data) {
                    // if(data.length == 0){
                    //     $("#headys").hide();
                    //     $("#dqyear").hide();
                    //     $("#endys").hide();
                    //     $("#preyear").hide();
                    // }
                    var template = kendo.template($("#javascriptTemplate").html());
                    var result = template(data);
                    $("#template").html(result);
                    self.len = $(".aqsg-span").length;
                    self.leftR = self.len - 4;
                    self.tab.scrollLeft = 0;
                    self.moveLefto();
                }
            })
        }
    };

    return Aqsg;
})