define(['lib/domReady!yjdx', 'ezviewCommon', 'fireTree/fireTree'], function (common) {
    var Page = {
        userInfo: {},
        NewData: false,
        isReadOnly: $.getUrlParams().isReadOnly === "true",

        init: function () {
            var self = this;
            self.getData();
        },

        initTree: function (tree) {
            var self = this;

            $(".dxjg-tree").setTree({
                dataSource: tree,
                search: {
                    mode: true,
                    filter: true
                },
                choosFirst: true,
                order: {
                    mode: true,
                    dataOrderField: "XSSX",
                    dataOrderType: "asc"
                },
                clickType: "click",
                edit: {
                    mode: !self.isReadOnly,
                    deep: [0, 1, 2, 3],
                    delete: [0, 1, 2, 3, 4],
                    rename: [0, 1, 2, 3, 4],
                    swap: [0, 1, 2, 3, 4],
                    method: "click"
                },
                dataSearchFields: ["DXMC"],
                dataTextField: "DXMC",
                dataValueField: "NBBM",
                method: {
                    add: function (old) {
                        var addData = new self.newData(old, self.userInfo);
                        self.NewData = true;
                        return addData;
                    },
                    addCallBack: function (data, e) {
                        data.XSSX = data.index;
                        self.callBack.change(data, e, true);
                    },
                    swap: function (upItem, downItem) {
                        self.update(self.dataAdapt(upItem));
                        self.update(self.dataAdapt(downItem));
                    },
                    change: function (data, e) {
                        self.callBack.change(data, e, self.NewData);
                    },
                    save: function (data, e) {
                        var result = self.dataAdapt(data);
                        self.update(result, self.NewData);
                    },
                    delete: function (data) {
                        self.delete(data);
                    }
                }
            });
        },

        newData: function (parent, user) {
            var DXBH = $.getUuid();
            this.DXBH = DXBH;
            this.DXMC = "新建对象";
            this.FJDX = parent.DXBH || -1;
            this.NBBM = parent.NBBM ? parent.NBBM + "." + DXBH : "1." + DXBH;
            this.YJZS = [];
            this.YJFA = [];
            this.SZDXFJG = {
                XFJGBH: user.DWBH,
                XFJGMC: user.DWMC,
                XFJGJC: user.DWSX,
                XFJGNBBM: user.DWNBBM
            };
            this.SZDXZQH = {
                XZQHBH: user.XZBM,
                XZQHNBBM: user.XZNBBM,
                XZQHMC: user.XZMC
            };
            this.JLZT = 1;
            this.RKRY = user.JYXM;
            this.RKSJ = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
            this.deep = (parent.deep === undefined || parent.deep === null) ? 0 : parent.deep + 1;
        },

        dataAdapt: function (data) {
            var obj = {};
            obj.DXBH = data.DXBH;
            obj.DXMC = data.DXMC || "";
            obj.FJDX = data.FJDX || "";
            obj.NBBM = data.NBBM || "";
            obj.XSSX = data.index;
            obj.YJZS = data.YJZS && data.YJZS.length > 0 ? copyArray(data.YJZS, "YJZS") : [];
            obj.YJFA = data.YJFA && data.YJFA.length > 0 ? copyArray(data.YJFA, "YJFA") : [];
            obj.SZDXZQH = {
                XZQHBH: data.SZDXZQH ? data.SZDXZQH.XZQHBH : self.userInfo.XZBM,
                XZQHMC: data.SZDXZQH ? data.SZDXZQH.XZQHMC : self.userInfo.XZMC,
                XZQHNBBM: data.SZDXZQH ? data.SZDXZQH.XZQHNBBM : self.userInfo.XZNBBM
            };
            obj.SZDXFJG = {
                XFJGBH: data.SZDXFJG ? data.SZDXFJG.XFJGBH : self.userInfo.DWBH,
                XFJGMC: data.SZDXFJG ? data.SZDXFJG.XFJGMC : self.userInfo.DWMC,
                XFJGJC: data.SZDXFJG ? data.SZDXFJG.XFJGJC : self.userInfo.DWSX,
                XFJGNBBM: data.SZDXFJG ? data.SZDXFJG.XFJGNBBM : self.userInfo.DWNBBM
            };
            obj.JLZT = data.JLZT;
            obj.RKSJ = data.RKSJ || (new Date()).Format("yyyy-MM-dd hh:mm:ss");

            function copyArray(arr, type) {
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    var obj = {};
                    switch (type) {
                        case"YJZS":
                            obj.ZSBH = arr[i].ZSBH;
                            obj.ZSBT = arr[i].ZSBT;
                            obj.XSSX = arr[i].XSSX;
                            break;
                        case "YJFA":
                            obj.FABH = arr[i].FABH;
                            obj.FAMC = arr[i].FAMC;
                            obj.XSSX = arr[i].XSSX;
                            break;
                    }
                    result.push(obj);
                }
                return result;
            }

            return obj;
        },

        update: function (yjdx, newData) {
            var self = this;
            $.ajax({
                url: CONTEXT_PATH + "/api/yjzb/yjsc/saveYjdx",
                type: "POST",
                data: {
                    yjdx: JSON.stringify(yjdx)
                },
                complete: function () {
                    if (newData) {
                        self.NewData = false
                    }
                }
            });
        },

        getData: function () {
            var self = this;
            $.ajax({
                url: CONTEXT_PATH + "/api/yjzb/yjsc/getYjdx",
                type: "GET",
                dataType: "json",
                data: {},
                success: function (data) {
                    self.initTree(data);
                }
            });
        },

        delete: function (data) {
            $.ajax({
                url: CONTEXT_PATH + "/api/yjzb/yjsc/deleteDx",
                type: "POST",
                data: {yjdx: JSON.stringify(data)},
                success: function (data) {
                }
            });
        },

        callBack: {
            change: function (data, e) {
            },
            init: function (data) {
                Page.init();
                Page.userInfo = data;
            },
            addRoot: function () {
                var data = new Page.newData({}, Page.userInfo);
                Page.NewData = true;
                $(".dxjg-tree").data("treeview").addRoot(data);
            }
        }


    };
    return Page.callBack;
});