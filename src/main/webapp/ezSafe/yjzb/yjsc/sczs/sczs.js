define(['ezviewCommon'] , function(common) {
    var kendo = common.kendo,
        $ = common.jquery;

    function Sczs() {
        this.readOnly = $.getUrlParams().isReadOnly == 'true';
        this.restoreData = {};
        //方案当中固定的几个可选项
        this.zdx = [
            {text: '适用条件' , code: 'sytj'},
            {text: '应对措施' , code: 'ydcs'},
            {text: '防护措施' , code: 'fhcs'},
            {text: '注意事项' , code: 'zysx'},
            {text: '其他...' , code:'qt'}
        ];
        this.highLightCount = 0;
        this._bindEvent();
    }

    Sczs.prototype = {
        /**
         * 绑定点击事件
         * @private
         */
        _bindEvent: function() {
            var self = this;
            $(".sczs-container").on('click' , '.sczs-common-title' , function(e) {
                e.stopPropagation();
                self._openOrClose($(this) , false);
            }).on('click' , '.sczs-button-edit' , function(e) {
                e.stopPropagation();
                var id = $(this).parents('.sczs-common-title').attr('id').substr(7),
                    mark = $(this).parents('.sczs-common-wrapper').attr('mark');
                id = id.indexOf('-edit') > 0 ? id.substring(0 , id.indexOf('-edit')) : id;
                if (self.restoreData[id]) {
                    self.editEvent(self.restoreData[id] , mark);
                } else {
                    self._loadDetails(id ,mark , function(res) {
                        self.editEvent(res , mark);
                    })
                }
            }).on('click' , '.sczs-button-delete' , function(e) {
                e.stopPropagation();
                var id = $(this).parents('.sczs-common-title').attr('id').substr(7),
                    mark = $(this).parents('.sczs-common-wrapper').attr('mark');
                self.commonDelete(self.restoreUid[id]);
            }).on('click' , '.sczs-single-img-wrapper>.sczs-pic' , function() {
                var target = $(this).parent(),
                    id = target.attr('relate'),
                    title = '',
                    dataItem = self.restoreData[id],
                    index = target.parent().index(),
                    list = [];
                if (dataItem.ZSBH) {
                    list = dataItem['ZSFJ'];
                    title = dataItem['ZSBT'];
                } else if (dataItem.FABH) {
                    list = dataItem['FAFJ'];
                    title = dataItem['FAMC'];
                }
                if (typeof self.showPic == 'function') {
                    self.showPic(list , index , title);
                }
            }).on('click' , '.sczs-common-title[target=true] + .sczs-common-content' , function() {
                self._openOrClose($(this).siblings('.sczs-common-title') , true);
            }).on('click' ,'.sczs-single-zdx-state-true' , function() {
                self.addFirstFa(self.restoreFa , $(this).children().text() == '其他...' ? '' : $(this).children().text());
            }).on('mousewheel' , '.sczs-details-files-wrapper-wrapper' , function(e) {
                if ($(this).width() != $(this).children().width()) {
                    e.preventDefault();
                    var step = 100;
                    if (event.wheelDelta > 0 || event.deltaY < 0) {
                        this.scrollLeft -= step;
                    } else {
                        this.scrollLeft += step;
                    }
                }
            });
        },

        /**
         * 载入初始化
         * @param obj
         */
        init: function(obj) {
            var self = this,
                template = kendo.template($("#sczs-single-template").html()),
                zsk = obj[0].items,
                fa = obj[1].items;
            self.restoreData = {};
            self.restoreUid = {};
            self.restoreFa ={};
            $(".sczs-fa-edit-wrapper").hide();
            $(".sczs-display-wrapper").show().scrollTop(0);
            $("#sczs-zsk-container").html('');
            $('#sczs-fa-container').html('');
            //知识库
            zsk.sort(function(a , b) {
                return a.XSSX - b.XSSX;
            });
            for (var x = 0 ; x < zsk.length ; x++) {
                self._append(zsk[x] , 'zsd');
            }
            //应急方案
            self._recursiveInit(fa , true);
        },

        /**
         * 递归渲染
         * @param items
         * @param first
         * @param suffix
         * @private
         */
        _recursiveInit: function(items , first , suffix) {
            var self = this;
            if (items && items.length > 0) {
                items.sort(function(a , b) {
                    return a.XSSX - b.XSSX;
                });
                for (var x = 0 ; x < items.length ; x++) {
                    self._append(items[x] , 'fa' , first , suffix);
                    self._recursiveInit(items[x].items , false , suffix);
                }
            }
        },

        /**
         * 打开某元素的相邻content
         * @param $e 元素
         * @param alwaysOpen 只会打开，而且不用动画
         * @private
         */
        _openOrClose: function($e , alwaysOpen) {
            var $content = $e.siblings('.sczs-common-content'),
                self = this,
                id = $e.attr('id').substr(7),
                mark = $e.parents('.sczs-common-wrapper').attr('mark');
            if (!$e.hasClass('sczs-state-selected')) {
                $('.sczs-state-selected').removeClass('sczs-state-selected');
                $e.addClass('sczs-state-selected');
                self.select(self.restoreUid[id]);
            }
            if (alwaysOpen) {
                $e.find('.sczs-common-triangle').attr('state' , 'expand');
                if ($e.attr('target') != 'false') {
                    if (!$content.find('.sczs-main-content').html()) {
                        self._loadDetails(id , mark ,function() {
                            $content.stop(true , true).show();
                        })
                    } else {
                        $content.stop(true , true).show();
                    }
                } else {
                    $content.stop(true , true).show();
                }
                return;
            }
            if ($content.css('display') === 'none') {
                $e.find('.sczs-common-triangle').attr('state' , 'expand');
                if ($e.attr('target') != 'false') {
                    if (!$content.find('.sczs-main-content').html()) {
                        self._loadDetails(id , mark ,function() {
                            $content.stop(true , true).slideDown();
                        })
                    } else {
                        $content.stop(true , true).slideDown();
                    }
                } else {
                    $content.stop(true , true).slideDown();
                }
            } else {
                $e.find('.sczs-common-triangle').attr('state' , 'collapse');
                $content.stop(true , true).slideUp();
            }
        },

        /**
         * 定位
         * @param dataItem
         */
        locate: function(dataItem) {
            var self = this,
                id = dataItem.id,
                $target = $("#lockon-" + id),
                parents = $target.parents('.sczs-common-wrapper'),
                $container = $(".sczs-display-wrapper");
            $target.find('.sczs-title-text').attr('title' , dataItem.text).text(dataItem.text);
            self._changeRestoreData(dataItem);
            if ($target.length == 0) {
                //如果没有找到的，即为新增
                self.add(dataItem);
                if (dataItem.deep == 1 && dataItem.FABH) {
                    self._showBigFa(dataItem);
                }
                return;
            }
            else if (dataItem.deep == 1 && dataItem.FABH && !self.readOnly) {
                self._showBigFa(dataItem);
                return;
            }
            else if (dataItem.FABH && $container.css('display') == 'none' && $("#lockon-" + id + '-edit').length > 0) {
                $target = $("#lockon-" + id + '-edit');
                parents = $target.parents('.sczs-common-wrapper');
            } else {
                $(".sczs-fa-edit-wrapper").hide();
                $container.show();
            }
            $target.find('.sczs-title-text').attr('title' , dataItem.text).text(dataItem.text);
            if (parents.length == 0) {
                self._openOrClose($target , true);
            } else {
                $(parents.get().reverse()).each(function() {
                    self._openOrClose($(this).children('.sczs-common-title') , true);
                });
                var top = $(".sczs-common-title.sczs-state-selected").offset().top;
                top = $container.scrollTop() + top - $container.offset().top - 50;
                $container.stop().animate({scrollTop: top} , 1000 , 'swing');
            }
        },

        /**
         * 展示一级方案
         * @param faItem
         * @private
         */
        _showBigFa: function(faItem) {
            var self = this;
            $(".sczs-display-wrapper").hide();
            self._clearFaEdit();
            $(".sczs-fa-edit-wrapper").show();

            $(".sczs-fa-edit-title-text").html(faItem.text);
            self.restoreFa = faItem;
            var zdxList = [];
            for (x in self.zdx) {
                var flag = true;
                if (faItem.items) {
                    for (var y = 0 ; y < faItem.items.length ; y++) {
                        if (self.zdx[x].code != 'qt' && faItem.items[y].text == self.zdx[x].text) {
                            flag = false;
                            break;
                        }
                    }
                }
                zdxList.push({
                    state: flag,
                    text: self.zdx[x].text,
                    code: self.zdx[x].code
                })
            }
            $(".sczs-fa-edit-selection").html(kendo.template($("#zdx-template").html())(zdxList));
            //名称 什么的
            self._recursiveInit(faItem.items , false , '-edit');
        },

        /**
         * 清除原有的dom
         * @private
         */
        _clearFaEdit: function() {
            $(".sczs-fa-edit-title-text").html('');
            $(".sczs-fa-edit-selection").html('');
            $(".sczs-fa-edit-content").html('');
        },

        /**
         * 按需加载知识点/事项(方案)
         * @param id 编号
         * @param mark 'zsd' or 'fa' //知识点 或是 方案
         * @param callback 加载完成后执行的回调
         * @private
         */
        _loadDetails: function(id , mark , callback) {
            var self = this;
            if (id.indexOf('-edit') > 0) {
                id = id.substring(0 , id.indexOf('-edit'));
            }
            if (self.restoreData[id]) {
                self._setDetails(id , mark , self.restoreData[id]);
                if (callback && typeof callback == 'function') {
                    callback(self.restoreData[id]);
                }
            } else {
                $.ajax({
                    url: CONTEXT_PATH + '/api/yjzb/sczs/getDetails?r=' + Math.random(),
                    data:{id: id , mark: mark},
                    success: function(res){
                        self.restoreData[id] = res;
                        self._setDetails(id , mark , res);
                        if (callback && typeof callback == 'function') {
                            callback(res);
                        }
                    }
                })
            }
        },
        /**
         * 设置详细数据展示
         * @param id
         * @param mark
         * @param details
         * @private
         */
        _setDetails: function(id , mark , details) {
            var template = kendo.template($('#sczs-single-details').html()),
                data = {
                    text:'',
                    remark: '',
                    files: [],
                    id: id,
                    mark: mark
                };
            if (mark == 'zsd') {
                data = {
                    text: details['ZSNR'] || '',
                    remark: details['ZSBZ'] || '',
                    files: details['ZSFJ'] || [],
                    id: id,
                    mark: mark
                }
            } else if (mark == 'fa') {
                data = {
                    text: details['FANR'] || '',
                    remark: details['FABZ'] || '',
                    files: details['FAFJ'] || [],
                    id: id,
                    mark: mark
                }
            }
            data.files.sort(function(a , b) {
                return a['XSSX'] - b['XSSX'];
            });
            $("#lockon-" + id + ' + .sczs-common-content>.sczs-main-content').html(template(data));
            $("#lockon-" + id + '-edit + .sczs-common-content>.sczs-main-content').html(template(data));
        },

        /**
         * 删除
         * @param id
         */
        delete: function(id) {
            var self = this;
            if (self.restoreData[id]) {
                delete self.restoreData[id];
            }
            $("#lockon-" + id).parent().remove();
            $("#lockon-" + id + '-edit').parent().remove();
        },

        /**
         * 新增
         * @param dataItem
         */
        add: function(dataItem) {
            var self = this;
            //知识点
            if (dataItem.ZSBH) {
                self._append(dataItem , 'zsd');
            }
            //方案
            else if (dataItem.FABH && dataItem.deep == 1)  { //一级方案
                self._append(dataItem , 'fa' , true);
            }
            else { //二级方案
                self._append(dataItem , 'fa' , false);
                self._append(dataItem , 'fa' , false , '-edit');
            }
        },

        /**
         * 页面添加到content最后
         * @param dataItem 具体数据
         * @param mark 记号 zsd=知识点,fa=方案
         * @param first
         * @param suffix
         * @private
         */
        _append: function(dataItem , mark , first , suffix) {
            var self = this,
                template = kendo.template($("#sczs-single-template").html()),
                item = {
                    id: dataItem['id'] + (suffix || ''),
                    name: dataItem['text'],
                    mark: mark,
                    readOnly: self.readOnly,
                    target: true
                };

            if (mark == 'zsd') { //应急知识
                $("#sczs-zsk-container").append(template(item));
            }
            else if (first) { //事故处置方案 第一次进入
                item.target = false;
                item.readOnly = true;
                $("#sczs-fa-container").append(template(item));

            }
            else {
                var fatherId = dataItem.NBBM.split('.');
                fatherId = fatherId[fatherId.length - 2] + (suffix || '');
                $("#lockon-" + fatherId + ' + .sczs-common-content>.sczs-children-content').append(template(item));
                if (suffix && dataItem.deep == 2) {
                    $("#sczs-fa-edit-content").append(template(item));
                }
            }

            self.restoreUid[item.id] = dataItem.uid;
            if (!suffix) {
                self.restoreData[dataItem.id] = self._renderDataItem(dataItem);
            }
        },

        /**
         * 修改
         * @param dataItem
         */
        modify: function(dataItem) {
            var self = this;
            if (dataItem.ZSBH || dataItem.FABH) {  //知识点 or 方案
                var mark = 'fa',
                    id = dataItem.FABH,
                    text = dataItem.FAMC;
                if (dataItem.ZSBH) {
                    mark = 'zsd';
                    id = dataItem.ZSBH;
                    text = dataItem.ZSBT;
                }
                if (self.restoreData[id]) {
                    self.restoreData[id] = dataItem;
                    self._loadDetails(id , mark);
                }
                $('#lockon-' + id + ' .sczs-title-text').attr('title' , text).text(text);
                $('#lockon-' + id + '-edit .sczs-title-text').attr('title' , text).text(text);
                self.modifyFa(self.restoreUid[id] , text , true);
            }
            else if (dataItem.id) {
                $('#lockon-' + dataItem.id + ' .sczs-title-text').attr('title' , dataItem.text).text(dataItem.text);
            }
        },

        /**
         * 判断已有字典项
         * @param textList
         * @returns {number}
         */
        checkObject: function(textList) {
            var self = this;
            $(".sczs-single-zdx-state-false").removeClass('sczs-single-zdx-state-false')
                .addClass('sczs-single-zdx-state-true');
            for (y in textList) {
                var text = textList[y];
                for (x in self.zdx) {
                    if (self.zdx[x].code != 'qt') {
                        if (self.zdx[x].text == text) {
                            $(".sczs-zdx-code-" + self.zdx[x].code)
                                .removeClass("sczs-single-zdx-state-true")
                                .addClass("sczs-single-zdx-state-false");
                            break;
                        }
                    }
                }
            }
            return -1;
        },

        /**
         * 上移元素
         * @param dataItem 被上移的元素
         */
        changePosition: function(dataItem) {
            var $target = $("#lockon-" + dataItem.id).parent(),
                $target2 = $("#lockon-" + dataItem.id + '-edit').parent();
            $target.insertBefore($target.prev());
            $target2.insertBefore($target2.prev());
        },

        /**
         * 高亮搜索
         * @param itemList
         * @param text
         */
        search: function(itemList , text) {
            var self = this,
                newText = "<span class='sczs-highLight'>$&</span>",
                reg = new RegExp(text , 'gi');
            self.clearHighLight();
            if (!text) return ;
            self.restoreSearch = text;
            for (var x = 0 ; x < itemList.length ; x++) {
                var children = $("#lockon-" + itemList[x].id),
                    parents = children.parents('.sczs-common-wrapper');
                if (parents.length > 0) {
                    $(parents.get().reverse()).each(function() {
                        self._openOrClose($(this).children('.sczs-common-title') , true);
                    });
                } else {
                    self._openOrClose(children , true);
                }

                var $container = children.parent(),
                    container1 = $container.find('.sczs-title-text').eq(0),
                    container2 = $container.find('.sczs-details-main-text').eq(0),
                    container3 = $container.find('.sczs-details-remarks').eq(0);

                container1.html(container1.html().replace(reg , newText));
                if (container2.length > 0) {
                    container2.html(container2.html().replace(reg , newText));
                }
                if (container3.length > 0) {
                    container3.html(container3.html().replace(reg , newText));
                }
            }
            self.highLightCount = 0;
            self.jumpToHighLight();
        },

        /**
         * 清除高亮
         */
        clearHighLight: function() {
            var self = this,
                $container = $(".sczs-display-wrapper"),
                allHtml = $container.html(),
                text1 = '<span class="sczs-highLight( sczs-highLight-focus)?">' + self.restoreSearch + '</span>',
                reg = new RegExp(text1 , 'gi');
            $(".sczs-fa-edit-wrapper").hide();
            $container.html(allHtml.replace(reg , function(x) {
                return x.substr(x.indexOf(">") + 1 , self.restoreSearch.length);
            })).show();
        },

        /**
         * 跳转到高亮位置
         */
        jumpToHighLight: function() {
            var self = this,
                $container = $(".sczs-display-wrapper"),
                $highLights = $(".sczs-highLight");
            if ($highLights.length < 1) return;
            $(".sczs-highLight-focus").removeClass('sczs-highLight-focus');
            var $target = $highLights.eq(self.highLightCount),
                top = $target.addClass('sczs-highLight-focus').offset().top;
            top = $container.scrollTop() + top - $container.offset().top - 50;
            $container.stop().animate({scrollTop: top} , 100 , 'swing');
            self.highLightCount = self.highLightCount == ($highLights.length - 1) ? 0 : self.highLightCount + 1;

            var id = $target.parents('.sczs-common-wrapper').eq(0)
                .children('.sczs-common-title').attr('id').substr(7);
            if (self.restoreUid[id]) {
                self.select(self.restoreUid[id])
            }
        },

        /**
         * 渲染dataItem 去除不要的属性
         * @param dataItem
         * @returns {*}
         * @private
         */
        _renderDataItem: function(dataItem) {
            dataItem = JSON.parse(JSON.stringify(dataItem));
            delete dataItem.id;
            delete dataItem.items;
            delete dataItem.text;
            delete dataItem.DXLB;
            delete dataItem.index;
            delete dataItem.img;
            delete dataItem.deep;
            delete dataItem.DXBH;
            delete dataItem.uid;
            if (dataItem.ZSBH) {
                delete dataItem.XSSX;
            }
            return dataItem;
        },

        /**
         * 更新restoreData里的标题
         * @param dataItem
         * @private
         */
        _changeRestoreData: function(dataItem) {
            var self = this,
                id = dataItem.id,
                text = dataItem.text;
            if (self.restoreData[id]) {
                if (self.restoreData[id]['FAMC']) {
                    if (text != self.restoreData[id]['FAMC']) {
                        self.restoreData[id]['FAMC'] = text;
                    }
                } else if (self.restoreData[id]['ZSBT']) {
                    if (text != self.restoreData[id]['ZSBT']) {
                        self.restoreData[id]['ZSBT'] = text;
                    }
                }
            } else {
                self.restoreData[id] = self._renderDataItem(dataItem);
            }
        },


        //以下是回调
        /******************************************************/

        /**
         * 展示图片的回调
         * @param list 图片list
         * @param index 当前图片index
         * @param title 知识点或事项标题
         */
        showPic: function(list , index , title) {
        },

        /**
         * 修改方案的回调
         * @param uid 修改所在数据的左边树的uid
         * @param val 修改后的方案名称
         * @param flag  true=更新数据库,false=不更新改数据库
         */
        modifyFa: function(uid , val , flag) {
        },

        /**
         * 点击编辑按钮的弹出编辑框事件
         * @param dataItem
         * @param mark zsd=知识点、fa=方案
         */
        editEvent: function(dataItem , mark) {
        },

        /**
         * 选择一个节点的回调
         * @param uid 节点uid
         */
        select: function(uid) {
        },

        /**
         * 删除节点的回调
         * @param uid
         */
        commonDelete: function(uid) {
        },

        /**
         * 添加方案下的措施（适用条件、应对措施...etc）
         * @param dataItem
         * @param text
         */
        addFirstFa: function(dataItem , text) {
        }

    };

    return Sczs;
});