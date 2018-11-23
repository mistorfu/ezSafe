define([], function () {
    function Rcgl(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
    }

    Rcgl.prototype = {
        _init: function () {

        },
        showData: function (data) {

        },
        clearData: function () {

        },
        resize: function () {

        }
    };

    return Rcgl;
});