define(["jquery"], function () {
    /**
     *  公用组件
     * @constructor
     */
    function CommonCPlugin(options) {
       this.pluginDomId = options["pluginDomId"] || "";
    }

    CommonCPlugin.prototype = {
        /**
         * 选择文件
         * @param filter 文件过滤filter, 例如：“Image Files(*.jpg *.png)”
         * @param isMultiple 是否多选
         * @returns {*}
         */
        selectOpenFile: function (filter, isMultiple) {
            return this.getPlugin().selectOpenFile(filter, isMultiple);
        },

        openLocalFile:function (filePath) {
            return this.getPlugin().openLocalFile(filePath);
        },

        getPlugin: function() {
            return document.getElementById(this.pluginDomId);
        },

        readCsvFile: function(filePath) {
            return this.getPlugin().readCsvFile(filePath);
        },

        selectDirectorys:function () {
            return this.getPlugin().selectDirectorys();
        },

        selectDirectory: function () {
            return this.getPlugin().selectDirectory();
        },

        getDirFiles:function (filePath) {
            return this.getPlugin().getDirFiles(filePath);
        },

        downloadUrl: function (fileUrl, filePath,isCover,isOpen) {
            return this.getPlugin().downloadUrl(fileUrl, filePath,isCover,isOpen);
        },

        selectSaveFile: function (empty, fileName) {
            return this.getPlugin().selectSaveFile(empty, fileName);
        },

        getFileSize: function (filePath) {
            return this.getPlugin().getFileSize(filePath);
        },

        openUrlFile:function (filePath,fileSuffix) {
            return this.getPlugin().openUrlFile(filePath,fileSuffix);
        }
    };
    return CommonCPlugin;
});