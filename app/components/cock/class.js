/**
 * Created by TC-62 on 2015/11/4.
 */

'use strict';

var i, x, tmp = {},
	Cock = require('../cock-core/cock'),
    auto = {
        name: 'class',
        tpl: require('./view/class.tmpl'),
        data: require('./data/class_cn.js'),
        tip: '请选择职位',
        //multi: 1,
        ratio: 12,
        parent: true, // 这是父级可选
		mui: {}
    }, key;

auto.data.lang = require('./lang/cn.js');


auto.data.type = {};
auto.data.all = [];
for (i = 0; i < auto.data.a_ll.length; i++) {
    key = auto.data.a_ll[i];
    auto.data.type[ key ] = auto.data.raw[ key ];
    tmp[key] = i;
    auto.data.all.push([key, []]);
}


for (i in auto.data.raw) {
    key = i.match(/\d{2}/) + '00';
    if (!/0{2}$/.test(i)) {
        auto.data.all[tmp[key]][1].push(i);
    }
}



// console.log(auto);


function Post(option, callback) {
    Cock.run($.extend({}, auto, option), callback);
}


Post.skin = Cock.skin;
Post.data = auto.data;

module.exports = Post;
