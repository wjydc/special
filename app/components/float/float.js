import './float.less';
// import share from '../share/share';

window._bd_share_config = {
  common: {
    bdText: '自定义分享内容',
    bdDesc: '自定义分享摘要',
    // bdUrl: '自定义分享url地址',
    bdPic: '自定义分享图片'
  },
  share: [{
    bdSize: 24
  }],
};


(document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)