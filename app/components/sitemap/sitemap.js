import './sitemap.less';

var $J_sitemap = $('#J_sitemap');
var $sitemap = $J_sitemap.children('.w-sitemap');
var winWidth = $(window).width();
var winHeight = $(window).height();

$('.area-change').on('click', function() {
  var tmpHeight = $sitemap.height() + 66
  
  layer.open({
    title: '请选择城市 >>',
    closeBtn: 2,
    shadeClose: true,
    area: [(winWidth < 640 ? winWidth * .9 : 600) + 'px', (winHeight * .7 < tmpHeight ? winHeight * .7 : tmpHeight) + 'px'],
    type: 1,
    success: function($layero) {
      $layero.find('.layui-layer-title').css({
        height: '51px',
        lineHeight: '52px',
        fontWeight: 'bold',
        fontSize: '20px',
        color: '#e67124',
        background: 'inherit',
        borderBottom: '1px dashed #d9d9d9'
      })
      $layero.find('.layui-layer-setwin').css({
        right: '39px',
        top: '39px'
      })
      $layero.find('.layui-layer-content').css({
        height: $layero.height() - 52 + 'px'
      }).append($sitemap.clone(true));
    },
    //end: function() {
    //  $J_sitemap.append($sitemap);
    //}

  });
})