define([CONTEXT_PATH + '/ezSafe/qyda/qyxx/qydsj/qydsj.js'], function (Qydsj) {
    function Zzxk(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
    }

    Zzxk.prototype = {

        _init: function () {

        },

        showZzxkDetail: function (e) {
            var self = this;
            self.bindZzxkWindow();
            self.getZzxkData(e);

        },
        /**
         * 资质许可详情弹窗点击事件
         */
        bindZzxkWindow: function () {
            $("#close-button-zzxk").click(function () {
                $("#zzxkWindow").data("kendoWindow").close();
            });

        },
        getZzxkData: function (e) {
            var self = this;
            var dataitem = e.currentTarget;
            var xxbh = dataitem.id;
            $.ajax({
                url: CONTEXT_PATH + "/api/qyda/qyxx/getZzxkDetail",
                type: "GET",
                cache: false,
                async: false,
                data: {
                    "XXBH": xxbh
                },
                dataType: "json",
                success: function (data) {
                    $("#zzxkWindow").data("kendoWindow").center().open();
                    self.editZzxkInfo(data);
                }
            })
        },
        editZzxkInfo: function (data) {
            var YXQQSRQ = data["YXQQSRQ"] ? data["YXQQSRQ"] : '';
            var YXQJZRQ = data["YXQJZRQ"] ? data["YXQJZRQ"] : '';

            var yxrq = YXQQSRQ + '~' + YXQJZRQ;
            data["YXRQ"] = yxrq;
            var self = this;
            if (!self.mvvmInit) {
                self.viewModel = kendo.observable({
                    dataKendo: data
                });
                kendo.bind($(".zzxk-detail-content"), self.viewModel);
                self.mvvmInit = true;
            } else {
                self.viewModel.set("dataKendo", data);
            }
            // 附件信息模板
            var fjTemplate = kendo.template($("#zzxkFjxxTemplate").html());
            var fjResult = fjTemplate(data);
            $("#zzxk-fjxx-div").html(fjResult);
            //备注信息模板
            var bzxxTemplate = kendo.template($("#zzxkBzxxTemplate").html());
            $("#zzxk-bzxx-div").html(bzxxTemplate(data));
            //资质内容模板
            var zznrTemplate = kendo.template($("#zzxkZznrTemplate").html());
            $("#zzxk-zznr-div").html(zznrTemplate(data));
            //业务范围模板
            var ywfwTemplate = kendo.template($("#zzxkYwfwTemplate").html());
            $("#zzxk-ywfw-div").html(ywfwTemplate(data));

        }
    }
    return Zzxk;
});