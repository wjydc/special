import './company.less';
import share from '../share/share';

/**
 * 分享
 */
share($('.w-company .company-info').append('<div class="bd_share"><span>分享到：</span></div>').children('.bd_share'));


/**
 * 企业魅力
 */
$('.open-album').on('click', function() {
  var src = $(this).attr('album-src'),
    top = ($(window).height() - 753) / 2;

  $.blockUI({
    fadeIn: 0,
    message: $('#block_box'),
    css: {
      cursor: 'default',
      top: (top > 0 ? top : 0) + 'px',
      left: ($(window).width() - 1003) / 2 + 'px'
    },
    onBlock: function() {
      $('#block_box').html('<iframe border="0" frameborder="0" width="1003" height="753"></iframe>');
      $('#block_box').find('iframe').attr('src', src);
    }
  });
})



/**
 * 展开
 */
var $company = $('.detail-info, .w-company')
if ($company.length) {
  $company.on('click', '.info-box-open', function() {
    var $this = $(this);
    var $infoBox = $this.parent();
    if ($infoBox.hasClass('opened')) {
      $infoBox.removeClass('opened')
      $this.html('[ 展开 ]')
    } else {
      $infoBox.addClass('opened')
      $this.html('[ 收起 ]')
    }
  });

  var $infoBox = $company.find('.info-box');

  var $pre = $infoBox.children('pre');
  $pre.html($('<div>' + $pre.html().replace(/<br\/?>/g, '\n') + '</div>').text()).show();

  if ($infoBox.children('pre').height() > 285) {
    $infoBox.addClass('init')
  }
}



/**
 * 职位筛选
 */
var $alljob = $('.w-company .company-alljob');
$alljob.on('click', '.job-filter .droplist-box a', function(ev) {
  var $this = $(this);
  var filter = $this.html();
  var $dropbase = $this.parents('[control=dropbase]');
  var type = $dropbase.data('filter');
  var $i = $dropbase.children('i');

  if (filter == '全部') {
    $alljob.find('.job-list li[' + type + ']').addClass(type)
    $i.html($i.attr('pla'));
    $dropbase.removeClass('isSet');
  } else {
    $alljob.find('.job-list li[' + type + ']').removeClass(type).filter('[' + type + '="' + filter + '"]').addClass(type)
    $i.html(filter);
    $dropbase.addClass('isSet');
  }

});