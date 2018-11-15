/**
 * Created by yangjunshi on 2018/4/28.
 */
require([CONTEXT_PATH + '/ezSafe/lib_js/avatarConfig.js'], function (common) {
    require(['lib/domReady!', 'ezviewCommon'], function (dom, common) {
        require([CONTEXT_PATH + "/ezSafe/lib_js/comAllPlayer.js", CONTEXT_PATH+'/ezSafe/lib_js/commonCPlugin/commonCPlugin.js', CONTEXT_PATH+'/ezSafe/lib_js/fileUpload/uploadXmlrpc.js'], function (ComAll, CommomCPlugin, UploadXmlrpc) {
            var page = {
                comAllPlayer: null,
                uploadXmlrpc: new UploadXmlrpc(),
                validationPictures: "",
                fileData: [],
                totalData: [],
                deleteData: [],
                ylData: null,
                tpType: "",
                spType: "",

                commonCPlugin: new CommomCPlugin({pluginDomId: "commonCPlugin"}),

                timePicker: {
                    start: null,
                    end: null,
                    newStart: null,
                    newEnd: null
                },
                szylListView: null,
                infoWindowTimeOut: null,

                listViewData: null,
                dropDownListData: {},
                listViewPager: null,

                params: {
                    keyWord: null,
                    startTime: null,
                    endTime: null,
                },

                indexParams: {
                    id: null,
                    ylbh: null,
                    startTime: null,
                    endTime: null,
                    ylmc: null,
                    yldd: null,
                    user: null,
                    rksj: null,
                    yldw: null,
                    ylnr: null,
                    //ssdw: null
                },

                userInfo: {
                    usercode: null,
                    username: null,
                    userdw: null,
                    userdwbh: null,
                    userdwnbbm: null,
                    userjylb: null,
                    userxzqhmc: null,
                    userxzqhbm: null,
                    userxzqhnbbm: null,
                    userxfjgnbbm: null
                },

                saveOrEdit: true,
                firstLoad: true,
                selectIndex: 0,

                init: function () {
                    var self = this;
                    self.getFileType();
                    var usercode = jQuery.getUrlParams().username;
                    if (usercode == null || usercode == '' || usercode == undefined) {
                        usercode = "admin";
                    }
                    self.userInfo.usercode = usercode;
                    $.ajax({
                        url: CONTEXT_PATH + "/common-api/getUserInfo?random=" + Math.random(),
                        type: "POST",
                        data: {userCode: usercode},
                        dataType: "json",
                        success: function (data) {
                            self.userInfo.username = data.JYXM;
                            self.indexParams.user = data.JYXM;
                            self.userInfo.userdw = data.DWMC;
                            self.userInfo.userjylb = data.JYLB;
                            self.userInfo.userdwnbbm = data.DWNBBM;
                            self.userInfo.userxzqhmc = data.XZMC;
                            self.userInfo.userxzqhbm = data.XZBM;
                            self.userInfo.userxzqhnbbm = data.XZNBBM;
                            self.userInfo.userxfjgnbbm = data.DWNBBM;
                            if (self.userInfo.usercode == "admin") {
                                self.userInfo.userdwnbbm = ""
                            }
                            self.userInfo.userdwbh = data.DWBH;

                            self.getSzylData();
                            self.bindCommonClickEvent();
                            self.bindListClickEvent();
                            self.renderDatePicker();
                            self.addEvent();
                            //self.xfjgInit();

                        }
                    });

                },

                // xfjgInit:function () {
                //   var self=this;
                //     xfdwSelect.change = function (text, value) {
                //         self.indexParams.ssdw = value;
                //         $("#new-ssdw").text(text);
                //     };
                //     xfdwSelect.close = function () {
                //         $(".xfdw-window").fadeOut();
                //     };
                //     xfdwSelect.init(self.userInfo.userdwbh, self.userInfo.userdwnbbm);
                // },


                /**
                 * 渲染时间选择器
                 */
                renderDatePicker: function () {
                    var self = this;
                    var today = new Date();
                    kendo.culture("zh-CN");
                    self.timePicker.start = $("#dateStart").kendoDateTimePicker({
                        format: "yyyy-MM-dd HH:mm:ss",
                        change: startChange
                    }).data("kendoDateTimePicker");

                    self.timePicker.end = $("#dateEnd").kendoDateTimePicker({
                        format: "yyyy-MM-dd HH:mm:ss",
                        change: endChange
                    }).data("kendoDateTimePicker");

                    self.timePicker.newStart = $("#new-dateStart").kendoDateTimePicker({
                        format: "yyyy-MM-dd HH:mm:ss",
                        change: newStartChange
                    }).data("kendoDateTimePicker");

                    self.timePicker.newEnd = $("#new-dateEnd").kendoDateTimePicker({
                        format: "yyyy-MM-dd HH:mm:ss",
                        change: newEndChange
                    }).data("kendoDateTimePicker");

                    self.timePicker.newStart.min(new Date(1970, 1, 1));
                    self.timePicker.newEnd.min(new Date(1970, 1, 1));

                    function startChange() {
                        var startDate = self.timePicker.start.value(),
                            endDate = self.timePicker.end.value();

                        self.params.startTime = kendo.toString(startDate, "yyyy-MM-dd HH:mm:ss");
                        self.params.endTime = kendo.toString(endDate, "yyyy-MM-dd HH:mm:ss");

                        if (startDate) {
                            startDate = new Date(startDate);
                            startDate.setDate(startDate.getDate());
                            self.timePicker.end.min(startDate);
                        } else if (endDate) {
                            self.timePicker.start.max(new Date(endDate));
                        } else {
                            endDate = today;
                            self.timePicker.start.max(endDate);
                            self.timePicker.end.min(endDate);
                        }
                    }

                    function newStartChange() {
                        var startDate = self.timePicker.newStart.value(),
                            endDate = self.timePicker.newEnd.value();

                        self.indexParams.startTime = kendo.toString(startDate, "yyyy-MM-dd HH:mm:ss");
                        self.indexParams.endTime = kendo.toString(endDate, "yyyy-MM-dd HH:mm:ss");

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

                    function endChange() {
                        var endDate = self.timePicker.end.value(),
                            startDate = self.timePicker.start.value();

                        self.params.startTime = kendo.toString(startDate, "yyyy-MM-dd HH:mm:ss");
                        self.params.endTime = kendo.toString(endDate, "yyyy-MM-dd HH:mm:ss");

                        if (endDate) {
                            endDate = new Date(endDate);
                            endDate.setDate(endDate.getDate());
                            self.timePicker.start.max(endDate);
                        } else if (startDate) {
                            self.timePicker.end.min(new Date(startDate));
                        } else {
                            endDate = today;
                            self.timePicker.start.max(endDate);
                            self.timePicker.end.min(endDate);
                        }
                    }

                    function newEndChange() {
                        var endDate = self.timePicker.newEnd.value(),
                            startDate = self.timePicker.newStart.value();

                        self.indexParams.startTime = kendo.toString(startDate, "yyyy-MM-dd HH:mm:ss");
                        self.indexParams.endTime = kendo.toString(endDate, "yyyy-MM-dd HH:mm:ss");

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

                /**
                 * 绑定通用点击事件
                 */
                bindCommonClickEvent: function () {
                    var self = this;
                    var valueOfOpen = true;
                    var $modal = $(".window-modal");
                    var $newWindow = $(".new-window");
                    var $fileAddWindow = $(".fileAdd-window");

                    //分割按钮 隐藏搜索框
                    $("#spliter-button").click(function () {
                        $(".dxal-content-searchParams").slideToggle();
                        if (valueOfOpen) {
                            valueOfOpen = false;
                            $(".dxal-content-lists").animate({
                                height: "90%"
                            });
                            $(this).addClass("spliter-slidedown");
                        } else {
                            valueOfOpen = true;
                            $(".dxal-content-lists").animate({
                                height: "72.93103448275862%"
                            });
                            $(this).removeClass("spliter-slidedown");
                        }
                    });

                    //重置按钮
                    $("#resetButton").click(function () {
                        $("#key-word").val("");
                        self.params.keyWord = null;
                        self.timePicker.start.value("");
                        self.timePicker.start.min(new Date(1970, 1, 1));
                        self.timePicker.end.min(new Date(1970, 1, 1));
                        self.timePicker.start.max(new Date(2999, 1, 1));
                        self.timePicker.end.max(new Date(2999.1,1));
                        self.timePicker.end.value("");
                        self.params.startTime = null;
                        self.params.endTime = null;
                        self.selectIndex=0
                        self.getSzylData();
                    });

                    //搜索按钮
                    $("#searchButton").click(function () {
                        self.params.keyWord = $("#key-word").val();
                        $.ajax({
                            url: CONTEXT_PATH + "/api/yjyl/getAllSzyl",
                            type: "GET",
                            cache: false,
                            data: {
                                kssj: self.params.startTime,
                                jssj: self.params.endTime,
                                gjz: self.params.keyWord,
                                DWNBBM: self.userInfo.userdwnbbm
                            },
                            dataType: "json",
                            success: function (data) {
                                for (x in data) {
                                    if (data[x].RKSJ == undefined || data[x].RKSJ == null) {
                                        data[x].RKSJ = "1970-01-01 00:00:00"
                                    }
                                }
                                self.listViewData = data;
                                self.selectIndex=0;
                                self.renderSzyl(data,1);
                            }
                        });
                    });

                    //导出按钮
                    $("#exportButton").click(function () {
                        if(self.listViewData.length==0)
                        {
                            kendo.ui.ExtMessageDialog.show({message: "暂无数据可以导出！", messageType: "warn"});
                            return;
                        }
                        $.ajax({
                            url: CONTEXT_PATH + "/api/yjyl/exportExcel?random=" + Math.random(),
                            type: "POST",
                            data: {szylData: JSON.stringify(self.listViewData)},
                            success: function (data) {
                                data= CONTEXT_PATH +"/"+data;
                                $("#export-download").attr("href", data);
                                document.getElementById("export-download").click();
                                $.insertLog(jQuery.LOG_MODULE.YJYL, jQuery.LOG_OBJ.SZYL, jQuery.LOG_TYPE.DCCZ, "", "导出：应急演练表格", self.userInfo.usercode);
                            },
                            error: function (data) {
                            }
                        });
                    });

                    //关键字搜索框事件
                    $("#key-word").keypress(function () {
                        if (event.keyCode == 13) {
                            document.getElementById("searchButton").click();
                        }
                    });
                    // $("#key-word").bind("input propertychange", function () {
                    //     if ($("#key-word").val() == "" || $("#key-word").val() == null) {
                    //         $(".clear-input").hide();
                    //     } else {
                    //         $(".clear-input").show();
                    //     }
                    // });
                    // $(".clear-input").click(function () {
                    //     $(this).parent().children("input").val("");
                    //     $(this).hide();
                    //     $(this).parent().children("input")[0].focus();
                    // });

                    //新建/修改窗口的保存按钮
                    $("#saveButton").click(function () {
                        self.indexParams.ylmc = $("#new-ylmc").val();
                        self.indexParams.yldw = $("#new-yldw").val();
                        self.indexParams.yldd = $("#new-yldd").val();
                        self.indexParams.ylnr = $("#new-ylnr").val();
                        self.indexParams.rksj = kendo.toString(new Date(), "yyyy-MM-dd HH:mm:ss");
                        if (self.indexParams.ylmc == null || self.indexParams.ylmc == "") {
                            alert("请输入演练名称");
                        }
                        // else if (self.indexParams.ssdw == null || self.indexParams.ssdw == "") {
                        //     alert("请选择所属消防机构");
                        // }
                        else if (self.saveOrEdit) {
                            $.ajax({
                                url: CONTEXT_PATH + "/api/yjyl/indexNewSzyl",
                                type: "POST",
                                cache: false,
                                dataType: "json",
                                data: self.indexParams,
                                success: function (data) {
                                    if (data) {
                                        $newWindow.hide(function () {
                                            $.insertLog(jQuery.LOG_MODULE.YJYL, jQuery.LOG_OBJ.SZYL, jQuery.LOG_TYPE.XZCZ, "", "新增:名称为" + self.indexParams.ylmc + "的应急演练,", self.userInfo.usercode);
                                            $("#info-window").fadeIn();
                                            $(".addVideo-btn").show();
                                            $(".info-pic").removeClass("fail-pic");
                                            $(".info-pic").addClass("success-pic");
                                            $("#info-text").text("添加成功");
                                            self.infoWindowTimeOut = setTimeout(function () {
                                                document.getElementById("info-close-button").click();
                                            }, 2000);
                                        });
                                    } else {
                                        $newWindow.hide(function () {
                                            $("#info-window").fadeIn();
                                            $(".info-pic").removeClass("success-pic");
                                            $(".info-pic").addClass("fail-pic");
                                            $("#info-text").text("添加失败");
                                            self.infoWindowTimeOut = setTimeout(function () {
                                                document.getElementById("info-close-button").click();
                                            }, 2000);
                                        });
                                    }
                                },
                                error: function () {
                                    $newWindow.hide(function () {
                                        $("#info-window").fadeIn();
                                        $(".info-pic").removeClass("success-pic");
                                        $(".info-pic").addClass("fail-pic");
                                        $("#info-text").text("添加失败");
                                        self.infoWindowTimeOut = setTimeout(function () {
                                            document.getElementById("info-close-button").click();
                                        }, 2000);
                                    });
                                }
                            })
                        } else {
                            $.ajax({
                                url: CONTEXT_PATH + "/api/yjyl/updateSzyl",
                                type: "POST",
                                cache: false,
                                dataType: "json",
                                data: self.indexParams,
                                success: function (data) {
                                    if (data) {
                                        $newWindow.hide(function () {
                                            $.insertLog(jQuery.LOG_MODULE.YJYL, jQuery.LOG_OBJ.SZYL, jQuery.LOG_TYPE.XGCZ, "", "修改:" + "编号为" + self.indexParams.id + "名称为" + self.indexParams.ylmc + "的应急演练,", self.userInfo.usercode);
                                            $("#info-window").fadeIn();
                                            $(".info-pic").removeClass("fail-pic");
                                            $(".info-pic").addClass("success-pic");
                                            $("#info-text").text("更新成功");
                                            self.infoWindowTimeOut = setTimeout(function () {
                                                document.getElementById("info-close-button").click();
                                            }, 2000);
                                        });
                                    } else {
                                        $newWindow.hide(function () {
                                            $("#info-window").fadeIn();
                                            $(".info-pic").removeClass("success-pic");
                                            $(".info-pic").addClass("fail-pic");
                                            $("#info-text").text("更新失败");
                                            self.infoWindowTimeOut = setTimeout(function () {
                                                document.getElementById("info-close-button").click();
                                            }, 2000);
                                        });
                                    }
                                },
                                error: function () {
                                    $newWindow.hide(function () {
                                        $("#info-window").fadeIn();
                                        $(".info-pic").removeClass("success-pic");
                                        $(".info-pic").addClass("fail-pic");
                                        $("#info-text").text("更新失败");
                                        self.infoWindowTimeOut = setTimeout(function () {
                                            document.getElementById("info-close-button").click();
                                        }, 2000);
                                    });
                                }
                            })
                        }
                    });

                    //"普通新增"按钮
                    $("#normalAdd").click(function () {
                        self.saveOrEdit = true;
                        $(".new-window-title").text("新增应急演练");
                        $(".alsp-right").fadeOut();
                        $modal.fadeIn();
                        $newWindow.fadeIn();

                        self.timePicker.newStart.value("");
                        self.timePicker.newStart.min(new Date(1970, 1, 1));
                        self.timePicker.newEnd.min(new Date(1970, 1, 1));
                        self.timePicker.newStart.max(new Date(2999, 1, 1));
                        self.timePicker.newEnd.max(new Date(2999, 1, 1));
                        self.timePicker.newEnd.value("");
                        self.indexParams.startTime = null;
                        self.indexParams.endTime = null;
                        $("#new-yldd").val(null);
                        self.indexParams.yldd = null;
                        $("#new-ylmc").val(null);
                        self.indexParams.ylmc = null;
                        $("#new-ylnr").val(null);
                        self.indexParams.ylnr = null;
                        $("#new-yldw").val(null);
                        self.indexParams.yldw = null;
                        // $("#new-ssdw").text("");
                        // self.indexParams.ssdw = null;
                    });

                    // //消防单位的点击事件
                    // $("#new-ssdw").click(function () {
                    //     xfdwSelect.binddingTreeView();
                    //     $(".xfdw-window").fadeIn(function () {
                    //     });
                    // });


                    //新建窗口的右上角关闭按钮
                    $("#new-window-close-button").click(function () {
                        $modal.fadeOut();
                        $newWindow.fadeOut(function () {
                            $(".alsp-right").fadeIn();
                        });
                    });

                    // //消防机构选择窗口的右上角关闭按钮
                    // $("#xfdw-window-close-button").click(function () {
                    //     $(".xfdw-window").fadeOut();
                    // });


                    //新建窗口的取消按钮
                    $("#cancelButton").click(function () {
                        $modal.fadeOut();
                        $newWindow.fadeOut(function () {
                            $(".alsp-right").fadeIn();
                        });
                    });


                    //删除提示框的右上角关闭按钮
                    $("#delete-window-close-button").click(function () {
                        $(".delete-window").fadeOut(function () {
                            $(".alsp-right").fadeIn();
                        });
                        $modal.fadeOut();
                    });

                    //删除提示框的取消按钮
                    $("#cancelButton-delete").click(function () {
                        $(".delete-window").fadeOut(function () {
                            $(".alsp-right").fadeIn();
                        });
                        $modal.fadeOut();
                    });

                    //成功/失败 提示框右上角的关闭按钮
                    $(".info-close-button").click(function () {
                        clearTimeout(self.infoWindowTimeOut);
                        self.infoWindowTimeOut = null;
                        $modal.fadeOut();
                        $("#info-window").fadeOut(300, function () {
                            $(".alsp-right").fadeIn(function () {
                                self.getSzylData();
                            });

                        });

                    });

                    //删除提示框的确认按钮
                    $("#checkButton-delete").click(function () {
                        $.ajax({
                            url: CONTEXT_PATH + "/api/yjyl/deleteSzyl",
                            type: "POST",
                            cache: false,
                            dataType: "json",
                            data: {id: self.indexParams.id},
                            success: function (data) {
                                if (data) {
                                    $.insertLog(jQuery.LOG_MODULE.YJYL, jQuery.LOG_OBJ.SZYL, jQuery.LOG_TYPE.SCCZ, "", "删除:" + "编号为" + self.indexParams.id + "的应急演练,", self.userInfo.usercode);
                                    $(".delete-window").hide();
                                    $("#info-window").fadeIn();
                                    $(".info-pic").removeClass("fail-pic");
                                    $(".info-pic").addClass("success-pic");
                                    $("#info-text").text("删除成功");
                                    self.infoWindowTimeOut = setTimeout(function () {
                                        document.getElementById("info-close-button").click();
                                    }, 2000);
                                } else {
                                    $(".delete-window").hide();
                                    $("#info-window").fadeIn();
                                    $(".info-pic").removeClass("success-pic");
                                    $(".info-pic").addClass("fail-pic");
                                    $("#info-text").text("删除失败");
                                    self.infoWindowTimeOut = setTimeout(function () {
                                        document.getElementById("info-close-button").click();
                                    }, 2000);
                                }
                            },
                            error: function () {
                                $(".delete-window").hide();
                                $("#info-window").fadeIn();
                                $(".info-pic").removeClass("success-pic");
                                $(".info-pic").addClass("fail-pic");
                                $("#info-text").text("删除失败");
                                self.infoWindowTimeOut = setTimeout(function () {
                                    document.getElementById("info-close-button").click();
                                }, 2000);
                            }
                        });

                    });

                },
                /**
                 * 绑定list中的点击事件
                 */
                bindListClickEvent: function () {
                    var self = this;

                    $("#lists-container").on("click", ".lists-one-single", function (e) {
                        var dataItem = self.dxalListView.dataItem(e.currentTarget);
                        var selectedId = dataItem.ID;
                        $(".list-single-focused").removeClass("list-single-focused");
                        $(this).addClass("list-single-focused");
                        if (selectedId != self.selectedDxal) {
                            self.selectedDxal = dataItem.ID;
                            self.getData(dataItem, self.dxalListView.dataSource._data);
                        }
                    });

                    $("#lists-container").on("click", ".list-single-title", function () {
                        var $thisContent = $(this).parent().children(".list-single-content");
                        $(".list-single-content").each(function () {
                            var eachDisplay = $(this).css("display");
                            if (eachDisplay != "none" && $(this)[0] != $thisContent[0]) {
                                $(this).slideUp();
                                $(this).children("img").attr("src", "../ezSafe/icons/common-treelist-collapse.png");
                            }
                        })
                        var display = $thisContent.css("display");
                        $thisContent.slideToggle();
                        if (display == "none") {
                            $(this).children("img").attr("src", "../ezSafe/icons/common-treelist-expand.png");
                        } else {
                            $(this).children("img").attr("src", "../ezSafe/icons/common-treelist-collapse.png");
                        }
                    });

                    $("#lists-container").on("click", ".button-edit", function (e) {
                        self.saveOrEdit = false;
                        $(".alsp-right").hide();
                        var dataItem = self.dxalListView.dataItem(e.currentTarget);
                        self.selectIndex=self.dxalListView.dataSource.indexOf(dataItem);
                        self.renderEditWindow(dataItem);
                        e.stopPropagation();
                    });

                    $("#lists-container").on("click", ".button-delete", function (e) {
                        e.stopPropagation();
                        $(".alsp-right").hide();
                        var dataItem = self.dxalListView.dataItem(e.currentTarget);
                        var ylbh = dataItem.YLBH;
                        var id = dataItem.ID;
                        self.indexParams.id = id;
                        self.indexParams.ylbh = ylbh;
                        $(".window-modal").fadeIn();
                        $(".delete-window").fadeIn();
                    });
                },

                /**
                 * 用户权限隐藏按钮
                 */
                buttonsOfUser: function () {
                    var self = this;

                    $(".list-single-title .button-edit").each(function (e) {
                        if (self.userInfo.usercode != "admin") {
                            var dataItem = self.dxalListView.dataItems()[e];
                            var rkry = dataItem.RKRY;
                            if (self.userInfo.username != rkry) {
                                $(this).hide();
                            }
                        }
                    });

                    $(".list-single-title .button-delete").each(function (e) {
                        if (self.userInfo.usercode != "admin") {
                            var dataItem = self.dxalListView.dataItems()[e];
                            var rkry = dataItem.RKRY;
                            if (self.userInfo.username != rkry) {
                                $(this).hide();
                            }
                        }
                    });
                },


                /**
                 * 获取应急演练
                 */
                getSzylData: function () {
                    var self = this;
                    $.ajax({
                        url: CONTEXT_PATH + "/api/yjyl/getAllSzyl",
                        type: "GET",
                        cache: false,
                        dataType: "json",
                        data: {
                            DWNBBM: self.userInfo.userdwnbbm
                        },
                        success: function (data) {
                            for (x in data) {
                                if (data[x].RKSJ == undefined || data[x].RKSJ == null) {
                                    data[x].RKSJ = "1970-01-01 00:00:00"
                                }
                            }
                            self.renderSzyl(data,1);
                            self.listViewData = data;
                        }
                    });
                },

                /**
                 * 渲染应急演练listview
                 */
                renderSzyl: function (listviewdata,page) {
                    var self = this;
                    var template = kendo.template($("#dxalTemplate").html());
                    var data = listviewdata;

                    data.sort(function (a, b) {
                        var bstring = b.RKSJ.replace(/-/g, "\/");
                        var bDate = new Date(bstring).getTime();
                        var astring = a.RKSJ.replace(/-/g, "\/");
                        var aDate = new Date(astring).getTime();
                        var result = bDate - aDate;
                        return result;
                    });

                    for (x in data) {
                        if (x % 2 == 1) {
                            data[x].jiou = "oushu"
                        } else {
                            data[x].jiou = "jishu"
                        }
                        if (data[x].KSSJ == undefined || data[x].KSSJ == null) {
                            data[x].KSSJ = "";
                        }
                        if (data[x].JSSJ == undefined || data[x].JSSJ == null) {
                            data[x].JSSJ = '';
                        }
                        if (data[x].RKSJ == undefined || data[x].RKSJ == null) {
                            data[x].RKSJ = "1970-01-01 00:00:00"
                        }
                        if (!data[x].YLDW) {
                            data[x].YLDW = "";
                        }
                        if (!data[x].YLDD) {
                            data[x].YLDD = "";
                        }
                        if (data[x].SZDXFJG == undefined || data[x].SZDXFJG == null) {
                            data[x].SSDW = '';
                        } else {
                            data[x].SSDW = $.isEmptyString(data[x].SZDXFJG.XFJGJC) ?
                                data[x].SZDXFJG.XFJGMC : data[x].SZDXFJG.XFJGJC;
                        }
                    }

                    var datasource = new kendo.data.DataSource({
                        data: data,
                        pageSize: 10
                    });

                    if (self.firstLoad) {
                        self.dxalListView = $("#lists-container").kendoListView({
                            template: template,
                            dataSource: datasource
                        }).data("kendoListView");
                        self.buttonsOfUser();
                        self.listViewPager = $("#lists-pager").kendoPager({
                            dataSource: datasource,
                            buttonCount: 3,
                            change: function () {
                                setTimeout(function () {
                                    $(self.dxalListView.element.children().first()).children(".list-single-title").trigger("click");
                                }, 0);
                                self.buttonsOfUser();
                            }
                        }).data("kendoPager");
                        self.firstLoad = false;
                    } else {
                        var currentPage = page||self.listViewPager.page();
                        datasource.fetch(function () {
                            datasource.page(currentPage);
                        });
                        self.dxalListView.setDataSource(datasource);
                        self.listViewPager.setDataSource(datasource);
                        self.buttonsOfUser();
                        self.selectedDxal = null;
                    }

                    self.listViewData = data;
                    if (data.length == 0) {
                        $(".addVideo-btn").hide();
                        self.viewHide();
                        self.getData("", "");
                        $("#playOCXWindow").css("visibility", "visible").show();
                    }

                    setTimeout(function () {
                        $(self.dxalListView.element.children()[self.selectIndex]).children(".list-single-title").trigger("click");
                    }, 0);
                },

                /**
                 * 渲染编辑窗口
                 * @param data
                 */
                renderEditWindow: function (data) {
                    var self = this;
                    var $modal = $(".window-modal");
                    var $newWindow = $(".new-window");
                    $(".new-window-title").text("修改应急演练");

                    self.indexParams.id = data.ID;
                    self.indexParams.ylbh = data.YLBH;
                    $("#new-ylmc").val(data.YLMC);
                    self.indexParams.ylmc = data.YLMC;
                    $("#new-ssdw").text(data.SSDW);
                    self.indexParams.ssdw = data.SZDXFJG.XFJGBH + ";" + data.SZDXFJG.XFJGMC + ";" + data.SZDXFJG.XFJGNBBM + ";" + data.SZDXFJG.XFJGJC + ";"
                        +  data.SZDXZQH.XZQHBH + ";" + data.SZDXZQH.XZQHMC + ";" + data.SZDXZQH.XZQHNBBM;
                    self.timePicker.newStart.min(new Date(1970, 1, 1));
                    self.timePicker.newEnd.min(new Date(1970, 1, 1));
                    self.timePicker.newStart.max(new Date(2999, 1, 1));
                    self.timePicker.newEnd.max(new Date(2999, 1, 1));
                    self.timePicker.newStart.value(data.KSSJ);
                    self.timePicker.newStart.trigger("change");
                    self.timePicker.newEnd.value(data.JSSJ);
                    self.timePicker.newEnd.trigger("change");
                    self.indexParams.startTime = data.KSSJ;
                    self.indexParams.endTime = data.JSSJ;
                    $("#new-yldd").val(data.YLDD);
                    self.indexParams.yldd = data.YLDD;
                    $("#new-yldw").val(data.YLDW);
                    self.indexParams.yldw = data.YLDW;
                    $("#new-ylnr").val(data.YLNR);
                    self.indexParams.ylnr = data.YLNR;

                    $modal.fadeIn();
                    $newWindow.fadeIn();
                },

                getUuid: function (len, radix) {
                    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), uuid = [], i;
                    radix = radix || chars.length;
                    if (len) {
                        // Compact form
                        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
                    } else {
                        // rfc4122, version 4 form
                        var r;

                        // rfc4122 requires these characters
                        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                        uuid[14] = '4';

                        // Fill in random data.  At i==19 set the high bits of clock sequence as
                        // per rfc4122, sec. 4.1.5
                        for (i = 0; i < 36; i++) {
                            if (!uuid[i]) {
                                r = 0 | Math.random() * 16;
                                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                            }
                        }
                    }
                    return uuid.join('');
                },

                /**获取视频和图片文件类型**/
                getFileType: function () {
                    var context = this;
                    $.ajax({
                        url: CONTEXT_PATH + "/common-api/getFileType",
                        cache: false,
                        type: 'GET',
                        async: false,
                        dataType: "json",
                        success: function (data) {
                            context.tpType = data.tpwjlx.replace(/\./g, "").split(",");
                            context.spType = data.spwjlx.replace(/\./g, "").split(",");
                        }
                    });
                },


                /**初始化视频组件**/
                initVideo: function (callback) {
                    var self = this;
                    if (self.comAllPlayer == null) {
                        self.comAllPlayer = new ComAllPlayer({
                            renderTo: "playOCXWindow",
                            listeners: {
                                playerloaded: function () {
                                    callback();
                                }
                            }
                        });
                    }
                    else {
                        callback();
                    }
                },

                /**获取应急演练文件数据**/
                getData: function (data, totalData) {
                    var self = this;
                    self.ylData = data;
                    self.totalData = totalData;
                    if (self.comAllPlayer != null) {
                        self.comAllPlayer.stopPlay(0);
                    }
                    if (data.YLMC == undefined) {
                        $(".alsp-title span").text("演练资料");
                    }
                    else {
                        $(".alsp-title span").text("演练资料 - " + data.YLMC);
                    }
                    self.bingdingTemplate();
                    if (self.userInfo.usercode != "admin") {
                        if (self.ylData.RKRY != self.userInfo.username) {
                            $(".addVideo-btn").hide();
                            $(".delete-img").hide();
                            $(".file-order").attr("disabled", true);
                        }
                        else {
                            $(".addVideo-btn").show();
                        }
                    }
                    else if(data!="") {
                        $(".addVideo-btn").show();
                    }

                },

                /**选择上传文件**/
                _loadPictureFromLocal: function (filePath) {
                    var context = this;
                    if (this._isEmpty(filePath)) {
                        kendo.ui.ExtMessageDialog.show({message: "请选择文件！", messageType: "error"});
                        return;
                    }
                    var fileStrArray = filePath.split("|"), fileObjects = [];
                    for (var i = 0; i < fileStrArray.length; i++) {
                        var fileName = fileStrArray[i].substring(fileStrArray[i].lastIndexOf("/") + 1);
                        var suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
                        suffix = suffix.toUpperCase();
                        var resourceType;
                        if (context.spType.indexOf(suffix) != -1) {
                            resourceType = 0;
                        } else if (context.tpType.indexOf(suffix) != -1) {
                            resourceType = 1;
                        } else {
                            resourceType = 2;
                        }
                        var fileObject = {
                            "ResourceName": fileName, // 文件名称带后缀
                            "ResourceType": resourceType, // 资源类型：0视频 1 图片 2文件
                            "ResourceMode": "0", // 0: 本地上传，1： url上传， 2: 字节上传
                            "ResourcePath": fileStrArray[i], // 资源绝对路径
                            "ResourceExt": suffix, // 资源后缀，全大写
                            "UserCustom": "XF_DXAL"
                        };
                        fileObjects.push(fileObject);
                    }
                    this._addPicture(fileObjects);
                },

                /**新增文件**/
                _addPicture: function (fileObjects) {
                    var context = this;
                    this.uploadXmlrpc.batchUploadResWithProgress(fileObjects, {
                        readyUpload: function (result) {
                            var resourceID = result["ResourceID"];
                            if (!$("#" + resourceID)[0] && context.deleteData.indexOf(result["ResourceID"]) == -1) {
                                var filename = result["ResourceName"].split("\\");
                                result["XSSX"] = context.fileData.data().length + 1;
                                result["WJMC"] = filename[filename.length - 1];
                                result["WJLX"] = (result["ResourceType"] + 1).toString();
                                context.fileData.add(result);
                                var scrollHeight = $('#video-list').prop("scrollHeight");
                                $('#video-list').animate({scrollTop: scrollHeight}, 600);
                            }
                        },
                        progress: function (result) {
                            $("#" + result["ResourceID"] + " .bar").css('width', result["UploadProgress"] + '%').text(result["UploadProgress"] + '%');
                        },
                        success: function (result) {
                            var resourceID = result["ResourceID"];
                            var listView = $("#video-list").data("kendoListView");
                            var dataItem = listView.dataItem($("#" + resourceID));
                            if (dataItem == null) {
                                return;
                            }
                            dataItem.SLTP = result["ThumbnailUrlPath"];
                            dataItem.WLLJ = result["FileUrlPath"];
                            dataItem.CCLJ = result["FileNfsPath"];
                            if (result["ResourceType"] == 2) {
                                result["ThumbnailUrlPath"] = "../ezSafe/icons/xtwy-allr-file-n.png";
                            }
                            $("#" + resourceID + " img").attr("src", result['ThumbnailUrlPath']);
                            $("#" + result["ResourceID"] + " .bar").hide();
                            context.updateXczhyData();
                        },
                        error: function (result) {
                            alert("上传失败");
                            context.fileData.remove(context.fileData.at(context.fileData.data().length - 1));
                        }
                    });
                },

                /**删除文件**/
                _deletePicture: function (index) {
                    var context = this;
                    $.when(kendo.ui.ExtConfirmDialog.show({
                        title: "提示!",
                        message: "是否删除此文件！",
                        icon: 'question'
                    })).done(function (result) {
                        if (result.button == 'OK') {
                            var fileIndex = $(".file-select").index();
                            if (fileIndex == index) {
                                context.viewHide();
                                $("#playOCXWindow").css("visibility", "visible").show();
                            }
                            else {
                                $("#playOCXWindow").css("visibility", "visible");
                                if (fileIndex > index) {
                                    fileIndex --;
                                }
                            }
                            if (context.fileData.at(index)["ResourceID"] != undefined) {
                                context.deleteData.push(context.fileData.at(index)["ResourceID"]);
                            }
                            context.fileData.remove(context.fileData.at(index));
                            $(".file-table-row").eq(fileIndex).trigger("click");
                            context.updateXczhyData();
                        }
                        else {
                            $("#playOCXWindow").css("visibility", "visible");
                        }
                    });

                },

                /**更改顺序**/
                _changeOrder: function (index, order) {
                    var context = this,
                        fileData = context.fileData.data(),
                        data = fileData[index];
                    if (order < 1) {
                        order = 1;
                    }
                    fileData.splice(index, 1);
                    fileData.splice(order - 1, 0, data);
                    context.updateXczhyData();
                },

                /**更新文件数据**/
                updateXczhyData: function () {
                    var context = this,
                        data = context.fileData.data(),
                        updateData = [];
                    for (var i = 0; i < data.length; i++) {
                        var zqwj = {
                            WJLX: data[i].WJLX,
                            WJMC: data[i].WJMC,
                            WLLJ: data[i].WLLJ,
                            CCLJ: data[i].CCLJ,
                            XSSX: data[i].XSSX,
                            SLTP: data[i].SLTP
                        };
                        updateData.push(zqwj);
                    }
                    $.ajax({
                        url: CONTEXT_PATH + "/api/yjyl/updateFile",
                        cache: false,
                        async: false,
                        type: 'POST',
                        data: {YLWJ: JSON.stringify(updateData), YLBH: context.ylData.YLBH},
                        success: function (res) {
                            if (res) {
                                $.insertLog(jQuery.LOG_MODULE.YJYL, jQuery.LOG_OBJ.SZYL, jQuery.LOG_TYPE.XGCZ, "", "修改:编号为" + context.ylData.YLBH + "的应急演练文件资料", context.userInfo.usercode);
                            }
                            else {
                                alert("文件资料操作失败！");
                            }

                        },
                        error: function () {
                            alert("文件资料操作失败！");
                        }
                    });

                },

                _isEmpty: function (obj) {
                    if (typeof obj == "undefined" || obj == null || obj === "") {
                        return true;
                    }
                    return false;
                },

                /**绑定模板**/
                bingdingTemplate: function () {
                    var context = this,
                        data = [],
                        template = kendo.template($("#FileTemplate").html());
                    if (context.ylData != null && context.ylData.YLWJ != null) {
                        data = context.ylData.YLWJ;
                    }
                    context.fileData = new kendo.data.DataSource({
                        data: data,
                        change: function () {
                            var data = this.data();
                            for (var i = 0; i < data.length; i++) {
                                data[i].XSSX = i + 1;
                            }
                        }
                    });
                    $("#video-list").kendoListView({
                        dataSource: context.fileData,
                        template: template
                    });

                    if (data.length > 0) {
                        $(".file-table-row:eq(0)").click();
                    }
                    else {
                        context.viewHide();
                        $("#playOCXWindow").css("visibility", "visible").show();
                    }
                },

                /**绑定实战视频事件**/
                addEvent: function () {
                    var context = this;
                    $(".addVideo-btn").on("click", function () {
                        if (context.ylData == null) {
                            alert("请选择一个演练资料");
                            return;
                        }
                        if (context.userInfo.usercode != "admin" && context.ylData.RKRY != context.userInfo.username) {
                            alert("没有权限添加！");
                            return;
                        }
                        var picPath = context.commonCPlugin.selectOpenFile(context.validationPictures, true);
                        if (context._isEmpty(picPath)) {
                            return;
                        }
                        context._loadPictureFromLocal(picPath);
                    });
                    $("#video-list").on("click", ".file-table-row", function (e) {
                        if ($(e.target).attr("class") == "file-order") {
                            return;
                        }
                        var listView = $("#video-list").data("kendoListView");
                        var dom = $(this);
                        dom.addClass("file-select").siblings().removeClass("file-select");
                        var dataItem = listView.dataItem(dom);
                        if (dataItem.CCLJ == "") {
                            return;
                        }
                        if (dataItem.WJLX == 1) {
                            $(".trp-window-img").hide();
                            $("#file-play").hide();
                            $(".video-play").show();
                            context.initVideo(function () {
                                context.comAllPlayer.startPlayLocalVideo(0, "", dataItem.CCLJ, dataItem.WLLJ);
                            });
                        }
                        else if (dataItem.WJLX == 2) {
                            if (context.comAllPlayer != null) {
                                context.comAllPlayer.stopPlay(0);
                            }
                            $("#file-play").hide();
                            $(".video-play").hide();
                            $(".trp-window-img").show().setImg(dataItem.WLLJ);
                        }
                        else {
                            if (context.comAllPlayer != null) {
                                context.comAllPlayer.stopPlay(0);
                            }
                            $(".video-play").hide();
                            $(".trp-window-img").hide();
                            $("#file-play").show();
                            $(".file-title").text(dataItem.WJMC);
                            $(".file-tip").val(dataItem);
                        }
                    });

                    $("#video-list").on("dblclick", ".file-table-row", function (e) {
                        if ($(e.target).attr("class") == "file-order") {
                            return;
                        }
                        var listView = $("#video-list").data("kendoListView");
                        var dom = $(this);
                        var dataItem = listView.dataItem(dom);
                        if (dataItem.CCLJ == "") {
                            return;
                        }
                        if (dataItem.WJLX == 3) {
                            var fileType = dataItem.WLLJ.split(".");
                            context.commonCPlugin.openUrlFile(dataItem.WLLJ, fileType[fileType.length - 1]);
                        }
                    });

                    $(".file-tip").click(function () {
                        var file = $(this).val(),
                            fileType = file.WLLJ.split(".");
                        context.commonCPlugin.openUrlFile(file.WLLJ, fileType[fileType.length - 1]);
                    });

                    $("#video-list").on("click", ".delete-img", function (e) {
                        e.stopPropagation();
                        if (context.userInfo.usercode != "admin") {
                            if (context.ylData.RKRY != context.userInfo.username) {
                                kendo.ui.ExtMessageDialog.show({message: "没有权限删除！", messageType: "error"});
                                return;
                            }
                        }
                        $("#playOCXWindow").css("visibility", "hidden");
                        var index = $(e.target).parent().index();
                        context._deletePicture(index);
                    });

                    $("#video-list").on("change", ".file-order", function (e) {
                        if (context.userInfo.usercode != "admin") {
                            if (context.ylData.RKRY != context.userInfo.username) {
                                return;
                            }
                        }
                        e.stopPropagation();
                        var index = $(e.target).parent().index();
                        var order = $(e.target).val();
                        context._changeOrder(index, order);
                    });

                    $("#video-list").on("keypress", ".file-order", function (e) {
                        if (context.userInfo.usercode != "admin") {
                            if (context.ylData.RKRY != context.userInfo.username) {
                                return;
                            }
                        }
                        if (e.keyCode == "13") {
                            $(this).blur();
                        }
                    });

                },

                viewHide: function () {
                    var context = this;
                    if (context.comAllPlayer != null) {
                        context.comAllPlayer.stopPlay(0);
                    }
                    $("#playOCXWindow").css("visibility", "hidden");
                    $("#trp-window-trp").hide();
                    $("#file-play").hide();
                }

            };

            page.init();
        });
    });
});