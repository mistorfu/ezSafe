/**
 * Created by fudapeng on 2018/7/20.
 */
define(['../jquery','../kendoui/js/kendo.all','../kendoui/js/cultures/kendo.culture.zh.min'], function () {
    (function ($) {
        $.fn.kdvideo = function (options) {
            var settings = {
                windowNum: 1,
                wsurl: "ws://",
                poster: "",
                windows: [],
                endPlay:null,
                hiddenButtons:[],  //play(播放) stop(停止)  call(语音) playHistory(回放) return(返回) slow(减速) resume(继续播放) fast(加速) voice(声音) full(全屏) endfull(退出全屏) screenShot(截图)
                fillWrapper:null
            };
            var choose = false; //声音选中状态
            var theDiv = null;  //拖拽对象
            var select = false; //进度选中状态
            var cssText = null; //临时的videoWrapper百分比

            if (options) {
                $.extend(settings, options);
            }

            var context = this;
            $(context).empty();

            var windowNumList = [1,2,4,6,8,9,16];
            // 生成dom元素
            if($.inArray(settings.windowNum,windowNumList) == -1){
                settings.windowNum = 1;
            }
            for (var i = 0; i < settings.windowNum; i++) {
                var windowID = "kdvideoWindow" + i;
                $(context).append('<div class="kdvideo-window-wrapper">' +
                    '<video id="' + windowID + '" class="kdvideo-window" autoplay poster="' + settings.poster +'"></video><div class="rate hidden"><span class="rateVal">1</span>x</div>' +
                    ' <div class="controls"><div class="leftBtn"><span class="play live" title="播放"></span><span class="stop live" title="停止"></span><span class="call live" title="语音"></span>' +
                    '<span class="playHistory live" title="历史回放"></span><span class="return record hidden" title="实时播放"></span><span class="slow record hidden" title="减速"></span>' +
                    '<span class="resume record hidden" title="暂停"></span><span class="fast record hidden" title="加速"></span><span class="screenShot" title="截屏"></span></div><div class="progressBar hidden"><span class="playCtrl"></span><div class="playPole"><div class="poleOn"></div></div>' +
                    '</div><div class="rightBtn"><span class="voice"></span><div class="voiceBar hidden"><div class ="voiceVal">0</div><div class="pole"><div class="poleVoice"></div></div><span class ="voiceCtrl"></span></div>' +
                    '<span class="endFull hidden" title="退出全屏"></span><span class="full" title="全屏"></span></div></div></div>');
                settings.windows.push(new VideoWindow(windowID, settings.wsurl)); // 创建播放窗口对象
                document.getElementById(windowID).volume = 0;   //初始声音为0
            }

            //生成弹出框
            $(context).append('</div><div id="window-bg" class="window hidden"><div id="window-Content" class="window hidden"><div class="title"><span>播放时间</span></div><div class="close"></div>' +
                '<div class="line"><span class="time">开始时间</span><input type="text" class="startTime"/></div>' +
                '<div class="line"> <span class="time">结束时间</span><input type="text" class="endTime"/></div>' +
                '<div class="confirm"></div><div class="cancel"></div></div>');

            var start = $(".startTime").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm:ss",
                culture: "zh-CN"
            }).data("kendoDateTimePicker");

            var end = $(".endTime").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm:ss",
                culture: "zh-CN"
            }).data("kendoDateTimePicker");

            var time = kendo.toString(kendo.date.today(), "yyyy-MM-dd HH:mm:ss");
            start.value(time);
            end.value(time);

            /**
             * @Description: 初始按钮显示
             **/
            for(var j=0; j < settings.hiddenButtons.length; j++){
                var className = "." + settings.hiddenButtons[j];
                $(className).addClass("invisible");
            }

            // 窗口选中控制
            $(context).find(".kdvideo-window-wrapper").click(function(e) {
                if (!$(this).hasClass("selected")) {
                    $(context).find(".kdvideo-window-wrapper").removeClass("selected");
                    $(this).addClass("selected");
                    var videoWrapper = $(this).closest(".kdvideo-window-wrapper")[0];
                    cssText = videoWrapper.style.cssText;
                }
            });

            // 开始/暂停按钮
            $(context).find(".kdvideo-window-wrapper .play").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var playIcon = $(this).closest(".kdvideo-window-wrapper").find(".play");
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                // if (videoDom.currentSrc && videoWindow.isPlaying) {
                if (videoWindow.isPlaying) {
                    if (videoDom.paused) {
                        videoDom.play();
                        $(this).addClass("pause");
                        playIcon.attr("title","暂停");
                    } else {
                        videoDom.pause();
                        $(this).removeClass("pause");
                        playIcon.attr("title","播放");
                    }
                } else {
                    videoWindow.realPlay();
                }
            });

            // 停止按钮
            $(context).find(".kdvideo-window-wrapper .stop").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                videoWindow.stopPlay();
                // $(this).closest(".kdvideo-window-wrapper").find("span.play").removeClass("pause");
            });

            //语音按钮
            $(context).find(".kdvideo-window-wrapper .call").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                if(videoWindow.isCalling){
                    videoWindow.endCall();
                    $(this).removeClass("endCall");
                }else {
                    videoWindow.startCall();
                    $(this).addClass("endCall");
                }
            });

            //截屏按钮
            $(context).find(".kdvideo-window-wrapper .screenShot").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var canvas = document.createElement("canvas");
                var width = videoDom.videoWidth;
                var height = videoDom.videoHeight;
                canvas.width= width;
                canvas.height= height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(videoDom, 0, 0, width, height);
                download(canvas);
            });

            function download(canvas){
                //1.确定图片的类型  获取到的图片格式 data:image/Png;base64,......
                var type ='jpeg';//你想要什么图片格式 就选什么吧
                var imgdata=canvas.toDataURL(type);
                //2.0 将mime-type改为image/octet-stream,强制让浏览器下载
                var fixtype=function(type){
                    type=type.toLocaleLowerCase().replace(/jpg/i,'jpeg');
                    var r=type.match(/png|jpeg|bmp|gif/)[0];
                    return 'image/'+r;
                };
                imgdata = imgdata.replace(fixtype(type),'image/octet-stream');
                //3.0 将图片保存到本地
                var saveFile=function(data,filename)
                {
                    var save_link=document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                    save_link.href=data;
                    save_link.download=filename
                    ;
                    var event=document.createEvent('MouseEvents');
                    event.initMouseEvent('click',true,false,window,0,0,0,0,0,false,false,false,false,0,null);
                    save_link.dispatchEvent(event);
                };
                var filename=''+new Date().getTime()+'.'+type;
                saveFile(imgdata,filename);
            }

            //回放按钮
            $(context).find(".kdvideo-window-wrapper .playHistory").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                openWindow(videoWindow,videoDom);
            });

            /**
             * @Description: 进度控制
             **/
            $(".playCtrl").mousedown(function (e) {
                select = true;
                theDiv = $(this);
                var video = theDiv.closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(video.id.substr(13))];
                videoWindow.isPlaying = false;
                videoWindow.stopTimer();  //停掉计时器
            });

            // 点击移动
            $(".playPole").click(function (e) {
                var video = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(video.id.substr(13))];
                var playCtrl =  $(this).closest(".kdvideo-window-wrapper").find(".playCtrl");
                var poleOn = $(this).closest(".kdvideo-window-wrapper").find(".poleOn");            //蓝色
                var playPole = $(this).closest(".kdvideo-window-wrapper").find(".playPole");        //灰色
                var leftPos = $(this).offset().left;
                var range = e.pageX - leftPos;
                var length = playPole.width();
                var percent = range / length;
                var duration = (new Date(videoWindow.dateTimeEnd) - new Date(videoWindow.dateTimeBegin))/1000;
                var videoTime = Math.round(duration * percent);
                videoWindow.videoTime = videoTime;
                poleOn.width(range);
                playCtrl.css({left: range + 'px'});
                videoWindow.controlPlayHistory(9,videoTime);
                if(!videoWindow.isPlaying){
                    videoWindow.isPlaying = true;
                    var historyResume = $(this).closest(".kdvideo-window-wrapper").find(".resume");
                    historyResume.attr("title","暂停");
                    videoWindow.startTimer();
                    $(this).closest(".kdvideo-window-wrapper").find("span.resume").addClass("pause");
                }
            });

            /**
             * @Description: 声音控制
             **/
            $(context).find(".kdvideo-window-wrapper .voice").click(function(e) {
                $(this).closest(".kdvideo-window-wrapper").find(".voiceBar").removeClass("hidden");
            });

            //点击控制声音
            $(".pole").click(function (e) {
                var voiceCtrl =  $(this).closest(".kdvideo-window-wrapper").find(".voiceCtrl");
                var poleVoice = $(this).closest(".kdvideo-window-wrapper").find(".poleVoice");
                var voiceVal = $(this).closest(".kdvideo-window-wrapper").find(".voiceVal");
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var topPos = $(this).offset().top;
                var range = e.pageY - topPos;
                var value = Math.round( (70 - range) * 100/ 70);
                voiceCtrl.css({bottom: (55 - range) + 'px'});
                voiceVal.text(value);
                poleVoice.height(range);
                videoDom.volume = value/100;
            });

            $(".voiceCtrl").mousedown(function (e) {
               choose = true;
               theDiv = $(this);
            });
            $(context).mouseup(function(e){
                if(select){
                    var video = theDiv.closest(".kdvideo-window-wrapper").children("video")[0];
                    var videoWindow = settings.windows[parseInt(video.id.substr(13))];
                    var poleOn = theDiv.closest(".kdvideo-window-wrapper").find(".poleOn");            //蓝色
                    var playPole = theDiv.closest(".kdvideo-window-wrapper").find(".playPole");        //灰色
                    var width = poleOn.width();
                    var length = playPole.width();
                    var percent = width / length;
                    var duration = (new Date(videoWindow.dateTimeEnd) - new Date(videoWindow.dateTimeBegin))/1000;
                    var videoTime = Math.round(duration * percent);
                    videoWindow.videoTime = videoTime;
                    videoWindow.controlPlayHistory(9,videoTime);
                    videoWindow.isPlaying = true;
                    videoWindow.startTimer();   //开启计时器

                    var historyResume = theDiv.closest(".kdvideo-window-wrapper").find(".resume");
                    historyResume.attr("title","暂停");
                    theDiv.closest(".kdvideo-window-wrapper").find("span.resume").addClass("pause");
                }
                choose = false;
                select = false;
            }).mousemove(function(e){
                if(choose){   //声音
                    var pole = theDiv.closest(".kdvideo-window-wrapper").find(".pole");            //蓝色
                    var voiceVal = theDiv.closest(".kdvideo-window-wrapper").find(".voiceVal");    //显示的声音值
                    var poleVoice = theDiv.closest(".kdvideo-window-wrapper").find(".poleVoice");  //灰色
                    var videoDom = theDiv.closest(".kdvideo-window-wrapper").children("video")[0];
                    // videoDom.muted = false;  // 取消静音
                    var topPos = pole.offset().top;  //控制条顶端
                    var bottomPos = topPos + 70;           //控制条底端
                    var position = 0;      //鼠标相对pole上端位置
                    if(topPos <= e.pageY && e.pageY <= bottomPos){
                        position = e.pageY - topPos ;
                        theDiv.css({bottom: (55 - position) + 'px'});
                        var value = Math.round( (70 - position) * 100/ 70);
                        voiceVal.text(value);
                        poleVoice.height(position);
                        videoDom.volume = value/100;
                    }else if(e.pageY > bottomPos){
                        position = 70 ;
                        theDiv.css({bottom: (55 - position) + 'px'});
                        voiceVal.text(0);
                        poleVoice.height(position);
                        videoDom.volume = 0;
                    }else{
                        position = 0 ;
                        theDiv.css({bottom: (55 - position) + 'px'});
                        voiceVal.text(100);
                        poleVoice.height(position);
                        videoDom.volume = 1;
                    }
                }
                if(select){  //进度
                    var poleOn = theDiv.closest(".kdvideo-window-wrapper").find(".poleOn");            //蓝色
                    var playPole = theDiv.closest(".kdvideo-window-wrapper").find(".playPole");        //灰色
                    var leftPos = playPole.offset().left;
                    var length = playPole.width();
                    var rightPos = length + leftPos;
                    if(leftPos <= e.pageX && e.pageX <= rightPos){
                        var range = e.pageX - leftPos;
                        poleOn.width(range);
                        theDiv.css({left: range + 'px'});
                    }else if(e.pageX > rightPos){
                        poleOn.width(length);
                        theDiv.css({left: length + 'px'});
                    }else if(e.pageX < leftPos){
                        poleOn.width(0);
                        theDiv.css({left: 0 + 'px'})
                    }
                }
            });

            $(document).click(function(e) {
                var name = e.target.className;
                if(name != 'poleVoice' && name != "pole" && name != "voiceVal" && name != "voiceBar" && name != "voice" && name != "voiceCtrl"){
                    $(".voiceBar").addClass("hidden");
                }
            });

            /**
             * @Description: 声音title
             **/
            $(".voice").hover(function () {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var volume = Math.round(videoDom.volume *100);
                $(this).attr("title","音量："+volume);
            });

            /**
             * @Description: 监听 hover 改变进度条长度
             **/
            $(".kdvideo-window-wrapper").hover(function () {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                if(!$(this).hasClass("selected")){
                    if(videoWindow.isBack) videoWindow.adjustPole();
                }
            });

            //屏幕大小改变 修改按钮和进度条
            window.onresize = function () {
                var videoDom = $('.selected').closest(".kdvideo-window-wrapper").children("video")[0];
                if(checkFull()){
                    $(".endFull").removeClass("hidden");
                    $(".full").addClass("hidden");
                    $(".playHistory").addClass("hidden");
                }else{
                    $(".endFull").addClass("hidden");
                    $(".full").removeClass("hidden");
                    if(!$(".play").hasClass("hidden")){
                        $(".playHistory").removeClass("hidden");
                    }
                    var videoWrapper = $('.selected').closest(".kdvideo-window-wrapper")[0];
                    if(videoWrapper != undefined){
                        videoWrapper.style.cssText = cssText;
                    }
                }
                if(videoDom != undefined){
                    var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                    if(videoWindow.isBack) videoWindow.adjustPole();
                }
            };
            //判断是否是全屏
            function checkFull() {
                var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;

                if (isFull === undefined) isFull = false;
                return isFull;
            }

            //双击全屏
            $(".kdvideo-window").dblclick(function (e) {
                if(!checkFull()){
                    var videoWrapper = $(this).closest(".kdvideo-window-wrapper")[0];
                    cssText = videoWrapper.style.cssText;
                    videoWrapper.style.cssText = "width: 100%; height: 100%;";
                    videoWrapper.webkitRequestFullScreen();
                }else document.webkitCancelFullScreen();

            });

            //全屏按钮
            $(context).find(".kdvideo-window-wrapper .full").click(function(e) {
                $(context).find(".kdvideo-window-wrapper").removeClass("selected");
                var videoWrapper = $(this).closest(".kdvideo-window-wrapper")[0];
                $(videoWrapper).addClass("selected");        //全屏时选中（防止多次设置cssText）
                cssText = videoWrapper.style.cssText;
                videoWrapper.style.cssText = "width: 100%; height: 100%;";
                videoWrapper.webkitRequestFullScreen();
            });
            //退出全屏按钮
            $(context).find(".kdvideo-window-wrapper .endFull").click(function(e) {
                document.webkitCancelFullScreen();
            });

            //返回按钮
            $(context).find(".kdvideo-window-wrapper .return").click(function(e) {
                document.webkitCancelFullScreen();
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                $(this).closest(".kdvideo-window-wrapper").find(".live").removeClass("hidden");
                $(this).closest(".kdvideo-window-wrapper").find(".record").addClass("hidden");
                $(this).closest(".kdvideo-window-wrapper").find(".progressBar").addClass("hidden");
                videoWindow._disconnect(videoWindow.video);
                videoWindow.stopTimer();
                videoWindow.realPlay();
                videoWindow.isBack = false;
            });

            // 回放 开始/暂停按钮
            $(context).find(".kdvideo-window-wrapper .resume").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                var historyResume = $(this).closest(".kdvideo-window-wrapper").find(".resume");
                if (videoWindow.isPlaying) {
                    historyResume.attr("title","播放");
                    videoWindow.stopTimer();
                    $(this).closest(".kdvideo-window-wrapper").find("span.resume").removeClass("pause");
                    videoWindow.isPlaying = false;
                    videoWindow.controlPlayHistory(2);
                }else {
                    historyResume.attr("title","暂停");
                    videoWindow.startTimer();
                    $(this).closest(".kdvideo-window-wrapper").find("span.resume").addClass("pause");
                    videoWindow.isPlaying = true;
                    videoWindow.controlPlayHistory(3);
                }
            });

            //快放
            $(context).find(".kdvideo-window-wrapper .fast").click(function(e) {
                // playbackRate   改变video的播放速度
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                if(videoWindow.isPlaying){
                    var rate = $(this).closest(".kdvideo-window-wrapper").find(".rate");
                    var rateVal = $(this).closest(".kdvideo-window-wrapper").find(".rateVal");
                    var speed = rateVal.html();
                    if(speed != 8){
                        videoWindow.controlPlayHistory(4);
                        speed = speed * 2;
                        rateVal.html(speed);
                        videoWindow.rate = speed;
                    }
                    rate.stop(false,true);
                    rate.fadeIn();
                    rate.fadeOut(3000)
                }
            });

            //慢放
            $(context).find(".kdvideo-window-wrapper .slow").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                if(videoWindow.isPlaying){
                    var rate = $(this).closest(".kdvideo-window-wrapper").find(".rate");
                    var rateVal = $(this).closest(".kdvideo-window-wrapper").find(".rateVal");
                    var speed = rateVal.html();
                    if(speed != 0.125){
                        videoWindow.controlPlayHistory(5);
                        speed = speed/2;
                        rateVal.html(speed);
                        videoWindow.rate = speed;
                    }
                    rate.stop(false,true);
                    rate.fadeIn();
                    rate.fadeOut(3000);
                }
            });

            //单帧
            $(context).find(".kdvideo-window-wrapper .frame").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                videoWindow.controlPlayHistory(6);
            });

            //正常
            $(context).find(".kdvideo-window-wrapper .common").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                videoWindow.controlPlayHistory(7);
                $(".speed").val(1);
            });

            //倍速设置
            $("select.speed").change(function(){
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                var speed = parseInt($(this).val());
                videoWindow.controlPlayHistory(8,speed);
            });
            $(".speed").val(1);  //默认值

            //cmd设置
            $("select.cmd").change(function(){
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                if(videoWindow.isPlaying == true && !videoDom.paused){
                    var cmd = parseInt($(this).val());
                    var param =parseInt($(this).closest(".kdvideo-window-wrapper").find("select.param").val());
                    videoWindow.controlPTZ(cmd,param,"start");
                    $(this).closest(".kdvideo-window-wrapper").find("span.break").removeClass("hidden");
                }
            });

            //param设置
            $("select.param").change(function(){
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                var cmd =parseInt($(this).closest(".kdvideo-window-wrapper").find("select.cmd").val());
                if(videoWindow.isPlaying == true && !videoDom.paused && cmd != 51 && cmd != 52){
                    var param = parseInt($(this).val());
                    videoWindow.controlPTZ(cmd,param,"start");
                    $(this).closest(".kdvideo-window-wrapper").find("span.break").removeClass("hidden");
                }
            });

            /**
             * @Description: 断开PTZ控制
             **/
            $(context).find(".kdvideo-window-wrapper .break").click(function(e) {
                var videoDom = $(this).closest(".kdvideo-window-wrapper").children("video")[0];
                var videoWindow = settings.windows[parseInt(videoDom.id.substr(13))];
                var cmd = parseInt($(this).closest(".kdvideo-window-wrapper").find("select.cmd").val());
                var param =parseInt($(this).closest(".kdvideo-window-wrapper").find("select.param").val());
                videoWindow.controlPTZ(cmd,param,"stop");
                $(this).addClass("hidden");
            });

                /**
             * @Description: 弹出框事件
             **/
           function openWindow(videoWindow,videoDom) {
               $(".window").removeClass("hidden");
               $(".close").unbind('click').click(function () {
                   $(".window").addClass("hidden");
               });
               $(".confirm").unbind('click').click(function () {
                   videoWindow.dateTimeBegin = kendo.toString(start.value(), "yyyy-MM-ddTHH:mm:ss");
                   videoWindow.dateTimeEnd = kendo.toString(end.value(), "yyyy-MM-ddTHH:mm:ss");
                   if(videoWindow.dateTimeBegin < videoWindow.dateTimeEnd){
                       $(".window").addClass("hidden");
                       $(videoDom).closest(".kdvideo-window-wrapper").find(".live").addClass("hidden");
                       $(videoDom).closest(".kdvideo-window-wrapper").find(".record").removeClass("hidden");
                       $(videoDom).closest(".kdvideo-window-wrapper").find(".progressBar").removeClass("hidden");

                       if(videoWindow.isCalling){
                           videoWindow._disconnect(videoWindow.phone);
                           videoWindow.isCalling = false;
                           $(videoDom).closest(".kdvideo-window-wrapper").find("span.call").removeClass("endCall");
                       }
                       if(videoWindow.isPlaying){
                           videoWindow._disconnect(videoWindow.video);
                           videoWindow.isPlaying = false;
                           $(videoDom).closest(".kdvideo-window-wrapper").find("span.play").removeClass("pause");
                       }
                       $(videoDom).closest(".kdvideo-window-wrapper").find(".rateVal").html(1);  //初始速度显示为1
                       videoWindow.rate = 1;
                       videoWindow.playHistory();
                       videoWindow.adjustPole();  //调整进度条

                       videoWindow.isBack = true;
                   }else alert("时间选择错误");

               });
               $(".cancel").unbind('click').click(function () {
                   $(".window").addClass("hidden");
               });
           }

           // 提供断开方法
            settings.endPlay = function (num) {
                if(num != undefined){
                    if(!isNaN(num) && num >= 0 && num<= settings.windowNum){
                        var videoWindow = settings.windows[num];
                        videoWindow.stopPlay();
                    }
                }else{
                    for(var x in settings.windows){
                        settings.windows[x].stopPlay();
                    }
                }
            };

           //控制是否撑满Wrapper
            settings.fillWrapper = function () {
                $(".kdvideo-window").css("object-fit","fill");
            };

            // 分屏设置
            var windowHeight = "100%";
            var windowWidth = "100%";
            switch (settings.windowNum) {
                case 1:
                    break;
                case 2:
                    windowWidth = "50%";
                    break;
                case 4:
                    windowHeight = "50%";
                    windowWidth = "50%";
                    break;
                case 6:
                case 9:
                    windowHeight = "33.33%";
                    windowWidth = "33.33%";
                    break;
                case 8:
                case 16:
                    windowHeight = "25%";
                    windowWidth = "25%";
                    break;
            }
            $(context).find(".kdvideo-window-wrapper").css({width: windowWidth, height: windowHeight});
            if (settings.windowNum == 6)
                $(context).find(".kdvideo-window-wrapper:first").css({width: "66.66%", height: "66.65%"});
            else if (settings.windowNum == 8)
                $(context).find(".kdvideo-window-wrapper:first").css({width: "75%", height: "75%"});

            // 返回对象给调用页面
            return settings;
        }
    })(jQuery);

    function VideoWindow(windowID, wsurl) {
        this.windowID = windowID;
        this.wsurl = wsurl;
        this.waitingCmd = null;
        this.isPlaying = false;
        this.isCalling = false;
        this.deviceID = null;
        this.isBack = false;
        this.dateTimeBegin = this.dateTimeBegin || null;
        this.dateTimeEnd = this.dateTimeEnd || null;
        this.rate = 1;  //倍速
        this.videoTime = 0;  //相对播放开始时间的秒数
        this.playTime = 0;  //计时器时间
        this.timer = null;  //计时器
        this.percent = 0;   //进度百分比
        this.poleLength = 0; //进度条长度
        this.video = {
            pc:null,
            socket:null,
            callStream:null
        };
        this.phone = {
            pc:null,
            socket:null,
            callStream:null
        }
    }

    VideoWindow.prototype = {
        _initPeerConnection: function (obj) {
            var context = this;
            obj.pc = new webkitRTCPeerConnection(null);

            if(obj.callStream != null){
                obj.pc.addStream(obj.callStream);
            }

            obj.pc.onicecandidate = function (event) {
                if (event.candidate !== null) {
                    obj.socket.send(JSON.stringify({
                        "account_token": "",
                        "cmd_type": "ice",
                        "request_type": "candidate",
                        "candidate": event.candidate.candidate
                    }));
                }
            };

            obj.pc.onaddstream = function (event) {
                // $("#" + context.windowID).attr("src", URL.createObjectURL(event.stream));
                var mediaElement = document.getElementById(context.windowID);
                mediaElement.srcObject = event.stream;
            };
        },

        _initSocket: function (obj,cmd) {
            var context = this;

            if ("WebSocket" in window) {
                obj.socket = new WebSocket(context.wsurl);
                obj.socket.onopen = function () {
                    if (cmd) {
                        obj.socket.send(JSON.stringify(cmd))
                    } else if (context.waitingCmd) {
                        obj.socket.send(JSON.stringify(context.waitingCmd));
                        context.waitingCmd = null;
                    }
                };
                obj.socket.onclose = function () {
                    // context._disconnect();
                };
                obj.socket.addEventListener("message", function (event) {
                    if (event.type == "message") {
                        var json = JSON.parse(event.data);
                        if (json.cmd_type == "ice") {
                            if (json.request_type == "offer") {
                                var desc = new RTCSessionDescription();
                                desc.sdp = json.sdp;
                                desc.type = 'offer';
                                obj.pc.setRemoteDescription(desc);
                                obj.pc.createAnswer(function (desc) {
                                    obj.pc.setLocalDescription(desc);
                                    obj.socket.send(JSON.stringify({
                                        "account_token": "",
                                        "cmd_type": "ice",
                                        "request_type": "answer",
                                        "sdp": desc.sdp
                                    }));
                                }, function (error) {
                                });
                            } else if (json.request_type == "reconnect") {
                                context._disconnect();
                                context._initSocket();
                            }
                        }
                    }
                });
            } else {
                console.log("浏览器不支持WebSocket!");
            }
        },

        _disconnect: function (video) {
            this.isPlaying = false;
            if(video.pc.iceConnectionState != "closed"){   //防止多次关闭
                if(video.callStream){
                    video.callStream.getTracks()[0].stop();
                }
                if(video.socket)
                    video.socket.close();
                if(video.pc)
                    video.pc.close();
            }
        },

        _sendCommand: function (cmdJson) {
            if (this.video.socket.readyState == 1)  { // socket处于OPEN(1)状态
                this.video.socket.send(JSON.stringify(cmdJson));
            } else {
                this.waitingCmd = cmdJson;
            }
        },

        /**
         * @Description: 实时播放
         **/
        realPlay: function (gbid) {
            if (gbid) this.deviceID = gbid;
            var json = {
                "account_token": "",
                "cmd_type": "live",
                "request_type": "start",
                "device_id": this.deviceID
            };
            this._initPeerConnection(this.video);
            this._initSocket(this.video,json);
            this.isPlaying = true;
            $("#" + this.windowID).closest(".kdvideo-window-wrapper").find("span.play").addClass("pause");
            $("#" + this.windowID).closest(".kdvideo-window-wrapper").find("span.play").attr("title","暂停");
        },

        /**
         * @Description: 停止播放
         */
        stopPlay: function() {
            if(this.isPlaying){
                $("#" + this.windowID).closest(".kdvideo-window-wrapper").find("span.play").removeClass("pause");
                $("#" + this.windowID).closest(".kdvideo-window-wrapper").find("span.play").attr("title","播放");
                this._disconnect(this.video);
                this.isPlaying = false;
            }
        },

        /**
         * @Description: 语音呼叫
         **/
        call:function () {
            var json = {
                "account_token": "",
                "cmd_type": "call",
                "request_type": "start"
            };
            this._initPeerConnection(this.phone);
            this._initSocket(this.phone,json);
            this.isCalling = true;
        },

        startCall:function () {
            var context = this;
            navigator.webkitGetUserMedia({
                "audio": true,
                "video": false
            }, function(stream){
                context.phone.callStream = stream;
                context.call();
            }, function(error){
                alert('语音呼叫失败\n' + error);
                console.log('startCall error: ' + error);
            });
        },

        /**
         * @Description: 断开语音
         **/
        endCall:function () {
            this._disconnect(this.phone);
            this.isCalling = false;
        },

        /**
         * @Description: 回放
         **/
        playHistory:function () {
            var context = this;
            context.videoTime = 0;  //上次的播放条时间
            var lastRealTime = 0; //上次的真实播放时间
            var duration = (new Date(context.dateTimeEnd) - new Date(context.dateTimeBegin))/1000;
            var playCtrl =  $("#"+this.windowID).closest(".kdvideo-window-wrapper").find(".playCtrl");
            var poleOn = $("#"+this.windowID).closest(".kdvideo-window-wrapper").find(".poleOn");
            var playPole = $("#"+this.windowID).closest(".kdvideo-window-wrapper").find(".playPole");
            context.playTime = 0;
            context.startTimer();
            $("#"+this.windowID).off('timeupdate');
            //控制条变化 播放
            $("#"+this.windowID).on('timeupdate', function(e) {
                if(context.isBack && (context.playTime > lastRealTime) && context.isPlaying){
                    var length = playPole.width();   //总长度(隐藏的时候为0)
                    if(playPole.width() != 0 ) context.poleLength = length;
                    var playTime = context.playTime;  //播放时间
                    var current = (playTime - lastRealTime) * context.rate + context.videoTime;
                    if(current >= duration){
                        current = duration;
                        context.stopTimer();
                        context._disconnect(context.video);
                        setTimeout(function () {
                            poleOn.width(0 + 'px');
                            playCtrl.css({left: 0 + 'px'});
                            if(context.isBack){
                                context.playHistory();
                                $("#"+context.windowID).closest(".kdvideo-window-wrapper").find(".rateVal").html(1);
                                context.rate = 1;
                            }
                        },1000)
                    }
                    var position = context.poleLength * current / duration;  //变化后的位置
                    context.percent = 100 * current / duration;
                    // var count = 0;
                    // var poleOnWidth = poleOn.width();    //先前的位置
                    // var changeTimer=setInterval(function(e){
                    //     var  realPosition = poleOn.width();    //实时的位置
                    //     count++;
                    //     var dynPosition = poleOnWidth + (position - poleOnWidth) * count /10;
                    //     if((position - realPosition) > 0 || (position - realPosition) < -5){
                    //         poleOn.width(dynPosition + 'px');
                    //         playCtrl.css({left: dynPosition + 'px'});
                    //     }
                    //     if(count===10) clearInterval(changeTimer);
                    // },30);
                    poleOn.width(position + 'px');
                    playCtrl.css({left: position + 'px'});
                    context.videoTime = current;
                    lastRealTime = playTime;
                }else if(!context.isBack){
                    poleOn.width(0 + '%');
                    playCtrl.css({left: 0 + 'px'});
                }
            });

            var json = {
                "account_token":"",
                "cmd_type": "playback",
                "request_type": "start",
                "device_id": this.deviceID,
                "start_time": this.dateTimeBegin,
                "end_time": this.dateTimeEnd
            };
            this._initPeerConnection(this.video);
            this._initSocket(this.video,json);
            this.isPlaying = true;
            $("#" + this.windowID).closest(".kdvideo-window-wrapper").find("span.resume").addClass("pause");
            $("#" + this.windowID).closest(".kdvideo-window-wrapper").find("span.resume").attr("title","暂停");
        },

        /**
         * @Description: 计时器
         **/
        startTimer:function () {
            var context = this;
            var duration = (new Date(context.dateTimeEnd) - new Date(context.dateTimeBegin))/1000;
            context.timer = setInterval(function () {
                context.playTime += 0.1;
                context.playTime =  Math.round(context.playTime * 100)/100;
                /**
                 * @Description: 防止视频播放少于规定时间的判断
                 **/
                // if((context.playTime - duration) > 1){
                //     clearInterval(context.timer);
                //     context._disconnect(context.video);
                //     if(context.isBack){
                //         context.playHistory();
                //     }
                // }
            },100);
        },

        stopTimer:function () {
            clearInterval(this.timer);
        },

        /**
         * @Description: 进度条调整(屏幕resize)
         **/
        adjustPole:function () {
            var window = $("#" + this.windowID);
            var leftWidth = window.closest(".kdvideo-window-wrapper").find(".leftBtn").width();  //左边按钮长度
            var rightWidth = window.closest(".kdvideo-window-wrapper").find(".rightBtn").width();   //右边按钮长度
            var controlsWidth = window.closest(".kdvideo-window-wrapper").find(".controls").width(); //控制栏总长度
            var playWidth = controlsWidth - leftWidth - rightWidth;
            window.closest(".kdvideo-window-wrapper").find(".progressBar").width(playWidth);

            var poleOn = window.closest(".kdvideo-window-wrapper").find(".poleOn");
            var playCtrl = window.closest(".kdvideo-window-wrapper").find(".playCtrl");
            // var playPoleWidth = window.closest(".kdvideo-window-wrapper").find(".playPole").width();
            var playPoleWidth = playWidth - 30;  //减去playPole的margin
            var position = this.percent * playPoleWidth /100;
            poleOn.width(position + 'px');
            playCtrl.css({left: position + 'px'});
        },

        /**
         * @Description: 回放控制
         * @param param 指定倍数 或者 相对时间
         * @param code  操作序号
         **/
        controlPlayHistory:function (code,param) {
                if(code != 8 && code != 9){
                    this.video.socket.send(JSON.stringify({
                        "account_token":"",
                        "cmd_type": "playback",
                        "request_type": "play_control",
                        "control_code":code
                    }))
                }else if(code == 8){
                    this.video.socket.send(JSON.stringify({
                        "account_token":"",
                        "cmd_type": "playback",
                        "request_type": "play_control",
                        "control_code": 8,
                        "scale" : param
                    }))
                }else if(code == 9){
                    this.video.socket.send(JSON.stringify({
                        "account_token":"",
                        "cmd_type": "playback",
                        "request_type": "play_control",
                        "control_code": 9,
                        "npt" : param
                    }))
                }
        },

        /**
         * @Description: PTZ控制
         **/
        controlPTZ:function (cmd,param,type) {
            var json = {};
            if(cmd != 51 && cmd != 52){
                 json = {
                    "account_token":"",
                    "cmd_type": "ptz",
                    "request_type": type,
                    "ptz_cmd":cmd,
                    "param":param,
                    "device_id": this.deviceID
                };
            }else {
                var width = $("#"+this.windowID).height(); // y
                var length = $("#"+this.windowID).width(); // x
                var zoomParam = {
                    "length":length,
                    "width":width,
                    "mid_point_x":length/2,
                    "mid_point_y":width/2,
                    "length_x":50,
                    "length_y":50
                };
                json = {
                        "account_token":"",
                        "cmd_type": "ptz",
                        "request_type": type,
                        "ptz_cmd":cmd,
                        "drag_zoom_param":zoomParam,
                        "device_id": this.deviceID
                };
            }
            this.video.socket.send(JSON.stringify(json));
        },

        /**
         * @Description: 录制
         * @param param: stop start
         **/
        record:function (param) {
            this.video.socket.send(JSON.stringify({
                "account_token":"",
                "cmd_type": "record",
                "request_type": param
            }))
        }
    }
});