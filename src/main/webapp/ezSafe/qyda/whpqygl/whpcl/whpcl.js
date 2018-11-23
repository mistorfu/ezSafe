define([], function () {
    function Whpcl(options) {
        if (options) {
            for (var key in options) {
                this[key] = options[key];
            }
        }
        this._init();
    }

    Whpcl.prototype = {
        _init: function () {

        },
        showData: function (data) {

        },
        clearData: function () {

        },
        resize: function () {

        }
    };

    return Whpcl;
});