/**
 * Created by TC-62 on 2015/12/7.
 * 这个插件很复杂，看不懂是正常现象 !^ _ ^!
 */


var layer = require('../layer/layer'),
  tpl = require('lib/art-template/template'),
  itemTpl = require('./view/item.tmpl'),
  stdTpl = require('./view/std.tmpl'),
  $win = $(window),
  cache = {},
  Cock,
  action,
  $me,
  layerSkin;


// 在模板中挂咋需要使用到的方法
tpl.helper('parseInt', parseInt);
tpl.helper('ceil', Math.ceil);
tpl.helper('inArray', $.inArray);

tpl.helper('colsp', function(len, ratio) {
  return Math.ceil(Math.sqrt(len / ratio));
});


Cock = {

  init: function() {
    this.events();
  },


  /**
   * 对象下的属性进行偏移，暂不考虑ob下有但oa下没有某属性的情况，因为这不是重点！
   * todo: oc = {left: oa.left +/- oa.left, top: oa.top +/- oa.top}
   * @param oa
   * @param ob
   * @param sign
   * @returns {{}}
   */
  offset: function(oa, ob, sign) {
    var i, oc = {};
    for (i in oa) {
      eval('oc[i]=' + oa[i] + (sign || '-') + (ob[i] || 0));
    }
    return oc;
  },


  /**
   * 通过id修改指定选项的选中状态
   */
  check: function(val, check) {
    $('.ve-w-cock .ck-table input[value=' + val + ']').prop('checked', check);
  },


  getVelues: function($s) {
    var list = [];
    $s.each(function() {
      list.push($(this).val());
    });
    return list;
  },


  events: function() {
    var $body = $('body'),
      me = this,
      timer,
      itemCache = '.ve-w-cock .item-cache';

    $body
    // todo: 打开二级选择框
      .on('click.cock', '.ve-w-cock .J_ck-all span', function() {
      var $this = $(this),
        $main = $this.closest('.ve-w-cock'),
        index = parseInt($this.data('index'), 10), // 二级菜单的缓存ID
        data = me.cache($main.attr('name')), // 大弹窗缓存（数据）
        $itemCache = $main.find('>.item-cache').show(), // 二级菜单div（缓存就在里面）
        $item = $itemCache.find('>#item-' + index),
        hit = me.getVelues($('.ve-w-cock .ck-std-list input')), // 已选择选项  从已选栏目查找
        ofs;


      //判断cache是否存在，如果不存在，则创建
      if (!$item.length) {
        $item = me.render(itemTpl, $.extend({}, data.data, {
          hit: hit,
          index: index,
          parent: data.parent,
          cols: data.ratio,
          multi: data.multi
        }));
        $itemCache.append($item);
      }
      $item.show().siblings().hide();


      //接下来就是对二级位置做出调整咯
      // ofs = me.offset(me.offset($this.offset(), $main.parent().offset()), {top: $this.height() + 1}, '+');
      var zleft = $this.offset().left + $itemCache.outerWidth() + 10,
        zwidth = $win.width(),
        ztop = $this.offset().top + $itemCache.outerHeight() + 10 - $(document).scrollTop(),
        zheight = $win.height(),
        offsetLeft = zleft > zwidth ? zleft - zwidth : 0,
        offsetTop = ztop > zheight ? ztop - zheight : 0;
      ofs = me.offset(me.offset($this.offset(), $main.parent().offset()), {
        left: offsetLeft,
        top: offsetTop
      });
      $itemCache.css(ofs);
    })

    // todo: 鼠标移出 240毫秒后 关闭二级菜单
    .on('mouseleave.cock', itemCache, function() {
        var $this = $(this);
        timer = setTimeout($this.hide.bind($this), 240);
      })
      .on('mouseenter.cock', itemCache, function() {
        clearTimeout(timer);
      })

    // todo: label改变
    .on('change.cock-i', '.ve-w-cock .ck-table input', function() {
      var $this = $(this),
        val = $this.val(),
        checked = $this.prop('checked'),
        $clist = $('.ve-w-cock .ck-std-list'),
        $main = $this.closest('.ve-w-cock'),
        data = me.cache($main.attr('name')),
        $label = $this.closest('label'),
        i, ls = [],
        multi = parseInt(data.multi, 10) > 1;

      // 地点页面主要城市标红加粗的城市
      for (i in data.emp) {
        ls.push(i);
      }


      if (multi) {
        // 多选 hit
        if (checked) {
          // 当前选项选中
          // 子集和父级不能同时被选中
          $clist.find('input[value=' + $this.attr('parent') + ']').closest('label').click(); // 这是一行价值伍佰元的代码
          $label.closest('table').find(($label.parent().get(0).tagName == 'TH' ? 'td' : 'th') + ' input').prop('checked', false).trigger('change.cock-i');

          if ($clist.find('label').length < data.multi) {
            $clist.append($label.clone().removeClass(ls.join(' ')));
          } else {
            $this.prop('checked', false);
            var tips = layer.tips(data.data.lang.multi.replace('<%multi%>', data.multi), $clist, {
              tips: 3,
              time: 2400
            });
            $(document).one('scroll', function () {
              layer.close(tips)
            })
            return;
          }
        } else {
          $clist.find('input[value=' + val + ']').closest('label').remove();
        }
      } else {
        // 单选
        $clist.find('input[value]').prop('checked', false).click();
        $this.prop('checked', checked = true);
        $clist.append($label.clone().removeClass(ls.join(' ')));
        setTimeout(function() {
          $body.find(itemCache).trigger('mouseleave.cock');
          $me.find('.layui-layer-btn0').click();
        });
      }


      me.check(val, checked);
    })

    // 头部已选择的label点击后删除
    .on('click', '.ve-w-cock .ck-std-list label', function() {
      var $this = $(this),
        val = $this.find('input').val();
      $this.remove();
      me.check(val, false);
    });


    var msgId,
      $msg,
      msgIdz = function() {
        msgId = 0;
      };
    $win
      .keydown(function(ev) {
        if (action && ev.keyCode == 27) {
          if (msgId) {
            layer.close(msgId);
          } else {
            action2 = true;
            msgId = layer.open({
              type: '0',
              content: '<p style="font-size:16px;text-align:center;">您确定要修改求职条件吗？</p>',
              btn: ['确定', '再想想'],
              success: function($o) {
                $msg = $o
              },
              yes: function(i) {
                layer.close(i);
                $me.find('.layui-layer-btn0').click();
              },
              end: msgIdz
            });
          }
        }
      })
      .keydown(function(ev) {
        if (msgId && ev.keyCode == 13) {
          $msg.find('.layui-layer-btn0').click();
        }
      });
  },


  /**
   * 用于缓存完整弹窗
   * @param key
   * @param value
   * @returns {*}
   */
  cache: function(key, value) {
    if (typeof value != 'undefined') {
      cache[key] = value;
    }
    return cache[key];
  },


  render: function(tmpl, data) {
    return $(tpl.compile(tmpl)(data));
  },



  /**
   * 获取弹窗主体（判断是否有缓存，如果有，则读缓存）
   */
  biu: function(opt) {
    var me = this,
      god = me.cache(opt.name),
      i;
    opt.data.ratio = opt.ratio || 999;

    if (!god) {
      god = me.cache(opt.name, $.extend({
        $main: me.render(opt.tpl, $.extend({
            multi: opt.multi
          }, opt.data))
          .attr('name', opt.name)[(window.screen.availHeight < 732 ? 'add' : 'remove') + 'Class']('mini-ms')
          .append('<div class="item-cache"></div>')
      }, opt));
      for (i in god.emp) {
        god.$main.find('.J_ck-hot').find(god.emp[i].join(',').replace(/(\d+)/g, 'input[value=$1]')).parent().addClass(i);
      }
    }

    return god;
  },


  /**
   * 入口
   */
  run: function(opt, callback) {
    var me = this,
      god = me.biu(opt);
    action = true;


    layer.open({
      area: '840px',
      title: (opt.tip || '~') + (opt.multi > 1 ? ' （' + opt.data.lang.multi.replace('<%multi%>', opt.multi) + '）' : ''),
      shift: 3, // parseInt(Math.random() * 5 + 1, 10),
      btn: ['[' + opt.data.lang.ok + ']', '[' + opt.data.lang.clean + ']'],
      closeBtn: 0,
      skin: 've-w-cock-box',
      success: function($layero, index) {
        $me = $layero;
        $layero.children('.layui-layer-content').append(god.$main);
        $win.resize();

        // 已选中职位（以后有机会可以一下这里的触发机制现在是每次都触发）
        me.render(stdTpl, $.extend({
          hit: opt.hit || []
        }, opt.data)).find('label').appendTo($layero.find('.ck-std .ck-std-list').find('label').click().end());
        $layero.find('.ck-table').find(opt.hit.join(',').replace(/(\d+)/g, 'input[value=$1]')).prop('checked', true);

        // 清除按钮
        if (!opt.clean) {
          $layero.find('>.layui-layer-btn>.layui-layer-btn1').css('display', 'none');
          window.hello = god.$main
        }
      },
      yes: function(index) {
        var list = {
            v: [],
            t: []
          },
          tow = [];

        $me.find('.ve-w-cock .ck-std-list label').each(function() {
          var $this = $(this),
            val = $this.find('input').val(),
            text = $this.text();
          list.v.push(val);
          list.t.push(text);
          tow.push({
            value: val,
            text: text
          });
        });

        god.$main.remove();
        layer.close(index);
        action = false;
        $me = false;

        god.$main.find('.item-cache').hide();

        callback && callback(list, tow);
      },
      cancel: function(index) {
        $me.find('.ve-w-cock .ck-std-list label').click();
        return false;
      }
    })
  },


  /**
   * 指定皮肤和语言
   */
  skin: function(skin) {
    // var url = skin == 'blue' ? __uri('./skin/blue.less') : __uri('./skin/orange.less');
    // var url = __uri('./ski') + 'n/' + (skin || 'orange') + '.css'
    // var uri = 'base:components/cock/skin/' + (skin || 'orange') + '.less';
    // if (!layerSkin) {
    // 	layerSkin = skin;
    // 	$.ajax({
    // 		url: 'http://fex.veryeast.cn/resource/getDeps?s=' + uri,
    // 		dataType: 'jsonp',
    // 		success: function (data) {
    // 			require.loadCss({ url: data.res[uri].url });
    // 		}
    // 	})
    // }
    skin == 'blue' ? require('./skin/blue.less') : require('./skin/orange.less')
    return this;
  }

};


Cock.init();


module.exports = Cock;