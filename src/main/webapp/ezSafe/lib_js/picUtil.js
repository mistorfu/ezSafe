define(['jquery'], function () {
    var imgDom = "<img draggable='false' class='x-common-pic' style='cursor:move;position: relative;max-height:none;max-width:none;'>";
    var DEFAULT_IMG = CONTEXT_PATH + '/ezSafe/images/common-zwtp.png';

    $.fn.extend({
        setImg: function (img) {
            var e = $(this);
            if (e.css("display") == "flex") {
                e.css("display", "block");
            }
            if (e.css('background-color') == 'rgba(0, 0, 0, 0)') {
                e.css('background-color', 'transparent');
            }
            var domHeight = e.height(),
                domWidth = e.width();
            if (e.attr("pic-container") == null) {
                var randomId = new Date().getTime();
                e.attr("pic-container", randomId).html(imgDom);
                picControl(randomId);
                e.addClass('x-img-wrapper');
            }
            else {
                if (e.children("img").length === 0) {
                    e.html(imgDom);
                }
            }

            e.css({
                'position': 'relative',
                'overflow': 'hidden',
                'text-align': 'unset'
            });

            var imgEle = e.children("img").attr("src", img),
                startTime = new Date().getTime(),
                picOnload = setInterval(renderImg, 50);

            function renderImg() {
                domHeight = e.height();
                domWidth = e.width();
                if (imgEle[0] && imgEle[0].naturalHeight) {
                    clearInterval(picOnload);
                    var picEle = imgEle[0],
                        height = picEle.naturalHeight,
                        width = picEle.naturalWidth,
                        alterTop = (domHeight - height) / 2,
                        alterLeft = (domWidth - width) / 2,
                        zoom = "100%";
                    if (width > domWidth || height > domHeight) {
                        if ((width / height) > (domWidth / domHeight)) {
                            zoom = 100 * domWidth / width + "%";
                            alterLeft = 0;
                            if (window.navigator.userAgent.indexOf("Chrome") < 0) {
                                alterTop = (domHeight - (domWidth / width) * height) / 2;
                            } else {
                                alterTop = (domHeight * (width / domWidth) - height) / 2;
                            }
                        } else {
                            zoom = 100 * domHeight / height + "%";
                            alterTop = 0;
                            if (window.navigator.userAgent.indexOf("Chrome") < 0) {
                                alterLeft = (domWidth - (domHeight / height) * width) / 2;
                            } else {
                                alterLeft = (domWidth * (height / domHeight) - width) / 2;
                            }
                        }
                    }
                    $(picEle).css({
                        "width": width,
                        "height": height,
                        "left": alterLeft,
                        "top": alterTop,
                        "zoom": zoom
                    });
                } else {
                    if (new Date().getTime() - startTime > 10000) {
                        startTime = new Date().getTime();
                        if (e.children("img").length === 0) {
                            e.html(imgDom);
                        }
                        imgEle = e.children("img").attr('src', DEFAULT_IMG);
                    }
                }
            }

            var returnObject = {
                reset: renderImg
            }
            return returnObject;
        }
    });

    function picControl(randomId) {
        var filter = "[pic-container= " + randomId + "]" + " .x-common-pic";
        $(document.body)
            .on("mousewheel", filter, function (e) {
                var zoom = this.style.zoom.split("%")[0] || 100,
                    positionX = $(this).css("left").replace("px", ""),  //图片的左位置
                    positionY = $(this).css("top").replace("px", ""),  //图片的上位置
                    relX = e.pageX - $(this).offset().left * (zoom / 100), // 鼠标相较图片左边的距离
                    relY = e.pageY - $(this).offset().top * (zoom / 100), // 鼠标相较图片上边的距离
                    deltaZoom = event.wheelDelta || -event.deltaY / 2,
                    zoom2 = zoom * (1 + deltaZoom / 1000); //一次滚轮的缩放倍数
                if ((deltaZoom < 0 && zoom2 >= 10) || (deltaZoom > 0 && zoom2 <= 1000)) {      //缩放最小值 10% 最大值1000%
                    this.style.zoom = zoom2 + '%';
                    if (window.navigator.userAgent.indexOf("Chrome") < 0) {
                        relX = (e.pageX - $(this).offset().left) * (zoom2 - zoom) / zoom;
                        relY = (e.pageY - $(this).offset().top) * (zoom2 - zoom) / zoom;
                    } else {
                        positionX *= zoom / zoom2;  //图片相对图片的左上角来缩放
                        positionY *= zoom / zoom2;

                        relX *= 100 / zoom - 100 / zoom2;
                        relY *= 100 / zoom - 100 / zoom2;
                    }
                    positionY -= relY; //相对于鼠标在图片的位置来调整图片的位置 使图片相对鼠标缩放
                    positionX -= relX;
                    $(this).css("left", positionX + "px").css("top", positionY + "px");
                }
                e.preventDefault();
            })
            .on("mousedown", filter, function (e) {
                var mouseDownPosiX = e.pageX,
                    mouseDownPosiY = e.pageY,
                    InitPositionX = $(this).css("left").replace("px", ""),
                    InitPositionY = $(this).css("top").replace("px", "");

                $(this).mousemove(function (e) {
                    e.preventDefault();
                    var tempX = parseInt(e.pageX) - parseInt(mouseDownPosiX),
                        tempY = parseInt(e.pageY) - parseInt(mouseDownPosiY),
                        picZoom = parseInt(this.style.zoom, 10) || 100;
                    if (window.navigator.userAgent.indexOf("Chrome") < 0) { //若是IE，则不需要zoom倍数
                        picZoom = 1;
                    } else {
                        picZoom = 100 / picZoom;
                    }

                    tempX = tempX * picZoom + parseInt(InitPositionX);
                    tempY = tempY * picZoom + parseInt(InitPositionY);

                    $(this).css("left", tempX + "px").css("top", tempY + "px");

                });

            })
            .on("mouseup", filter, function () {
                $(this).unbind("mousemove");
            })
            .on("mouseleave", filter, function () {
                $(this).unbind("mousemove");
            })
            .on('dblclick', filter, function () {
                var ele = $(this).parent()[0],
                    requestMethod = ele.requestFullscreen || ele.webkitRequestFullscreen || ele.msRequestFullscreen || ele.mozRequestFullScreen,
                    exitMethod = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen,
                    isFullscreen = document.webkitFullscreenElement || document.fullscreenElement || document.msFullscreenElement;
                if (isFullscreen) {
                    if (exitMethod) {
                        exitMethod.call(document);
                    }
                } else {
                    if (requestMethod) {
                        requestMethod.call(ele);
                    }
                }
            })
            //Chrome
            .on('fullscreenchange webkitfullscreenchange', "[pic-container=" + randomId + "]", function () {
                var isFullscreen = document.webkitFullscreenElement || document.fullscreenElement || document.msFullscreenElement,
                    that = this;
                if (isFullscreen) {
                    //send fullscreen request msg
                    window.sendMsgInfo('SetFullScreen');
                } else {
                    //send fullscrenn exit msg
                    window.sendMsgInfo('ExitFullScreen');
                }
                setTimeout(function () {
                    $(that).setImg($(that).children('img').attr('src'));
                }, 50);

            });
        //IE11
        $(document).on('MSFullscreenChange', function () {
            var that = $("[pic-container=" + randomId + "]"),
                isFullscreen = document.webkitFullscreenElement || document.fullscreenElement || document.msFullscreenElement;
            if (isFullscreen) {
                //send fullscreen request msg
                window.sendMsgInfo('SetFullScreen');
            } else {
                //send fullscrenn exit msg
                window.sendMsgInfo('ExitFullScreen');
            }
            if (that.length > 0) {
                setTimeout(function () {
                    $(that).setImg($(that).children('img').attr('src'));
                }, 50);
            }

        })

    }

});