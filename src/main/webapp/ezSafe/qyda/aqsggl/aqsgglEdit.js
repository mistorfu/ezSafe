define(['uploadXmlrpc',CONTEXT_PATH+'/ezSafe/lib_js/xzqhSelect/xzqhSelect.js'], function (UploadXmlrpc,xzqhSelect) {

    function AqsgglEdit(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this.onClose = this.onClose || null;
        this.init();
    }

    AqsgglEdit.prototype = {
        addClick: null,
        filesPath: [],
        viewModel: null,
        uploadXmlrpc: new UploadXmlrpc(),
        sgfj:0,
        zgfj:1,
        tpwjlx: "",
        spwjlx: "",
        fjxx: {
            FJLX:"",
            FJMC:"",
            FJHZ:"",
            FJMS:"",
            FJDZ:"",
            XSSX:""
        },
        ssxq: {
            XZQHBH: "",
            XZQHMC: "",
            XZQHNBBM: ""
        },
        xzqhSelect:$(".xzqh-window").xzqhSelect({
            change: function (text, value) {
            var string = value.split(";");
            AqsgglEdit.prototype.ssxq.XZQHBH = string[0];
            AqsgglEdit.prototype.ssxq.XZQHMC = string[1];
            AqsgglEdit.prototype.ssxq.XZQHNBBM = string[2];
            $("#aqsg-xzqhSelectIpt").val(string[1]);
        }

}),
        timePicker: {
            newStart: null,
            newEnd: null,
            zgsj: null
        },

        miniFireEdit: function (data) {
            var self = this;
            if (data && data.SSXQ) {
                self.ssxq = data.SSXQ;
                self.editInfo(data);
            } else {
                $("#edit-window").data("kendoWindow").center().open();
            }
        },

        init: function () {
            var self = this;
            $.ajax({
                url: CONTEXT_PATH + "/api/qyda/aqsggl/getInit",
                type: "GET",
                cache: true,
                success: function (data) {
                    self.tpwjlx = data.tpwjlx;
                    self.spwjlx = data.spwjlx;
                }
            });
            self.uiInit();
            self.bindEvent();
        },

        uiInit: function () {

            $(".xzqh-window").kendoWindow({
                width: "25%",
                height: "70%",
                visible: false,
                title: false,
                modal: true,
                resizable: false
            }).data("kendoWindow");
        },

        /**
         * 渲染时间选择器
         */
        renderDatePicker: function () {
            var self = this;
            var today = new Date();
            kendo.culture("zh-CN");

            self.timePicker.newStart = $("#new-dateStart").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm:ss",
                change: newStartChange
            }).data("kendoDateTimePicker");

            self.timePicker.newEnd = $("#new-dateEnd").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm:ss",
                change: newEndChange
            }).data("kendoDateTimePicker");

            self.timePicker.zgsj = $("#new-zgsj").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm:ss"
            }).data("kendoDateTimePicker");

            self.timePicker.newStart.min(new Date(1970, 1, 1));
            self.timePicker.newEnd.min(new Date(1970, 1, 1));
            self.timePicker.zgsj.min(new Date(1970, 1, 1));

            function newStartChange() {
                var startDate = self.timePicker.newStart.value(),
                    endDate = self.timePicker.newEnd.value();

                if (startDate) {
                    startDate = new Date(startDate);
                    startDate.setDate(startDate.getDate());
                    self.timePicker.newEnd.min(startDate);
                } else if (endDate) {
                    self.timePicker.newStart.max(new Date(endDate));
                } else {
                    endDate = today;
                    self.timePicker.newStart.max(endDate);
                    self.timePicker.newEnd.min(endDate);
                }
            }

            function newEndChange() {
                var endDate = self.timePicker.newEnd.value(),
                    startDate = self.timePicker.newStart.value();

                if (endDate) {
                    endDate = new Date(endDate);
                    endDate.setDate(endDate.getDate());
                    self.timePicker.newStart.max(endDate);
                } else if (startDate) {
                    self.timePicker.newEnd.min(new Date(startDate));
                } else {
                    endDate = today;
                    self.timePicker.newStart.max(endDate);
                    self.timePicker.newEnd.min(endDate);
                }
            }
        },

        bindEvent: function () {
            var self = this;
            $("#new-window-close-button,#cancelButton").click(function () {
                if (self.onClose) self.onClose();
            });
            $("#saveButton").click(function (e) {
                var miniFire = self.viewModel.get("dataKendo");
                $(".remove-search").remove();
                self.save(miniFire);
            });

            $("#xzqh-close-button").click(function () {
                $(".xzqh-window").data("kendoWindow").close();
            });

            $("#xfdw-close-button").click(function () {
                $(".xfdw-window").data("kendoWindow").close();
            });
            /**
             * 事故类别下拉框
             */
            $("#sglbDropDown").kendoDropDownZdx({
                zdlx: "20030",
                level: "1",
                change: function (e) {
                    self.viewModel.dataKendo.SGLB = {ID: e.id, VALUE: e.text, CHAIN: e.nbbm};
                }
            });

            /**
             * 事故级别下拉框
             */
            $("#sgjbDropDown").kendoDropDownZdx({
                zdlx: "20031",
                level: "1",
                change: function (e) {
                    self.viewModel.dataKendo.SGJB = {ID: e.id, VALUE: e.text}
                }
            });
        },

        editInfo: function (data) {
            var self = this;
            self.copy = JSON.parse(JSON.stringify(data));
            self.renderDatePicker();
            if (data.SGLB !== undefined || data.SGLB !== null) {
                $('#sglbDropDown input').val(data.SGLB.VALUE);
            }
            if (data.SGJB !== undefined || data.SGJB !== null) {
                $('#sgjbDropDown input').val(data.SGJB.VALUE);
            }
            if (!self.mvvmInit) {
                self.viewModel = kendo.observable({
                    dataKendo: self.copy,
                    dictData: data,
                    addSGFJ: function () {
                        self.uploadFile(this.dataKendo,self.sgfj);
                    },
                    addZGFJ: function () {
                        self.uploadFile(this.dataKendo,self.zgfj);
                    },
                    deleteSgfj: function (e) {
                        $.when(kendo.ui.ExtConfirmDialog.show({
                            title: "提示!",
                            message: "确定要删除吗",
                            icon: 'question'
                        })).done(function (result) {
                            if (result.button == "OK") {
                                var index = $(e.target).parents(".sgfj-row").index();
                                self.viewModel.dataKendo.SGFJ.splice(index, 1);
                            }
                        });
                    },
                    deleteZgfj: function (e) {
                        $.when(kendo.ui.ExtConfirmDialog.show({
                            title: "提示!",
                            message: "确定要删除吗",
                            icon: 'question'
                        })).done(function (result) {
                            if (result.button == "OK") {
                                var index = $(e.target).parents(".zgfj-row").index();
                                self.viewModel.dataKendo.ZGFJ.splice(index, 1);
                            }
                        });
                    },
                    openXzqh: function () {
                        self.xzqhSelect.openXzqh();
                    },
                    openXfdw:function () {
                        $(".xfdw-window").data("kendoWindow").center().open();
                        //xfdwSelect.binddingTreeView();
                    }
                });
                kendo.bind($("#detail-aqsg"), self.viewModel);
                self.mvvmInit = true;
            } else {
                self.viewModel.set("dataKendo", self.copy);
            }
        },

        save: function (data) {
            var self = this;
            var kssj = self.timePicker.newStart.value();
            var jssj = self.timePicker.newEnd.value();
            var zgsj = self.timePicker.zgsj.value();
            data.SSXQ = self.ssxq;
            data.KSSJ = kendo.toString(data.KSSJ = kssj? kssj : "", 'yyyy-MM-dd HH:mm:ss');
            data.JSSJ = kendo.toString(data.JSSJ = jssj? jssj : "", 'yyyy-MM-dd HH:mm:ss');
            data.ZGSJ = kendo.toString(data.ZGSJ = zgsj? zgsj : "", 'yyyy-MM-dd HH:mm:ss');
            if (!self.check(data)) {
                kendo.ui.ExtMessageDialog.show({
                    messageType: "error",
                    message: "请填写必填项",
                    autoDisappearTime: 1500
                });
                return;
            }
            $.ajax({
                url: CONTEXT_PATH + "/api/qyda/aqsggl/save",
                cache: false,
                type: 'POST',
                data: {miniFire: JSON.stringify(data)},
                success: function (data) {
                    $("#edit-window").data("kendoWindow").close();
                    self.addClick();
                    kendo.ui.ExtMessageDialog.show({
                        messageType: "info",
                        message: "保存成功",
                        autoDisappearTime: 800
                    });
                },
                error: function () {
                    kendo.ui.ExtMessageDialog.show({
                        messageType: "error",
                        message: "数据格式错误",
                        autoDisappearTime: 1500
                    });
                }
            })
        },

        check: function (data) {
            var result = true;
            $(".must").each(function () {
                if (!$(this).val()) {
                    result = false;
                }
            });
            if (!data.SGLB.VALUE || !data.SGJB.VALUE || !data.KSSJ || !data.SGLB || !data.SGJB) {
                result = false
            }
            return result
        },
        /**上传方法**/
        uploadFile: function (data,type) {
            var self = this;
            window.top.receiveMsgInfo = function (msg) {
                if (msg != undefined && msg != null && msg != "") {
                    var picPath = msg.split("|")[1];
                    if (picPath != "") {
                        self.uploadLocalFile(picPath,data,type);
                    }
                }
            };
            window.sendMsgInfo("SelectFiles|*.*");
        },
        uploadLocalFile: function (filePath,data,type) {
            var self = this;
            if (typeof filePath == "undefined" || filePath == null || filePath === "") {
                return;
            }
            var fileStrArray = filePath.split(";"), fileObjects = [];
            for (var i = 0; i < fileStrArray.length; i++) {
                var fileName = fileStrArray[i].substring(fileStrArray[i].lastIndexOf("/") + 1);
                var suffix = fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase();
                var fileType = "1";
                if (self.tpwjlx.indexOf(suffix) >= 0) {
                    fileType = "1";
                    self.fjxx.FJLX = "图片";
                } else if (self.spwjlx.indexOf(suffix) >= 0) {
                    fileType = "0";
                    self.fjxx.FJLX = "视频";
                } else {
                    fileType = "2";
                    self.fjxx.FJLX = "文件";
                }
                var fileObject = {
                    "ResourceName": fileName,           // 文件名称带后缀
                    "ResourceType": fileType,           // 资源类型：0视频 1 图片 2文件
                    "ResourceMode": "0",                // 0: 本地上传，1： url上传， 2: 字节上传
                    "ResourcePath": fileStrArray[i],    // 资源绝对路径
                    "ResourceExt": suffix,              // 资源后缀，全大写
                    "UserCustom": "XF_YJSC"             // 文件上传的目录名称
                };
                fileObjects.push(fileObject);
                self.fjxx.FJHZ = suffix;
            }

            this.uploadXmlrpc.batchUploadResWithProgress(fileObjects, {
                readyUpload: function (result) {
                },
                progress: function (result) {
                },
                success: function (result) {
                    self.fjxx.FJMC = result["ResourceName"];
                    self.fjxx.FJDZ = result["FileUrlPath"];
                    self.fjxx.XSSX = "";
                    self.fjxx.FJMS = "";
                    if (type === 0) {
                        data.SGFJ.push(self.fjxx);
                    }
                    if (type === 1) {
                        data.ZGFJ.push(self.fjxx);
                    }
                },
                error: function (result) {
                    alert("上传失败！");
                }
            });
        },
        emptyWindow: function () {
            var self = this;
            var empty = new self.newMiniFire(self);
            self.dataItem = null;
            self.MiniFireMore(empty);
        },
        newMiniFire: function (self) {
            this.XXBH = $.getUuid();
            this.SGBH = "";
            this.SGMC = "";
            this.KSSJ = "";
            this.JSSJ = "";
            this.SGLB = {
                ID: "",
                VALUE: "",
                CHAIN: ""
            };
            this.SGJB = {
                ID: "",
                VALUE: ""
            };
            this.SGYY = "";
            this.SGJG = "";
            this.SGMS = "";
            this.QSRS = "";
            this.ZSRS = "";
            this.SWRS = "";
            this.JJSS = {
                JE: "",
                DW: ""
            };
            this.DCRY = "";
            this.SGZR = "";
            this.CLJY = "";
            this.ZGCS = "";
            this.ZGSJ = "";
            this.BZXX = "";
            this.QYXX = {
                QYBH: "",
                QYMC: ""
            };
            this.SGFJ = [];
            this.ZGFJ = [];
            this.SSJZ = {
                JZBH: "",
                JZMC: "",
                JZNBBM: ""
            };
            this.SSXQ = {
                XZQHBH: "",
                XZQHMC: "",
                XZQHSX: "",
                XZQHJC: "",
                XZQHNBBM: ""
            };
            this.JLZT = "1";
        }

    };
    return AqsgglEdit;
});