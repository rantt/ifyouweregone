var Game = {
  w: 800,
  h: 600,
  score: 0,
  deaths: 0,
  startTime: 0,
  runningTime: 0,
};


var playerbmd,
    debris,
    borderbmd;

Game.Boot = function(game) {
  this.game = game;
};

Game.Boot.prototype = {
  preload: function() {
		this.game.stage.backgroundColor = '#FFF';
		this.game.load.image('loading', 'assets/images/loading.png');
		this.game.load.image('title', 'assets/images/title.png');
		this.game.load.image('instructions', 'assets/images/instructions.png');

    this.game.load.bitmapFont('minecraftia','assets/fonts/font.png','assets/fonts/font.xml');
  },
  create: function() {
   this.game.state.start('Load');
  }
};

Game.Load = function(game) {
  this.game = game;
};

Game.Load.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;

    // Plugins 
    var screenShake = this.game.plugins.add(Phaser.Plugin.ScreenShake);
    this.game.plugins.ScreenShake = screenShake;

    //Debug Plugin
    // this.game.add.plugin(Phaser.Plugin.Debug);

    //Loading Screen Message/bar
    var loadingText = this.game.add.text(Game.w, Game.h, 'Loading...', { font: '30px Helvetica', fill: '#000' });
  	loadingText.anchor.setTo(0.5, 0.5);
  	var preloading = this.game.add.sprite(Game.w/2-64, Game.h/2+50, 'loading');
  	this.game.load.setPreloadSprite(preloading);
    
    //Draw a white square
    playerbmd = this.game.add.bitmapData(32, 32);
    playerbmd.ctx.strokeStyle = '#000';
    playerbmd.ctx.rect(0, 0, 32, 32);
    playerbmd.ctx.fillStyle = '#fff';
    playerbmd.ctx.fill();

    debris = this.game.add.bitmapData(8, 8);
    debris.ctx.strokeStyle = '#000';
    debris.ctx.rect(0, 0, 32, 32);
    // debris.ctx.fillStyle = '#fff';
    debris.ctx.fillStyle = '#f660ab';
    debris.ctx.fill();

    //Draw a black and white checker board
    borderbmd = this.game.add.bitmapData(32, 32);
    borderbmd.ctx.rect(0, 0, 32, 32);
    borderbmd.ctx.fillStyle = '#fff'; //set a white backborder for the tile
    borderbmd.ctx.fill();
    borderbmd.ctx.beginPath();
    borderbmd.ctx.rect(0, 0, 16, 16);  
    borderbmd.ctx.rect(16, 16, 16, 16);
    borderbmd.ctx.fillStyle = '#ff0000';
    borderbmd.ctx.fill();

    this.game.load.image('twitter','assets/images/twitter.png');

    // Music Track
    // this.game.load.audio('music','soundtrack.mp3');

  },
  create: function() {
    this.game.state.start('Menu');
  }
};
