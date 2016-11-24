'use strict';

import './droplist.less';

var H = require('../helper/helper'),
  $win = $(window),
  $doc = $(document),
  $body = $('body'),
  li = '.cw-droplist-i li',
  out = setTimeout,
  cachelist = {},
  SELECT = function(data, filter) {
    data = data.length ? data : [
      [0, '无']
    ];
    this.create(data, filter);
  },
  api = SELECT.prototype,
  def = {
    $dom: null,
    data: null,
    skin: '',
    zIndex: 35,
    cache: true
  };

/**
 * 对外接口
 * @param opt   $dom control="select"
 *              data 渲染列表所需的数据
 *              skin .cw-droplist-i的自定义class，可用于自定义样式
 * @returns {*}
 */
function drop(opt, callback) {
  opt = $.extend({}, def, opt);

  var v = opt.$dom.data('v'),
    $i = opt.$dom.children('i'),
    callback = arguments[arguments.length - 1];

  $i.width($i.width()).addClass('ellipsis');
  /*if (!cachelist[v]) {
   cachelist[v] = new SELECT(data[v] || data);
   }*/
  cachelist[v] = new SELECT(opt.data[v] || opt.data, opt.filter);

  cachelist[v].$me = opt.$dom;
  cachelist[v].tpl.attr('dropid', v).removeClass().addClass('cw-droplist-i ' + opt.skin).css('zIndex', opt.zIndex);

  if (typeof callback == "function") {
    cachelist[v].callback = callback;
  }
  return cachelist[v];
}


/**
 * todo: 渲染option列表
 * @param data
 * @returns {*|jQuery}
 */
api.create = function(data, filter) {

  var $tpl = $('<div class="cw-droplist-i"><ul>'),
    $ul = $tpl.children('ul'),
    $tmp;

  for (var i = 0, len = data.length; i < len; i++) {
    if (data[i][0] == 0 || !filter || $.inArray(data[i][0], filter) >= 0) {
      $tmp = $('<li class="ellipsis">');
      $tmp.text(data[i][1])
        .data('value', data[i][0]);
      data[i][2] != undefined && $tmp.attr('dropItem', data[i][2]);

      $ul.append($tmp);
    }
  }

  this.tpl = $tpl;
  return this;
};


api.hide = function() {
  this.$me.removeClass('active');
  this.tpl.removeClass('active').remove();
  return this;
};


api.show = function() {
  var me = this;
  dropHide();
  me.$me.addClass('active');
  me.tpl.appendTo($body).show();
  out(function() {
    me.tpl.addClass('active').find('li').removeClass('hover');
  });
  return this;
};


/**
 * 工具单个元素的高度动态计算列表高度
 * @param num  指定一页显示的列数
 * @returns {number}  列表的高度（px）
 */
api.height = function(num) {
  var $dom = this.$me,
    height = $dom.height() * (num || 10),
    ulHeight = this.tpl.find('ul li').length * $dom.height();

  return height < ulHeight ? height : ulHeight;
};


/**
 * 初始化drop的尺寸包括宽，高，字体大小，行高
 * @param num
 * @returns {SELECT}
 */
api.resize = function(num) {
  var $dom = this.$me;
  this.tpl.css({
    width: $dom.innerWidth(),
    height: this.height(num),
    fontSize: $dom.css('fontSize'),
    lineHeight: $dom.css('lineHeight')
  });
  return this;
};


/**
 * 将列表移动到当前按钮的位置
 * @param type
 * @returns {SELECT}
 */
api.move = function(type) {
  var $dom = this.$me,
    me = this,
    $tpl = me.tpl,
    offset = $dom.offset(),
    height, top;

  height = $tpl.height();
  top = offset.top - (height - $dom.innerHeight()) / 2;

  switch (type) {
    case 1:
      // 上下展开效果。列表将相对于select纵向居中显示
      me.resize($dom.innerHeight() / $dom.height());

      $tpl
        .css({
          left: offset.left,
          top: offset.top,
          display: 'block',
          overflow: 'hidden'
        }).animate({
          top: top > 50 ? top : 50,
          height: height
        }, 200, function() {
          $tpl.css({
            overflow: ''
          });
        });
      break;
    default:
      me.tpl.css({
        left: offset.left,
        top: offset.top + $dom.innerHeight() + 3,
        display: 'block'
      });
  }
  me.show();
  return me;
};


/**
 * 绑定各种默认事件
 */
$body.on('mouseenter', li, function() {
  $(this).addClass('hover');
}).on('mouseleave', li, function() {
  $(this).removeClass('hover');
}).on('click', li, function() {
  var $self = $(this),
    v = $self.closest('.cw-droplist-i').attr('dropid'),
    me = cachelist[v],
    $i = me.$me.children('i'),
    val = $self.data('value'),
    item = $self.attr('dropItem'),
    zero = (!val || val == '0');

  $self.addClass('active').siblings().removeClass('active');

  $i.text(zero ? $i.attr('pla') : $self.text()).siblings().val($self.data('value'));
  me.$me[(zero ? 'remove' : 'add') + 'Class']('isSet');

  me.callback ? me.callback(val, item) : null;
});


/**
 * 在一些情况下，也需要隐藏列表
 */
var dropHide = function() {
  $('[control=select]').removeClass('active');
  $body.children('.cw-droplist-i').removeClass('active').remove();
};
$doc.on('click', dropHide);
$win.on('resize scroll', dropHide);


// -

$doc.on('click', function() {
  $('[control=dropbase] .cw-droplist-i').hide();
});

$('[control=dropbase]').each(function() {
  var $this = $(this);
  var $list = $this.find('.cw-droplist-i');
  $list.data('height', $list.height())
}).on('click', function() {
  var $this = $(this);
  var $list = $this.find('.cw-droplist-i');
  if ($list.css('display') == 'block') {
    $('[control=dropbase] .cw-droplist-i').hide();
  } else {
    setTimeout(function() {
      $list.css({
        zIndex: 35,
        display: 'block',
        overflow: 'hidden',
        left: -1,
        top: -1,
        height: 28,
        width: $this.outerWidth() - 2
      }).animate({
        top: -$list.data('height') / 2 + 15,
        height: $list.data('height')
      })
    })
  }
});

// -


module.exports = drop;