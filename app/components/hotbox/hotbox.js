var $hotbox = $('.w-hotbox');

$hotbox.on('mouseenter', '.rec-title li', function () {
  var $this = $(this);
  $this.addClass('active').siblings().removeClass('active');
  $hotbox.find('.rec-main ul').eq( $this.index() ).addClass('active').siblings().removeClass('active');
});