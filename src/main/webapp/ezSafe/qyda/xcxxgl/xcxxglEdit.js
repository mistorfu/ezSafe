define(['lib/domReady!mhyjEdit', 'ezviewCommon',CONTEXT_PATH+'/ezSafe/lib_js/xzqhSelect/xzqhSelect.js','dateTimePicker',
    CONTEXT_PATH +'/ezSafe/lib_js/fileUpload/uploadXmlrpc.js'],
    function (dom, common,xzqhSelect,dtp,uploadXmlrpc) {

        function XcxxglEdit(options) {
            if (options) {
                for (var key in options) {
                    this[key] = options[key];
                }
            }
            this.onClose = this.onClose || null;
            this._init();
        }

        XcxxglEdit.prototype = {
            addClick: null,
                filesPath: [],
                viewModel: null,
                uploadXmlrpc: new uploadXmlrpc(),
                tpwjlx: "",
                spwjlx: "",
                fjxx:{
                    FJLX:"",
                    FJMC: "",
                    FJHZ: "",
                    FJMS: "",
                    FJDZ: "",
                    XSSX: ""
                },
            ssxq:{
                XZQHBH:"",
                XZQHMC: "",
                XZQHNBBM: "",
                XZQHSX: "",
                XZQHJC: ""
            },
            xzqhSelect:null,

                timePicker: {
                    newStart: null,
                    newEnd: null,
                    newsjStart: null,
                    newsjEnd: null,
                },

            showData: function (data) {
                var self = this;
                if (data) {
                    $("#edit-window").data("kendoWindow").center().open();
                    self.ssxq = data.SSXQ;
                    self.editInfo(data);
                } else {
                    $(".miniFire-edit-window").data("kendoWindow").center().open();
                }
            },

            _init: function () {
                var self = this;
                self.uiInit();
                self.bindEvent();
            },

            uiInit: function () {
                var self = this;

                $("#edit-window").kendoWindow({
                    scrollable: false,
                    width: "45%",
                    height: "94%",
                    visible: false,
                    title: false,
                    modal: true,
                    resizable: false
                }).data("kendoWindow");

                $(".xzqh-window").kendoWindow({
                    width: "30%",
                    height: "70%",
                    visible: false,
                    title: false,
                    modal: true,
                    resizable: false
                }).data("kendoWindow");

                $("#moTai").kendoWindow({
                    scrollable: false,
                    width: "20%",
                    height: "10%",
                    visible: false,
                    title: false,
                    modal: false,
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

                self.timePicker.newStart = $("#jhks-dateStart").kendoDateTimePicker({
                    format: "yyyy-MM-dd HH:mm:ss",
                    change: newStartChange
                }).data("kendoDateTimePicker");

                self.timePicker.newEnd = $("#jhjs-dateEnd").kendoDateTimePicker({
                    format: "yyyy-MM-dd HH:mm:ss",
                    change: newEndChange
                }).data("kendoDateTimePicker");

                self.timePicker.newsjStart = $("#sjks-dateStart").kendoDateTimePicker({
                    format: "yyyy-MM-dd HH:mm:ss",
                    change: newSJStartChange
                }).data("kendoDateTimePicker");

                self.timePicker.newsjEnd = $("#sjjs-dateEnd").kendoDateTimePicker({
                    format: "yyyy-MM-dd HH:mm:ss",
                    change: newSJEndChange
                }).data("kendoDateTimePicker");

                self.timePicker.newStart.min(new Date(1970, 1, 1));
                self.timePicker.newEnd.min(new Date(1970, 1, 1));
                self.timePicker.newsjStart.min(new Date(1970, 1, 1));
                self.timePicker.newsjEnd.min(new Date(1970, 1, 1));

                function newSJStartChange() {
                    var newsjstart = self.timePicker.newsjStart.value(),
                        newsjsend = self.timePicker.newsjEnd.value();

                    if (newsjstart) {
                        newsjstart = new Date(newsjstart);
                        newsjstart.setDate(newsjstart.getDate());
                        self.timePicker.newsjEnd.min(newsjstart);
                    } else if (newsjsend) {
                        self.timePicker.newsjStart.max(new Date(newsjsend));
                    } else {
                        newsjsend = today;
                        self.timePicker.newStart.max(newsjsend);
                        self.timePicker.newEnd.min(newsjsend);
                    }
                }

                function newSJEndChange() {
                    var newsjsend = self.timePicker.newsjStart.value(),
                        newsjstart = self.timePicker.newsjEnd.value();

                    if (newsjsend) {
                        newsjsend = new Date(newsjsend);
                        newsjsend.setDate(newsjsend.getDate());
                        self.timePicker.newsjEnd.min(newsjsend);
                    } else if (newsjstart) {
                        self.timePicker.newsjStart.max(new Date(newsjstart));
                    } else {
                        newsjstart = today;
                        self.timePicker.newStart.max(newsjstart);
                        self.timePicker.newEnd.min(newsjstart);
                    }
                }

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

                self.xzqhSelect=$(".xzqh-window").xzqhSelect({
                    change: function (text, value) {
                        var string = value.split(";");
                        self.ssxq.XZQHBH = string[0];
                        self.ssxq.XZQHMC = string[1];
                        self.ssxq.XZQHNBBM = string[2];
                        $("#xcxx-xzqhSelectIpt").val(string[1]);
                    },
                })

                $("#new-window-close-button").click(function () {
                    $(".remove-search").remove();
                    $("#edit-window").data("kendoWindow").close();
                });
                $("#saveButton").click(function (e) {
                    var miniFire = self.viewModel.get("dataKendo");
                    $(".remove-search").remove();
                    self.save(miniFire);
                });

                $("#cancelButton").click(function () {
                    $("#edit-window").data("kendoWindow").close();
                });

                //时间控件
                $.datetimepicker.setLocale('ch');
                $("#search-JHKSSJ").datetimepicker({
                    format: "Y-m-d H:i:s",
                });
                $(".kssj-button").on("click", function () {
                    $("#search-JHKSSJ").datetimepicker('toggle').datetimepicker('reset');
                });
                $("#search-JHJSSJ").datetimepicker({
                    format: "Y-m-d H:i:s"
                });

                $("#xfdw-close-button").click(function () {
                    $(".xfdw-window").data("kendoWindow").close();
                });

                $(".nsearch-XCLB").kendoDropDownZdx({
                    zdlx: "20023",
                    level: "0",
                    change: function (e) {
                        self.viewModel.dataKendo.XCLB = {ID: e.id, VALUE: e.text};
                    }
                });

                $(".nsearch-XCZT").kendoDropDownZdx({
                    zdlx: "20024",
                    level: "0",
                    change: function (e) {
                         //$("#nsearch-XCZT input").attr("value", e.id);
                        self.viewModel.dataKendo.XCZT =  {ID: e.id, VALUE: e.text};
                    }
                });

                $(".nsearch-XCFL").kendoDropDownZdx({
                    zdlx: "20022",
                    level: "0",
                    change: function (e) {
                        self.viewModel.dataKendo.XCFL = {ID: e.id, VALUE: e.text};
                    }
                });

                $(".nsearch-XCJG").kendoDropDownZdx({
                    zdlx: "20025",
                    level: "0",
                    change: function (e) {
                        self.viewModel.dataKendo.XCJG = {ID: e.id, VALUE: e.text};
                    }
                });

            },

            editInfo: function (data) {
                var self = this;
                if(data.SSXQ){
                    self.ssxq = data.SSXQ;
                }
                if(!data.FJXX){
                    data["FJXX"] = [];
                }
                if(!data.JHXCRY){
                    data["JHXCRY"] = [];
                }
                if(!data.JHXCNR){
                    data["JHXCNR"] = [];
                }
                if(!data.SJXCRY){
                    data["SJXCRY"] = [];
                }
                if(!data.SJXCNR){
                    data["SJXCNR"] = [];
                }
                self.renderDatePicker();
                self.copy = JSON.parse(JSON.stringify(data));

                if (!self.mvvmInit) {
                    self.viewModel = kendo.observable({
                        dataKendo: self.copy,
                        dictData: data,
                        SJXCNR: function () {
                            var arr = new Array();
                            var SJXCNR = this.dataKendo.SJXCNR;
                            if (SJXCNR[0]) {
                                return SJXCNR;
                            } else {
                                arr.push(SJXCNR);
                            }
                            return arr;
                        },
                        JHXCNR: function () {
                            var arr = new Array();
                            var JHXCNR = this.dataKendo.JHXCNR;
                            if (JHXCNR[0]) {
                                return JHXCNR;
                            } else {
                                arr.push(JHXCNR);
                            }
                            return arr;
                        },
                        JHXCRY: function () {
                            var arr = new Array();
                            var JHXCRY = this.dataKendo.JHXCRY;
                            if (JHXCRY[0]) {
                                return JHXCRY;
                            } else {
                                arr.push(JHXCRY);
                            }
                            return arr;
                        },
                        SJXCRY: function () {
                            var arr = new Array();
                            var SJXCRY = this.dataKendo.SJXCRY;
                            if (SJXCRY[0]) {
                                return SJXCRY;
                            } else {
                                arr.push(SJXCRY);
                            }
                            return arr;
                        },

                        addFJXX: function () {
                            self.uploadFile(this.dataKendo,self.fjxx);
                        },

                        addJhxcry: function () {
                            var jhxcry = {
                                RYBH: "",
                                RYXM: ""
                            };
                            //获取模板
                            var template = kendo.template($("#jhxcryEdit-template").html());

                            //给模板填充sjxcnr

                            var result = template(jhxcry);


                            $("#addjhxcry").append(result);
                            $(".jhxcry-delete").click(function () {
                                $(this).parents(".jhxcry-row").remove();
                            });

                        },

                        addSjxcry: function () {
                            var sjxcry = {
                                RYBH: "",
                                RYXM: ""
                            };
                            //获取模板
                            var template = kendo.template($("#sjxcryEdit-template").html());

                            //给模板填充sjxcnr

                            var result = template(sjxcry);


                            $("#addsjxcry").append(result);
                            $(".sjxcry-delete").click(function () {
                                $(this).parents(".sjxcry-row").remove();
                            });
                        },

                        addSjxcnr: function () {

                            var sjxcnr = {
                                XJDW: "",
                                XJSM: ""
                            }

                            //获取模板
                            var template = kendo.template($("#sjxcnrEdit-template").html());

                            //给模板填充sjxcnr

                            var result = template(sjxcnr);


                            $("#addsjxcnr").append(result);
                            $(".sjxcnr-delete").click(function () {
                                $(this).parents(".sjxcnr-row").remove();
                            });

                        },


                        addJxxcnr: function () {
                            var jhxxnr = {
                                XJDW: "",
                                XJSM: ""
                            };
                            var template = kendo.template($("#jhxcnrEdit-template").html());
                            var result = template(jhxxnr);
                            $("#addjhxcnr").append(result);
                            $(".jhxcnr-delete").click(function () {
                                $(this).parents(".jhxcnr-row").remove();

                            });


                        },

                        deleteFjxx: function (e) {
                            var index = $(e.target).parents(".sgfj-row").index();
                            this.dataKendo.FJXX.splice(index, 1);
                        },

                        deleteJhxcry: function (e) {
                            $(e.target).parents(".jhxcry-row").remove();
                        },

                        deleteSjxcry: function (e) {
                            $(e.target).parents(".sjxcry-row").remove();

                        },

                        deleteJhxcnr: function (e) {
                            $(e.target).parents(".jhxcnr-row").remove();

                        },

                        deleteSjxcnr: function (e) {
                            $(e.target).parents(".sjxcnr-row").remove();
                        },

                        openXfdw: function () {
                            $(".xfdw-window").data("kendoWindow").center().open();
                        },

                        openXzqh: function () {
                            self.xzqhSelect.openXzqh();
                        }

                    });
                    kendo.bind($("#edit-window"), self.viewModel);
                    self.mvvmInit = true;
                } else {
                    self.viewModel.set("dataKendo", self.copy);
                }
            },

            save: function (data) {

                var self = this;

                delete data.STATE_TYPE;
                data.SSXQ = self.ssxq;
                var jhkssj = self.timePicker.newStart.value();
                var jhjssj = self.timePicker.newEnd.value();
                var sjkssj = self.timePicker.newsjStart.value();
                var sjjssj = self.timePicker.newsjEnd.value();
                data.SJKSSJ = kendo.toString(data.SJKSSJ = sjkssj ? sjkssj : "", 'yyyy-MM-dd HH:mm:ss');
                data.JHKSSJ = kendo.toString(data.JHKSSJ = jhkssj ? jhkssj : "", 'yyyy-MM-dd HH:mm:ss');
                data.SJJSSJ = kendo.toString(data.SJJSSJ = sjjssj ? sjjssj : "", 'yyyy-MM-dd HH:mm:ss');
                data.JHJSSJ = kendo.toString(data.JHJSSJ = jhjssj ? jhjssj : "", 'yyyy-MM-dd HH:mm:ss');
                var sjarr = [];
                $(".sjxcnr-row").each(function (c, e) {
                    var arrsjxcnr = {
                        XJDW: "",
                        XJSM: ""
                    }
                    arrsjxcnr.XJDW = $(e).find(":input").eq(0).val();
                    arrsjxcnr.XJSM = $(e).find(":input").eq(1).val();
                    sjarr.push(arrsjxcnr);
                })
                data.SJXCNR = sjarr;
                var jharr = [];
                $(".jhxcnr-row").each(function (c, e) {
                    var arrjhxcnr = {
                        XJDW: "",
                        XJSM: ""
                    }
                    arrjhxcnr.XJDW = $(e).find(":input").eq(0).val();
                    arrjhxcnr.XJSM = $(e).find(":input").eq(1).val();
                    jharr.push(arrjhxcnr);
                })
                data.JHXCNR = jharr;
                var jhxcryarr = [];
                $(".jhxcry-row").each(function (c, e) {
                    var jhxcry = {
                        RYBH: "",
                        RYXM: ""
                    }
                    jhxcry.RYBH = $(e).find(":input").eq(0).val();
                    jhxcry.RYXM = $(e).find(":input").eq(1).val();
                    jhxcryarr.push(jhxcry);
                })
                data.JHXCRY = jhxcryarr;

                var sjxcryarr = [];
                $(".sjxcry-row").each(function (c, e) {
                    var sjxcry = {
                        RYBH: "",
                        RYXM: ""
                    }
                    sjxcry.RYBH = $(e).find(":input").eq(0).val();
                    sjxcry.RYXM = $(e).find(":input").eq(1).val();
                    sjxcryarr.push(sjxcry);
                })
                data.SJXCRY = sjxcryarr;

                if (!self.check(data)) {
                    kendo.ui.ExtMessageDialog.show({
                        messageType: "error",
                        message: "请填写必填项",
                        autoDisappearTime: 1500
                    });
                    return;
                }
                $.ajax({
                    url: CONTEXT_PATH + "/api/qyda/xcxxgl/save",
                    cache: false,
                    type: 'POST',
                    data: {miniFire: JSON.stringify(data)},
                    success: function () {
                        $("#edit-window").data("kendoWindow").close();
                        if(self.addClick){
                            self.addClick(data);
                        }
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
                if(!data.XCFL||!data.XCFL.VALUE){
                    return false;
                }
                if(!data.XCZT||!data.XCZT.VALUE){
                    return false;
                }
                if(!data.XCLB||!data.XCLB.VALUE){
                    return false;
                }
                if(!data.XCJG||!data.XCJG.VALUE){
                    return false;
                }
                $(".must").each(function () {
                    if (!$(this).val()) {
                        result = false;
                    }
                });
                return result;
            },
            /**上传方法**/
            uploadFile: function (data, type) {
                var self = this;
                window.top.receiveMsgInfo = function (msg) {
                    if (msg != undefined && msg != null && msg != "") {
                        var picPath = msg.split("|")[1];
                        if (picPath != "") {
                            self.uploadLocalFile(picPath, data, type);
                        }
                    }
                };
                window.sendMsgInfo("SelectFiles|*.*");
            },
            uploadLocalFile: function (filePath, data, type) {
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
                        data.FJXX.push(self.fjxx);
                    },
                    error: function (result) {
                        alert("上传失败！");
                    }
                });
            },

            _newQyjcxxData: function (self) {
                this.XXBH = $.getUuid();
                this.QYXX = {
                    QYBH: "",
                    QYMC: ""
                };
                this.RWBH = "";
                this.RWMC = "";
                this.XCFL = {
                    ID: "",
                    VALUE: "",
                };
                this.XCLB = {
                    ID: "",
                    VALUE: ""
                };
                this.XCZT = {
                    ID: "",
                    VALUE: ""
                };
                this.JHXCNR = [];
                this.JHXCSM = "";
                this.JHKSSJ = "";
                this.JHJSSJ = "";
                this.JHXCRY = [];
                this.SJXCRY = [];
                this.SJKSSJ = "";
                this.SJJSSJ = "";
                this.SJXCNR = [];
                this.SJXCSM = "";
                this.XCJG = {
                    ID: "",
                    VALUE: ""
                };
                this.BZXX = "";
                this.FJXX = [];
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

    return XcxxglEdit;
});