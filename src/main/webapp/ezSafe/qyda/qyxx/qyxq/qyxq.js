define([], function () {
    function Qyxq(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
    }

    Qyxq.prototype = {
        _init: function () {

        },
        showData: function (result) {
            var self = this;
            if(result.message === undefined){
                if(result.TZZE !== undefined){
                    result.TZZE.JE = result.TZZE.JE + result.TZZE.DW;
                }
                if(result.GDZCZE !== undefined){
                    result.GDZCZE.JE = result.GDZCZE.JE + result.GDZCZE.DW;
                }
                if(result.NLRZE !== undefined){
                    result.NLRZE.JE = result.NLRZE.JE + result.NLRZE.DW;
                }
                if(result.NXSSRZE !== undefined){
                    result.NXSSRZE.JE = result.NXSSRZE.JE + result.NXSSRZE.DW;
                }
                if(result.ZCZB !== undefined){
                    result.ZCZB.JE = result.ZCZB.JE + result.ZCZB.DW;
                }
                result.BGLJZMJ = result.BGLJZMJ ? result.BGLJZMJ + "平方米" : "";
                result.CJCFJZMJ = result.CJCFJZMJ ? result.CJCFJZMJ  + "平方米" : "";
                result.CKJZMJ = result.CKJZMJ ? result.CKJZMJ + "平方米" : "";
                result.ZDMJ = result.ZDMJ ? result.ZDMJ + "平方米" : "";

                if (!self.mvvmInit) {
                    self.viewModel = kendo.observable({
                        dataKendo: result
                    });
                    kendo.bind($(".qyjbxx"), self.viewModel);
                    kendo.bind($(".qyzcxx"), self.viewModel);
                    kendo.bind($(".qygmxx"), self.viewModel);
                    self.mvvmInit = true;
                } else {
                    self.viewModel.set("dataKendo", result);
                }
            }else {
                kendo.ui.ExtMessageDialog.show({
                    messageType: "warn",
                    message: "数据为空",
                    autoDisappearTime: 1500
                });
            }

            $(".long").hover(function (e) {
                $(this).attr("title", e.currentTarget.innerText);
            });
        },
        resize: function () {

        }
    };

    return Qyxq;
});