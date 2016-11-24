import './search.less';

var $Search = $('.w-search')
var $area = $('.w-area-all .area-class a');


// $Search.on('click.searchmap', '.search-btn', function() {
//   var $val = $Search.find('.search-val')
//   var value = $.trim($val.val());
//   if (value == '') {
//     layer.tips('请输入城市名', $val, { tips: 3, time: 2400 });
//     return;
//   }

//   var regexp = RegExp(value);
//   $area.each(function() {
//     var $item = $(this)
//     var area = $item.html();

//     if (regexp.test(area)) {
//       $item.addClass('action')
//     } else {
//       $item.removeClass('action')
//     }
//   })

//   var $filter = $area.filter('.action');
//   if ($filter.length == 1) {
//     location.href = $filter.attr('href');
//   }

// });



// $Search.on('keydown', '.search-val', function(ev) {
//   if (ev.keyCode == 13) {
//     $Search.find('.search-btn').trigger('click.searchmap');
//     ev.preventDefault();
//   }
// });