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
    shakeWorld = 0;
    scrollPosition = 0;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
		this.game.stage.backgroundColor = '#000';


    var screenShake = this.game.plugins.add(Phaser.Plugin.ScreenShake);
    this.game.plugins.ScreenShake = screenShake;


    //Draw a white square
    this.playerbmd = this.game.add.bitmapData(32, 32);
    this.playerbmd.ctx.strokeStyle = '#000';
    this.playerbmd.ctx.rect(0, 0, 32, 32);
    this.playerbmd.ctx.fillStyle = '#fff';
    this.playerbmd.ctx.fill();

    this.debris = this.game.add.bitmapData(8, 8);
    this.debris.ctx.strokeStyle = '#000';
    this.debris.ctx.rect(0, 0, 32, 32);
    this.debris.ctx.fillStyle = '#fff';
    this.debris.ctx.fill();


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
    player.tint = 0xffffff;
    player.body.gravity.y = 750;

    this.pillars = this.game.add.group();

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

    this.emitter = this.game.add.emitter(0, 0, 100);
    this.emitter.makeParticles(this.debris);
    this.emitter.gravity = 500;
    this.emitter.minParticleSpeed.setTo(-200, -200);
    this.emitter.maxParticleSpeed.setTo(200, 200);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.scoreText = this.game.add.text(Game.w - 120, 16, 'Score:  0', { font: "18px Helvetica", fill: "#ffffff" });
    this.score = 0;
  },
  update: function() {

    scrollPosition -= 6;
    ground.tilePosition.x = scrollPosition;
    background.tilePosition.x = scrollPosition * 0.1;

    if (player.alive === true) {

      // this.game.physics.arcade.overlap(player, this.pillars, this.hitPillar, null, this);
      this.game.physics.arcade.collide(player, this.pillars, this.hitPillar, null, this);
      this.game.physics.arcade.collide(group, ground);
      this.playerMovement();

    }else {
      if (this.game.input.activePointer.isDown){
        this.pillars.forEach(function(p) {
          p.alive = false;
        });
        this.game.state.start('Play');
      }
    }

  },
  hitPillar: function(plyr, pillar) {
    console.log('ouch');
      this.playerDead();
      shakeWorld = 40;
    // if (pillar.body.touching.left || pillar.body.touching.right) {
    //   console.log('hit');
    //   this.playerDead();
    // }
  },
  playerDead: function() {
    this.game.plugins.ScreenShake.start(40);

    player.alive = false;
    player.kill();
    this.emitter.x = player.x;
    this.emitter.y = player.y;
    this.emitter.start(true, 1000, null, 128);
  },
  addPillars: function() {
    if (player.alive === false) {
      return;
    }else {
      this.scoreText.setText('Score:  '+ this.score);
      this.score += 1;
    }
    var hole = Math.floor(Math.random() * 7) ;
     // Add the 6 pipes 
     for (var i = 0; i < 9; i++) {
       if (i !== hole && i !== hole + 1 && i !== hole + 2) { 
         this.addPillar(800, i * 32 + 280, i);   
       }
     }
  },
  addPillar: function(x,y, i) {

    var p;
    if (this.pillars.getFirstExists(false) === null) {
      p = this.add.sprite(x, y, this.playerbmd, 0); 
      this.game.physics.arcade.enable(p);
      p.checkWorldBounds = true;
      p.outOfBoundsKill = true;
      p.body.immovable = true;
      this.pillars.add(p);
      console.log('create pillar');
    }else {
      p = this.pillars.getFirstExists(false);
      p.reset(x, y);
      console.log('rez pillar');
    }

    if (i % 2) {
      p.tint = 0xffffff;
    }else {
      p.tint = 0xff0000;
    }

    this.game.physics.arcade.enable(p);

    p.body.velocity.x = -355; 
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
  // render: function()
  // {
  //     this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00');
  // },

};
