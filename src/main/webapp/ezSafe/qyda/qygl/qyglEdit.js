define(['uploadXmlrpc',CONTEXT_PATH+'/ezSafe/lib_js/xzqhSelect/xzqhSelect.js',CONTEXT_PATH+'/ezSafe/lib_js/wgxxSelect/wgxxSelect.js'], function (UploadXmlrpc,xzqhSelect,wgxxSelect) {
    function QyglEdit(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this.onClose = this.onClose || null;
        this._init();
    }

    QyglEdit.prototype = {
        tpxx : {
                TPID: $.getUuid(),
                TPMC: "",
                TPHZ: "",
                TPMS: "",
                TPDZ: "",
                TPLXID: "",
                TPLXMC: ""
        },
        addClick: null,
        viewModel: null,
        uploadXmlrpc: new UploadXmlrpc(),
        imageType: '*.BMP;*.JPEG;*.JPG;*.PNG;',
        timePicker: {
            newStart: null,
            newEnd: null
        },

        _init: function () {
            this._bindPageEvent();
            this._isDropDown();
        },
        showData: function (data) {
            var self = this;

            if (data) {
                $("#edit-window").data("kendoWindow").center().open();
                self._editInfo(data);
            } else {
                $("#edit-window").data("kendoWindow").center().open();
            }
            $("#cancelButton").click(function (e) {
                $("#edit-window").data("kendoWindow").close();
            });
            $("#saveButton").click(function (e) {
                var miniFire = self.viewModel.get("dataKendo");
                self.save(miniFire);
            });
        },
        uploadLocalFile: function (filePath, field) {
            var self = this;
            if (typeof filePath == "undefined" || filePath == null || filePath === "") {
                return;
            }
            var imageType = '.BMP,.JPEG,.JPG,.PNG';
            var fileStrArray = filePath.split(";");
            var fileObjects = [];
            for (var i = 0; i < fileStrArray.length; i++) {
                var fileName = fileStrArray[i].substring(fileStrArray[i].lastIndexOf("/") + 1);
                var suffix = fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase();
                var resourceType = 2;
                if (imageType.indexOf(suffix) != -1) {
                    resourceType = 1;
                }
                var fileObject = {
                    "ResourceName": fileName,           // 文件名称带后缀
                    "ResourceType": resourceType,       // 资源类型：0视频 1 图片 2文件
                    "ResourceMode": "0",                // 0: 本地上传，1： url上传， 2: 字节上传
                    "ResourcePath": fileStrArray[i],    // 资源绝对路径
                    "ResourceExt": suffix,              // 资源后缀，全大写
                    "UserCustom": "XF_ZDAB"             // 文件上传的目录名称
                };
                self.tpxx.TPMC = fileName;
                self.tpxx.TPHZ = suffix;
                fileObjects.push(fileObject);
            }
            this.uploadXmlrpc.batchUploadResWithProgress(fileObjects, {
                readyUpload: function (result) {
                },
                progress: function (result) {
                },
                success: function (result) {
                    if (field === "qytp") {
                        self.tpxx.TPDZ = result["FileUrlPath"];
                        self.viewModel.dataKendo.QYTP.push(self.tpxx);
                    }
                },
                error: function () {
                    kendo.ui.ExtMessageDialog.show({
                        messageType: "warn",
                        message: "上传失败！",
                        autoDisappearTime: 800
                    });
                }
            });
        },

        _isDropDown: function () {
            var self = this;
            $("#qygl-qyfl-lx").kendoDropDownZdx({
                zdlx: "20004",
                level: "0",
                change:function (e) {
                    self.viewModel.dataKendo.QYFL = {ID: e.id, VALUE: e.text, CHAIN: e.nbbm};
                }
            });
            $("#dlwzDropDown").kendoDropDownZdx({
                zdlx: "20010",
                level: "0",
                change:function (e) {
                    self.viewModel.dataKendo.DLWZ = {ID: e.id, VALUE: e.text};
                }
            });
            $("#zclxDropDown").kendoDropDownZdx({
                zdlx: "20001",
                level: "0",
                change:function (e) {
                    self.viewModel.dataKendo.ZCLX = {ID: e.id, VALUE: e.text};
                }
            });
            $("#qygl-qygm-lx").kendoDropDownZdx({
                zdlx: "20005",
                level: "0",
                change:function (e) {
                    self.viewModel.dataKendo.QYGM = {ID: e.id, VALUE: e.text, CHAIN: e.nbbm};
                }
            });
            $("#qygl-sshyly-lx").kendoDropDownZdx({
                zdlx: "20012",
                level: "0",
                change:function (e) {
                    self.viewModel.dataKendo.SSHYLY = {ID: e.id, VALUE: e.text, CHAIN: e.nbbm};
                }
            });

            $("#qygl-sfyyjdw-lx").kendoDropDownZdx({
                zdlx: "20010",
                level: "0",
                dataBound: dataFunc,
                change:function (e) {
                    $("#qygl-sfyyjdw-lx input").attr("value", e.id);
                    self.viewModel.dataKendo.SFYYJDW = e.id;
                }
            });
            $("#qygl-sfyyrybw-lx").kendoDropDownZdx({
                zdlx: "20010",
                level: "0",
                dataBound: dataFunc,
                change:function (e) {
                    $("#qygl-sfyyrybw-lx input").attr("value", e.id);
                    self.viewModel.dataKendo.SFYYRYBW = e.id;
                }
            });
            $("#qygl-sfyzdwxy-lx").kendoDropDownZdx({
                zdlx: "20010",
                level: "0",
                dataBound: dataFunc,
                change:function (e) {
                    $("#qygl-sfyzdwxy-lx input").attr("value", e.id);
                    self.viewModel.dataKendo.SFYZDWXY = e.id;
                }
            });
            function dataFunc(e) {
                var datatem = [{id: '0', value: "0", text: "否"}, {id: '1', value: "1", text: "是"}];
                e.sender._initTreeData = datatem;
                e.sender._oData = datatem;
                e.sender._realTimeData = datatem;
            }
        },

        _bindPageEvent: function () {
            var self = this;
            var today = new Date();
            kendo.culture("zh-CN");

            $(".xzqh-window").kendoWindow({
                width: "25%",
                height: "70%",
                visible: false,
                title: false,
                modal: true,
                resizable: false
            }).data("kendoWindow");

            self.xzqhSelect = $(".xzqh-window").xzqhSelect({
                change: function (text, value) {
                    var string = value.split(";");
                    self.viewModel.dataKendo.SSXQ.XZQHBH = string[0];
                    self.viewModel.dataKendo.SSXQ.XZQHMC = string[1];
                    self.viewModel.dataKendo.SSXQ.XZQHNBBM = string[2];
                    $("#qygl-xzqhSelectIpt").val(string[1]);
                }
            });

            self.wgxxSelect = $(".wgxx-window").wgxxSelect({
                change: function (text, value) {
                    self.viewModel.dataKendo.SSWG.WGBH = value;
                    self.viewModel.dataKendo.SSWG.WGMC = text;
                    $("#qygl-wgxxSelectIpt").val(text);
                }
            });

            $("#xzqh-close-button").click(function () {
                $(".xzqh-window").data("kendoWindow").close();
            });

            $("#wgxx-close-button").click(function () {
                $(".wgxx-window").data("kendoWindow").close();
            });

            self.timePicker.newStart = $("#clrq-date-pick").kendoDatePicker({
                format: "yyyy-MM-dd",
                change: newStartChange
            }).data("kendoDatePicker");

            self.timePicker.newEnd = $("#tcrq-date-pick").kendoDatePicker({
                format: "yyyy-MM-dd",
                change: newEndChange
            }).data("kendoDatePicker");

            $(".date-pick").kendoDatePicker({
                format: "yyyy-MM-dd"
            }).data("kendoDatePicker");

            self.timePicker.newStart.min(new Date(1970, 1, 1));
            self.timePicker.newEnd.min(new Date(1970, 1, 1));

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

            $("#edit-window-close").click(function () {
                if (self.onClose) self.onClose();
            });
            $("#button-update").click(function () {
                if($("#tab-jbxx").hasClass("selected")){
                    $("#qyglEdit-jbxx").show();
                    $("#qyglEdit-jyxx").hide();
                    $("#qyglEdit-xfxg").hide();
                }else if($("#tab-jyxx").hasClass("selected")) {
                    $("#qyglEdit-jyxx").show();
                    $("#qyglEdit-jbxx").hide();
                    $("#qyglEdit-xfxg").hide();
                }else if($("#tab-xfxg").hasClass("selected")) {
                    $("#qyglEdit-xfxg").show();
                    $("#qyglEdit-jyxx").hide();
                    $("#qyglEdit-jbxx").hide();
                }
            });
            $("#button-add").click(function () {
                $("#qyglEdit-jbxx").show();
                $("#qyglEdit-jyxx").show();
                $("#qyglEdit-xfxg").show();
            });
        },


        _editInfo: function (data) {
            var self = this;
            data.QYTP = data.QYTP ? data.QYTP : [];
            data.SFYZDWXY = data.SFYZDWXY ? data.SFYZDWXY : "";
            data.SFYYRYBW = data.SFYYRYBW ? data.SFYYRYBW : "";
            data.SFYYJDW = data.SFYYJDW ? data.SFYYJDW : "";
            data.ZCLX = data.ZCLX ? data.ZCLX :{ID: "", VALUE: ""};
            data.SSWG = data.SSWG ? data.SSWG : {WGBH: "", WGMC: ""};
            data.SSJZ = data.SSJZ ? data.SSJZ : {JZBH: "", JZMC: "", JZNBBM: ""};
            data.SSXQ = data.SSXQ ? data.SSXQ : {XZQHBH: "", XZQHMC: "", XZQHSX: "", XZQHJC: "", XZQHNBBM: ""};
            data.GMJJHY = data.GMJJHY ? data.GMJJHY : {ID: "", VALUE: "", CHAIN: ""};
            data.DLWZ = data.DLWZ ? data.DLWZ : {ID: "", VALUE: ""};
            data.QYFL = data.QYFL ? data.QYFL : {ID: "", VALUE: "", CHAIN: ""};
            data.QYGM = data.QYGM ? data.QYGM : {ID: "", VALUE: "", CHAIN: ""};
            data.ZYFX = data.ZYFX ? data.ZYFX : {ID: "", VALUE: ""};
            data.TZFGJ = data.TZFGJ ? data.TZFGJ : {ID: "", VALUE: ""};

            var imageURL = $("#detail-QYTP ul li image");
            for(var i = 0; i<imageURL.context.images.length;i++){
                var newImageURL = imageURL.context.images[i].currentSrc;
                if(newImageURL === undefined){
                    data.QYTP[i] = [];
                }
            }

            self.copy = JSON.parse(JSON.stringify(data));
            if (!self.mvvmInit) {
                self.viewModel = kendo.observable({
                    dataKendo: self.copy,
                    uploadFile : function (e) {
                        window.top.receiveMsgInfo = function (msg) {
                            if (msg != undefined && msg != null && msg != "") {
                                var picPath = msg.split("|")[1];
                                if (picPath != "") {
                                    self.uploadLocalFile(picPath,"qytp");
                                }
                            }
                        };
                        window.sendMsgInfo("SelectFiles|" + self.imageType);
                    },
                    removeFile : function (e) {
                        var self = this;
                        $.when(kendo.ui.ExtConfirmDialog.show({
                           title: "提示",
                           message: "确定要删除吗",
                           icon: "question"
                        })).done(function (result) {
                            if(result.button === "OK"){
                                var model = self.dataKendo.QYTP.toJSON();
                                for (var i = 0; i < model.length; i++) {
                                    if (model[i].TPDZ === e.data.TPDZ) {
                                        model.splice(i, 1);
                                    }
                                }
                                self.dataKendo.set("QYTP", model);
                            }
                        });
                    },
                    openXzqh: function () {
                        self.xzqhSelect.openXzqh();
                    },
                    openWgxx: function () {
                        self.wgxxSelect.openWgxx();
                    }
                });
                self.setSearchSelectTree(data);
                kendo.bind($(".qyglEdit-wrap"), self.viewModel);
                self.mvvmInit = true;
            } else {
                self.viewModel.set("dataKendo", self.copy);
            }
        },

        setSearchSelectTree: function (data) {
            if (data.QYFL !== undefined && data.QYFL !== null) {
                $('#qygl-qyfl-lx input').val(data.QYFL.VALUE);
            }
            if (data.QYGM !== undefined && data.QYGM !== null) {
                $('#qygl-qygm-lx input').val(data.QYGM.VALUE);
            }
            if (data.SSHYLY !== undefined && data.SSHYLY !== null) {
                $('#qygl-sshyly-lx input').val(data.SSHYLY.VALUE);
            }

        },

        save: function (data) {
            data.CLRQ = kendo.toString(data.CLRQ = data.CLRQ ? data.CLRQ : "",'yyyy-MM-dd');
            data.TCRQ = kendo.toString(data.TCRQ = data.TCRQ ? data.TCRQ : "",'yyyy-MM-dd');
            data.FRDB.CSRQ = kendo.toString(data.FRDB.CSRQ = data.FRDB.CSRQ ? data.FRDB.CSRQ : "",'yyyy-MM-dd');

            var self = this;
            if (!self.check(data)) {
                kendo.ui.ExtMessageDialog.show({
                    messageType: "error",
                    message: "请填写必填项",
                    autoDisappearTime: 1500
                });
                return;
            }
            $.ajax({
                url: CONTEXT_PATH + "/api/qyda/qygl/save",
                cache: false,
                type: 'POST',
                data: {qyjcxx: JSON.stringify(data)},
                success: function (returnData) {
                    $("#edit-window").data("kendoWindow").close();
                    if(returnData.ID === "insert"){
                        if(returnData.VALUE === "inserted"){
                            self.addClick();
                            kendo.ui.ExtMessageDialog.show({
                                messageType: "info",
                                message: "新增成功",
                                autoDisappearTime: 800
                            });
                        }
                    }
                    if(returnData.ID === "update"){
                        if(returnData.VALUE === "updated"){
                            self.addClick();
                            kendo.ui.ExtMessageDialog.show({
                                messageType: "info",
                                message: "修改成功",
                                autoDisappearTime: 800
                            });
                        }
                    }
                }
            })
        },

        check: function (data) {
            var result = true;
            $(".must").each(function () {
                if ($(this).val()==="") {
                    result = false;
                }
            });
            if(data.ZCLX === undefined || data.ZCLX.VALUE === ""){
                result = false;
            }
            if(data.SSXQ === undefined || data.SSXQ.XZQHMC === ""){
               result = false;
            }
            if(data.FRDB === undefined || data.FRDB.RYXM === ""){
                result = false;
            }
            return result
        },
        
        _newQyjcxxData : function (self) {
            this.STATE_TYPE = "insert";
            this.QYBH = $.getUuid();
            this.QYMC = "";
            this.QYGK = "";
            this.QYBZ = "";
            this.GSZCH = "";
            this.ZZJGDM = "";
            this.TYSHXYBM = "";
            this.ZCLX = {
                ID: "",
                VALUE: ""
            };
            this.ZCDZ = "";
            this.JYDZ = "";
            this.YZBM = "";
            this.JD = "";
            this.WD = "";
            this.DLWZ = {
                ID: "",
                VALUE: ""
            };
            this.LSXZ = {
                ID: "",
                VALUE: ""
            };
            this.SSWG = {
                WGBH: "",
                WGMC: ""
            };
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
            this.QYTP = [];
            this.QYZT = {
                ID: "",
                VALUE: ""
            };
            this.QYXZ = {
                ID: "",
                VALUE: "",
                CHAIN: ""
            };
            this.QYFL = {
                ID: "",
                VALUE: "",
                CHAIN: ""
            };
            this.QYGM = {
                ID: "",
                VALUE: "",
                CHAIN: ""
            };
            this.QYGMQK = "";
            this.SSHYLY = {
                ID: "",
                VALUE: "",
                CHAIN: ""
            };
            this.GMJJHY = {
                ID: "",
                VALUE: "",
                CHAIN: ""
            };
            this.SSHYJT = "";
            this.SJGSMC = "";
            this.CLRQ = "";
            this.TCRQ = "";
            this.JYFW = "";
            this.ZYFX = {
                ID: "",
                VALUE: ""
            };
            this.ZYFXSM = "";
            this.AQSCDJ = {
                ID: "",
                VALUE: ""
            };
            this.TZFGJ = {
                ID: "",
                VALUE: ""
            };
            this.FRDB = {
                RYXM: "",
                RYXB: {
                    ID: "",
                    VALUE: ""
                },
                RYZW: "",
                CSRQ: "",
                ZJXX: {
                    CODE: "",
                    ID: "",
                    VALUE: ""
                },
                GDDH: "",
                YDDH: "",
                DZYX: ""
            };
            this.LXRY = "";
            this.GDDH = "";
            this.YDDH = "";
            this.DZYX = "";
            this.DWCZ = "";
            this.ZCZB = {
                JE: "",
                DW: "人民币"
            };
            this.TZZE = {
                JE: "",
                DW: "人民币"
            };
            this.GDZCZE = {
                JE: "",
                DW: "人民币"
            };
            this.NXSSRZE = {
                JE: "",
                DW: "人民币"
            };
            this.NLRZE = {
                JE: "",
                DW: "人民币"
            };
            this.ZDMJ = "";
            this.CKJZMJ = "";
            this.BGLJZMJ = "";
            this.CJCFJZMJ = "";
            this.CFGS = {
                ID: "",
                VALUE: ""
            };
            this.CQTP = "";
            this.CYRYSL = "";
            this.AQGCSRS = "";
            this.AQSCGLRS = "";
            this.ZZYJGLRS = "";
            this.SFYZDWXY = "";
            this.SFYYRYBW = "";
            this.SFYYJDW = "";
        }

    };

    return QyglEdit;
});