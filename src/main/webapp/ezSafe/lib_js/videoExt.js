define(['jquery'], function () {
    $.fn.extend({
        setVideo: function (obj) {
            $(this).each(function () {
                obj.id = $.getUuid();
                obj.ele = $(this);
                VideoInit(obj);
                $(this).data("fsVideo", fsVideo(obj));
            })
        }
    });

    function VideoInit(obj) {
        obj.ele.html("");
        obj.ele.append('<div class="fs-video-container" id="video-' + obj.id + '">' +
            '<div class="fs-video-zoom">' +
            '<video class="fs-video" src="' + obj.src + '"></video>' +
            '</div>' +
            '<div class="fs-video-controls">' +
            '<div class="fs-controls-left">' +
            '<div class="play fs-play-pause"></div>' +
            '<input type="range" class="fs-seek-bar" value="0">' +
            '<div class="fs-video-time">00:00/00:00</div>' +
            '</div>' +
            '<div class="fs-controls-right">' +
            '<div class="rotate fs-left-rotate"></div>' +
            '<div  class="rotate fs-right-rotate"></div>' +
            '<div class="yl fs-mute"></div>' +
            '<input type="range" class="fs-volume-bar" value="100">' +
            '<div class="fs-full-screen"></div>' +
            '<div style="height:100%"></div>' +
            '</div>' +
            '</div>' +
            '</div>');

        var video = $("#video-" + obj.id + " .fs-video")[0];
        var $video = $("#video-" + obj.id + " .fs-video");
        var outDiv = $("#video-" + obj.id + " .fs-video-zoom");

        var playButton = $("#video-" + obj.id + " .fs-play-pause");
        var muteButton = $("#video-" + obj.id + " .fs-mute");
        var fullScreenButton = $("#video-" + obj.id + " .fs-full-screen");
        var rotateLeft = $("#video-" + obj.id + " .fs-left-rotate");
        var rotateRight = $("#video-" + obj.id + " .fs-right-rotate");
        var timeTool = $("#video-" + obj.id + " .fs-video-time");

        var rotateNum = 0;

        var seekBar = $("#video-" + obj.id + " .fs-seek-bar");
        var volumeBar = $("#video-" + obj.id + " .fs-volume-bar");


        /**
         * 视频加载完成
         * **/
        video.addEventListener("loadedmetadata", function () {
            resetVideo(video.videoWidth, video.videoHeight, outDiv.width(), outDiv.height(), $video, 0);
            var time = formatTime(parseInt(video.currentTime)) + "/" + formatTime(parseInt(video.duration));
            timeTool.html(time);
            volumeBar.css('background', 'linear-gradient(90deg,#4FA6E5 ' + 100 + '%,white 0%)');
            if (obj.autoPlay) {
                playButton.click()
            }
        });

        /**
         * 视频播放结束
         * **/
        video.addEventListener("ended", function () {
            playButton.removeClass("play pause");
            playButton.addClass("play");
        });

        /**
         * 播放
         * **/
        playButton.click(function () {
            playButton.removeClass("play pause");
            if (video.paused == true) {
                video.play();
                playButton.addClass("pause");
            } else {
                video.pause();
                playButton.addClass("play");
            }
        });


        /**
         * 静音
         * **/
        muteButton.click(function () {
            muteButton.removeClass("yl jy");
            if (video.muted == false) {
                video.muted = true;
                muteButton.addClass("jy");
            } else {
                video.muted = false;
                muteButton.addClass("yl");
            }
        });


        /**
         * 全屏
         * **/
        fullScreenButton.click(function () {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        });


        /**
         * 进度条
         * **/
        seekBar[0].addEventListener("change", function () {
            var time = video.duration * (seekBar[0].value / 100);
            video.currentTime = time;
        });

        $("#video-" + obj.id + " .fs-video-controls input").on('input propertychange', function () {
            $(this).css('background', 'linear-gradient(90deg,#4FA6E5 ' + $(this).val() + '%,white 0%)');
        });

        /**
         * 旋转（左）
         * **/
        rotateLeft.click(function () {
            var rotateDgree = (--rotateNum) * 90;
            if (rotateNum % 2 == 0) {
                rotateVideo(video.videoWidth, video.videoHeight, outDiv.width(), outDiv.height(), $video, rotateDgree);
            } else {
                rotateVideo(video.videoHeight, video.videoWidth, outDiv.width(), outDiv.height(), $video, rotateDgree);
            }
        });

        /**
         * 旋转（右）
         * **/
        rotateRight.click(function () {
            var rotateDgree = (++rotateNum) * 90;
            if (rotateNum % 2 == 0) {
                rotateVideo(video.videoWidth, video.videoHeight, outDiv.width(), outDiv.height(), $video, rotateDgree);
            } else {
                rotateVideo(video.videoHeight, video.videoWidth, outDiv.width(), outDiv.height(), $video, rotateDgree);
            }
        });

        /**
         * 播放时间
         * **/
        video.addEventListener("timeupdate", function () {
            var value = (100 / video.duration) * video.currentTime;
            var time = formatTime(parseInt(video.currentTime)) + "/" + formatTime(parseInt(video.duration));
            timeTool.html(time);
            seekBar[0].value = value;
            seekBar.css('background', 'linear-gradient(90deg,#4FA6E5 ' + value + '%,white 0%)');
        });


        /**
         * 音量
         * **/
        volumeBar[0].addEventListener("change", function () {
            video.volume = volumeBar[0].value / 100;
        });
    }

    function fsVideo(obj) {
        var video = $("#video-" + obj.id + " .fs-video")[0];
        return {
            setVideo: function (src) {
                video.src = src;
            },
            destroyVideo: function () {
                obj.ele.html("");
            }
        }
    }

    function resetVideo(width, height, Outwidth, OutHeight, $video, rotate) {
        var scale = 1;
        var left = (Outwidth - width) / 2;
        var top = (OutHeight - height) / 2;
        if (OutHeight / Outwidth >= height / width) {
            scale = Outwidth / width;
        } else {
            scale = OutHeight / height
        }
        $video.css({
            "left": left,
            "top": top,
            "transform": "scale(" + scale + ") rotate(" + rotate + "deg)"
        });
    }

    function rotateVideo(width, height, Outwidth, OutHeight, $video, rotate) {
        var scale = 1;
        if (OutHeight / Outwidth >= height / width) {
            scale = Outwidth / width;
        } else {
            scale = OutHeight / height
        }
        $video.css({
            "transform": "scale(" + scale + ") rotate(" + rotate + "deg)"
        });
    }

    function formatTime(seconds) {
        var min = Math.floor(seconds / 60),
            second = seconds % 60,
            hour, newMin, time;

        if (min > 60) {
            hour = Math.floor(min / 60);
            newMin = min % 60;
        }

        if (second < 10) {
            second = '0' + second;
        }
        if (min < 10) {
            min = '0' + min;
        }

        return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
    }
});