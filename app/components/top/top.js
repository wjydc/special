/**
 * Created by TC-62 on 2015/10/20.
 */

import './top.less';
import config from '../config';

var sso, parameter = {},
  $top = $('.top_box');


/**
 * iframe 延迟加载
 */
function lazyload() {
  var $topItem = $top.find('.top-item');

  function load() {
    var $self = $(this);
    if (!$self.attr('src')) {
      $self.attr('src', $self.attr('lazy-src'));
    }
  }
  $topItem.one('mouseenter', function() {
    $(this).find('[lazy-src]').each(load);
  });
  setTimeout(function() {
    $top.find('[lazy-src]').each(load);
  }, 5000);
}



/**
 * 初始化sso
 */
function initSso() {
  try {
    sso = new SSO_Controller(null, $);
    sso.init({
      name: 'sso',
      encoding: 'utf-8',
      is_check_login_state: false,
      custom_login_state_callback: function(cookieinfo) {
        loginEnter(cookieinfo);
      }
    });
    sso = window.sso = sso;
    sso.custom_login_state_callback(sso.cookieinfo);
  } catch (err) {
    console && console.log(err);
  }
}




// <div class="top-item">免费注册 <i class="arrow"></i>
//   <div class="top-item-box register">
//     <a href="http://i.veryeast.cn/user/register">个人注册</a>
//     <a href="http://vip.veryeast.cn/reg.asp">企业注册</a>
//   </div>
// </div>
// <i class="splitline"></i>
// <a   class="top-item" href="http://i.veryeast.cn/user/login">用户登录</a>

// <span class="top-item top-logged">
//   <span>您好，<a class="user-name" href="http://my.veryeast.cn/user/home/">个人</a>，欢迎来到最佳东方！</span>
//   <a class="user-page" href="http://my.veryeast.cn/user/home/">进入我的最佳东方</a>
//   <a class="login-logout">[退出]</a>
// </span>

// <span class="top-item top-logged">
//   <span>您好，<a class="user-name" href="http://vip.veryeast.cn/">企业</a>，欢迎来到最佳东方！</span>
//   <a class="user-page" href="http://vip.veryeast.cn/">进入招聘通</a>
//   <a class="login-logout">[退出]</a>
// </span>

/**
 * 登陆状态模板
 */
function loginInit() {
  parameter.autologin = 1;
  parameter['welcome'] = '<div class="top-item">免费注册 <i class="arrow"></i><div class="top-item-box register"><a href="http://i.veryeast.cn/user/register">个人注册</a><a href="http://vip.veryeast.cn/reg.asp">企业注册</a></div></div><i class="splitline"></i><a   class="top-item" href="http://i.veryeast.cn/user/login">用户登录</a>';
  parameter['vip'] = '<span class="top-item top-logged"><span>您好，<a class="user-name" href="http://vip.veryeast.cn/">企业</a>，欢迎来到最佳东方！</span><a class="user-page" href="http://vip.veryeast.cn/">进入招聘通</a><a class="login-logout">[退出]</a></span>'
  parameter['my'] = '<span class="top-item top-logged"><span>您好，<a class="user-name" href="http://my.veryeast.cn/user/home/">个人</a>，欢迎来到最佳东方！</span><a class="user-page" href="http://my.veryeast.cn/user/home/">进入我的最佳东方</a><a class="login-logout">[退出]</a></span>';
}




/**
 * 登陆状态的回掉函数
 * @param data // sso.cookieinfo
 */
function loginEnter(data) {
  var name, type, $tl = $('.js-top-login');

  if (data && (parameter.username = name = data.username)) {
    type = data.user_type;
    if (1 == type) {
      $tl.html(parameter.vip);

    } else if (2 == type) {
      $tl.html(parameter.my);
    }
    $tl.find('.user-name').html(name);
  } else {
    $tl.html(parameter.welcome);
  }
}


/**
 * 退出
 */
function logout() {
  sso.logout('script');
  initSso();
}




function operate() {
  $top.on('mouseenter', '.top-item', function() {
    $(this).find('.top-item-box').stop().slideDown(200);
  }).on('mouseleave', '.top-item', function() {
    $(this).find('.top-item-box').stop().slideUp(200);
  });

  $top.on('click', '.login-logout', logout);
}



/**
 * 获取用户基本信息
 */
$.ajax({
  url: config.jsonpBase + '/api/get-login-user-info?format=jsonp',
  method: 'GET',
  dataType: 'jsonp',
  cache: false,
  success: function(data) {
    window.USER_INFO = data;
  }
});
$('.login-logout').on('click', function() {
  setTimeout(function() {
    USER_INFO.status = 2;
  }, 500);
});
// ---


function init() {
  loginInit();
  initSso();
  operate();
  lazyload();
}

init();


// 对外接口，退出
exports.logout = logout;
// 状态刷新，（登陆后操作）
exports.initSso = initSso;