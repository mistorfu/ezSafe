define(["jquery"], function () {
    function CanvasTools(obj) {
        var $ele = $("#" + obj.id);
        this.$canvas = $ele;
        if (obj.css) {
            $ele.css(obj.css)
        }
        if (obj.height) {
            $ele[0].height = obj.height;
        }
        if (obj.width) {
            $ele[0].width = obj.width;
        }
    }

    CanvasTools.prototype = {
        drawLine: function (points, lineWidth, color, speed,firstArcRadius,callback) {
            var canvas = this.$canvas[0];
            var context = canvas.getContext('2d');
            if (typeof(arguments[arguments.length - 1]) == "function") {
                callback = (arguments[arguments.length - 1]);
            }
            typeof (lineWidth) == "number" ? lineWidth = lineWidth : lineWidth = 2;
            typeof (color) == "string" ? color = color : color = "#FCDC08";
            typeof (speed) == "number" ? speed = speed : speed = 20;
            typeof (firstArcRadius) == "number" ? firstArcRadius = firstArcRadius : firstArcRadius = 10;
            if (this.animateLineTime) {
                for (var x = 0; x < this.animateLineTime.length; x++) {
                    clearInterval(this.animateLineTime[x]);
                }
            }
            this.animateLineTime=[];
            context.beginPath();
            context.moveTo(points[0][0], points[0][1]);
            context.lineWidth = lineWidth;
            context.strokeStyle = color;
            context.fillStyle = color;
            context.shadowBlur = 20;
            context.shadowColor = "rgba(255,255,255,1)";
            context.save();
            context.beginPath();
            var grad = context.createRadialGradient(points[0][0], points[0][1], 0, points[0][0], points[0][1], firstArcRadius);
            var gradColor = HexToRgb(color);
            context.fillStyle = "rgba(" + gradChange(gradColor[0], 0.9) + "," + gradChange(gradColor[1], 0.9) + "," + gradChange(gradColor[2], 0.9) + "," + 0.3 + ")";
            context.arc(points[0][0], points[0][1], firstArcRadius + 5, 0, Math.PI * 2, true);
            context.fill();
            context.beginPath();
            grad.addColorStop(1, "rgb(" + gradChange(gradColor[0], 0.95) + "," + gradChange(gradColor[1], 0.95) + "," + gradChange(gradColor[2], 0.95) + ")");
            grad.addColorStop(0.3, "rgb(" + gradChange(gradColor[0],1.1) + "," + gradChange(gradColor[1],1.1) + "," + gradChange(gradColor[2],1.1) + ")");
            context.fillStyle = grad;
            context.arc(points[0][0], points[0][1], firstArcRadius, 0, Math.PI * 2, true);
            context.fill();
            context.restore();
            context.beginPath();
            context.moveTo(points[0][0], points[0][1]);
            animateLineTo(points, 1, context, canvas, speed,this.animateLineTime, function () {
                context.beginPath();
                context.arc(points[points.length - 1][0], points[points.length - 1][1], 6, 0, Math.PI * 2, true);
                context.fill();
                if (callback) {
                    callback();
                }
            });
        },

        clear: function () {
            var canvas = this.$canvas[0];
            var context = canvas.getContext('2d');
            if (this.animateLineTime) {
                for (var x = 0; x < this.animateLineTime.length; x++) {
                    clearInterval(this.animateLineTime[x]);
                }
            }
            this.animateLineTime=[];
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    };


    function animateLineTo(points, i, context, canvas, d, timeId, callback) {
        var k, time, stepX, stepY;
        if (i < points.length) {
            var x1 = points[i][0], x0 = points[i - 1][0], y1 = points[i][1], y0 = points[i - 1][1];
            if (x1 == x0 || y1 == y0) {
                x1 == x0 ? stepX = 0 : x0 >= x1 ? stepX = -d : stepX = d;
                y1 == y0 ? stepY = 0 : y0 >= y1 ? stepY = -d : stepY = d;
            } else {
                k = Math.abs((y1 - y0) / (x1 - x0));
                x0 >= x1 ? stepX = -d : stepX = d;
                y0 >= y1 ? stepY = -d * k : stepY = d * k;
            }
            time = setInterval(function () {
                context.beginPath();
                context.moveTo(x0,y0);
                context.lineTo(x0 += stepX, y0 += stepY);
                context.stroke();
                if (Math.abs(x0 - x1) < d && Math.abs(y0 - y1) < d && time) {
                    context.lineTo(x1, y1);
                    context.stroke();
                    if (i == points.length - 1) {
                        callback();
                    }
                    clearInterval(time);
                    if (i < points.length) {
                        animateLineTo(points, i + 1, context, canvas, d, timeId, callback);
                    }
                }
            }, 10);
            timeId.push(time);
        }
    }

    function HexToRgb(color) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = color.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return sColor;
        }
    };

    function gradChange(color, k) {
        color = color * k > 255 ? 255 : Math.ceil(color * k);
        return color;
    }

    return CanvasTools;

});
