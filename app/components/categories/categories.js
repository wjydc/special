import './categories.less'

$('.w-categories .categories-item:nth-child(2n)').css({
    background: '#f8f8f8'
  })
  .find('.cgo-image').css({
    float: 'right'
  }).end().find('.cgo-main').css({
    float: 'left'
  })