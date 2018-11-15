define(['lib/domReady!xxbj', 'ezviewCommon', 'fileUpload/uploadXmlrpc'], function (dom, common, UploadXmlrpc) {

    var page = {
        bulidModel: null,
        uploadXmlrpc: new UploadXmlrpc(),
        updateClick: null,
        closeClick: null,
        isNew: false,
        isOptYJZS: false,
        dataSource: null,
        tpwjlx: "",
        spwjlx: "",

        init: function () {
            var self = this;
            self.bindEvent();

            $.ajax({
                url: CONTEXT_PATH + "/api/yjzb/yjsc/getInit",
                type: "GET",
                cache: true,
                success: function (data) {
                    self.tpwjlx = data.tpwjlx;
                    self.spwjlx = data.spwjlx;
                }
            });
        },

        bindEvent: function () {
            var self = this;

            $(".save-button").click(function (e) {
                var isValid = self.isValidate();
                if (isValid) {
                    if (self.isOptYJZS) {
                        self.optYjzs();
                    }
                    else {
                        self.optYjsx();
                    }
                }
            });

            $(".cancel-button").click(function () {
                if (typeof self.closeClick != 'undefined' && typeof self.closeClick == 'function') {
                    self.closeClick(self.isNew);
                }
            });

            $(".info-editor-close").click(function () {
                if (typeof self.closeClick != 'undefined' && typeof self.closeClick == 'function') {
                    self.closeClick(self.isNew);
                }
            });
        },

        setXxbj: function (data, isOptYJZS, isNew) {
            var self = this;
            self.isNew = isNew;
            self.isOptYJZS = isOptYJZS;
            self.dataSource = data;
            data = self.handleData(data, isOptYJZS, isNew);

            var response = {data: data, event: {}};
            response.event.removeFile = function (e) {
                var model = this.data.FJ.toJSON();
                for (var i = 0; i < model.length; i++) {
                    if (model[i].SLTP == e.data.SLTP) {
                        model.splice(i, 1);
                    }
                }
                this.data.set("FJ", model);
            };
            response.event.uploadFile = function (e) {
                window.top.receiveMsgInfo = function (msg) {
                    if (msg != undefined && msg != null && msg != "") {
                        var picPath = msg.split("|")[1];
                        if (picPath != "") {
                            self.uploadLocalFile(picPath);
                        }
                    }
                };
                window.sendMsgInfo("SelectFiles|*.*");
            };
            self.bulidModel = kendo.observable(response);
            kendo.bind($(".xxbj-container"), self.bulidModel);
        },

        optYjzs: function () {
            var self = this;
            self.dataSource.ZSBT = self.bulidModel.data.BT;
            self.dataSource.ZSNR = self.bulidModel.data.NR;
            self.dataSource.ZSBZ = self.bulidModel.data.BZ;
            self.dataSource.ZSFJ = self.bulidModel.data.FJ;

            $.ajax({
                url: CONTEXT_PATH + "/api/yjzb/yjsc/updateYjzs?random=" + Math.random(),
                type: "POST",
                cache: false,
                data: {
                    yjzs: JSON.stringify(self.dataSource)
                },
                success: function (data) {
                    kendo.ui.ExtMessageDialog.show({
                        messageType: "info",
                        message: self.isNew ? "新增成功" : "修改成功",
                        autoDisappearTime: 1500
                    });
                    if (typeof self.updateClick != 'undefined' && typeof self.updateClick == 'function') {
                        self.updateClick(self.dataSource);
                    }
                },
                error: function (result) {
                    kendo.ui.ExtMessageDialog.show({
                        messageType: "error",
                        message: self.isNew ? "新增失败" : "修改失败",
                        autoDisappearTime: 1500
                    });
                }
            });
        },

        optYjsx: function () {
            var self = this;
            self.dataSource.FAMC = self.bulidModel.data.BT;
            self.dataSource.FANR = self.bulidModel.data.NR;
            self.dataSource.FABZ = self.bulidModel.data.BZ;
            self.dataSource.FAFJ = self.bulidModel.data.FJ;

            $.ajax({
                url: CONTEXT_PATH + "/api/yjzb/yjsc/updateYjfa?random=" + Math.random(),
                type: "POST",
                cache: false,
                data: {
                    yjfa: JSON.stringify(self.dataSource)
                },
                success: function (data) {
                    kendo.ui.ExtMessageDialog.show({
                        messageType: "info",
                        message: self.isNew ? "新增成功" : "修改成功",
                        autoDisappearTime: 1500
                    });
                    if (typeof self.updateClick != 'undefined' && typeof self.updateClick == 'function') {
                        self.updateClick(self.dataSource);
                    }
                },
                error: function (result) {
                    kendo.ui.ExtMessageDialog.show({
                        messageType: "error",
                        message: self.isNew ? "新增失败" : "修改失败",
                        autoDisappearTime: 1500
                    });
                }
            });
        },

        uploadLocalFile: function (filePath) {
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
                } else if (self.spwjlx.indexOf(suffix) >= 0) {
                    fileType = "0";
                } else {
                    fileType = "2";
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
            }

            this.uploadXmlrpc.batchUploadResWithProgress(fileObjects, {
                readyUpload: function (result) {
                },
                progress: function (result) {
                },
                success: function (result) {
                    var mode = self.bulidModel.data.FJ.toJSON();
                    mode.push({
                        WJLX: Number(result["ResourceType"]) + 1,
                        WJMC: result["ResourceName"],
                        WJMS: "",
                        SLTP: result["ThumbnailUrlPath"],
                        WLLJ: result["FileUrlPath"],
                        CCLJ: result["FileNfsPath"],
                        XSSX: ""

                    });
                    self.bulidModel.data.set("FJ", mode);
                },
                error: function (result) {
                    alert("上传失败！");
                }
            });
        },

        isValidate: function () {
            var self = this;
            var data = self.bulidModel.data;
            if (data["BT"] == null || data["BT"] === "") {
                kendo.ui.ExtMessageDialog.show({
                    messageType: "error",
                    message: "请输入标题",
                    autoDisappearTime: 1500
                });
                return false;
            }

            return true;
        },

        handleData: function (data, isOptYJZS, isNew) {
            var self = this;
            var dataItem = {};
            if (isOptYJZS) {
                dataItem = {
                    BT: data.ZSBT || "",
                    NR: data.ZSNR || "",
                    BZ: data.ZSBZ || "",
                    FJ: data.ZSFJ || []
                };
            } else {
                dataItem = {
                    BT: data.FAMC || "",
                    NR: data.FANR || "",
                    BZ: data.FABZ || "",
                    FJ: data.FAFJ || []
                };
            }
            if (isNew) {
                $("info-editor-window .new-window-title").text(isOptYJZS ? "新增知识点" : "新增事项");
            } else {
                $("info-editor-window .new-window-title").text(isOptYJZS ? "修改知识点" : "修改事项");
            }

            return dataItem;
        }
    };
    page.init();

    return page;
});