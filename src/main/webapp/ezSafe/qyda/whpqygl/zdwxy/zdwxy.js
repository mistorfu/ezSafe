define([], function () {
    function Zdwxy(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
    }

    Zdwxy.prototype = {
        _init: function () {

        },
        showData: function (data) {

        },
        clearData: function () {

        },
        resize: function () {

        }
    };

    return Zdwxy;
});