/**
 * Created by liwei on 2015/2/27.
 * ezview base module
 */

define(['jquery', 'jszip', 'kendo', 'culture', 'messages', 'jqueryJson', 'bowser', 'corner', 'kendoUIExt', 'picUtil', 'videoExt', 'jqueryExt'], function (jquery, jszip, kendo, culture, messages, jqueryJson, bowser, corner, kendoUIExt, picUtil, videoExt, jqueryExt) {
    
    if (bowser.msie && bowser.version < 9) {
        require(['respond'], function () {
            //console.log("loaded the specify js for IE....");
        });
    }

    kendo.data.binders.imgSrc = kendo.data.Binder.extend(
        {
            refresh: function () {
                var value = this.bindings["imgSrc"].get();
                if (value) {
                    $(this.element).attr("src", value);
                }
            }
        }
    );

    jQuery.extend({
        getUrlParams: function () {
            var url = location.search;
            var params = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return params;
        },
        deepCloneObject: function(oldObj) {
            return oldObj == null ? null : JSON.parse(JSON.stringify(oldObj));
        },
        getUuid: function(len, radix) {
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
            return uuid.join('').replace(/-/g , "").toLowerCase();
        },


        //插入日志
        insertLog: function (czmk, czdx, czlx, czcs, rzms, username) {
            $.ajax({
                url: CONTEXT_PATH + "/api/log/insert",
                cache: false,
                type: "POST",
                data: {
                    rzms: rzms || "",
                    czcs: czcs || "",
                    czlx: czlx || "",
                    czmk: czmk || "",
                    czdx: czdx || "",
                    username: username || "no User Name"
                },
                success: function (data) {
                    var temp = '';
                },
                error: function (data) {
                    var temp = '';
                }
            });
        },

        /**
         * 判断字符串是否为空
         * @param s
         * @returns {boolean}
         */
        isEmptyString: function(s) {
            return s == null || s == ""
        },

        //日志操作模块
        LOG_MODULE: {
            ZBZS: "10000",      //战备值守
            ZBDT: "10001",      //值班动态
            ZBXX: "10002",      //值班地图
            JRJQ: "10003",      //今日警情
            SXGL: "10004",      //事项录入

            YJZH: "20000",      //应急指挥
            ZQXX: "20001",      //灾情信息
            CZDX: "20002",      //处置对象
            CZLL: "20003",      //参战力量
            NGLL: "20004",      //内攻力量
            LDXX: "20005",      //联动信息
            SPDD: "20006",      //视频调度
            SPHY: "20007",      //视频会议

            YJZB: "30000",      //应急准备
            LLZB: "30001",      //力量总表
            SDBD: "30002",      //属地编队
            ZYBD: "30003",      //增援编队
            ZYDW: "30004",      //专业队伍
            YJLD: "30005",      //应急联动
            YJBZ: "30006",      //应急保障
            LQBZ: "30007",      //联勤保障
            ZJK: "30008",       //专家库
            YJWZ: "30009",      //应急物资
            YJYA: "30010",      //应急预案
            YJYL: "30011",      //应急演练

            ZDAB: "40000",      //重大安保
            ABBS: "40001",      //安保部署
            MRFK: "40002",      //每日防控
            MZFK: "40003",      //每周防控
            ABGL: "40004",      //安保录入

            FZJC: "50000",      //辅助决策
            ZDDX: "50001",      //重点对象
            XFJD: "50002",      //消防监督
            ZQFX: "50003",      //灾情分析
            ZQCX: "50004",      //灾情查询
            DXAL: "50005",      //典型案例

            DTCC: "60000",      //地图操作
            YJSS: "60001",      //一键搜索
            CJDT: "60002",      //超级地图
            DTSQ: "60003",      //地图书签
            DWBZ: "60004",      //点位标注
            ZQYJ: "60005",      //灾情预警

            XTYW: "70000",      //系统运维
            SJJC: "70001",      //数据监测
            SJZL: "70002",      //数据质量
            JCPZ: "70003",      //检测配置
            ZQGZ: "70004",      //灾情规则
            DWTJ: "70005",      //定位统计
            XFRY: "70006",      //消防人员
            ALLR: "70007",      //案例录入
            SZXHS: "70008",     //市政消火栓
            XFSC: "70009",      //消防水池
            XFSH: "70010",      //消防水鹤
            QSMT: "70011",      //取水码头

            XTGL: "80000",      //系统管理
            YHGL: "80001",      //用户管理
            JSGL: "80002",      //角色管理
            XTPZ: "80003",      //系统配置
            GNPZ: "80004",      //功能配置
            CZRZ: "80005",      //操作日志
            ZZJG: "80006",      //组织机构
            XZQY: "80007",      //行政区域

            QT: "99000"        //其它
        },

        //日志操作对象
        LOG_OBJ: {
            YHXX: "10000",      //用户信息
            JSXX: "10001",      //角色信息
            XTGNZ: "10002",     //系统功能组
            XTGNX: "10003",     //系统功能项
            XTPZX: "10004",     //系统配置项
            ZZJG: "10005",      //组织机构
            XZQY: "10006",      //行政区域
            FHDW: "20000",      //防火单位
            MHDW: "20001",      //灭火单位
            JZXX: "20002",      //建筑信息
            YQGX: "20003",      //油气管线
            GLSD: "20004",      //公路隧道
            SHLXX: "20005",     //石化类信息
            DZDXX: "20006",     //地震带信息
            WXQXX: "20007",     //危险区信息
            HDZXX: "20008",     //核电站信息
            SKSDZ: "20009",     //水电站、水库
            YJLDDW: "30000",    //应急联动单位
            LQBZDW: "30001",    //联勤保障单位
            MHJYZJ: "30002",    //灭火救援专家
            ZFTJXX: "40000",    //执法统计信息
            ABHDXX: "50000",    //安保活动信息
            ABCSXX: "50001",    //安保场所信息
            ABBSXX: "50002",    //安保部署信息
            ABLLXX: "50003",    //安保力量信息
            ABDTXX: "50004",    //安保动态信息
            ABLDXX: "50005",    //安保联动信息
            SZYL: "50006",      //实战演练
            XFDW: "60000",      //消防单位
            YBDW: "60001",      //应保单位
            XFDZ: "60002",      //消防队站
            ZYDW: "60003",      //专业队伍
            SDBD: "60004",      //属地编队
            ZYBD: "60005",      //增援编队
            RYXX: "60006",      //人员信息
            CLXX: "60007",      //车辆信息
            ZBXX: "60008",      //装备信息
            TZZB: "60009",      //特种装备
            MHYJ: "60010",      //灭火药剂
            WZCK: "60011",      //物资仓库
            CBWZ: "60012",      //储备物资
            SZXHS: "60013",     //市政消火栓
            XFSC: "60014",      //消防水池
            XFSH: "60015",      //消防水鹤
            QSMT: "60016",      //取水码头
            TRSY: "60017",      //天然水源
            WHP: "60018",       //危化品
            ZQXX: "70000",      //灾情信息
            ZQZL: "70001",      //灾情指令
            ZQWX: "70002",      //灾情微信
            XCXX: "70003",      //现场信息
            DPXX: "70004",      //调派信息
            QQZY: "70005",      //请求增援
            WDXX: "70006",      //文电信息
            HCWS: "70007",      //火场文书
            HCDT: "70008",      //火场动态
            DXAL: "70009",      //典型案例
            ZBDT: "80000",      //值班动态
            ZBKB: "80001",      //值班快报
            ZQLL: "80002",      //执勤力量
            ZYSX: "80003",      //重要事项
            SXYQ: "80004",      //涉消舆情
            ZQYJ: "80005",      //灾情预警
            TQYB: "80006",      //天气预报
            JYGZ: "90000",      //校验规则
            JCDX: "90001",      //检测对象
            ZQGZ: "90002",      //灾情规则
            SJZL: "11001",      //数据质量
            BZTJ: "11002",      //标注统计
            SPDW: "11003",      //视频点位
            CZRZ: "11004"       //操作日志
        },

        //日志操作类型
        LOG_TYPE: {
            YHCZ: "10000",      //用户操作
            DLCZ: "10001",      //登录
            ZXCZ: "10002",      //注销
            SQCZ: "10003",      //授权
            CGCZ: "20000",      //常规操作
            XZCZ: "20001",      //新增
            SCCZ: "20002",      //删除
            XGCZ: "20003",      //修改
            CXCZ: "20004",      //查询
            CKCZ: "20005",      //查看
            SHCZ: "20006",      //审核
            SCXX: "20007",      //上传
            XZXX: "20008",      //下载
            DCCZ: "20009",      //导出
            SPCZ: "30000",      //视频操作
            SSDY: "30001",      //实时调阅
            LSDY: "30002",      //历史调阅
            SPJT: "30003",      //视频截图
            SPXZ: "30004",      //视频下载
            PTZ: "30005"        //PTZ控制
        },
        judgeZqja: function(id , callback) {
            $.ajax({
                url: CONTEXT_PATH + "/common-api/judgeZqja?random=" + Math.random(),
                type: "GET",
                data:{id : id},
                success: callback
            })
        },
        getPzxx: function(pzx , callback) {
            $.ajax({
                url: CONTEXT_PATH + "/common-api/getPzxx?random=" + Math.random(),
                type: "GET",
                data: {pzx: pzx},
                success: callback
            })
        }
    });

    function waterMark() {
        var username = jQuery.getUrlParams().username;
        var watermark = jQuery.getUrlParams().watermark;
        if (!username) {
            username = "admin";
        }
        if (watermark == "0") {
            return;
        }
        $.ajax({
            url: CONTEXT_PATH + "/common-api/getUserInfo",
            type: "POST",
            dataType: "json",
            data: {userCode: username},
            success: function (data) {
                for (var key in data) {
                    USER_INFO[key] = data[key];
                }
                if (USER_INFO.onSucccess) USER_INFO.onSucccess();

                if (data.watermark == "true" || watermark == "1") {
                    $("body").prepend("<div class='water-marker' disabled='disabled'></div>");
                    // $("body").prepend("<div class='upon-water-marker'></div>");
                    // $(".upon-water-marker").css("background-image", "url('avatar/ezFireExt/zdab/images/EzFireExt-background.png')");
                    // $("body,html").css({"background-image":"none","background":"none"});
                    for (var i = 0; i < 80; i++) {
                        $(".water-marker").append(' <span class="waterIn-span" >' + data.JYXM + '<br>'+data.DWMC+'</span>')
                    }
                }
                $(".water-marker").on("click", function (e) {
                    e.preventDefault();
                })
            }
        });

    };
    waterMark();
    //为ie的页面添加tip
    (function() {
        if (window.navigator.userAgent.indexOf("Chrome") < 0) {
            var showTipsTo = null;
            $(document.body)
                .on("mouseenter" , "[title]" , function() {
                    var tip = $(this).attr("title");
                    if (!tip) return;
                    $(this).attr("tip" , tip);
                    $(this).removeAttr("title");
                    if ($("#x-tip").length == 0 ) {
                        var tipDom = "<div id='x-tip' style='float:left;position:absolute;z-index:99999;display:none;opacity:0;'>" +
                            "<iframe src='about:blank' style='position:absolute;z-index:-1;background:none;left:0;top:0;width:100%;height: 100%;' frameborder='0' ></iframe>" +
                            "<div style='padding: 2px 4px;background-color: #fff;border:1px solid grey;border-radius:3px;color:#3d3d3d;max-width:300px;text-align:center;'></div>" +
                            "</div>";
                        $(document.body).append(tipDom);
                    }

                    var element = this;
                    showTipsTo = setTimeout(function() {
                        var $tip = $("#x-tip");
                        $tip.children("div").text(tip);
                        var l = $(element).offset().left + ($(element).outerWidth() - $tip.outerWidth()) / 2 ;
                        var t = $(element).offset().top + $(element).outerHeight() + 3;
                        if (t + $tip.outerHeight() > $(document.body).outerHeight()) {
                            t -= ($(element).outerHeight() + $tip.outerHeight() + 6);
                        }
                        if (l + $tip.outerWidth() > $(document.body).outerWidth()) {
                            l -= (l + $tip.outerWidth() - $(document.body).outerWidth());
                        }
                        l = l < 0 ? 0 : l;
                        $tip.stop(true).css({left: l,top: t,opacity: 0}).show().animate({opacity: 1} , 300);
                    } , 700);
                })
                .on("mouseleave" , "[tip]" , function() {
                    clearTimeout(showTipsTo);
                    if ($(this).attr("tip") != '') {
                        $(this).attr("title", $(this).attr("tip"));
                        $(this).removeAttr("tip");
                    }
                    if ($("#x-tip").css("display") != "none") {
                        $("#x-tip").animate({opacity : 0} , 300 , function() {
                            $(this).hide();
                        });
                    }
                })
        }
    })();

    Date.prototype.Format = function (fmt) { //author: jmf
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    //for  Backward  jquery < 1.9
    if (!$.browser && $.fn.jquery != "1.3.2") {
        $.extend({
            browser: {}
        });
        $.browser.init = function () {
            var a = {};
            try {
                navigator.vendor ?
                    /Chrome/.test(navigator.userAgent) ?
                        (a.browser = "Chrome", a.version = parseFloat(navigator.userAgent.split("Chrome/")[1].split("Safari")[0])) : /Safari/.test(navigator.userAgent) ? (a.browser = "Safari", a.version = parseFloat(navigator.userAgent.split("Version/")[1].split("Safari")[0])) : /Opera/.test(navigator.userAgent) && (a.Opera = "Safari", a.version = parseFloat(navigator.userAgent.split("Version/")[1])) : /Firefox/.test(navigator.userAgent) ? (a.browser = "mozilla",
                            a.version = parseFloat(navigator.userAgent.split("Firefox/")[1])) : (a.browser = "MSIE", /MSIE/.test(navigator.userAgent) ? a.version = parseFloat(navigator.userAgent.split("MSIE")[1]) : a.version = "edge")
            } catch (e) {
                a = e;
            }
            $.browser[a.browser.toLowerCase()] = a.browser.toLowerCase();
            $.browser.browser = a.browser;
            $.browser.version = a.version;
            $.browser.chrome = $.browser.browser.toLowerCase() == 'chrome';
            $.browser.safari = $.browser.browser.toLowerCase() == 'safari';
            $.browser.opera = $.browser.browser.toLowerCase() == 'opera';
            $.browser.msie = $.browser.browser.toLowerCase() == 'msie';
            $.browser.mozilla = $.browser.browser.toLowerCase() == 'mozilla';
        };
        $.browser.init();
    }

    return {
        'jquery': jquery,
        'jszip': jszip,
        'kendo': kendo,
        'culture': culture,
        'messages': messages,
        "jqueryJson": jqueryJson,
        'bowser': bowser,
        'corner': corner,
        'kendoUIExt': kendoUIExt
    }
});

