/**
 * Created by TC-62 on 2015/10/30.
 */

'use strict';


var QueryString = {
    data: {},
    Initial: function () {
        var aPairs, aTmp;
        var queryString = new String(window.location.search);
        queryString = queryString.substr(1, queryString.length); //remove   "?"    
        aPairs = queryString.split("&");
        for (var i = 0; i < aPairs.length; i++) {
            aTmp = aPairs[i].split("=");
            this.data[aTmp[0]] = aTmp[1];
        }
    },
    GetValue: function (key) {
        return this.data[key];
    }
}
QueryString.Initial();




var textBox = 'input[placeholder], textarea[placeholder]',

    Helper = {


        /**
         * 返回浏览器版本信息
         * 其实最主要就是为了判断ie6-9的版本需要做一些hack
         * 其他浏览器的判断不是很精准，但一般情况都是准确的，但那不是重点
         * @returns {['kernel', version]}
         */
        browser: (function () {
            var kernel = navigator.userAgent.toLowerCase().match(/(msie|chrome|safari|firefox).(\d+)\./) || 0;
            return kernel ? [kernel[1], parseInt(kernel[2], 10)] : [];
        } ()),


        /**
         * 字符串截取
         * @param str
         * @param len
         * @param flow
         * @returns {*}
         */
        substring: function (str, len, flow) {
            if (!str) return str;
            var newLength = 0,
                str = (typeof (str) != 'string') ? '' : str,
                newStr = "",
                chineseRegex = /[^\x00-\xff]/g,
                singleChar,
                strLength = str.replace(chineseRegex, "**").length,
                flow = typeof (flow) == 'undefined' ? '...' : flow;

            if (strLength <= len + (strLength % 2 == 0 ? 2 : 1))
                return str;

            for (var i = 0; i < strLength; i++) {
                singleChar = str.charAt(i).toString();
                if (singleChar.match(chineseRegex) != null)
                    newLength += 2;
                else
                    newLength++;

                if (newLength > len)
                    break;
                newStr += singleChar;
            }

            if (flow && strLength > len) newStr = $.trim(newStr) + flow;
            return newStr;
        },


        /**
         * 禁止文本被选中
         * @param BOOL
         * @param $dom
         */
        selected: function (BOOL, $dom) {
            $($dom ? $dom : document)[BOOL ? 'off' : 'on']('selectstart mousedown mouseup selectstart', selectAction);
        },


        /**
         * 获取一个整数随机数随机数
         * @returns {Number}
         */
        random: function () {
            return parseInt(String(Math.random()).slice(2), 10);
        },


        /**
         * 前补0；
         * @param num // 数值
         * @param len // 长度限制
         * @param at  // 补全字符
         * @param cut // 是否超出截断
         * @returns {string}
         */
        pad: function (num, len, at, cut) {
            if (typeof at == 'boolean') {
                cut = at;
                at = 0;
            }
            var nl = String(num).length,
                str = Array(len > nl ? len - nl + 1 : 0).join(at || 0) + num;
            return cut ? str.slice(nl - len) : str;
        },


        /**
         * 把字符串转换为对象，修正json必须使用双引号的问题
         * @param string
         * @returns {Object}
         */
        object: function (string) {
            if (typeof string == 'string')
                return Function('return ' + (string || '{}'))();
        },


        /**
         * 返回对象类型
         * @param me
         * @returns {string}
         */
        type: function (obj) {
            return Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase();
        },


        /**
         * 刷新视图
         * @param blur
         */
        refresh: function (blur) {
            $(blur || textBox).trigger('blur.placeholder');
        },


        cookie: function (name, value, time) {
            var i, tmp, cookie = {}, regl = this.type(name) == 'regexp' ? {} : null,
                list = document.cookie.split(/; */),
                arg = arguments;

            if (value) {
                var exp = new Date;
                exp.setTime(time * 1000 + exp.getTime());
                document.cookie = name + '=' + value + (time ? ';expires=' + exp.toGMTString() : '');
            } else {
                for (i = 0; i < list.length; i++) {
                    tmp = list[i].match(/^([^=]+)=(.*)/);
                    cookie[tmp[1]] = tmp[2];
                    if (regl && name.test(tmp)) {
                        regl[tmp[1]] = tmp[2];
                    }
                }
                return !arg.length ? cookie : regl ? regl : arg.length == 1 ? cookie[name] : undefined;
            }
        },

        rmCookie: function (name) {
            var // isReg = this.type(name) == 'regexp',
                exp = new Date;
            exp.setTime(exp.getTime() - 1);
            document.cookie = name + "=;expires=" + exp.toGMTString();
        },



        /**
         * 获取地址栏GET参数
         */
        getValue: function (key) {
            return QueryString.GetValue(key)
        }
    };


/**
 * 从这里开始是页面加载后执行的默认脚本
 */


// 禁止文本被选中
function selectAction(ev) {
    ev.returnValue = false;
    return false;
}


var browser = Helper.browser;
if (browser[0] == 'msie' && browser[1] < 10) {
    $('html')
        .on('blur.placeholder', textBox, function placeholder() {
            var $me = $(this);
            if ($me.val() == '') {
                $me.val($me.attr('placeholder')).addClass('placeholder');
            }
        })
        .on('focus', textBox, function () {
            var $me = $(this);
            if ($me.val() == $me.attr('placeholder')) {
                $me.val('').removeClass('placeholder');
            }
        })
        .find(textBox).trigger('blur.placeholder');
}


module.exports = window.Helper = Helper;

