define(['lib/domReady!mhyjEdit', 'ezviewCommon','dateTimePicker', CONTEXT_PATH +'/ezSafe/lib_js/commonCPlugin/commonCPlugin.js',
    CONTEXT_PATH +'/ezSafe/lib_js/fileUpload/uploadXmlrpc.js',CONTEXT_PATH+'/ezSafe/lib_js/xzqhSelect/xzqhSelect.js'], function (dom, common,dtp,CommomCPlugin, UploadXmlrpc,xzqhSelect) {

    var Page = {
        singleZGJLInit: {
            JLBH: "",
            ZGSJ: "",
            ZGCS: "",
            ZGZJ: {
                DW: "",
                JE: "",
            },
            ZGSM: "",
            ZGFJ: [],
            ZGJG: {
                ID: "",
                VALUE: "",
            },
            YSRY: "",
            YSSJ: "",
        },
        ZGJLIndex: -1,
        ZGJL: [],
        ZGJG: {
            ID: "",
            VALUE: ""
        },
        JCRY: {
            RYBH: "",
            RYXM: ""
        },
        YHLY: {
            ID: "",
            VALUE: ""
        },
        ZGZJ: {
            DW: "",
            JE: "",
        },
        SSJZ:{
            JZBH: "",
            JZMC: "",
            JZNBBM: ""
        },
        addClick: null,
        filesPath: [],
        viewModel: null,
        uploadXmlrpc: new UploadXmlrpc(),
        jcfj:0,
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
                Page.ssxq.XZQHBH = string[0];
                Page.ssxq.XZQHMC = string[1];
                Page.ssxq.XZQHNBBM = string[2];
                $("#aqyh-xzqhSelectIpt").val(string[1]);
            }
        }),
        timePicker: {
            jcsj: null,
            zgqx: null
        },

        init: function () {
            var self = this;
            $.ajax({
                url: CONTEXT_PATH + "/api/qyda/aqyhgl/getInit",
                type: "GET",
                cache: true,
                success: function (data) {
                    self.tpwjlx = data.tpwjlx;
                    self.spwjlx = data.spwjlx;
                }
            });
            self.uiInit();
            self.bindEvent();
            self.renderDatePicker();
        },
        uiInit: function () {
            var self = this;

            var zgjlTemplate = kendo.template($("#zgjlEdit-list-xq-template").html());
            var result = zgjlTemplate("");
            $("#zgjlEditContent").html(result);
            //整改记录编辑弹窗页面初始化
            $("#aqyhglEdit-zgjl-xj-win").kendoWindow({
                scrollable: false,
                width: "45%",
                height: "45%",
                visible: false,
                title: false,
                modal: true,
                resizable: false
            }).data("kendoWindow");
        },

        aqyhEdit: function (data) {
            var self = this;
            if (data) {
                $("#edit-window").data("kendoWindow").center().open();
                self.ssxq.XZQHBH = data.SSXQ.XZQHBH;
                self.ssxq.XZQHMC = data.SSXQ.XZQHMC;
                self.ssxq.XZQHNBBM = data.SSXQ.XZQHNBBM;
                data = self.setEmptyValue(data);
                self.editInfo(data);
            } else {
                $("#edit-window").data("kendoWindow").center().open();
            }
        },

        bindEvent: function () {
            var self = this;

            //整改详情
            $(".list-zgjl-xq").click(function (e) {
                //更改源
                $("#aqyhgl-zgjl-xq-win").data("kendoWindow").center().open();
            })

            $("#edit-window-close,#cancelButton").click(function () {
                $(".remove-search").remove();
                $("#edit-window").data("kendoWindow").close();
            });
            $("#saveButton").click(function (e) {
                var data = self.viewModel.get("dataKendo");
                $(".remove-search").remove();
                //data = self.setEmptyValue(data);
                self.save(data);
            });
            $("#xzqh-close-button").click(function () {
                $(".xzqh-window").data("kendoWindow").close();
            });

            $("#xzqh-close-button").click(function () {
                $(".xzqh-window").data("kendoWindow").close();
            });
            //隐患类型下拉框
            $("#yhlxDropDown").kendoDropDownZdx({
                zdlx:"20026",
                level:"0",
                change: function (e) {
                    self.viewModel.dataKendo.YHLX = {ID: e.id, VALUE: e.text, CHAIN: e.nbbm};
                }
            });
            //隐患级别下拉框
            $("#yhjbDropDown").kendoDropDownZdx({
                zdlx:"20027",
                level:"0",
                change: function (e) {
                    self.viewModel.dataKendo.YHJB = {ID: e.id, VALUE: e.text};
                }
            });
            //隐患来源下拉框
            $("#yhlyDropDown").kendoDropDownZdx({
                zdlx:"20029",
                level:"0",
                change: function (e) {
                    self.viewModel.dataKendo.YHLY = {ID: e.id, VALUE: e.text};
                }
            });
            //关闭安全隐患详情的弹窗
            $("#zgjl-xq-close-button").click(function () {
                $("#aqyhgl-zgjl-xq-win").data("kendoWindow").close();
            });

            //关闭整改记录的弹窗
            $("#zgjl-edit-close-button").click(function () {
                $("#aqyhglEdit-zgjl-xj-win").data("kendoWindow").close();
            })

            $("#zgjlEditCancelButton").click(function () {
                $("#aqyhglEdit-zgjl-xj-win").data("kendoWindow").close();
            })

            //保存新建/修改的整改记录（单条）
            $("#zgjlEditSaveButton").click(function () {
                //新增/修改数据源
                var singleZGJL = self.viewModel.singleZGJL;
                singleZGJL.ZGSJ = kendo.toString(singleZGJL.ZGSJ, 'yyyy-MM-dd HH:mm:ss');
                singleZGJL.YSSJ = kendo.toString(singleZGJL.YSSJ, 'yyyy-MM-dd HH:mm:ss');

                if (!self.checkSingleZGJL(singleZGJL)) {
                    kendo.ui.ExtMessageDialog.show({
                        messageType: "error",
                        message: "请填写必填项",
                        autoDisappearTime: 1500
                    });
                    return;
                }
                if (self.ZGJLIndex != -1) {
                    self.ZGJL.splice(self.ZGJLIndex, 1, singleZGJL);
                } else {
                    self.ZGJL.splice(0, 0, singleZGJL);
                }
                var dataSource = new kendo.data.DataSource({
                    data: self.ZGJL
                });
                var listView = $("#zgjlEdit-list").data("kendoListView");
                listView.setDataSource(dataSource);
                $("#aqyhglEdit-zgjl-xj-win").data("kendoWindow").close();
            })

        },

        editInfo: function (data) {
            var self = this;
            self.copy = JSON.parse(JSON.stringify(data));
            var singleZGJL = JSON.parse(JSON.stringify(self.singleZGJLInit));

            if (data.YHLX !== undefined || data.YHLX !== null) {
                $('#yhlxDropDown input').val(data.YHLX.VALUE);
            }
            if (data.YHJB !== undefined || data.YHJB !== null) {
                $('#yhjbDropDown input').val(data.YHJB.VALUE);
            }

            //填充整个记录
            self.ZGJL = self.copy.ZGJL;
            if (!self.ZGJL) {
                self.ZGJL = []
            }
            var listView = $("#zgjlEdit-list").data("kendoListView");
            if (!self.mvvmInit) {
                //整改数据列表
                listView = $("#zgjlEdit-list").kendoListView({
                    dataSource: self.ZGJL,
                    template: kendo.template($("#zgjlEdit-list-template").html()),
                    dataBound: function (e) {
                        $(".list-zgjl-edit").click(function (e) {
                            self.ZGJLIndex = $(e.target).parents(".zgfj-row").index();
                            var dataItem = listView.dataItem(e.currentTarget);
                            singleZGJL = dataItem;
                            self.viewModel.set("singleZGJL", singleZGJL);
                            $("#zgjl-edit-window-title").html("修改整改记录");
                            $("#aqyhglEdit-zgjl-xj-win").data("kendoWindow").center().open();
                        })

                        $(".deleteSingleZGJL").click(function (e) {
                            $.when(kendo.ui.ExtConfirmDialog.show({
                                title: "提示!",
                                message: "确定要删除吗",
                                icon: 'question'
                            })).done(function (result) {
                                if (result.button == "OK") {
                                    var index = $(e.target).parents(".zgfj-row").index();
                                    self.ZGJL.splice(index, 1);
                                    var dataSource = new kendo.data.DataSource({
                                        data: self.ZGJL
                                    });
                                    listView.setDataSource(dataSource);
                                }
                            });
                        })
                    }
                }).data("kendoListView");
            } else {
                var dataSource = new kendo.data.DataSource({
                    data: self.ZGJL
                });
                listView.setDataSource(dataSource);
            }
            if (!self.mvvmInit) {
                self.viewModel = kendo.observable({
                    dataKendo: self.copy,
                    singleZGJL: singleZGJL,
                    dictData: data,
                    addJCFJ: function () {
                        self.uploadFile(this.dataKendo,self.jcfj);
                    },
                    addSingleZGJL: function () {
                        //打开编辑弹窗
                        self.ZGJLIndex = -1;
                        var singleZGJL = JSON.parse(JSON.stringify(self.singleZGJLInit));
                        self.viewModel.set("singleZGJL", singleZGJL);
                        $("#zgjl-edit-window-title").html("新增整改记录");
                        $("#aqyhglEdit-zgjl-xj-win").data("kendoWindow").center().open();
                        /*self.uploadFile(this.dataKendo,self.zgfj);*/
                    },
                    deleteJcfj: function (e) {
                        $.when(kendo.ui.ExtConfirmDialog.show({
                            title: "提示!",
                            message: "确定要删除吗",
                            icon: 'question'
                        })).done(function (result) {
                            if (result.button == "OK") {
                                var index = $(e.target).parents(".jcfj-row").index();
                                self.viewModel.dataKendo.JCFJ.splice(index, 1);
                            }
                        });
                    },
                    openXzqh: function () {
                        $(".xzqh-window").data("kendoWindow").center().open();
                        //xzqhSelect.binddingTreeView();
                    },
                    openXzqh: function () {
                        self.xzqhSelect.openXzqh();
                    },
                    addSingleZGFJ: function (e) {
                        self.uploadFile(self.viewModel.singleZGJL.ZGFJ, 1);//添加整改附件
                    },
                    deleteSingleZGFJ: function (e) {
                        $.when(kendo.ui.ExtConfirmDialog.show({
                            title: "提示!",
                            message: "确定要删除吗",
                            icon: 'question'
                        })).done(function (result) {
                            if (result.button == "OK") {
                                var index = $(e.target).parents(".zgfj-single-row").index();
                                self.viewModel.singleZGJL.ZGFJ.splice(index, 1);
                            }
                        });
                    }
                });
                kendo.bind($(".miniFireEdit-wrap"), self.viewModel);
                self.mvvmInit = true;
            } else {
                self.viewModel.set("dataKendo", self.copy);
            }
        },

        save: function (data) {
            var self = this;
            data.ZGJL = self.ZGJL;
            data.SSXQ = self.ssxq;
            var jcsj = self.timePicker.jcsj.value();
            data.JCSJ = kendo.toString(data.JCSJ = jcsj ? jcsj : "", 'yyyy-MM-dd HH:mm:ss');
            data.ZGQX = kendo.toString(data.ZGQX, 'yyyy-MM-dd');
            data.SSXQ.XZQHNBBM = data.SSXQ.XZQHNBBM ? data.SSXQ.XZQHNBBM : 1;
            if (!self.check(data)) {
                kendo.ui.ExtMessageDialog.show({
                    messageType: "error",
                    message: "请填写必填项",
                    autoDisappearTime: 1500
                });
                return;
            }
            $.ajax({
                url: CONTEXT_PATH + "/api/qyda/aqyhgl/save",
                cache: false,
                type: 'POST',
                data: {miniFire: JSON.stringify(data)},
                success: function (data) {
                    $("#edit-window").data("kendoWindow").close();
                    self.addClick(data);
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
            if (!data.YHLX.VALUE || !data.YHJB.VALUE  || !data.YHLX || !data.YHJB) {
                result = false;
            }
            return result;
        },

        checkSingleZGJL: function(data) {
            var result = true;
            if (!data.ZGSJ || !data.ZGJG || !data.ZGCS|| !data.YSRY|| !data.YSSJ) {
                result = false;
            }
            return result;
        },

        /**
         * 渲染时间选择器
         */
        renderDatePicker: function () {
            var self = this;
            kendo.culture("zh-CN");
            self.timePicker.jcsj = $("#jcsj-date").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm:ss",
            }).data("kendoDateTimePicker");

            $("#singleZGSJ").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm:ss",
            }).data("kendoDateTimePicker");
            $("#singleYSSJ").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm:ss"
            }).data("kendoDateTimePicker");
        },

        setEmptyValue: function (data) {
            if(!data.ZGJL){
                data.ZGJL=[];
            }else {
                var zgjlLen = data.ZGJL.length;
                for (var i = 0; i < zgjlLen; i++){
                    if(!data.ZGJL[i].JLBH) data.ZGJL[i].JLBH = "";
                    if(!data.ZGJL[i].ZGSJ) data.ZGJL[i].ZGSJ = "";
                    if(!data.ZGJL[i].ZGCS) data.ZGJL[i].ZGCS = "";
                    if(!data.ZGJL[i].ZGSM) data.ZGJL[i].ZGSM = "";
                    if(!data.ZGJL[i].YSRY) data.ZGJL[i].YSRY = "";
                    if(!data.ZGJL[i].YSSJ) data.ZGJL[i].YSSJ = "";

                    if(!data.ZGJL[i].ZGZJ) {
                        data.ZGJL[i].ZGZJ = self.ZGZJ;
                    }else{
                        if(!data.ZGJL[i].ZGZJ.DW) data.ZGJL[i].ZGZJ.DW = "";
                        if(!data.ZGJL[i].ZGZJ.JE) data.ZGJL[i].ZGZJ.JE = "";
                    }
                    if(!data.ZGJG){
                        data.ZGJG = [];
                    }else {
                        if(!data.ZGJL[i].ZGJG.ID) data.ZGJL[i].ZGJG.ID = "";
                        if(!data.ZGJL[i].ZGJG.VALUE) data.ZGJL[i].ZGJG.VALUE = "";
                    }
                    if(!data.ZGJL[i].ZGFJ){
                        data.ZGJL[i].ZGFJ = [];
                    }else{
                        var zgfjLen = data.ZGJL[i].ZGFJ.length;
                        for (var j = 0; j < zgfjLen; j++){
                            var zgfj = data.ZGJL[i].ZGFJ[j];
                            if(!zgfj.FJDZ) zgfj.FJDZ = "";
                            if(!zgfj.FJHZ) zgfj.FJHZ = "";
                            if(!zgfj.XSSX) zgfj.XSSX = "";
                            if(!zgfj.FJLX) zgfj.FJLX = "";
                            if(!zgfj.FJMC) zgfj.FJMC = "";
                            if(!zgfj.FJMS) zgfj.FJMS = "";
                        }
                    }

                }
            }
            if(!data.YHLY){
                data.YHLY = self.YHLY;
            }else{
                if(!data.YHLY.ID) data.YHLY.ID = "";
                if(!data.YHLY.VALUE) data.YHLY.VALUE = "";
            }
            if(!data.YHLX){
                data.YHLX = self.YHLX;
            }else{
                if(!data.YHLX.ID) data.YHLX.ID = "";
                if(!data.YHLX.VALUE) data.YHLX.VALUE = "";
                if(!data.YHLX.CHAIN) data.YHLX.CHAIN = "";
            }
            if(!data.YHJB){
                data.YHJB = self.YHJB;
            }else{
                if(!data.YHJB.ID) data.YHJB.ID = "";
                if(!data.YHJB.VALUE) data.YHJB.VALUE = "";
            }

            if(!data.JCFJ){
                data.JCFJ=[];
            }else {
                var len = data.JCFJ.length;
                for (var i = 0; i < len; i++){
                    var jcfj = data.JCFJ[i];
                    if(!jcfj.FJDZ) jcfj.FJDZ = "";
                    if(!jcfj.FJHZ) jcfj.FJHZ = "";
                    if(!jcfj.XSSX) jcfj.XSSX = "";
                    if(!jcfj.FJLX) jcfj.FJLX = "";
                    if(!jcfj.FJMC) jcfj.FJMC = "";
                    if(!jcfj.FJMS) jcfj.FJMS = "";
                }
            }

            if(!data.JCRY){
                data.JCRY = self.JCRY;
            } else {
                if(!data.JCRY.RYBH) data.JCRY.RYBH = "";
                if(!data.JCRY.RYXM) data.JCRY.RYXM = "";
            }

            if(!data.ZGJG){
                data.ZGJG = self.ZGJG;
            } else {
                if(!data.ZGJG.ID) data.ZGJG.ID = "";
                if(!data.ZGJG.VALUE) data.ZGJG.VALUE = "";
            }

            if(!data.SSJZ){
                data.SSJZ = self.SSJZ;
            }else{
                if(!data.SSJZ.JZBH) data.SSJZ.JZBH = "";
                if(!data.SSJZ.JZMC) data.SSJZ.JZMC = "";
                if(!data.SSJZ.JZNBBM) data.SSJZ.JZNBBM = "";
            }
            return data;
        },

        newMiniFire: function (self) {
            this.XXBH = $.getUuid();
            this.RWBH = "";
            this.QYXX = {
                QYBH: "",
                QYMC: ""
            };
            this.YHBH = $.getUuid();
            this.YHMC = "";
            this.YHLX = {
                ID: "",
                VALUE: "",
                CHAIN: ""
            };
            this.YHJB = {
                ID: "",
                VALUE: ""
            };
            this.YHLY = {
                ID: "",
                VALUE: ""
            };
            this.YHWZ = "";
            this.YHBW = "";
            this.YHNR = "";
            this.JCRY = {
                RYBH: "",
                RYXM: ""
            };
            this.JCSJ = "";
            this.JCFJ = [];
            this.ZGQX = "";
            this.ZRBM = "";
            this.ZRRY = "";
            this.LXDH = "";
            this.ZGJL = [];
            this.ZGJG = {
                ID: "",
                VALUE: ""
            };
            this.BZXX = "";
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
            this.XSSX = "";
            this.SJLY = "";
            this.RKRY = "";
            this.RKSJ = "";
            this.JLZT = "1";
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
                        data.push(self.fjxx);
                    }
                },
                error: function (result) {
                    alert("上传失败！");
                }
            });
        },
    };


    Page.init();
    return Page;
});