import './company-map.less'
var tmpl = require('./bdmap.tmpl');

var $mapBtn = $('.w-company-map');

if ($mapBtn.length) {
  window.BMAP_CONFIG = $mapBtn.data();

  if (BMAP_CONFIG.x != '') {
    $mapBtn.addClass('action').on('click', function() {
      layer.open({
        type: 1,
        title: '企业地址',
        area: ['840px', '500px'],
        content: '',
        success: function($layero, index) {
          var $iframe = $('<iframe src="about:blank" style="width:100%;height:100%;border:0"></iframe>').appendTo($layero.find('.layui-layer-content').css({overflow:'hidden'})).get(0).contentDocument.write(tmpl)
        }
      })
    });
  }

}