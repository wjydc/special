/**
 * 这个模块主要针对表单进行ajax形式提交做出了处理
 * Created by TC-62 on 2015/10/23.
 */

'use strict';

var H = require('../helper/helper'),
    Form = function (form) {
        var me = this;
        me.$form = $(form);

        me.event();
    },
    fn = Form.prototype;


/**
 * 将表单数据打包成女票
 * @returns {*}
 */
fn.data = function () {
    var me = this,
        $form = me.$form,
        $input = $form.find('input[type=text], input[type=hidden], textarea, label.active input[type=radio]'),

        // 这里可以放一些静态数据，会作为数据传到后台
        data = H.object($form.attr('config') || '{}');

    $input.each(function () {
        var $self = $(this);
        // 需要注意, 暂时不支持复选
        data[$self.attr('name')] = $self.val();
    });
    return data;
};


fn.event = function () {
    var me = this,
        $form = me.$form;

};


fn.submit = function (callback) {
    var me = this,
        $form = me.$form,
        data = {};

    $.each($form.serializeArray(), function (key, item) {
        // 数值为空不显示
        if (item.value && (item.value != '0' || item.name == 'key_words')) {
            if (item.name.match(/(?:\[\])$/)) {
                var i = item.name.match(/(.*)(?:\[\])$/)[1];
                if (!data[i]) {
                    data[i] = []
                }
                data[i].push(item.value);
            } else {
                data[item.name] = item.value;
            }
        }
    });
    data = $.extend(H.object($form.attr('formdata')), data);

    if (callback) {
        $.ajax({
            url: $form.attr('action'),
            methed: $form.attr('methed'),
            dataType: $form.attr('dataType') || 'json',
            data:  data,
            success: callback
        });
    } else if ($form.attr('method') == 'get') {
        location.href = $form.attr('action') + '?' + $.param(data);
    } else {
        // 没有支持formdata属性，以后有用到的时候再写吧
        // 但理论上说这是不可能的
        $form.submit();
    }
};


module.exports = Form;
