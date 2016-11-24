/**
 * Created by TC-62 on 2015/11/24.
 */


import config from '../config';
import '../autocomplete/autocomplete';

var H = require('../helper/helper'),
  KW = {
    post: require('../cock/post').skin(),
    area: require('../cock/area')
  },
  $keywork = $('.w-keyworks'),
  $doc = $(document),
  $his = $keywork.find('.J_search-his'),
  hisCache,

  cache = {};





$keywork
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


/**
 * 搜索关键字类型
 */
.on('mouseover', '.search-type', function(ev) {
    $(this).addClass('active');
  })
  .on('mouseout', '.search-type', function(ev) {
    $(this).removeClass('active');
  })
  .on('click', '.search-type li', function(ev) {
    var $me = $(this);
    $keywork
      .find('.search-type').removeClass('active')
      .find('.keyword_scope').val($me.data('name'))
      .siblings('span').html($me.html());
    ev.stopPropagation();
  })


/**
 * 历史纪录和联想
 */
.on('keyup.rapid', '.search-val', function() {
  var $me = $(this),
    nVal = $.trim($me.val()) != '';

  if (nVal) {
    $his.hide();
  } else if (hisCache) {
    $his.show();
  } else {
    $.ajax({
      url: config.jsonpBase + '/job_search/get-history?format=jsonp',
      method: 'get',
      dataType: 'jsonp',
      success: function(data) {
        var i = 0,
          len = data.data.length,
          item, html = '';

        for (; i < len; i++) {
          item = data.data[i];
          html += '<li><a class="ellipsis " href="/job_search/job_list?s=history&p=' + encodeURIComponent(item.value) + '" title="' + item.word + '">' + item.word + '</a></li>';
        }
        $keywork.find('.J_search-his')[html == '' ? 'hide' : 'show']().find('.sb-list').html(html);
        hisCache = html;
      }
    });
  }

})

.on('focus', '.search-val', function() {
    setTimeout(function() {
      $keywork.find('.search-val').trigger('keyup.rapid');
    }, 50);
  })
  .on('blur', '.search-val', function() {
    cache.timer = setTimeout(function() {
      $keywork.find('.search-rapid').hide()
    }, 0);
  })
  .on('mousedown', '.search-rapid', function() {
    setTimeout(function() {
      clearTimeout(cache.timer)
    }, 0)
  });


/** ************************************* **/
var $input = $('.search-val'),
  opsCache = {};

$input.autocomplete({
  limit: 10,
  show: 10,
  key: 'keyword',
  className: 'auto-complete-hot',
  request: function(task, callback) {
    $.ajax({
      url: config.jsonpBase + '/api/autocomplete?format=jsonp',
      type: 'GET',
      dataType: 'jsonp',
      data: {
        keywords: task.keyword
      },
      success: function(data) {
        callback(data.data);
      }
    });
  },
  render: function(data, keyword) {
    var me = this,
      content = '';
    $.each(data, function(k, v) {
      content += '<li>' + me.highlight(v[me.key], keyword) + (v.exist == 1 ? '<em></em>' : '') + '</li>';
    });
    return content;
  }
});

$input.autocomplete('bind', 'hover', function($ele, data) {
  var index = $ele.index(),
    list = data[index],
    opts = this,
    $list = opts.element.$list,
    $opsWrap;
  $list.height('auto');

  var fillOps = function(opsList) {
    var str = '<div class="ops-list">';
    for (var key in opsList) {
      str += '<a href="http://job.veryeast.cn/' + opsList[key].c_userid + '" target="_self">' + opsList[key].company_name + '</a>'
    }
    str += "</div>";
    $opsWrap = $(str).appendTo($ele);
    $ele.attr('ops-loaded', 1);
    $ele.find('em').addClass('on-ops');

    position($opsWrap);
  };

  var position = function($opsWrap) {
    var width = Math.max($opsWrap.height(), $list.height());
    $opsWrap.css('top', -1 * $ele.index() * ($ele.outerHeight() + 3));
    $opsWrap.height(width);
    $list.height(width);
  };

  if ($ele.attr('ops-loaded') == '1') {
    position($ele.find('.ops-list'));
    return;
  }

  if (list.exist == '1') {
    if (opsCache[list.id]) {
      fillOps(opsCache[list.id]);
    } else {
      $.ajax({
        url: '/api/opskeyword',
        type: 'post',
        dataType: 'json',
        data: {
          id: list.id
        },
        success: function(data) {
          opsCache[list.id] = data.data;
          fillOps(opsCache[list.id]);
        }
      });
    }
  }
});


var $bar = $keywork.find('.search-bar');
$input.autocomplete('bind', 'show', function() {
  this.element.$list.height('auto').find('li').eq(0).css('margin-top', 0);
  this.element.$wrap.css({
    top: $bar.offset().top + $bar.height() + 2,
    left: this.$input.offset().left,
    width: this.$input.outerWidth()
  });
});

/** ************************************* **/



$doc.on('click', function(ev) {
  var $st = $keywork.find('.search-type'),
    st = $st.get(0),
    elp = document.elementFromPoint(ev.clientX || 0, ev.clientY || 0);

  while (true) {
    if (!elp || elp == st) {
      return;
    }
    if (elp.parentElement) {
      elp = elp.parentElement
    } else {
      break;
    }
  }

  $keywork.find('.search-type').removeClass('active');
});