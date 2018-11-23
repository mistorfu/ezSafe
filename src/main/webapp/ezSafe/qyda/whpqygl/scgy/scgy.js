define([], function () {
    function Scgy(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
    }

    Scgy.prototype = {
        _init: function () {

        },
        showData: function (data) {

        },
        clearData: function () {

        },
        resize: function () {

        }
    };

    return Scgy;
});