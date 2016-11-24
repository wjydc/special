import './index.less';

import config from '../config';
import '../autocomplete/autocomplete';

var H = require('../helper/helper'),
  KW = {
    post: require('../cock/post').skin(),
    area: require('../cock/area')
  },
  $content = $('.w-banner .banner-content'),
  $doc = $(document);


$content
/**
 * 初始化打开弹出窗的按钮
 */
  .find('.kwbtn').each(function() {
    var $me = $(this),
      name = $me.data('name').split('-')[0],
      $input = $me.find('input[type=hidden]'),
      val = $input.val().split(','),
      i = 0,
      len = val.length,
      list = [],
      tmp, title;
    for (; i < len; i++) {
      tmp = KW[name].data.raw[val[i]] || KW[name].data.type[val[i]];
      tmp && list.push(tmp);
    }
    title = list.join('+');
    if (list.length) {
      $me.attr('title', title).find('span').html(title);
    }
  }).end()
  /**
   * 神奇的弹出窗
   */
  .on('click', '.kwbtn[data-name]', function() {
    var $this = $(this),
      data = $this.data();

    data.hit = $this.find('input').val().split(',');

    KW[$this.data('name').split('-')[0]](data, function(list) {
      var value = list.v.join(','),
        text = list.t.join('+');

      $this.find('input').val(value ? value : '');
      $this.attr('title', text ? text : $this.data('title'));
      $this.find('span').html(text ? text : $this.data('placeholder'));
    });
  })