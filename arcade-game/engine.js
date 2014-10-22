var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        patterns = {},
        lastTime;

    canvas.width = game.WIDTH;
    canvas.height = game.HEIGHT;

    doc.body.appendChild(canvas);

    function main() {
      var now = Date.now(),
          dt = (now - lastTime) / 1000.0;

      update(dt);
      render();

      lastTime = now;
      win.requestAnimationFrame(main);
    };

    function init() {
      reset();
      lastTime = Date.now();
      main();
    }

    function update(dt) {
        updateEntities(dt);
        // game.timer(dt)
        checkCollisions();
    }
    
    function checkCollisions() {
      for (var i = 0, l = allEnemies.length; i < l; i++) {

        if (collided(player, allEnemies[i])) {
          player.reset(ctx);
        }
        
        if (collided(player, prize) && !collided(player, allEnemies[i])) {
          prize.score();
        }
        
        function collided(obj1, obj2) {
          // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
          var obj1Rect = {
            x:      obj1.rect.x,
            y:      obj1.rect.y,
            width:  obj1.rect.width - game.collisionOffset,
            height: obj1.rect.height - game.collisionOffset
          };
          var obj2Rect  = {
            x:      obj2.rect.x,
            y:      obj2.rect.y,
            width:  obj2.rect.width - game.collisionOffset,
            height: obj2.rect.height - game.collisionOffset  
          }
          if (obj1Rect.x < obj2Rect.x + obj2Rect.width &&
              obj1Rect.x + obj1Rect.width > obj2Rect.x &&
              obj1Rect.y < obj2Rect.y + obj2Rect.height &&
              obj1Rect.height + obj1Rect.y > obj2Rect.y) {
              // collision detected!
              return true;
          }
          
        }
        
      }
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(dt);
    }

    function render() {
        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/grass-block.png',
                'images/grass-block.png'
            ],
            numRows = game.rows,
            numCols = game.cols,
            row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * game.CELL_WIDTH, row * game.CELL_HEIGHT);
            }
        }

        renderEntities();
    }

    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        prize.render();
        player.render();
    }

    function reset() {
        // noop
    }

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/Gem Blue.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Heart.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
