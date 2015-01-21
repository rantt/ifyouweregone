/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */


// var musicOn = true;


var wKey;
var aKey;
var sKey;
var dKey;
var spaceKey;

var group, player, ground, background, scrollPosition = 0;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
		this.game.stage.backgroundColor = '#000';


    //Draw a white square
    var playerbmd = this.game.add.bitmapData(32, 32);
        playerbmd.ctx.rect(0, 0, 32, 32);
        playerbmd.ctx.fillStyle = '#fff';
        playerbmd.ctx.fill();

    //Draw a black and white checker board
    var groundbmd = this.game.add.bitmapData(32, 32);
        groundbmd.ctx.rect(0, 0, 32, 32);
        groundbmd.ctx.fillStyle = '#fff'; //set a white background for the tile
        groundbmd.ctx.fill();
        groundbmd.ctx.beginPath();
        groundbmd.ctx.rect(0, 0, 16, 16);  
        groundbmd.ctx.rect(16, 16, 16, 16);
        groundbmd.ctx.fillStyle = '#bbb';
        groundbmd.ctx.fill();


    background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, groundbmd);
    background.tileScale.set(4);
    background.tint = 0x444444;

    group = this.game.add.group();
    group.enableBody = true;
    ground = this.game.add.tileSprite(-512, this.game.height - 32, this.game.width + 512, 32, groundbmd);

    this.game.physics.arcade.enable(ground);
    ground.body.immovable = true;
    ground.body.allowGravity = false;

    player = this.game.add.sprite(128, this.game.world.centerY, playerbmd, 0, group);
    this.game.physics.arcade.enable(player);
    player.anchor.set(0.5);
    player.tint = 0x00ff00;
    player.body.gravity.y = 750;


    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);

    this.cursors = this.game.input.keyboard.createCursorKeys();

  },

  update: function() {

    this.game.physics.arcade.collide(group, ground);
    scrollPosition -= 6;
    
    ground.tilePosition.x = scrollPosition;
    background.tilePosition.x = scrollPosition * 0.1;

    if (spaceKey.isDown) {
      player.body.velocity.y = -300;
      console.log('jumpy'+player.body.velocity.y);
    }


    // background.tilePosition.x = -(scrollPosition * 0.005);
    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);

  },
  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('Health: ' + tri.health, 32, 96);
  // }
  render: function()
  {
      this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00');
  },

};
