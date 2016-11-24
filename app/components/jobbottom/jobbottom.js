/**
 * Created by TC-62 on 2015/12/1.
 */


var joblist = require('../joblist/joblist'),
  $jobbottom = $('.w-jobbottom'),
  $joblist = $('.w-joblist'),
  check = '.base .job input[type=checkbox]';


function checks() {
  return $joblist.find('.job-child input.checked').closest('.job-child');
}


function checkAll() {
  var url = [];
  checks().each(function() {
    url.push($(this).data('id'));
  });

  $jobbottom.find('.J-shows')
    .attr('href', url.length ? '/job_search/job_show/' + url.join('-') : 'javascript:')
    .attr('target', url.length ? '_blank' : ''); // 解决ie9一下兼容问题
}


$jobbottom
  .on('change', '.selectAll', function() {
    var ck = $(this).prop('checked');
    $joblist.find(check).prop('checked', ck)[(ck ? 'add' : 'remove') + 'Class']('checked');
    checkAll();
  })

.on('click', '.J-shows', function() {
  var $shows = checks();
  !$shows.length && layer.message({
    right: '<h4>啊哦，不能显示</h4><span>您没有选中任何职位哦！</span>',
    icon: 2
  });
});


/**
 * todo: 判断是否全选
 */
$joblist.on('click', check, function(ev) {
  var $self = $(this);
  setTimeout(function() {
    var $check = $joblist.find(check),
      ck = $self.prop('checked');

    $self[(ck ? 'add' : 'remove') + 'Class']('checked');
    $jobbottom.find('.selectAll').prop('checked', ck && $check.length == $check.filter('.checked').length);
    checkAll();
  });
  ev.stopPropagation();
});
