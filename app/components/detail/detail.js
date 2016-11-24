import './detail.less';
import share from '../share/share';
import H from '../helper/helper';
import config from '../config';

// widget
var $detail = $('.w-detail');
var $hotbox = $detail.find('.detail-info');

var companyid = $detail.data('companyid');
var jobid = $detail.data('jobid');


/**
 * 页面流量统计
 */
if (companyid) {
  $.ajax({
    url: config.jsonpBase + '/observer/counter/' + companyid + '/' + jobid + '/click',
    dataType: 'jsonp',
    data: {
      format: 'jsonp',
      returnType: 'json'
    }
  })
}



/**
 * 修改简历 / 预览简历
 */
var $codeBox = $('.detail-code-box');
if ($codeBox.length) {
  $(function() {
    $.ajax({
      url: '/Html/completeness?jobcomp=1',
      dataType: 'html',
      type: 'GET',
      success: function(data) {
        $codeBox.html(data);
      }
    })
  });
}




function serviceInfo(id, cb) {
  $.ajax({
    url: 'http://my.veryeast.cn/service/index/has-service',
    data: {
      id: id,
      format: 'jsonp'
    },
    dataType: 'jsonp',
    success: cb
  });
}
if (companyid) {
  serviceInfo(2, function(data) {
    if (data.data.isValid) {
      $('.replace-time').append('<span style="color:#297ac9;text-decoration:none;font-size:12px;display:inline-block;padding-left:23px;background:url(http://f3.v.veimg.cn/www_veryeast_cn/images/33.png) no-repeat;line-height:18px;margin-left:20px"><a style="color:#2a7ac9" href="http://my.veryeast.cn/service/matching?job_id=850788" target="_blank">简历匹配度</a></span>')
    }
    serviceInfo(3, function(data) {
      if (data.data.isValid) {
        $('.replace-time').append('<span style="color:#297ac9;text-decoration:none;font-size:12px;display:inline-block;padding-left:23px;background:url(http://f3.v.veimg.cn/www_veryeast_cn/images/22.png) no-repeat;line-height:18px;margin-left:10px"><a style="color:#2a7ac9" href="http://my.veryeast.cn/service/competitive?job_id=850788" target="_blank">比比竞争力</a></span>')
      }
    })
  })
}






var $jobPre = $('.w-detail .info-main>li').eq(0).children('pre')
if ($jobPre.length) {
  $jobPre.html($('<div>' + $jobPre.html().replace(/<br\/?>/g, '\n') + '</div>').text()).show();
}




/**
 * 收起/展开效果问题增强
 */
$('.info-main').on('click', '.info-box-open', function() {
  var $this = $(this);
  setTimeout(function () {
    $hotbox.find('.info-title li').eq($this.parent().index()).trigger('mouseenter.detail');
  })
});



/**
 * 职位详情/企业详情 tab切换
 */
$hotbox.on('mouseenter.detail', '.info-title li', function() {
  var $this = $(this);
  $this.addClass('active').siblings().removeClass('active');
  $hotbox.find('.info-main li').eq($this.index()).addClass('active').siblings().removeClass('active');

  var $infoBox = $('.info-main').find('.info-box')
  if ($infoBox.children('pre').height() > 285) {
    $infoBox.addClass('init')
  }

  $hotbox.find('.info-main').height($hotbox.find('.info-main li').eq($this.index()).height());
}).find('.info-title li:first-child').trigger('mouseenter.detail');

share($('.w-detail .detail-left').prepend('<div class="bd_share"><span>分享到：</span></div>').find('.bd_share'));



/**
 * 用户类型确认
 */
function userTypeVerDoAjax() {
  if (USER_INFO && USER_INFO.status == 1 && USER_INFO.data.userType == 1) {
    layer.message({
      right: "<h4>操作失败！</h4><span>抱歉，企业用户不能进行此操作哦！</span>",
      icon: 2,
      title: "操作失败"
    });
  } else {
    ajax.apply(this, arguments);
  }
}




/**
 * 先之测评
 */
function cpplay(id) {
  // todo:
  // $.ajax({
  // 	url: 'http://search.veryeast.cn/pop/evaluation',
  // 	data: {
  // 		job_id: id
  // 	},
  // 	dataType: 'jsonp',
  // 	success: function(data) {
  // 		require('ceping:widget/cpplay/cpplay.js').cpplay('.wukong-btn', data.message);
  // 	}
  // })
}



var ajax = function(opt, data) {
  var success, args = arguments;
  if (typeof opt == 'string') {
    opt = {
      auto: true,
      url: opt
    };
  }

  $.extend(opt, {
    data: $.extend({
      returnType: 'json',
      format: 'jsonp'
    }, data)
  });

  // 回掉函数
  var endargs = args[args.length - 1];
  success = opt.success ? opt.success : typeof endargs == "function" ? endargs : null;

  layer.load(2, {
    shade: .1
  });

  $.ajax($.extend({
    method: 'GET',
    dataType: 'jsonp',
    success: function(data) {
      layer.closeAll();
      var status = data.status;

      if (status == 2) {
        location.href = 'http://i.veryeast.cn/user/login?redirect=' + encodeURIComponent(location.href);
      } else if (status == 0 || (opt.auto && data.message && data.message.right)) {
        var msg = data.message;
        layer.message({
          right: msg.right,
          bottom: msg.bottom || undefined,
          icon: msg.icon || 0,
        }, {
          area: $(window).width() < 640 ? ['80%'] : undefined,
          title: msg.title,
          success: function(layero) {
            layero.find('.layui-layer-content').css({
              overflow: 'inherit'
            });
          }
        });
      } else if (status == 1) {
        success && success(data);
      } else {
        layer.alert('未知错误! data.status:' + status)
      }
    },
    error: function(err) {
      layer.closeAll();
      layer.alert('未知错误!<br><pre>' + H.substring(JSON.stringify(err), 1000) + '</pre>', {
        maxWidth: '600px'
      });
    }
  }, opt));
};



/**
 * 选择求职信 [ 申请之前，选择求职信 ]   打开效果
 * @type {*|jQuery|HTMLElement}
 */
var $popbox = $detail.find('.popbox')
var joblistTimer = $detail.on('mouseenter', '.apply', function() {
  var me = this;
  joblistTimer = setTimeout(function() {
    $popbox.show();
  }, 150);
}).on('mouseleave', '.apply', function() {
  clearTimeout(joblistTimer);
  $popbox.hide();
});






function collect(job_id) {
  cpplay(job_id);

  ajax({
    url: config.jsonpBase + '/pop/collection_job',
    auto: false
  }, {
    job_id: job_id
  }, function(data) {
    // console.log(data.message.successIds);
    try {
      layer.message(data.message, {
        title: data.message.title,
        success: function(layero) {
          layero.find('.layui-layer-content').css({
            overflow: 'inherit'
          });
        }
      });
      $detail.find('.collect').addClass('active');
    } catch (e) {}
  });
}



var jsldata;
var drop = require('../droplist/droplist');
$(document).on('click', '.w-joblist-sl [control=select]', function(ev) {
  var $self = $(this);

  if (!$self.hasClass('active')) {
    drop({
      $dom: $self,
      data: jsldata.list,
      skin: 'w-joblist-drop',
      zIndex: parseInt($self.closest('.layui-layer').css('zIndex'), 10) + 1,
      cache: false
    }, function(val) {
      var $sl = $('.layui-layer .w-joblist-sl');
      $sl.find('textarea').val(jsldata.all[val].content);
    }).resize(8).move(0);
    ev.stopPropagation();
  }
});


var selectletter = require('./selectletter.tmpl');


$detail
  .on('click', '.apply', function(ev) { // 立即申请
    cpplay(jobid);
    userTypeVerDoAjax(config.jsonpBase + '/pop/apply_job', {
      job_id: jobid
    }, function(data) {});
  }).on('click', '.pop', function(ev) {
    var $child = $(this).closest('.w-detail');

    userTypeVerDoAjax(config.jsonpBase + '/pop/choose_resume', {
      job_id: jobid
    }, function(data) {
      // 求职信列表数据
      var i, len, letterList = data.message.letterList;
      jsldata = {
        list: [],
        all: {}
      };
      for (i = 0, len = letterList.length; i < len; i++) {
        jsldata.list.push([letterList[i].id, letterList[i].title]);
        jsldata.all[letterList[i].id] = letterList[i];
      }

      layer.open({
        title: '请选择求职信',
        content: selectletter,
        area: '480px',
        move: false,
        btn: false,
        success: function(layero) {
          this.layero = layero
        },
        yes: function() {
          var apl_id = this.layero.find('[name=apply_letter_id]').val();

          if (apl_id == '') {
            layer.message('<p>请选择求职信哦！</p>', 2, {
              shade: .1
            });
          } else {
            ajax(config.jsonpBase + '/pop/apply_job', {
              job_id: jobid,
              use_letter: 1,
              apply_letter_title: apl_id,
              apply_letter_title_value: jsldata.all[apl_id].title,
              apply_letter_content: this.layero.find('[name=apply_letter_content]').val()
            }, function(data) {});
          }
        }
      });
    });
    ev.stopPropagation();
  }).on('click', '.collect', function() {
    /**
     * 收藏
     */
    var $self = $(this);
    if (!$self.hasClass('action')) {
      //console.log($self.closest('.job-child'));
      collect(jobid);
    }
  })









/**
 * 投诉
 */
// /pop/new-report
var $complaint = $('#complaint-tpl');
$detail.on('click', '.complaint', function() {
  if (window.USER_INFO && USER_INFO.status == 1) {
    layer.open({
      title: '举报该职位',
      content: $complaint.html(),
      area: ['520px'],
      btn: ['提交'],
      success: function (layero) {
        var $layero = $(layero)
        if (USER_INFO.data && USER_INFO.data.person) {
          $layero.find('input[name=p_mobile]').val(USER_INFO.data.person.mobile);
          $layero.find('input[name=p_email]').val(USER_INFO.data.person.email);
        }
      },
      yes: function() {
        var $form = $('#complaint-form');
        if (!$form.find('.report-type input:checked').length) {
          layer.tips('请填写举报类型', $('.report-type'), {
            tips: [3, '#fe9901']
          });
          return;
        }
        if ($.trim($form.find('.situation').val()) == '') {
          layer.tips('请填写举报说明', $('.situation'), {
            tips: [3, '#fe9901']
          });
          return;
        }
        ajax({
          url: config.jsonpBase + '/pop/new-report?' + $form.serialize(),
          auto: false
        }, {}, function(data) {
          // console.log(data.message.successIds);
          try {
            layer.message(data.message, {
              title: data.message.title,
              success: function(layero) {
                layero.find('.layui-layer-content').css({
                  overflow: 'inherit'
                });
              }
            });
          } catch (e) {}
        });
      }
    })
  } else {
    location.href = 'http://i.veryeast.cn/user/login?redirect=' + encodeURIComponent(location.href);
  }
})




/**
 * 关注
 */
$('.content').on('click', '.js-company-follow', function() {
  var $this = $(this);
  ajax({
    url: config.jsonpBase + '/pop/follow',
    auto: false
  }, {
    company_id: companyid
  }, function(data) {
    // console.log(data.message.successIds);
    try {
      layer.message(data.message, {
        title: data.message.title,
        success: function(layero) {
          layero.find('.layui-layer-content').css({
            overflow: 'inherit'
          });
        }
      });
      // $detail.find('.collect').addClass('active');
      $this.find('span').html('已关注')
      $this.removeClass('js-company-follow');
    } catch (e) {}
  });
})





export {
  userTypeVerDoAjax
};