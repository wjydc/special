var $screen = $('.w-screen');

/**
 * 更多
 */
$screen
  .find('.child-all').each(function() {
    var $this = $(this);
    if ($this.height() > 45) {
      $this.parent().after('<span class="more-show">更多</span>')
    }
  }).end()
  .on('mouseenter', '.more-show', function() {
    $(this).parents('.child-screen').addClass('active').siblings().removeClass('active');
  }).on('click', '.more-show', function() {
    $(this).parents('.child-screen').toggleClass('active');
  }).on('mouseleave', '.child-screen', function() {
    var $this = $(this);
    this.screen_more_delay = setTimeout(function() {
      $this.removeClass('active');
    }, 500);
  }).on('mouseenter', '.child-screen', function() {
    clearTimeout(this.screen_more_delay);
  });








import {
  DROPDATA,
  DROPDATA_FILTER,
  DROPDATA_CHILDREN_MAP,
  DROPDATA_INDEX
} from '../search/init';

var drop = require('../droplist/droplist'),
    H = require('../helper/helper'),
    $doc = $(document),
    $screen = $('.w-screen');


// var joblist = require('../joblist/joblist');


function getTimer(offset) {
    var time = new Date;
    time.setTime(time.valueOf() - _SERVER_TIME_OFFSET); // 服务器时间偏移
    time.setDate(time.getDate() + (offset || 0));       // 参数时间偏移
    return time.getFullYear() + '-' + H.pad(time.getMonth() + 1, 2) + '-' + H.pad(time.getDate(), 2);
}


/**
 * 条件筛选
 */
function where_second() {
    var vals = $screen.find('.drops form').serializeArray(),
        arr_where_filter_second = '', i, len, name, value;

    for (i = 0, len = vals.length; i < len; i++) {
        name = vals[i]['name'];
        value = vals[i]['value'];
        if (name == 'job_update_time') {
            // 更新日期
            if (value && value != 0) {
                arr_where_filter_second += name + ' >-s||' + getTimer(-value) + '*';
            }
        } else if (name == 'salary') {
            // 月薪范围
            if (value && value != 0) {
                value = DROPDATA_FILTER[name][value].split('-');
                arr_where_filter_second += 'salary_min-s||' + value[0] + '*' + 'salary_max-s||' + value[1] + '*';
            }
        } else if (value && value != 0) {
            arr_where_filter_second += name + '-s||' + value + '*';
        }
    }
    arr_where_filter_second = arr_where_filter_second.slice(0, -1);

    // joblist.where('arr_where_filter_second', arr_where_filter_second);
}


$screen.on('click', '[control=select]', function (ev) {
    var name = $(this).find('input[name]').attr('name');

    var $self = $(this),
        $tpl = drop({
            $dom: $self,
            data: DROPDATA,
            skin: 'w-screen-drop'
        }, where_second);

    if ($self.hasClass('active')) {
        $tpl.hide();
    } else {
        $tpl.resize(12).move(1);
    }
    ev.stopPropagation();
});
