/**
 * Filename: ComAllPlayer.js Company: 苏州科远软件上海研发中心
 *
 * @author: yyt
 * @version: AVATAR0.0.1
 */

/**
 * ComAllPlayer插件封装代理类 /
 */
var ComAllPlayer = function (config) {

    if (typeof config != "object") {
        config = {};
    }
    if (this.isEmpty(config.renderTo)) {
        config.renderTo = document.body;
    }

    this.width = config.width;
    this.height = config.height;
    this.obj = null;
    this.layout = null;
    this.cutFiles = [];
    this.isPlayerLoaded = false;

    /**
     * 回调所有事件执行方法 /
     */
    this.listeners = {

        /**
         * 播放器加载完成回调事件
         * */
        playerloaded: null,

        /**
         * 播放结果 /
         */
        playresult: null,

        /**
         * 添加时间计时完毕后的notify，参数object类型，属性包括：{ "index" : 【窗口索引(number类型)】 } /
         */
        timefinished: null,

        /**
         * (本地)录像播放完成上报 /
         */
        finishplay: null,

        /**
         * 窗口右键响应，参数object类型，属性包括：{ "index" : 【窗口索引(number类型)】 "point"
		 * 【点击右键时，鼠标在窗口中的坐标】例如："%d,%d"} /
         */
        menuctrl: null,

        /**
         * 全屏提示框url链接点击事件，参数object类型，属性包括：{ "url" :【url链接(string类型)】 } /
         */
        fullscreenproinfonotify: null,

        /**
         * 摘要或者一些不在整合ocx中处理的任务事件上报 /
         */
        otherocxtasknotify: null,

        /**
         * 画图画框响应 /
         */
        graphresultnotify: null,

        /**
         * 视频播放信息获取,播放成功后返回视频信息（宽高和播放窗口id） /
         */
        videoinfo: null,

        /**
         * 播放成功响应 /
         */
        playresultnotify: null,

        /**
         * 视频抓拍回调事件 /
         */
        snappicinfo: null,

        /**
         * 视频窗口置顶回调事件 /
         */
        camcenter: null,

        /**
         * 视频剪切回调事件 /
         */
        videocut: null,

        /**
         * 开始视频剪切回调事件 /
         */
        cuttimeinfo: null,

        /**
         * 视频剪切进度回调事件 /
         */
        cutprogressnotify: null
    };
    if (typeof config.listeners == "object") {
        for (var key in config.listeners) {
            if (key in this.listeners) {
                this.listeners[key] = config.listeners[key];
            }
        }
    }
    this._init(config);
    this._checkPlayerLoaded(config);
};

ComAllPlayer.prototype = {

    /**
     * 初始化插件对象 /
     */
    _init: function (config) {
        if (typeof config.renderTo != "object") {
            this.renderTo = document.getElementById(config.renderTo);
        }
        else {
            this.renderTo = config.renderTo;
        }
        if (typeof config.obj == "object") {
            this.obj = config.obj;
        }
        else {
            this.obj = this._createObject();
        }
        this._createEvent();
    },

    /**
     * 注册插件所有事件（event），实现回调 /
     */
    _createEvent: function () {

        var self = this;
        /**
         * 当页面关闭时释放插件 /
         */
        if (window.attachEvent) {
            window.attachEvent("onunload", function () {
                self.releaseOcx();
            });

            this.obj.attachEvent("OcxNotifyEvent", function () {
                self._ocxNotifyEvent.apply(self, arguments);
            });
        } else {
            window.addEventListener("unload", function () {
                self.releaseOcx();
            });

            this.obj.addEventListener("OcxNotifyEvent", function () {
                self._ocxNotifyEvent.apply(self, arguments);
            });
        }
    },

    /**
     * 消息通知
     *
     * @param strXml【xml格式字符串(string类型)】
     * @return /
     */
    _ocxNotifyEvent: function (strXml) {

        this.printf(strXml);

        var jsonResult = this.xmlToJson(strXml);
        if (typeof jsonResult == "object" && "ocxxml" in jsonResult && "notify" in jsonResult.ocxxml) {
            var result = jsonResult.ocxxml.notify;
            if (result.id == "otherocxtasknotify") {
                return;
            }
            if (!this.isEmpty(result) && typeof result == "object" && "id" in result && result.id in this.listeners) {
                if (result.id == "cuttimeinfo") {
                    for (var i = 0; i < this.cutFiles.length; i++) {
                        if (this.isObject(this.cutFiles[i]) && this.cutFiles[i].fileID == result.port) {
                            alert("剪切视频任务唯一标识重复！");
                            return;
                        }
                    }
                    this.cutFiles.push({
                        fileID: result.port,
                        fileName: result.filename
                    });
                }
                else if (result.id == "cutprogressnotify") {
                    if (result.context == "0") {
                        for (var i = 0; i < this.cutFiles.length; i++) {
                            if (this.isObject(this.cutFiles[i]) && this.cutFiles[i].fileID == result.port) {
                                var args = {};
                                args.UserData = result.usrdata;
                                args.CameraNo = result.camerano;
                                args.FileName = this.cutFiles[i].fileName;
                                args.Success = true;
                                if (typeof this.listeners["videocut"] == "function") {
                                    this.listeners["videocut"](args);
                                }
                                return;
                            }
                        }
                    }
                    else if (result.context == "-1") {
                        var args = {
                            UserData: result.usrdata,
                            CameraNo: result.camerano,
                            FileName: "",
                            Success: false
                        };
                        if (typeof this.listeners["videocut"] == "function") {
                            this.listeners["videocut"](args);
                        }
                    }
                }
                else if (typeof this.listeners[result.id] == "function") {
                    this.listeners[result.id](result);
                }
                else if (!this.isEmpty(this.listeners[result.id]) && typeof this.listeners[result.id] == "object" && "fn" in this.listeners[result.id] && typeof this.listeners[result.id].fn == "function") {
                    this.listeners[result.id].fn.apply(this.listeners[result.id].scope, [result]);
                }
            }
        }
        else {
            throw new Error("The event returned by ocx is not right, caused in Function _ocxNotifyEvent file ComAllPlayer.js");
        }
    },

    /**
     * 创建object 对象
     *
     * @return 【object类型】 /
     */
    _createObject: function () {
        try {
            var object = document.createElement("object");
            object.style.width = this.width || "100%";
            object.style.height = this.height || "100%";
            object.classid = "clsid:10F149E2-6C7F-4595-BD32-41BD778853DF";
            this.renderTo.appendChild(object);

            return object;
        }
        catch (e) {
            alert("未正确安装播放插件！");
            return null;
        }
    },

    /**
     * 判断播放器是否加载完成
     * */
    _checkPlayerLoaded: function (config) {
        var that = this;
        var count = 0;
        var timer = setInterval(function () {
            var check = that.checkInit();
            if (check && check.status == 1) {
                that.isPlayerLoaded = true;
                if (typeof that.listeners["playerloaded"] == "function") {
                    that.listeners["playerloaded"]({isPlayerLoaded: true});
                }
                clearInterval(timer);
            }
            if (count == 20) {
                that.isPlayerLoaded = false;
                if (typeof that.listeners["playerloaded"] == "function") {
                    that.listeners["playerloaded"]({isPlayerLoaded: false});
                }
                clearInterval(timer);
            }
            count++;
        }, 500);
    },

    /**
     * 控件初始化成功与否(主动查询接口)
     *
     * @return 【object类型】见_getResult方法返回值
     */
    checkInit: function () {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "     <id>checkinit</id>"
            + "     <ocxtype>2</ocxtype>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 播放实时视频的函数 /
     */
    startPlayRealVideo: function (index, cameraNo, cameraName, buttonStyle) {

        if (this.isEmpty(buttonStyle)) {
            buttonStyle = "haiou_common";
        }
        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>startplay</id>"
            + "      <style>tvplay</style>"
            + "      <substyle>" + buttonStyle + "</substyle>"
            + "      <index>" + index + "</index>"
            + "      <camno>" + cameraNo + "</camno>"
            + "      <title>" + cameraName + "</title>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 播放本地视频的函数 /
     */
    startPlayLocalVideo: function (index, title, filePath, fileUrl, correctionTime, buttonStyle) {
        var self = this;
        if (self.isEmpty(buttonStyle)) {
            buttonStyle = "zfk";
        }
        if (!self.isEmpty(correctionTime)) {
            correctionTime = self.unixTime(correctionTime);
        }
        if (self.playerOcxMode == undefined) {
            try {
                $.ajax({
                    url: "/ezFireExt/common-api/getPlayConfig",
                    async: false,
                    type: 'GET',
                    dataType: "json",
                    success: function (data) {
                        self.playerOcxMode = self.isEmpty(data.playerOcxMode) ? "smb" : data.playerOcxMode;
                    }
                });
            }
            catch (err) {
                self.playerOcxMode = "smb";
            }
        }
        var mode = (!self.isEmpty(filePath) && self.isEmpty(fileUrl)) ? "smb"
                 : (self.isEmpty(filePath) && !self.isEmpty(fileUrl)) ? "http" : self.playerOcxMode;
        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>startplay</id>"
            + "      <style>localrecord</style>"
            + "      <substyle>" + buttonStyle + "</substyle>"
            + "      <index>" + index + "</index>"
            + "      <title>" + title + "</title>"
            + "      <mode>" + mode + "</mode>"
            + "      <path><![CDATA[" + filePath + "]]></path>"
            + "      <url><![CDATA[" + fileUrl + "]]></url>"
            + "      <correctiontime>" + correctionTime + "</correctiontime>"
            + "      <hidetitle>true</hidetitle>"
            + "  </command>"
            + "</ocxxml>";

        return self._getResult(strXml);
    },

    /**
     * 播放历史视频的函数
     */
    startPlayHistoryVideo: function (index, cameraNo, cameraName, startTime, endTime, buttonStyle) {

        if (this.isEmpty(buttonStyle)) {
            buttonStyle = "haiou_common";
        }
        var parameter = "<ocxxml>"
            + "    <head>1.0</head>"
            + "    <command>"
            + "        <id>startplay</id>"
            + "        <style>tvrec</style>"
            + "        <substyle>" + buttonStyle + "</substyle>"
            + "        <index>" + index + "</index>"
            + "        <camno>" + cameraNo + "</camno>"
            + "        <title>" + cameraName + "</title>"
            + "        <starttime>" + this.unixTime(startTime) + "</starttime>"
            + "        <endtime>" + this.unixTime(endTime) + "</endtime>"
            + "        <recplaywithoutchosetime></recplaywithoutchosetime>"
            + "    </command>"
            + "</ocxxml>";

        return this._getResult(parameter);
    },

    /**
     * 设置窗体是否可以相互拖拽，调换位置
     *
     * @param isDragable【是否可拖拽，true为可拖，false为不可拖动】
     * @return 【object类型】见_getResult方法返回值
     */
    setWinDragable: function (isDragable) {

        var defaultValue = false;
        if (isDragable === true) {
            defaultValue = true;
        }
        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>wnddrag</id>"
            + "      <status>" + defaultValue + "</status>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(command);
    },

    /**
     * 设置画面风格,区分 4 和4y,其中4表示四方格风格,4y为竖型四窗口模式，目前竖型的窗口展示风格见于图上浏览; 区别4
     * 和4s风格:其中4表示普通的四方格风格,相互之间不干扰,4s表示四窗口同步模式,其中历史录像和本地录像需要使用 1c表示进入剪辑模式
     *
     * @param layout【几画面风格1/4/9/16/6/8/4y/4s/1s(string类型)】
     * @return 【object类型】见_getResult方法返回值
     */
    setLayout: function (layout) {

        if (this.layout == layout) {
            return null;
        }
        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>setlayout</id>"
            + "      <layout>" + layout + "</layout>"
            + "  </command>"
            + "</ocxxml>";

        var msg = this._getResult(strXml);
        if (!this.isEmpty(msg) && typeof msg == "object" && msg.flag == "success") {
            this.layout = layout;
        }
        return msg;
    },

    /**
     * 获取画面风格
     *
     * @return 【几画面风格1/4/9/16/6/8/4y/4s/1s(string类型)】
     */
    getLayout: function () {

        return this.layout;
    },

    /**
     * 获取选中窗体编号的函数
     */
    getSelectedWindowIndex: function () {

        var index = 0;
        var strXml = "<ocxxml>"
            + "    <head>1.0</head>"
            + "    <command>"
            + "        <id>getselectwnd</id>"
            + "    </command>"
            + "</ocxxml>";

        var msg = this._getResult(strXml);
        if (!this.isEmpty(msg) && typeof msg == "object") {
            index = msg.index;
        }

        return index;
    },

    /**
     * 控制选中的窗口
     * */
    SetSelectWnd: function (index) {

        var strXml = "<ocxxml>"
            + "    <head>1.0</head>"
            + "    <command>"
            + "        <id>selectwnd</id>"
            + "        <style>realtime_pu</style>"
            + "        <index>" + index + "</index>"
            + "    </command>"
            + "</ocxxml>";

        this._getResult(strXml);
    },

    /**
     * 获取窗口播放信息的函数
     * 备注：当前选中窗口(-1)
     */
    getWindowPlayInfo: function (index) {

        var strXml = "<ocxxml>"
            + "    <head>1.0</head>"
            + "    <command>"
            + "        <id>getselectwndplayinfo</id>"
            + "        <index>" + index + "</index>"
            + "    </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 可以设置多种规则，目前只有1种默认规则
     * 规则1：有没有播放任务的窗口时，先按选中窗口播放，然后按照窗体的index递增顺序播放。所有窗口都有播放任务时，替换选中窗口.
     *
     * @param index【几画面风格1/2/3...】
     * @return 【object类型】见_getResult方法返回值
     */
    setPlayRule: function (index) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>setplayrule</id>"
            + "      <rule>" + index + "</rule>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 设置窗口画面比例
     *
     * @param index【窗口索引,如果该值为-1,则表示设置全部全窗口,如果具体值为1,2,3则表示对某个窗口进行设置(number类型)】
     * @param mode【0表示全窗口充满，1表示4:3窗口，2表示16:9窗口(number类型)】
     * @param
     *            auto【true时不需设置mode，false时，需设置mode，否则窗口保留前一次mode模式，仅对图片有效(boolean类型)】
     * @return 【object类型】见_getResult方法返回值
     */
    setWndMode: function (index, mode, auto) {

        var nodeMode = "";
        if (true === auto) {
            nodeMode = "<mode>" + mode + "</mode>";
        }
        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>setwndmode</id>"
            + "      <index>" + index + "</index>"
            + "      <auto>" + (true === auto) + "</auto>"
            + nodeMode
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /*
     * 设置窗口全屏
     *
     * @param index【窗口索引,-1则表示全窗口全屏,如果具体值为1,2,3则表示对某个窗口进行全屏(number类型)】
     * @param value【true表示显示全屏,false退出全屏(boolean类型)】
     * @param screenidx【指定在第几个屏幕进行全屏播放，主要用于一机多屏，可选项，默认为第一屏(number类型)】
     * @return 【object类型】见_getResult方法返回值
     */
    setFullWnd: function (index, value, screenidx) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "     <id>setfullwnd</id>"
            + "     <index>" + index + "</index>"
            + "     <value>" + value + "</value>"
            + "     <screenidx>" + screenidx + "</screenidx>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 设置窗口右键菜单显示项
     *
     * @param index【窗口索引(number类型)】
     * @param point ：
     *            %d,%d, 【点击右键时，鼠标在窗口中的坐标】
     * @param showmenu :
        *            [1,2,3]【菜单显示项，类型为array数组】 showmenu :
     *            编号从0开始，如果有多个按钮需要显示时，填入1,2,3等等，目前1代表关闭，当右键不需要显示时需传入0，后续新增按钮起始值为9
     *            PS:对应的编号为：关闭 -- 2 光学放大 --3 数字放大 --4 开始平台录像 -- 5 开始窗口轮巡 --6
     *            停止平台录像 --7 停止窗口轮巡 --8 退出全屏 -- 9 此功能由ComBinOcx控制，调用方不用控制
     *            暂停窗口轮巡--10 继续窗口轮巡 --11
     */
    menuCtrl: function (index, point, showmenu) {
        if (this.isEmpty(point)) {
            point = "0,0";
        }
        if (this.isEmpty(showmenu) || showmenu.length == 0) {
            showmenu = [0];
        }
        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>menuctrl</id>"
            + "      <index>" + index + "</index>"
            + "      <point>" + point + "</point>"
            + "      <showmenu>" + showmenu.join(",") + "</showmenu>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 取消蓝色选择框
     *
     * @param isCancel【是否取消蓝色选中框，True则没有蓝色选中框，false则出现蓝色选中框】
     * @return 【object类型】见_getResult方法返回值
     */
    cancelSelect: function (isCancel) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>cancelselect</id>"
            + "      <status>" + isCancel + "</status>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 服务器摘要进度条联动
     *
     * @param index【窗口索引号(number类型)】
     * @param type【操作类型(string类型)】
     * @param time【进度条时间段(string类型)】
     *
     */
    setMultiWinSliderPos: function (index, type, time) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>setsliderpos</id>"
            + "      <index>" + index + "</index>"
            + "      <type>" + type + "</type>"
            + "      <time>" + time + "</time>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 显示时调用true,不显示时调用false
     *
     * @param showpbtn【显示翻页按钮(boolean类型)】
     *
     */
    showPageBtn: function (showpbtn) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>showpagebtn</id>"
            + "      <status>" + showpbtn + "</status>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 设置全屏时提示信息框内容
     *
     * @param  "info" 【提示信息(string类型)】 "url" 【url链接(string类型)】
     * @return 【object类型】见_getResult方法返回值
     */
    setFullScreenOprInfo: function (info, url, type) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>setfullscreenoprinfo</id>"
            + "      <info>" + info + "</info>"
            + "      <url>" + url + "</url>"
            + "      <type>" + type + "</type>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 设置服务器摘要目标快照全屏显示 picInfo包括图片路径，目标坐标以及宽高
     *
     * @param picInfo【大图图片信息(object类型)】
     *                {
	 * 					fullpath: 图片路径,
	 * 					pointx: 横坐标,
	 * 					pointy: 纵坐标,
	 * 					width：宽度,
	 * 					height: 高度
	 * 				}
     *
     */
    picFullScreenShow: function (picInfo) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>picfullscreenshow</id>"
            + json2xml(picInfo, "")
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 设置插件分辨率模式
     *
     * @param style【bigmode大分辨率模式samllmode
     *            小分辨率模式】
     * @return 【object类型】见_getResult方法返回值
     */
    setOcxScreenMode: function (style) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>setocxscreenmode</id>"
            + "      <style>" + style + "</style>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 获取用户数据
     *
     * @param type【获取的用户数据类型，例如：预置位等】
     * @return 【object类型】见_getResult方法返回值
     */
    getUserData: function (type) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "      <id>getuserdata</id>"
            + "      <type>" + type + "</type>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * ptz操作
     *
     * @param config【config包含
     *            index 窗口号 comid (1:向上移动 2:向下移动 3:向左移动 4:向右移动 5:回归 6:停止移动
     *            7:拉近摄像头 8:拉远摄像头 9:视野调节停止 10:将焦距调远 11:将焦距调近 12:自动调焦 13:调焦停止
     *            14:摄象头预存 15:调摄象头预存 16:初始化摄像头 17:画面调亮 18:画面调暗
     *            19:停止调亮后面的命令只由mutliwnd调用，所以参数不开放给接口 20:新命令 21:附加命令 22:中心定位
     *            23:局部放大)
     *            speed 速度 (object类型)】
     * @return 【object类型】见_getResult方法返回值
     */
    ptzComd: function (index, comid, speed) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "     <id>ptzcomd</id>"
            + "     <index>" + index + "</index>"
            + "     <comid>" + comid + "</comid>"
            + "     <speed>" + speed + "</speed>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 关闭指定窗口的播放
     *
     * @param index【窗口编号】
     * @return 【object类型】见_getResult方法返回值
     */
    stopPlay: function (index) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "     <id>stopplay</id>"
            + "     <index>" + index + "</index>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 指定窗口播放包含指定时间段的录像(播放跳转功能)
     * 只根据starttime标签进行录像查找，跨段只播放starttime所在段的录像
     * 如果有切割条，则切割条会根据时间段显示按钮
     *
     * @author wangzhiming
     * @param index【窗口编号(Number)】
     *          startTime【跳转播放的起始时间】
     *          endTime【跳转播放的结束时间，主要用于切割条的滑块定位】
     */
    playrecByTime: function (index, startTime, endTime) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "     <id>playrecbytime</id>"
            + "     <index>" + index + "</index>"
            + "     <starttime>" + startTime + "</starttime>"
            + "     <endtime>" + endTime + "</endtime>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 释放ocx
     */
    releaseOcx: function () {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "     <id>releaseocx</id>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 画线画框
     *
     * @param config【包含：index 窗口编号，
     *                        cleangraph 清除图像标志，
     *                        graphinfo 画线画框信息{type:1框, 2线; store:1存储, 0不存储}
     *                        color 颜色{r:红色; g:绿色; b:蓝色}
     *                        getgraphfilter 有标签即可，目前不要使用】
     */
    addGraph: function (config) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "     <id>addgraph</id>"
            + json2xml(config, "")
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);

    },

    /**
     * 剪辑视频
     */
    cutSaveVideo: function (index, startTime, endTime) {

        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "     <id>cutsave</id>"
            + "     <index>" + index + "</index>"
            + "     <starttime>" + startTime + "</starttime>"
            + "     <endtime>" + endTime + "</endtime>"
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 设置非线性编辑智能目标信息
     */
    setPlayTargetInfo: function (config) {

        var targetInfo = "";
        if (!this.isEmpty(config) && !this.isEmpty(config.tracks)) {
            for (var i = 0; i < config.tracks.length; i++) {
                if (!this.isEmpty(config.tracks[i])) {
                    targetInfo += "<objecttrack>";
                    targetInfo += "<top>" + config.tracks[i].top + "</top>";
                    targetInfo += "<left>" + config.tracks[i].left + "</left>";
                    targetInfo += "<right>" + config.tracks[i].right + "</right>";
                    targetInfo += "<bottom>" + config.tracks[i].bottom + "</bottom>";
                    targetInfo += "<time>" + config.tracks[i].frameTime + "</time>";
                    targetInfo += "</objecttrack>";
                }
            }
        }
        var strXml = "<ocxxml>"
            + "  <head>1.0</head>"
            + "  <command>"
            + "     <id>setplaytargetinfo</id>"
            + targetInfo
            + "  </command>"
            + "</ocxxml>";

        return this._getResult(strXml);
    },

    /**
     * 获取插件执行操作后返回的结果
     *
     * @param strXml【xml格式字符串(string类型)】
     * @return 【object类型】，属性包括：flag : success/fail //接口是否调用成功 data :
     *         //接口同步返回的结果，根据不同接口可能有也可能没有 errormsg : //错误描述信息(非必填项) /
     */
    _getResult: function (strXml) {

        this.printf(strXml);

        var jsonResult = this.postXMLCommand(strXml);
        if (null !== jsonResult && typeof jsonResult == "object" && "ocxxml" in jsonResult && null !== jsonResult.ocxxml && typeof jsonResult.ocxxml == "object") {
            if ("result" in jsonResult.ocxxml) {
                jsonResult.ocxxml.result.isPlayerLoad = this.isPlayerLoaded;
                return jsonResult.ocxxml.result;
            }
            else if ("notify" in jsonResult.ocxxml) {
                jsonResult.ocxxml.notify.isPlayerLoad = this.isPlayerLoaded;
                return jsonResult.ocxxml.notify;
            }
        }
        return null;
    },

    /**
     * 给插件发送xml格式数据执行相应操作
     *
     * @param strXml【xml格式字符串(string类型)】
     * @return 【string类型】 /
     */
    postXMLCommand: function (strXml) {

        if (null != this.obj) {
            return this.xmlToJson(this.obj.OcxXmlCommand(strXml));
        }
        return null;
    },

    /**
     * 转化为时间戳,转化为以秒为单位的utc时间 /
     */
    unixTime: function (time) {

        if (this.isEmpty(time)) {
            return '';
        }
        time = time.replace(/-/g, '/');
        var date = new Date(time);
        var time = date.getTime();

        return time / 1000;
    },

    /**
     * 将xml字符串转换成json对象
     */
    xmlToJson: function (strXml) {
        var browser = navigator.appName;
        var xmlDoc;
        if (browser == "Microsoft Internet Explorer") {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(strXml);
        } else {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(strXml, "text/xml");
        }

        var strJson = xml2json(xmlDoc, "");
        return JSON.parse(strJson);
    },

    /**
     * 调试打印
     *
     * @param info【打印信息(string类型)】
     * @return 【boolean类型】
     */
    printf: function (info) {

        if (typeof top.printf == "function") {
            //top.printf(info);
            return true;
        }
        else {
            //console.log(info);
            return true;
        }
    },

    /**
     * 判断变量是否为空
     *
     * @param param【判断变量(string类型)】
     * @return 【boolean类型】 / /
     */
    isEmpty: function (param) {

        return typeof param == "undefined" || param === null || param === "";
    },

    /**
     * 判断变量是否Object /
     */
    isObject: function (param) {

        return param !== null && typeof param == "object";
    }
};

function json2xml(o, tab) {
    var toXml = function (v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
            for (var i = 0, n = v.length; i < n; i++)
                xml += ind + toXml(v[i], name, ind + "\t") + "\n";
        }
        else if (typeof(v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
                if (m.charAt(0) == "@")
                    xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                    hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for (var m in v) {
                    if (m == "#text")
                        xml += v[m];
                    else if (m == "#cdata")
                        xml += "<![CDATA[" + v[m] + "]]>";
                    else if (m.charAt(0) != "@")
                        xml += toXml(v[m], m, ind + "\t");
                }
                xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
            }
        }
        else {
            xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
        }
        return xml;
    }, xml = "";
    for (var m in o)
        xml += toXml(o[m], m, "");
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
};

function xml2json(xml, tab) {
    var X = {
        toObj: function (xml) {
            var o = {};
            if (xml.nodeType == 1) {   // element node ..
                if (xml.attributes.length)   // element with attributes  ..
                    for (var i = 0; i < xml.attributes.length; i++)
                        o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild = 0, cdataChild = 0, hasElementChild = false;
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1) hasElementChild = true;
                        else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType == 4) cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) {  // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                }
                                else  // first occurence of element..
                                    o[n.nodeName] = X.toObj(n);
                            }
                        }
                        else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    }
                    else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    }
                    else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n = xml.firstChild; n; n = n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null;
            }
            else if (xml.nodeType == 9) { // document.node
                o = X.toObj(xml.documentElement);
            }
            else
                alert("unhandled node type: " + xml.nodeType);
            return o;
        },
        toJson: function (o, name, ind) {
            var json = name ? ("\"" + name + "\"") : "";
            if (o instanceof Array) {
                for (var i = 0, n = o.length; i < n; i++)
                    o[i] = X.toJson(o[i], "", ind + "\t");
                json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
            }
            else if (o == null)
                json += (name && ":") + "null";
            else if (typeof(o) == "object") {
                var arr = [];
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
            }
            else if (typeof(o) == "string")
                json += (name && ":") + "\"" + o.toString() + "\"";
            else
                json += (name && ":") + o.toString();
            return json;
        },
        innerXml: function (node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function (n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i = 0; i < n.attributes.length; i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c = n.firstChild; c; c = c.nextSibling)
                                s += asXml(c);
                            s += "</" + n.nodeName + ">";
                        }
                        else
                            s += "/>";
                    }
                    else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c = node.firstChild; c; c = c.nextSibling)
                    s += asXml(c);
            }
            return s;
        },
        escape: function (txt) {
            return txt.replace(/[\\]/g, "\\\\")
                .replace(/[\"]/g, '\\"')
                .replace(/[\n]/g, '\\n')
                .replace(/[\r]/g, '\\r');
        },
        removeWhite: function (e) {
            e.normalize();
            for (var n = e.firstChild; n;) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    }
                    else
                        n = n.nextSibling;
                }
                else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                }
                else                      // any other node
                    n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
};
