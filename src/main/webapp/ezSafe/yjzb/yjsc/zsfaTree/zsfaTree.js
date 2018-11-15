define(['lib/domReady!zsfaTree', 'ezviewCommon', 'fireTree/fireTree'], function (common) {
    var Page = {
        userInfo: {},
        isInit: false,
        zdx: [],
        isReadOnly: $.getUrlParams().isReadOnly === "true",
        defImg: "../ezSafe/icons/common-treeview-zzjg.png",
        faImg: "../ezSafe/icons/yjsc-icon-fa-n.png",
        csImg: "../ezSafe/icons/yjsc-icon-cs-n.png",
        zsdImg: "../ezSafe/icons/yjsc-icon-zsd-n.png",
        getTreeAjax: null,

        init: function () {
            var self = this;
        },

        initTree: function (tree) {
            var self = this;
            self.isInit = true;
            $(".zsfa-tree").setTree({
                dataSource: tree,
                search: {
                    mode: true,
                    filter: false
                },
                clickType: "click",
                choosFirst: false,
                order: {
                    mode: true,
                    dataOrderField: "XSSX",
                    dataOrderType: "asc"
                },
                edit: {
                    mode: !self.isReadOnly,
                    deep: [0, 2, 3, 4],
                    delete: [1, 2, 3, 4, 5],
                    rename: [1, 2, 3, 4, 5],
                    swap: [1, 2, 3, 4, 5],
                    method: "click"
                },
                dataSearchFields: ["FAMC", "FANR", "FABZ", "ZSBT", "ZSNR", "ZSBZ"],
                dataTextField: "text",
                dataValueField: "id",
                method: {
                    add: function (old) {
                        var addData = new self.newData(old, self.userInfo, self);
                        self.callBack.add(old);
                        return addData;
                    },
                    addCallBack: function (data) {
                        self.callBack.addCallback(data);
                    },
                    change: function (data, e) {
                        self.callBack.change(data, e);
                    },
                    save: function (data) {
                        var result = self.dataAdapt(data);
                        self.getSublings(data);
                        self.update(data.DXLB, result.objList, result.obj, "save");
                    },
                    swap: function (upItem, downItem) {
                        var result = self.dataAdapt(upItem);
                        self.update(upItem.DXLB, result.objList, result.obj, "swap");
                        if (upItem.DXLB === "YJFA") {
                            var resultDown = self.dataAdapt(downItem);
                            self.update(upItem.DXLB, resultDown.objList, resultDown.obj, "swap");
                        }
                        self.callBack.swap(upItem, downItem);
                    },
                    delete: function (data) {
                        setTimeout(function () {
                            if (data.DXLB === "YJFA") {
                                self.getSublings(data);
                                self.update(data.DXLB, [], data, "delete");
                            } else if (data.DXLB === "YJZS") {
                                var result = self.dataAdapt(data);
                                self.update(data.DXLB, result.objList, result.obj, "delete");
                            }
                            self.callBack.removeCallBack(data);
                        }, 0)
                    },
                    search: function (items, text, doms) {
                        self.callBack.search(items, text, doms);
                    },
                    searchKeyPress: function (e) {
                        if (e.keyCode === 13) {
                            self.callBack.searchEnter(e);
                        }
                    }
                }
            });
        },

        newData: function (parent, user, self, text) {
            var id = $.getUuid();
            if (parent.DXLB === "SGFARoot" || parent.DXLB === "YJFA") {
                this.id = id;
                this.DXLB = "YJFA";
                this.FABH = id;
                this.FAMC = text;
                this.text = text || "新建方案";
                this.FJFA = parent.id || -1;
                this.NBBM = parent.NBBM ? parent.NBBM + "." + id : "1." + id;
                this.items = [];
                this.img = parent.FABH ? self.csImg : self.faImg;
            } else if (parent.DXLB === "ZSKRoot") {
                this.id = id;
                this.ZSBH = id;
                this.DXLB = "YJZS";
                this.deep = 1;
                this.ZSBT = text;
                this.text = text || "新增知识点";
                this.img = self.zsdImg;
            }
            this.DXBH = parent.DXBH;
            this.deep = parent.deep + 1;
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
        },

        dataAdapt: function (data) {
            var self = this;
            var obj = {};
            var objList = [];
            switch (data.DXLB) {
                case "YJFA":
                    obj.FABH = data.id;
                    obj.idFather = data.DXBH;
                    obj.FAMC = data.text || "";
                    obj.DXBH = data.DXBH || "";
                    obj.XSSX = data.index;
                    obj.FJFA = data.FJFA || "";
                    obj.NBBM = data.NBBM || "";
                    data.FAMC = data.text;
                    break;
                case "YJZS":
                    obj.ZSBH = data.id;
                    obj.idFather = data.DXBH;
                    obj.ZSBT = data.text || "";
                    data.ZSBT = data.text;
                    for (var i = 0; i < data.parent().length; i++) {
                        var temp = {};
                        temp.ZSBH = data.parent()[i].id;
                        temp.ZSBT = data.parent()[i].text;
                        temp.XSSX = data.parent()[i].index;
                        objList.push(temp);
                    }
                    break;
                default:
                    break;
            }
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
            obj.JLZT = data.JLZT || 1;
            obj.RKSJ = data.RKSJ || (new Date()).Format("yyyy-MM-dd hh:mm:ss");

            return {
                obj: obj,
                objList: objList
            }
        },

        update: function (DXLB, ObjList, Obj, CZLX) {
            var self = this;
            $.ajax({
                url: CONTEXT_PATH + "/api/yjzb/yjsc/saveZsfaTree",
                type: "POST",
                dataType: "json",
                data: {
                    dxlb: DXLB,
                    czlx: CZLX,
                    dxList: JSON.stringify(ObjList),
                    dxnr: JSON.stringify(Obj)
                },
                success: function (data) {
                }
            });
        },

        /**
         * 获取兄弟节点状态
         * **/
        getSublings: function (dataItem) {
            var self = this;
            var lists = [];
            if (dataItem.deep === 2 && dataItem.DXLB === "YJFA") {
                for (var i = 0; i < dataItem.parent().length; i++) {
                    lists.push(dataItem.parent()[i].FAMC);
                }
                self.callBack.update(lists);
            }
        },

        callBack: {
            change: function (a, b) {
            },
            setTree: function (tree) {
                if (Page.isInit) {
                    $(".zsfa-tree").data("treeview").reset(tree);
                } else {
                    Page.initTree(tree);
                }
            },
            getData: function (data, el, isNew, callBack) {
                var zsfaTree = [];
                if (isNew) {
                    var DXLB = ["ZSKRoot", "SGFARoot"];
                    var text = ["对象知识库", "事故处置方案"];
                    var img = [Page.defImg, Page.defImg];
                    for (var i = 0; i < 2; i++) {
                        var obj = {};
                        obj.deep = 0;
                        obj.DXBH = data.DXBH;
                        obj.DXLB = DXLB[i];
                        obj.id = "";
                        obj.text = text[i];
                        obj.items = [];
                        obj.img = img[i];
                        zsfaTree.push(obj);
                    }
                    callBack(zsfaTree);
                } else {
                    if (Page.getTreeAjax) {
                        Page.getTreeAjax.abort();
                    }
                    Page.getTreeAjax = $.ajax({
                    url: CONTEXT_PATH + "/api/yjzb/yjsc/getZsfa",
                    type: "GET",
                    dataType: "json",
                    data: {
                        DXBH: data.DXBH,
                        zskName: "对象知识库",
                        sgfaName: "事故处置方案",
                        ZSKRootImg: Page.defImg,
                        SGFARootImg: Page.defImg,
                        YJSXImg: Page.csImg,
                        FAFLImg: Page.csImg,
                        YJZSImg: Page.zsdImg,
                        YJFAImg: Page.faImg
                    },
                    success: function (tree) {
                        setTimeout(function () {
                            callBack(tree);
                        }, 300)
                    }
                });
                }
            },
            init: function (data) {
                Page.init();
                Page.userInfo = data;
            },
            add: function (old) {
            },
            addCallback: function (data) {
            },
            data: function () {
                return $(".zsfa-tree").data("treeview").data();
            },
            expand: function (uid, isChange, isScroll) {
                $(".zsfa-tree").data("treeview").expandTo(uid, isChange, isScroll);
            },
            remove: function (uid, hideDialog) {
                $(".zsfa-tree").data("treeview").remove(uid, hideDialog);
            },
            removeCallBack: function (data) {
            },
            rename: function (name, uid, isSave) {
                var dataItem = $(".zsfa-tree").data("treeview").rename(name, "", uid, isSave);
                switch (dataItem.DXLB) {
                    case "YJZS":
                        dataItem.ZSBT = name;
                        break;
                    case "YJFA":
                        dataItem.FAMC = name;
                        break;
                    default:
                        break;
                }
            },
            swap: function (upItem, downItm) {
            },
            addYjfa: function (uid, text) {
                $(".zsfa-tree").data("treeview").add(uid, function (old) {
                    var addData = new Page.newData(old, Page.userInfo, Page, text);
                    Page.callBack.add(old);
                    return addData;
                });
            },
            search: function (items, text) {
            },
            searchEnter: function (e) {

            },
            update: function (lists) {
                console.log(lists);
            }
        }
    };
    return Page.callBack;
});