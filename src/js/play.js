/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */


var wKey,
    aKey,
    sKey,
    dKey,
    spaceKey;

var group,
    player,
    ground,
    background,
    scrollPosition = 0,
    pillars;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
		this.game.stage.backgroundColor = '#000';


    //Draw a white square
    this.playerbmd = this.game.add.bitmapData(32, 32);
    this.playerbmd.ctx.strokeStyle = '#000';
    this.playerbmd.ctx.rect(0, 0, 32, 32);
    this.playerbmd.ctx.fillStyle = '#fff';
    this.playerbmd.ctx.fill();

    //Draw a black and white checker board
    var groundbmd = this.game.add.bitmapData(32, 32);
        groundbmd.ctx.rect(0, 0, 32, 32);
        groundbmd.ctx.fillStyle = '#fff'; //set a white background for the tile
        groundbmd.ctx.fill();
        groundbmd.ctx.beginPath();
        groundbmd.ctx.rect(0, 0, 16, 16);  
        groundbmd.ctx.rect(16, 16, 16, 16);
        // groundbmd.ctx.fillStyle = '#bbb';
        groundbmd.ctx.fillStyle = '#ff0000';
        groundbmd.ctx.fill();

    var pillar = this.game.add.bitmapData(32, 64);
        pillar.ctx.rect(0, 0, 32, 64);
        pillar.ctx.fillStyle = '#fff';
        pillar.ctx.fill();

    this.pillars = this.game.add.group();

    background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, groundbmd);
    background.tileScale.set(4);
    background.tint = 0x444444;

    group = this.game.add.group();
    group.enableBody = true;
    ground = this.game.add.tileSprite(-512, this.game.height - 32, this.game.width + 512, 32, groundbmd);

    this.game.physics.arcade.enable(ground);
    ground.body.immovable = true;
    ground.body.allowGravity = false;

    player = this.game.add.sprite(128, this.game.world.centerY, this.playerbmd, 0, group);
    this.game.physics.arcade.enable(player);
    player.anchor.set(0.5);
    // player.tint = 0x00ff00;
    player.tint = 0xffffff;
    player.body.gravity.y = 750;

    this.timer = this.game.time.events.loop(1500, this.addPillars, this);  

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
  addPillars: function() {
    var hole = Math.floor(Math.random() * 5) + 1;
     // Add the 6 pipes 
     for (var i = 0; i < 9; i++)
       if (i != hole && i != hole + 1 && i != hole + 2) { 
         this.addPillar(800, i * 32 + 280, i);   
       }
  },
  addPillar: function(x,y, i) {
    var p = this.add.sprite(x, y, this.playerbmd, 0)
    p.checkWorldBounds = true;
    p.outOfBoundsKill = true;

    if (i % 2) {
      p.tint = 0xffffff;
    }else {
      p.tint = 0xff0000;
    }
    this.game.physics.arcade.enable(p);

    p.body.velocity.x = -355; 
  },
  update: function() {

    this.game.physics.arcade.collide(group, ground);
    this.playerMovement();

    scrollPosition -= 6;
    ground.tilePosition.x = scrollPosition;
    background.tilePosition.x = scrollPosition * 0.1;

  },
  playerMovement: function() {
    if (spaceKey.isDown && player.body.touching.down) {
      player.body.velocity.y = -600;
        this.game.add.tween(player).to({angle: player.angle - 270}, 800, Phaser.Easing.Linear.None).start();
    }

    spaceKey.onUp.add(function() {
      if (player.body.velocity.y < -200) {
        player.body.velocity.y = -200;
      }
    },this);
  },
  render: function()
  {
      this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00');
  },

};
