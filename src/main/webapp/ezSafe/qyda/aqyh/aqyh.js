define([CONTEXT_PATH + '/ezSafe/qyda/aqyh/details/xcrwEdit.js'], function (xcrwContent) {
    function Aqyh(options) {
        this.qybh = "";
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();

    }

    Aqyh.prototype = {
        _init: function () {
            var self = this;
            document.getElementById("aqyh-next").onclick =function (ev) {
                self.moveRight();
            };
            document.getElementById("aqyh-prev").onclick =function (ev) {
                self.moveLeft();
            };
            var now = new Date().getFullYear();
            $("#aqyh-year-left").text(now);
            $("#aqyh-year-right").text(now+1);
        },
        showData: function (param) {
            if(!param || param==""){

                return;
            }
            var self = this;
            self.qybh =  param["qyxx.qybh"];
            var year = new Date().getFullYear();

            var map = {
                year:year,
                qybh: self.qybh
            }

            self.doPost(map);
        },
        resize: function () {

        }
        ,
        moveRight:function () {
            var self = this;
            if(self.qybh=="") {
             return ;
            }

            var left = $("#aqyh-year-left").text();

            try{
                if(parseInt(left)<1940){

                    return;
                }

            }catch (e) {

                return;
            }
            var map = {
                year:left-1,
                qybh: self.qybh
            }
            self.doPost(map);
            $("#aqyh-year-left").text(parseInt(left)-1);
            $("#aqyh-year-right").text(left);
        },
        moveLeft: function () {
            var self = this;
            if(self.qybh=="") {
                return ;
            }

            var right = $("#aqyh-year-right").text();

            var year = new Date().getFullYear();
            try{
                if(parseInt(right)>parseInt(year)){

                    return;
                }

            }catch (e) {

                return;
            }

            var map = {
                year:parseInt(right),
                qybh: self.qybh
            }
            self.doPost(map);
            $("#aqyh-year-right").text(parseInt(right)+1);
            $("#aqyh-year-left").text(right);
        },
        doPost:function (params) {
            $.ajax({
                url:"qyxx/aqyh",
                type:"get",

                data:{year:params.year,qybh:params.qybh},
                success:function (data) {

                    var template = kendo.template($("#aqyh-javascriptTemplate").html());

                    for(var i=1;i<=4;i++){
                        obj = data["season"+i];
                        if(!obj || obj.length<1 ){
                            $("#s"+i).attr("class","aqyh-circle-s");
                            $("#season"+i).html("");
                        }else{
                            $("#season"+i).html(template(obj));
                            $("#s"+i).attr("class","aqyh-circle");
                        }
                    }

                    $(".time").find("a").click(function () {

                        var mark = $(this).parent("div").attr("mark")
                        var ul = $(this).parent(".time").parent("div").parent("li").parent("ul");
                        var tdata = data[$(ul).attr("id")];
                        var showdata = tdata[parseInt(mark.substring(5,mark.length))]
                        xcrwContent.xcrwDetail(showdata);
                    })


                },
                error:function (data) {

                }
            })
        }
    };


    return Aqyh;
});