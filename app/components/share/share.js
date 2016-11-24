import './share.less';

export default(share_box) => {
	var $share_box = $(share_box);
	if($share_box.length) {
		$share_box.append('<div class="bdsharebuttonbox" data-tag="share_1"><a class="bds_weixin" data-cmd="weixin"></a><a class="bds_sqq" data-cmd="sqq"></a><a class="bds_tsina" data-cmd="tsina"></a><a class="bds_more" data-cmd="more"></a></div>');
		//以下为js加载部分
		(document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)
	}
}