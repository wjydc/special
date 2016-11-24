// 将产品给定的文本数据转换为对应的ID

var timen = (new Date).valueOf();

var fs = require('fs'),
    util = require('util'),
    post = require('../data/cn/post-data.json'),
    post_cn = {},

    postTxt = fs.readFileSync('../data/cn/post.txt').toString(),
    postHot = fs.readFileSync('../data/cn/post-hot.txt').toString(),

    tmp, i;


// post_cn 的key和值颠倒
for (i in post) {
    post_cn[post[i]] = i;
}


postHot = postSplit(postHot);

function itemhot(hot) {
    var i, item = [];
    for (i = 0; i < hot.length; i++) {
        if (util.isArray(hot[i])) {
            hot[i] = itemhot(hot[i]);
        } else {
            hot[i] = post_cn[hot[i]] || hot[i];
        }
    }
    return hot;
}
postHot = itemhot(postHot);
console.log(postHot);


// 中文数据结构
function postSplit(postTxt) {
    var i, len, tmp;
    postTxt = postTxt.split(/\r?\n/);
    for (i = 0, len = postTxt.length; i < len; i++) {
        tmp = postTxt[i].replace(/\t*$/, '').split('\t');
        postTxt[i] = [tmp.shift(), tmp];
    }
    return postTxt;
}
postTxt = postSplit(postTxt);


function items(list) {
    var i, item = [];

    for (i = 0; i < list.length; i++) {
        if (util.isArray(list[0]) && util.isArray(list[1])) {
            // 子集列表
            item[i] = items(list[i]);
        } else if (util.isString(list[0]) && util.isArray(list[1])) {
            if (!i) {
                // 标题
                item = [
                    post_cn[list[1][0]].match(/^\d{2}/)[0] + '00',
                    items(list[1])
                ];
                /*[
                 post_cn[list[1][0]].match(/^\d{2}/)[0] + '00',     // ID
                 list[0],                                           // 显示的文本
                 items(list[1])                                     // 子集
                 ]*/
            }
        } else {
            // 列表
            item[i] = post_cn[list[i]];
            /*[
             post_cn[list[i]],       // ID
             list[i]                 // 显示的文本
             ]*/
        }
    }

    return item;
}


var allpost = items(postTxt);


console.log('');console.log('');

console.log(allpost);



// console.log(items(postTxt));


fs.writeFileSync('../../data/post_cn.js', 'module.exports=' + JSON.stringify({
        all: allpost,   // 所有职位的分类 （必选且结构固定）
        raw: post,      // key对应文本的数据源 （必选且结构固定）
        hot: postHot,   // 热门职位
        type: require('../data/cn/post-type.json')
    }, null, 4)/*.replace(/\"(\w)\"\:/g, "$1:")*/);


console.log((new Date).valueOf() - timen + 'ms', 'done!');
