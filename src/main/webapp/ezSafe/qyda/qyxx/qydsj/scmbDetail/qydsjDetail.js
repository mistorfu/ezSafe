define([], function () {
    var Page = {
        init: function () {
            var self = this;
        },
        scmbDetail: function (xxbh) {
            var self = this;
            $.ajax({
                url: CONTEXT_PATH + "/api/qyda/qyxx/getScmbDetail",
                type: "GET",
                cache: false,
                async:false,
                data:{
                    "XXBH":xxbh,
                },
                dataType: "json",
                success: function (data) {
                    $("#scmbWindow").data("kendoWindow").center().open();
                    self.showScmbData(data);
                }
            });

        },
        showScmbData: function (data) {
            var self = this;

            $("#scmbWindow").data("kendoWindow").center().open();
            var scmbTemplate = kendo.template($("#scmbTemplate").html());
            var result = scmbTemplate(data);
            $("#scmbWindow").html(result);
            if(data.ZTMB){
                self.strReset(data.ZTMB, "#ztmb-detail", 108);
            }
            if(data.NDMB){
                self.strReset(data.NDMB, "#ndmb-detail", 108);
            }
            self.bindEvent();
        },
        //大段文字是否换行
        strReset: function (str, location, rowLength) {
            var self = this;
            $(location).html("");
            if(str.search("\n") != -1){
                var strArray = str.split(/\n/g);
                for(var i = 0; i < strArray.length; i++){
                    var stri = strArray[i];
                    self.moreRowsReset(stri, location, rowLength);
                }
            } else {
                self.moreRowsReset(str, location, rowLength);
            }
        },

        //大段文字整理（参考：https://blog.csdn.net/qq_26230421/article/details/82908267）
        moreRowsReset: function (str, location, rowLength) {
            var self = this;
            var len = str.length;
            var lenByte = self.getByteLength(str);
            var k = rowLength;
            for(var i = 0; i < lenByte; i+=rowLength){
                //如果这一段文字为空的话，直接break
                if(str.substring(Math.ceil(i/2)).length === 0){
                    break;
                }
                //是否为最后一行
                if(lenByte - i > rowLength){
                    var strtemp = str.substring(Math.ceil((i+rowLength)/2));
                    // var reg = new RegExp("[\\u4E00-\\u9FFF]+$","g");
                    // var reg =/\p{P}/;
                    var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
                    //每行的字符数是否变化
                    if(k - rowLength == 4){
                        rowLength+=4;
                    }
                    //行首是否为标点符号
                    if(reg.test(strtemp.charAt(0)) || strtemp == ""){
                        rowLength-=4;
                    }
                    var strTemp = str.substring(Math.ceil(i/2),Math.ceil((i+rowLength)/2));

                    $(location).append("<span class=\"cnnr-detail\">"+strTemp+"</span>");

                }else{
                    var strTemp = str.substring(Math.ceil(i/2),Math.ceil((i+rowLength)/2));
                    //var len = strTemp.length;
                    var lenb = self.getByteLength(strTemp);
                    if(lenb <= 1){
                        break;
                    };
                    $(location).append("<span class=\"cnnr-detail\""+ " style='text-align: left; text-align-last: left;'" +">"+strTemp+"</span>");
                }
            }
        },
        getByteLength: function (str) {
            var len = str.length;
            var blen = 0;
            for(i=0; i<len; i++) {
                if ((str.charCodeAt(i) & 0xff00) != 0) {
                    blen ++;
                }
                blen ++;
            }
            return blen;
        },

        bindEvent: function () {
            $("#scmbDetailClose").bind("click", function () {
                $("#scmbWindow").data("kendoWindow").close();
            })
        },
    };

    Page.init();
    return Page;
});