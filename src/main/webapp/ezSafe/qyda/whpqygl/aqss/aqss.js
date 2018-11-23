define([], function () {
    function Aqss(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
    }

    Aqss.prototype = {
        _init: function () {

        },
        showData: function (data) {

        },
        clearData: function () {

        },
        resize: function () {

        }
    };

    return Aqss;
});