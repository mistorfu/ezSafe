define(["jquery", CONTEXT_PATH + "/ezSafe/lib_js/fileUpload/xmlRpc.js"], function () {
    /**
     * 资源上传接口
     * @param options
     * @constructor
     */
    function UploadXmlRpc(options) {
        this.defaultParam = {
            "ResourceName": "", // 文件名称带后缀
            "ResourceType": "", // 资源类型：1 图片
            "ResourceMode": "", // 0: 本地上传，1： url上传， 2: 字节上传
            "ResourcePath": "", // 资源绝对路径
            "ResourceExt": "" // 资源后缀，全大写
        };
        this.url = "http://127.0.0.1:58458/ResourceUpload";
        for (var key in options) {
            this[key] = options[key];
        }
    }

    UploadXmlRpc.prototype = {

        /**
         * 批量资源上传, 包含进度回调
         * @param array 元素内容参见 this.defaultParam
         * @param options 进度回调选项 {
         *   @description 成功回调：result.ResourceInfo上传资源数组， 其中元素为【json对象类型】 {
         *         ResourceID: 资源唯一标识码
         *    }
         *   success: function(result) {},
         *   @description 失败回调：message 失败回调消息【string类型】
         *   error: function(message) {}
         *  }
         */
        batchUploadResWithProgress: function (array, options) {
            if (!array || array.length == 0) {
                return;
            }
            for (var i = 0; i < array.length; i++) {
                array[i] = $.toJSON(array[i]);
            }
            var request = new XmlRpcRequest(this.url, "uploadResource");
            request.addParam(array);
            var context = this;
            var marks = {};
            var markSuccess = {};
            request.send({
                success: function (result) {
                    var ids = [];
                    for (var i = 0; i < result["ResourceInfo"].length; i++) {
                        ids.push(result["ResourceInfo"][i]["ResourceID"]);
                    }
                    (function(ids){
                        var num = 0;
                        var timer = setInterval(function () {
                            context.batchQueryResource(ids, {
                                success: function (result) {
                                    var res;
                                    for (var i = 0; i < result["ResourceInfo"].length; i++) {
                                        res = result["ResourceInfo"][i];
                                        if (!marks[res["ResourceID"]]) {
                                            marks[res["ResourceID"]] = true;
                                            if (options && typeof options.readyUpload == "function") {
                                                options.readyUpload(res);
                                            }
                                        } else {
                                            if(!markSuccess[res["ResourceID"]])
                                            {
                                                if (options && typeof options.progress == "function") {
                                                    options.progress(res);
                                                }
                                            }
                                        }
                                        if (res && (res["UploadStatus"] == 2)) {
                                            if (!markSuccess[res["ResourceID"]]) {
                                                markSuccess[res["ResourceID"]] = true;
                                                num++;
                                                if (options && typeof options.success == "function") {
                                                    options.success(res);
                                                }
                                            }
                                        } else if (res && (res["UploadStatus"] == -1)) {
                                            if (!markSuccess[res["ResourceID"]]) {
                                                markSuccess[res["ResourceID"]] = true;
                                                num++;
                                                if (options && typeof options.error == "function") {
                                                    options.error(res);
                                                }
                                            }
                                        }
                                    }
                                    if (num ==  result["ResourceInfo"].length) {
                                        clearInterval(timer);
                                    }
                                },
                                error: function (message) {
                                    clearInterval(timer);
                                    if (options && typeof options.error == "function") {
                                        options.error(message);
                                    }
                                }
                            })
                        }, 500);
                    })(ids);
                },
                error: function (message) {
                    if (options && typeof options.error == "function") {
                        options.error(message);
                    }
                }
            });
        },

        /**
         * 单资源上传, 包含进度回调
         * @param param 内容参见 this.defaultParam
         * @param options 进度回调选项 {
         *   @description 成功回调：result【json对象类型】 {
         *         ResourceID: 资源唯一标识码
         *    }
         *   success: function(result) {},
         *   @description 失败回调：message 失败回调消息【string类型】
         *   error: function(message) {}
         *  }
         */
        uploadResWithProgress: function (param, options) {
            if (!param) {
                return;
            }
            var resource = {}
            for (var key in this.defaultParam) {
                resource[key] = this._isEmpty(param[key]) ? this.defaultParam[key] : param[key];
            }
            var request = new XmlRpcRequest(this.url, "uploadResource");
            request.addParam($.toJSON(resource));
            var context = this;
            request.send({
                success: function (result) {
                    var timer = setInterval(function () {
                        context.queryResource(result["ResourceID"], {
                            success: function (result) {
                                context.marks = context.marks ? context.marks : {};
                                if (!context.marks[result["ResourceID"]]) {
                                    context.marks[result["ResourceID"]] = true;
                                    if (options && typeof options.readyUpload == "function") {
                                        options.readyUpload(result);
                                    }
                                } else {
                                    if (options && typeof options.progress == "function") {
                                        options.progress(result);
                                    }
                                }
                                if (result && (result["UploadStatus"] == 2)) {
                                    delete context.marks[result["ResourceID"]];
                                    clearInterval(timer);
                                    if (options && typeof options.success == "function") {
                                        options.success(result);
                                    }
                                } else if (result && (result["UploadStatus"] == -1)) {
                                    delete context.marks[result["ResourceID"]];
                                    clearInterval(timer);
                                    if (options && typeof options.error == "function") {
                                        options.error("上传失败");
                                    }
                                }
                            },
                            error: function (message) {
                                clearInterval(timer);
                                if (options && typeof options.error == "function") {
                                    options.error(message);
                                }
                            }
                        })
                    }, 500);
                },
                error: function (message) {
                    if (options && typeof options.error == "function") {
                        options.error(message);
                    }
                }
            });
        },
        /**
         * 资源上传
         * @param param 内容参见 this.defaultParam
         * @param options 回调选项 {
         *   @description 成功回调：result【json对象类型】 {
         *         ResourceID: 资源唯一标识码
         *    }
         *   success: function(result) {},
         *   @description 失败回调：message 失败回调消息【string类型】
         *   error: function(message) {}
         *  }
         */
        uploadResource: function (param, options) {
            if (!param) {
                return;
            }
            var resource = {}
            for (var key in this.defaultParam) {
                resource[key] = this._isEmpty(param[key]) ? this.defaultParam[key] : param[key];
            }
            var request = new XmlRpcRequest(this.url, "uploadResource");
            request.addParam($.toJSON(resource));
            request.send(options);
        },
        /**
         * 资源上传进度查询
         * @param resourceId 资源上传后分配的唯一id
         * @param options 回调选项 {
         *    @description 成功回调：result【json对象类型】 {
         *         FileNfsPath: "" // nfs存储上的路径； FileUrlPath: 文件http访问路径
         *         ThumbnailUrlPath: 缩略图http访问路径， UploadProgress: 上传进度，
         *         UploadStatus: 上传状态 2标识完成， -1 上传失败
         *    }
         *   success: function(result) {},
         *   @description 失败回调：message 失败回调消息【string类型】
         *   error: function(message) {}
         *  }
         */
        queryResource: function (resourceID, options) {
            var progress = new XmlRpcRequest(this.url, "queryResource");
            progress.addParam(resourceID);
            progress.send(options);
        },

        /**
         * 批量查询资源上传进度
         * @param ids 元素为资源上传后分配的唯一id
         * @param options 回调选项 {
         *    @description 成功回调：result.ResourceInfo 数组对象， 其中元素为【json对象类型】 {
         *         FileNfsPath: "" // nfs存储上的路径； FileUrlPath: 文件http访问路径
         *         ThumbnailUrlPath: 缩略图http访问路径， UploadProgress: 上传进度，
         *         UploadStatus: 上传状态 2标识完成，-1 上传失败
         *    }
         *   success: function(result) {},
         *   @description 失败回调：message 失败回调消息【string类型】
         *   error: function(message) {}
         *  }
         */
        batchQueryResource: function (ids, options) {
            var progress = new XmlRpcRequest(this.url, "queryResource");
            progress.addParam(ids);
            progress.send(options);
        },

        _isEmpty: function (obj) {
            if (typeof obj == "undefined" || obj === "" || obj === null) {
                return true;
            }
            return false;
        }
    }

    return UploadXmlRpc;
});