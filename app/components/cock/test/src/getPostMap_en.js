// 将产品给定的文本数据转换为对应的ID

var timen = (new Date).valueOf();

var i,
	fs = require('fs'),
    util = require('util'),
	post_cn = require('../../data/post_cn.js'),
	post_hot = require('../data/en/post-hot.json'),
	postEn = require('../data/en/post.json'),
	postType = require('../data/en/post-type.json');



for (i = 0; i < post_cn.hot.length; i++) {
	post_cn.hot[i][0] = post_hot[i];
}


for (i in post_cn.raw) {
	if (postEn[i]) {
		post_cn.raw[i] = postEn[i];
	}
}


for (i in post_cn.type) {
	if (postType[i]) {
		post_cn.type[i] = postType[i];
	}
}




fs.writeFileSync('../../data/post_en.js', 'module.exports=' + JSON.stringify(post_cn, null, 4));

console.log((new Date).valueOf() - timen + 'ms', 'done!');
