/**
 * Created by TC-62 on 2015/11/4.
 */

'use strict';

var 
	Cock = require('../cock-core/cock'),
    auto = {
        name: 'post',
        tpl: require('./view/post.tmpl'),
        data: require('./data/post_cn.js'),
        tip: '请选择职位',
        //multi: 1,
        ratio: 12,
        parent: true, // 这是父级可选
		mui: {}
    };

auto.data.lang = require('./lang/cn.js');


function Post(option, callback) {
    Cock.run($.extend({}, auto, option), callback);
}


Post.skin = Cock.skin;
Post.data = auto.data;

module.exports = Post;
