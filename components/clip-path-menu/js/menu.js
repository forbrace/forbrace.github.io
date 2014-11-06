var Menu = function(options) {

  var self = this;
  var options = options || {};
  var elem = options.elem || document.querySelector('.menu');

  var clip = elem.querySelector('.clip'),
    menu = elem.querySelector('.menu-list'),
    links = elem.querySelectorAll('.menu-item-link span'),
    polygon = elem.querySelectorAll('polygon'),
    items = elem.querySelectorAll('.menu-content-item');
  captionCells = elem.querySelectorAll('.menu-content-item-cell');

  self.init = function(argument) {
    var height = 0;

    for (var i = 0, l = links.length; i < l; i++) {

      height += links[i].offsetHeight;
      links[i].shift = (height - links[i < 2 ? i : i - 1].offsetHeight) + links[i].offsetHeight / 2;
      links[i].content = items[i];

      (function(i) {
        setTimeout(function() {
          captionCells[i].style.height = height + 'px';
        }, 0)
      }(i))
    };

    elem.style.height = height + 'px';
    menu.addEventListener('mouseover', onMenuMouseover);
    renderPolygon(height);

    function onMenuMouseover(e) {

      var event = e || window.event;
      var target = event.target || event.srcElement;

      if (target.tagName != 'SPAN') return;

      renderPolygon(height, target.shift);

      for (var i = 0, l = items.length; i < l; i++) {
        items[i].classList.remove('is-active-item');
        links[i].parentNode.classList.remove('is-active');
      }
      target.content.classList.add('is-active-item');
      target.parentNode.classList.add('is-active');
    }

    function renderPolygon(height, shift) {
      var shift = shift || 25;

      clip.style.cssText = '-webkit-clip-path: polygon(10px ' + Math.floor(shift) +
                          'px, 0px ' + height + 'px, 220px ' + height + 'px, 220px 0px, 0px 0px);';

      polygon[0].setAttribute('points', '10 ' + Math.floor(shift) +
                              ',0 ' + height + ',220 ' + height + ',220 0,0 0');
    }

  };
};

document.addEventListener('DOMContentLoaded', function() {
  (new Menu()).init();
})