/**
 * Created by TC-62 on 2015/12/3.
 */

var i
    , tpl = require('common:components/tpl/tpl.js')
    , joblist = require('search:widget/joblist/joblist.js')
    , $pages
    ;


/**
 * 复制翻页到底部
 */
$('.w-tabmenu .tabright .w-page-inner').clone().appendTo('.funright');


$pages = $('.w-page-inner:not(.nojs)');

var allpage = $pages.data('allpage');

$pages
    .on('click', '.page-btn', function () {
        var page = parseInt($(this).siblings('.page-text').val(), 10);
        joblist.where('page', page > allpage ? allpage : page < 1 ? 1 : page, true);
    })
    .on('keydown', '.page-text', function (ev) {
        ev.keyCode == 13 && $(this).siblings('.page-btn').click();
    })
    .on('click', 'a', function () {
        joblist.where('page', $(this).html(), true);
    }).find('a').attr('href', 'javascript:;');
