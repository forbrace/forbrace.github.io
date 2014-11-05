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
        
        (function  (i) {
          setTimeout(function() {
            captionCells[i].style.height = height + 'px';
          },0)
        }(i))
      };

      elem.style.height = height + 'px';

      menu.addEventListener('mouseover', onMenuMouseover);

      clip.style.cssText = '-webkit-clip-path: polygon(10px 25' +
        'px, 0px ' + height + 'px, 220px ' + height + 'px, 220px 0px, 0px 0px);';

      polygon[0].setAttribute('points', '10 25' +
        ',0 ' + height + ',220 ' + height + ',220 0,0 0');

      function onMenuMouseover(e) {

        var event = e || window.event;
        var target = event.target || event.srcElement;

        if (target.tagName != 'SPAN') return;

        clip.style.cssText = '-webkit-clip-path: polygon(10px ' +
          Math.floor(target.shift) +
          'px, 0px ' + height + 'px, 220px ' + height + 'px, 220px 0px, 0px 0px);';

        polygon[0].setAttribute('points', '10 ' +
          Math.floor(target.shift) +
          ',0 ' + height + ',220 ' + height + ',220 0,0 0');

        for (var ii = 0, ll = items.length; ii < ll; ii++) {
          items[ii].classList.remove('is-active-item');
        }
        target.content.classList.add('is-active-item');
      }
    };
  };

  document.addEventListener('DOMContentLoaded', function() {
    (new Menu()).init();
  })