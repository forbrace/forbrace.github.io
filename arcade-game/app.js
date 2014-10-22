var game = {};

game.X = 0; // x coordinate
game.Y = 0; // x coordinate
game.cols = 8;
game.rows = 6;

game.collisionOffset = 10;

game.CELL_WIDTH = 101; // cell width
game.CELL_HEIGHT = 83; // cell height
game.CELL_OFFSET = 20; // player position cell offset

game.WIDTH = game.CELL_WIDTH * game.cols; // game canvas width
game.HEIGHT = game.CELL_HEIGHT * game.rows + 90; // game canvas height
game.TRACK_WIDTH = game.CELL_WIDTH * game.cols; // enemy track length
game.TRACK_OFFSET = -game.CELL_WIDTH; // enemy track start    

game.prizes = 10; // # of diamonds to collect
game.lifes = 3; // # of lifes
game.running = true;

// Timer constructor
game.Timer = function() {
  var that = this;
  
  this.now = new Date(0, 0, 1);
  
  // create and append timer div to body
  this.timerElem = document.createElement('div');
  this.timerElem.className = 'timer';
  this.timerElem.innerHTML = '00:00:00';
  document.body.appendChild(this.timerElem);
  //assing func to count method
  this.count = count;
  // count func
  function count() {
    // count every second
    that.now.setSeconds(that.now.getSeconds() + 1);
    
    var hh = that.now.getHours() < 10 ? '0' + that.now.getHours() : that.now.getHours();
    var mm = that.now.getMinutes() < 10 ? '0' + that.now.getMinutes() : that.now.getMinutes();
    var ss = that.now.getSeconds() < 10 ? '0' + that.now.getSeconds() : that.now.getSeconds();
    
    that.timerElem.innerHTML = hh + ':' + mm + ':' + ss;
    
    that.timerId = setTimeout(function() {
      count();
    },1000);
  }
  
};
game.Timer.prototype.start = function() {
  var that = this;
  // add 1sec delay to start from 00:00:00
  setTimeout(function() {
    that.count();
  }, 1000);
  return this;
};
game.Timer.prototype.stop = function() {
  clearTimeout(this.timerId);
  return this;
};
game.Timer.prototype.reset = function() {
  this.timerElem.innerHTML = '00:00:00';
  this.now = new Date(0, 0, 1);
  return this;
};

var timer = new game.Timer();
timer.start();

game.over = function(headingText, buttonText) {
  // create overlay, splash, heading & restart button
  var overlay = document.createElement('div');
  overlay.className = 'overlay';
  var splash = document.createElement('div');
  splash.className = 'splash';
  splash.innerHTML = '<h1>'+headingText+'<h1>';
  
  splash.style.paddingTop = ctx.canvas.height/2 - 50 + 'px';
  
  var button = document.createElement('button');
  button.innerHTML = buttonText;
  // add event listener on button click to remove overlay & splash and restart the game
  button.addEventListener('click', function() {
    // remove splash
    document.body.removeChild(overlay);
    document.body.removeChild(splash);
    // reset game
    game.restart();
  });
  // append created nodes to DOM
  splash.appendChild(button);
  
  document.body.appendChild(overlay);
  document.body.appendChild(splash);
  
  // stop timer
  timer.stop();
  
  game.running = false;
}

game.restart = function() {
  game.running = true;
  timer.reset().start();
  player.reset(ctx);
  prize.updateLocation();
  prize.scores.length = 0;
  game.lifes = 3;
};
    
// Enemies our player must avoid
var Enemy = function(options) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    
    // if no options provided use some defaults
    var options = options || {};
    
    this.sprite = 'images/enemy-bug.png';
    
    // enemy rect
    this.rect = {
      x: options.startX || game.TRACK_OFFSET,
      y: options.startY || game.CELL_HEIGHT - game.CELL_OFFSET,
      width: game.CELL_WIDTH,
      height: game.CELL_HEIGHT
    };
    
    // enemy speed
    this.speed = options.speed || 50;
    
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    // if the game is over stop enemy at last x position
    // else move enemy from track start to track end infinitely
    
    if (game.running) {
      // clear ctx
      ctx.clearRect(0,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight);
      // loop enemy movement from -1 cell to cell.length + 1
      this.rect.x = this.rect.x > game.TRACK_WIDTH ? 
                    game.TRACK_OFFSET : 
                    this.rect.x + this.speed * dt;
    }
    
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.rect.x, this.rect.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  
  var that = this;
  
  this.sprite = 'images/char-boy.png';
  this.lifeSprite = 'images/Heart.png';
  
  // player initial location
  this.initLocation = {
    x: game.CELL_WIDTH * 4,
    y: game.CELL_HEIGHT * 5 - game.CELL_OFFSET
  };
  
  // player rect
  this.rect = {
    x: this.initLocation.x, // initial x position
    y: this.initLocation.y, // bottom row, initial y position
    width: game.CELL_WIDTH,
    height: game.CELL_HEIGHT
  };
  
  // reset player
  this.reset = function(ctx) {
    game.lifes -= 1;
    if (game.lifes === 0) {
      game.over('Game Over!', 'Play Again');
      return;
    }
    // clear ctx
    ctx.clearRect(0,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight);
    // set player to initial location
    this.rect.x = this.initLocation.x;
    this.rect.y = this.initLocation.y;
  }
  
  this.ratio = function() {
    return Resources.get(this.lifeSprite).width/Resources.get(this.lifeSprite).height;
  }
  
};

Player.prototype.update = function(dt) {
  if (game.running) {
    // clear ctx
    ctx.clearRect(0,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight);
    // cache this
    var that = this;
    // check if in the water i.e. upper cell
    var inTheWater = (this.rect.y === -game.CELL_OFFSET);
    // if in the water restart the game
    if (inTheWater) {
      this.reset(ctx);
    }
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.rect.x, this.rect.y);
  for (var i = 0; i < game.lifes; i++) {
    ctx.drawImage(Resources.get(this.lifeSprite), game.WIDTH - 30 - 30 * i, 0, 30, 30/this.ratio());
  };
};

Player.prototype.handleInput = function(key) {
  if (game.running) {
    // change player coordinates depending on key press
    switch (key) {
    case 'down':
      this.rect.y = this.rect.y === this.initLocation.y ? 
                    this.initLocation.y : 
                    this.rect.y + game.CELL_HEIGHT;
      break;
    case 'up':
      this.rect.y = this.rect.y === -game.CELL_OFFSET ?
                    -game.CELL_OFFSET :
                    this.rect.y - game.CELL_HEIGHT;
      break;
    case 'left':
      this.rect.x = this.rect.x === game.X ?
                    game.X :
                    this.rect.x - game.CELL_WIDTH;
      break;
    case 'right':
      this.rect.x = this.rect.x === game.WIDTH - game.CELL_WIDTH ?
                    game.WIDTH - game.CELL_WIDTH :
                    this.rect.x + game.CELL_WIDTH;
      break;
    default:
      break;
    } 
  }
};

// Prize constructor
var Prize = function() {
  // cache this
  var that = this;
  
  this.sprite = 'images/Gem Blue.png';
  this.rect = {
    x: randLocation().x,
    y: randLocation().y,
    width: game.CELL_WIDTH,
    height: game.CELL_HEIGHT
  };
  // store picked diamonds
  this.scores = [];
  
  // calc diamond width/height ratio
  this.ratio = function(){
    return Resources.get(that.sprite).width/Resources.get(that.sprite).height;
  }
  
  // draw picked diamonds with its width step
  this.displayScore = function(ctx, step) {
    if (ctx && typeof step !== 'undefined') {
      ctx.drawImage(Resources.get(that.sprite), 30 * step, 0, 30, 30/this.ratio());
    }
  };
  // randomize diamond location
  this.updateLocation = function(ctx) {
    this.rect.x = randLocation().x;
    this.rect.y = randLocation().y;
  };
  // random location depends from num of cols and rows
  function randLocation() {
    return {
      x: game.CELL_WIDTH * rand(0, game.cols - 1),
      y: game.CELL_HEIGHT * rand(1, game.rows - 3)  - game.CELL_OFFSET
    }
  }
  // generate rand from min to max
  function rand(min, max) {
    var rand = min - 0.5 + Math.random()*(max-min+1)
    rand = Math.round(rand);
    return rand;
  }
  
};
// render prize
Prize.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.rect.x, this.rect.y);
  // dsplay picked diamonds one by one
  if (this.scores.length) {
    for (var step = 0; step < this.scores.length; step++) {
      this.displayScore(ctx, step);
    }
  }
};
// count picked diamonds
Prize.prototype.score = function() {
  if (game.running) {
    // if picked all diamonds
    if (this.scores.length === game.prizes-1) {
      // game completed
      game.over('Good Job!', 'Play Again');
    } else if (this.scores.length < game.prizes) {
      // randomize location
      this.updateLocation();
    }
    this.scores.push(this);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy(
  {
    startX: game.TRACK_OFFSET,
    startY: game.CELL_HEIGHT - game.CELL_OFFSET,
    speed: 50
  }
);
var enemy2 = new Enemy(
  {
    startX: game.TRACK_OFFSET*5,
    startY: game.CELL_HEIGHT*2 - game.CELL_OFFSET,
    speed: 70
  }
);
var enemy3 = new Enemy(
  {
    startX: game.TRACK_OFFSET*4,
    startY: game.CELL_HEIGHT*3 - game.CELL_OFFSET,
    speed: 90
  }
);
var enemy4 = new Enemy(
  {
    startX: game.TRACK_OFFSET*2,
    startY: game.CELL_HEIGHT*4 - game.CELL_OFFSET,
    speed: 60
  }
);
var player = new Player();
var allEnemies = [enemy1, enemy2, enemy3, enemy4];

var prize = new Prize();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});