require(['lib/domReady!yjsc', 'ezviewCommon'], function (dom, common) {
    require([CONTEXT_PATH + '/ezSafe/yjzb/yjsc/yjdx/yjdx.js',
        CONTEXT_PATH + '/ezSafe/yjzb/yjsc/zsfaTree/zsfaTree.js',
        CONTEXT_PATH + '/ezSafe/yjzb/yjsc/sczs/sczs.js',
        CONTEXT_PATH + '/ezSafe/yjzb/yjsc/xxbj/xxbj.js'], function (yjdx, zsfaTree, Sczs, xxbj) {

        var page = {
            sczs: new Sczs(),
            userCode: null,
            imgList: [],

            init: function () {
                var self = this;
                self.userCode = jQuery.getUrlParams().username;
                if (self.userCode == null || self.userCode == '' || self.userCode == undefined) {
                    self.userCode = "admin";
                }
                if (jQuery.getUrlParams().isReadOnly != "true") {
                    $(".add-button").show();
                }

                $.ajax({
                    url: CONTEXT_PATH + "/common-api/getUserInfo?random=" + Math.random(),
                    type: "POST",
                    data: {userCode: self.userCode},
                    dataType: "json",
                    success: function (data) {
                        self.setTree(data)
                    }
                });

                self.bindEvent();
            },

            bindEvent: function () {
                var self = this;

                $(".bigImg-window").kendoWindow({
                    width: "60%",
                    height: "80%",
                    title: false,
                    modal: true,
                    resizable: false
                });

                $(".info-editor-window").kendoWindow({
                    width: "57%",
                    height: "80%",
                    title: false,
                    modal: true,
                    resizable: false
                });

                $(".add-button").click(function () {
                    yjdx.addRoot();
                });

                $(".bigImg-close").click(function () {
                    $(".bigImg-window").data("kendoWindow").close();
                });

                $(".rotate-left").click(function () {
                    self.currentImg.rotate(-90);
                });

                $(".rotate-right").click(function () {
                    self.currentImg.rotate(90)
                });

                $(".image-up").click(function () {
                    imgChange(-1);
                });

                $(".image-down").click(function () {
                    imgChange(1);
                });

                function imgChange(type) {
                    var img = $(".bigImg-container img")[0];
                    var curImg = $(img).attr("u-url");
                    if (!curImg) {
                        curImg = img.src;
                    }
                    var index = 0;
                    for (var i = 0; i < self.imgList.length; i++) {
                        if (curImg == self.imgList[i].WLLJ) {
                            index = i + type;
                            break;
                        }
                    }
                    if (index >= 0 && index < self.imgList.length) {
                        imgShow(self.imgList[index]);
                    }
                }

                function imgShow(data) {
                    if (data.WJLX == "2") {
                        self.currentImg = $(".bigImg-container").setImg(data.WLLJ);
                        $(".rotate-left").show();
                        $(".rotate-right").show();
                    } else {
                        var template = kendo.template($("#file-template").html());
                        $(".bigImg-container").html(template(data));
                        $(".rotate-left").hide();
                        $(".rotate-right").hide();
                    }
                }

                self.sczs.showPic = function (list, index, title) {
                    self.imgList = list;

                    $(".bigImg-window .new-window-title").html(title);
                    $(".bigImg-window").data("kendoWindow").center().open();
                    imgShow(list[index]);
                };

                self.sczs.editEvent = function (dataItem, mark) {
                    delete dataItem.id;
                    console.log(dataItem , mark);
                    if (mark == 'zsd') {
                        xxbj.setXxbj(dataItem, true, false);
                    }
                    else if (mark == 'fa') {
                        xxbj.setXxbj(dataItem, false, false);
                    }
                    $(".info-editor-window").data("kendoWindow").center().open();
                };

                xxbj.updateClick = function (data) {
                    console.log(data);
                    self.sczs.modify(data);
                    $(".info-editor-window").data("kendoWindow").close();
                };

                xxbj.closeClick = function (isNew) {
                    $(".info-editor-window").data("kendoWindow").close();
                    if (isNew) {
                        zsfaTree.remove("", true);
                    }
                };

                //删除
                self.sczs.commonDelete = function (uid) {
                    zsfaTree.remove(uid, false);
                };
                //选中
                self.sczs.select = function (uid) {
                    zsfaTree.expand(uid, false, true);
                };
                //编辑方案名称
                self.sczs.modifyFa = function (uid, val, flag) {
                    //flag == true 更新数据库, flag == false 不更新数据库
                    zsfaTree.rename(val, uid, flag);
                };

                zsfaTree.removeCallBack = function (data) {
                    self.sczs.delete(data.id);
                };

                self.sczs.addFirstFa = function(dataItem , text) {
                    zsfaTree.addYjfa(dataItem.uid,text);
                };
            },

            setTree: function (data) {
                var self = this;
                yjdx.init(data);
                zsfaTree.init(data);
                yjdx.change = function (data, el, isNew) {
                    $(".right-up-title").html(data.DXMC + " - 知识库");
                    zsfaTree.getData(data, el, isNew, function (tree) {
                        zsfaTree.setTree(tree);
                        self.sczs.init(zsfaTree.data());
                    });
                };
                zsfaTree.change = function (data, e) {
                    var item = $.deepCloneObject(data);
                    if (item.deep > 0) {
                        item = self.setUid(item, data);
                        self.sczs.locate(item, e);
                    }
                };
                zsfaTree.addCallback = function (data) {
                    if (data.DXLB == "YJZS") {
                        xxbj.setXxbj({ZSBH: data.id}, true, true);
                    } else if (data.DXLB == "YJFA") {
                        xxbj.setXxbj({FABH: data.id, FAMC: data.FAMC}, false, true);
                    } else {
                        return;
                    }
                    $(".info-editor-window").data("kendoWindow").center().open();
                };
                zsfaTree.swap = function (upItem, downItem) {
                    self.sczs.changePosition(upItem);
                };
                zsfaTree.search = function (items, text) {
                    self.sczs.search(items , text);
                };
                zsfaTree.searchEnter = function (e) {
                    self.sczs.jumpToHighLight();
                };
                zsfaTree.update = function (lists) {
                    self.sczs.checkObject(lists);
                }
            },

            setUid: function(item , data) {
                if (data.uid) {
                    item.uid = data.uid;
                }
                if (item.items) {
                    for (var x = 0; x < item.items.length; x++) {
                        this.setUid(item.items[x], data.items[x]);
                    }
                }
                return item;

            }
        };

        page.init();
    });
});