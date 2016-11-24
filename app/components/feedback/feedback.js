import './feedback.less';

$(function() {

  function getFileSize(obj) {
    var objValue = obj.value;
    if (objValue == "") return;
    var fileLenth = -1;
    try {
      //对于IE判断要上传的文件的大小  
      var fso = new ActiveXObject("Scripting.FileSystemObject");
      fileLenth = parseInt(fso.getFile(objValue).size);
    } catch (e) {
      try {
        //对于非IE获得要上传文件的大小  
        fileLenth = parseInt(obj.files[0].size);
      } catch (e) {
        fileLenth = -1;
      }
    }
    return fileLenth;
  }


  $(window).scroll(function() {
    $('.w-float .pageTop').css({
      display: $(document).scrollTop() < 200 ? 'none' : 'block'
    });
  }).scroll();


  $('.w-float .feedback-open').click(function() {

    layer.open({
      content: $('#feedback-tpl').html(),
      title: false,
      closeBtn: false,
      type: 1,
      area: ['600px', '600px'],
      success: function(self, index) {
        var $self = $(self)

        function tips(msg, select) {
          layer.tips('<span style="font-size:14px;color:#fff">' + msg + '</span>', $self.find(select).get(), {
            tips: [3, '#f90']
          })
        }

        $self.find('.layui-layer-content').css({
          'overflow': 'inherit'
        }).find('input[name=redirect]').val(location.href)

        $self.find('.feedback-close').one('click', function() {
          layer.close(index);
        })

        $self.find('#feedback-file').on('change', function(ev) {
          var $this = $(this);
          var vals = $this.val();
          if (vals == '' || vals.match(new RegExp($this.attr('accept').replace(/,\./g, '|\\.').replace(/^\./, '\\.')))) {
            var sp = vals.split('\\')
            $this.next().html(vals ? sp[sp.length-1] : '点击上传文件')
            if (getFileSize(this) > 2000000) {
              $this.val('')
              $this.next().html('点击上传文件');
              tips('文件大小不能超过2MB', '.feedback-file-show')
            }
          } else {
            $this.val('')
            $this.next().html('点击上传文件');
            tips('您所选的文件格式暂不支持哦', '.feedback-file-show')
          }
        })

        $self.find('.feedback-file-show').on('click', function() {
          $self.find('#feedback-file').click();
        })

        $self.find('#feedback').submit(function(ev) {
          var phone = $self.find('#feedback-phone').val();
          if (phone && !$self.find('#feedback-phone').val().match(/1\d{10}/)) {
            tips('手机号码长度为11位', '#feedback-phone')
            ev.preventDefault();
          }
          var $textarea = $self.find('textarea[name=feedback-text]')
          if (!$textarea.val() && !$('#feedback-file').val()) {
            tips('吐槽点什么呢？', 'textarea[name=feedback-text]')
            ev.preventDefault();
          }
        })
      }

    })

  })

})