/**
 *  @author wuhaidong
 *
 *  @date  2013/11/26
 *
 *  @desc  pagination 列表加分页插件
 *
 */

(function ($) {

    var PAGER_NAME = 'pagination';

    var Pagination = {

        opts: {
            url: window.location.href,
            type: 'GET',
            data: null,
            postData: {},
            dataType: 'json',
            submit: function (postData, callback) {
                var me = this,
                    postData = $.extend({}, this.postData, postData), url = this.url;

                me.onLoadingBegin(url, postData);
                $.ajax({
                    url: url,
                    type: this.type,
                    cache: false,
                    data: postData,
                    dataType: this.dataType,
                    success: function (data) {
                        me.onLoadingEnd();
                        me.data = data.data;
                        me.render(data.data);
                        (typeof(callback) == 'function') && callback();
                    }
                });
            },
            onLoadingBegin: function () {
                this.disabled = true;
            },
            onLoadingEnd: function () {
                this.disabled = false;
            },
            render: function (data) {
                Pagination.renderPageInfo(this.$page, this);
                this.perDropdown && Pagination.refreshPagePer(this.$page, data.pager);
                this.fillContent(data);
            },
            fillContent: function (data) {
            },
            pageSetting: {
                // 当前页的最大紧邻前置页数（不包括最前面的显示页数）
                prepose: 2,
                // 当前页的最大紧邻后置页数
                postpose: 2,
                // 第一个"..."前显示的页数
                first: 2,
                // 第二个"..."后显示的页数
                last: 1
            }
        },

        _attachPagination: function (target, options) {
            var opts = this._newOpts(target, options);
            this.render(opts);

            if (opts.data)
                opts.render();
            else
                opts.submit();
        },

        _newOpts: function (target, options) {
            var opts = $.extend({}, this.opts, options);
            (typeof(opts.$page) == 'undefined') && (opts.$page = $(target).find('.page'));

            $.data(target, PAGER_NAME, opts);
            return opts;
        },

        _getOpts: function (target) {
            return $.data(target, PAGER_NAME);
        },

        render: function (opts) {
            opts.$page.html('<span class="page-info"></span>');
            this.renderGoto(opts);
            this.events(opts);
            opts.onRender && opts.onRender();
        },

        renderPageInfo: function ($page, opts) {
            var i, pagerHtml = '', pager = opts.data.pager, setting = opts.pageSetting, $p = $page.children().first();

            pagerHtml += '<span class="prev"><i></i>上一页</span>';
            pagerHtml += '<ul class="page-list">';

            // 当前页的前的页码展示
            if (pager.cur <= setting.first + setting.prepose + 1) {
                for (i = 1; i < pager.cur; i++) {
                    pagerHtml += this._renderActivePage(i);
                }
            } else {
                for (i = 1; i <= setting.first; i++) {
                    pagerHtml += this._renderActivePage(i);
                }
                (setting.first > 0) && (pagerHtml += '<li class="pagination-break">...</li>');
                for (i = pager.cur - setting.prepose; i <= pager.cur - 1; i++) {
                    pagerHtml += this._renderActivePage(i);
                }
            }

            // 当前页的页码展示
            pagerHtml += this._renderActivePage(pager.cur, 'cur');

            // 当前页的后的页码展示
            if (pager.cur >= pager.allPages - setting.last - setting.postpose) {
                for (i = pager.cur + 1; i <= pager.allPages; i++) {
                    pagerHtml += this._renderActivePage(i);
                }

            } else {
                for (i = pager.cur + 1; i <= pager.cur + setting.postpose; i++) {
                    pagerHtml += this._renderActivePage(i);
                }
                (setting.last > 0) && (pagerHtml += '<li class="pagination-break">...</li>');
                for (i = pager.allPages - setting.last + 1; i <= pager.allPages; i++) {
                    pagerHtml += this._renderActivePage(i);
                }
            }

            pagerHtml += '</ul>';
            pagerHtml += '<span class="next">下一页<i></i></span>';
            pagerHtml += '<span class="page-sum">共' + pager.allPages + '页</span>';

            $p.html(pagerHtml);

            (pager.cur < 2) && $p.find('.prev').addClass('prev-disabled');
            (pager.cur > pager.allPages - 1) && $p.find('.next').addClass('next-disabled');
        },

        _renderActivePage: function (i, className) {
            return '<li class="num' + (i < 10 ? ' min' : '') + (className ? ' ' + className : '') + '" data-page="' + i + '">' + i + '</li>';
        },

        refreshPagePer: function ($page, pager) {
            $.fn.dropdown && $page.find('.pager-dropdown').dropdown('value', pager.per, false);
        },

        renderGoto: function (opts) {
            var $page = opts.$page,
                me = this, $input,
                $gotoWrap = $('<span class="page-go">跳转<input type="text">页</span>').appendTo($page),
                $btn = $('<a class="page-btn">GO</a>').appendTo($page);

            $input = $gotoWrap.find('input');

            $input.on('keypress', function (event) {
                var code = event.which;
                if (code == 13) {
                    $btn.trigger('click');
                    return false;
                }
                return (code >= 48 && code <= 57) || (code == 46 || code == 8 || code == 0);
            });

            $btn.on('click', function () {
                var page = $input.val();
                if (page != '') me.goTo(opts, page);
                $input.val('');
            });
        },

        events: function (opts) {
            var me = this,
                p = opts.$page;

            p.on('click', '.num', function () {
                if ($(this).hasClass('cur') || opts.disabled) return;
                me.goTo(opts, $(this).attr('data-page'));
            });

            p.on('mouseenter mouseleave', '.num', function () {
                $(this).toggleClass('hover');
            });

            p.on('click', '.prev', function () {
                if ($(this).hasClass('prev-disabled') || opts.disabled) return;
                me.goTo(opts, opts.data.pager.cur - 1);
            });

            p.on('click', '.next', function () {
                if ($(this).hasClass('next-disabled') || opts.disabled) return;
                me.goTo(opts, opts.data.pager.cur + 1);
            });
        },

        goTo: function (opts, page, callback) {
            var postData = {cur: page};
            opts.submit(postData, callback);
        },

        /*
         * 对外接口
         */
        _refreshPagination: function (target, postData) {
            var opts = this._getOpts(target);
            if (!opts) return;
            if (postData) opts.postData = $.extend(opts.postData, postData);
            this.goTo(opts, opts.data.pager.cur);
        },

        _submitPagination: function (target, postData, callback, merge) {
            var merge = merge || false,
                opts = this._getOpts(target),
                postData = postData || {};

            opts.postData = merge ? $.extend(opts.postData, postData) : $.extend({}, postData);
            this.goTo(opts, 1, callback);
        },

        _goToPagination: function (target, page) {
            var opts = this._getOpts(target);
            this.goTo(opts, page);
        },

        _loadPagination: function (target, data) {
            var opts = this._getOpts(target);
            opts.data = data;
            opts.render();
        }

    };

    $.fn.pagination = function (options) {
        if (!this.length) return this;
        var otherArgs = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            typeof options === "string" ?
                Pagination["_" + options + "Pagination"].apply(Pagination, [this].concat(otherArgs)) :
                Pagination._attachPagination(this, options);

            return this;
        });
    };

}(window.jQuery));