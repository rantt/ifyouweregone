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
    blue,
    ground,
    background,
    deathwave,
    facing,
    cutscene = false;
    win = false;
    scrollPosition = 0;

Game.Level3 = function(game) {
  this.game = game;
};

Game.Level3.prototype = {
  init: function() {
    this.game.world.resize(800, 2000);
  },
  create: function() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.stage.backgroundColor = '#000';

    background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, borderbmd);
    background.tileScale.set(4);
    background.tint = 0x444444;
    background.fixedToCamera = true;

    group = this.game.add.group();
    group.enableBody = true;

    var borderLeft = this.game.add.tileSprite(0, 0, 32, this.game.world.height + 512, borderbmd, 0, group);
    borderLeft.enableBody = true;
    game.physics.arcade.enable(borderLeft);
    borderLeft.body.immovable = true;
    borderLeft.body.allowGravity = false;
    
    var borderRight = this.game.add.tileSprite(this.game.width-32, 0, 32, this.game.world.height + 512, borderbmd, 0, group);
    borderRight.enableBody = true;
    game.physics.arcade.enable(borderRight);
    borderRight.body.immovable = true;
    borderRight.body.allowGravity = false;
   
    floor = this.game.add.tileSprite(-512, this.game.world.height - 112, this.game.width + 512, 32, playerbmd, 0 , group);
    floor.enableBody = true;
    floor.enableyBody = true;
    this.game.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor.tint = 0x000

    deathwave = this.game.add.tileSprite(-512, this.game.world.height - 32, this.game.width + 512, 32, playerbmd);
    deathwave.enableBody = true;
    this.game.physics.arcade.enable(deathwave);
    deathwave.body.immovable = true;
    deathwave.body.allowGravity = false;
    deathwave.tint = 0xff0000;
    deathwave.body.velocity.y = -25;


    // Top Platform
    var ceilingbmd = this.game.add.bitmapData(256, 32);
    ceilingbmd.ctx.strokeStyle = '#000';
    ceilingbmd.ctx.rect(0, 0, 256, 32);
    ceilingbmd.ctx.fillStyle = '#00';
    ceilingbmd.ctx.fill();
    var ceiling = this.add.sprite(this.game.world.centerX, 128, ceilingbmd, 0, group);
    this.game.physics.arcade.enable(ceiling);
    ceiling.anchor.set(0.5);
    ceiling.checkWorldBounds = true;
    ceiling.outOfBoundsKill = true;
    ceiling.body.immovable = true;


    player = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 128, playerbmd);
    player.enableyBody = true;
    this.game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.anchor.set(0.5);
    player.tint = 0xf660ab;
    player.body.gravity.y = 1000;
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    blue = this.game.add.sprite(this.game.world.centerX, 96, playerbmd);
    blue.enableBody = true;
    this.game.physics.arcade.enable(blue);
    blue.body.collideWorldBounds = true;
    blue.anchor.set(0.5);
    blue.tint = 0x00bfff;
    // blue.body.allowGravity = false;
    blue.body.immovable = true;


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
    this.emitter.makeParticles(debris);
    this.emitter.gravity = 500;
    this.emitter.minParticleSpeed.setTo(-200, -200);
    this.emitter.maxParticleSpeed.setTo(200, 200);
  
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.platforms = this.add.group();

    for (var i = 1800;i >= 200;i-=200) {
      this.addPlatform(i)
    }

    this.deathText = this.game.add.bitmapText(Game.w - 264 , 16, 'minecraftia','Deaths:  '+Game.deaths, 32);
    this.deathText.fixedToCamera = true;
    this.playAgainText = this.game.add.bitmapText(this.game.world.centerX - 300, - 100, 'minecraftia','test',48);

    this.messageText = this.game.add.bitmapText(this.game.world.centerX - 300, this.game.world.height - 400,'minecraftia', 'I\'d climb the talest \nmountain....',32);
    this.messageText.tint = 0xf660ab;
    this.game.add.tween(this.messageText).to({alpha: 0}, 1800).start();




  },
  addPlatform: function(height) {
    if (player.alive === false) {
      return;
    }

    //Platform Size
    var platformLength = this.rnd.between(3, 8);

    //Draw a white square
    var platformbmd = this.game.add.bitmapData(32*platformLength, 32);
    platformbmd.ctx.strokeStyle = '#000';
    platformbmd.ctx.rect(0, 0, 32*platformLength, 32);
    platformbmd.ctx.fillStyle = '#fff';
    platformbmd.ctx.fill();

    var platform = this.add.sprite(this.game.world.centerX, height, platformbmd, 0, this.platforms);
    this.game.physics.arcade.enable(platform);
    platform.checkWorldBounds = true;
    platform.outOfBoundsKill = true;
    platform.body.immovable = true;

    platform.body.velocity.x = this.rnd.between(100, 150);
    

  },
  update: function() {
    this.game.physics.arcade.collide(group, player);
    this.game.physics.arcade.collide(player, blue, this.youWin, null, this);

    if (win === false) {
      background.tilePosition.y = -(this.game.camera.y * 0.3);
      if (player.alive === true) {

        this.game.physics.arcade.overlap(this.platforms, group, this.bounce, null, this);
        this.game.physics.arcade.collide(this.platforms, player);
        this.game.physics.arcade.overlap(player, deathwave, this.playerDead, null, this);
        this.playerMovement();

      }else {
        this.playAgainText.setText("Don't Give Up!");
        this.playAgainText.tint = 0x00bfff;

        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { 
          this.game.add.tween(this.playAgainText).to({y: 200}, 255, Phaser.Easing.Linear.None).start();
        }, this);

          
        if (this.game.input.activePointer.isDown || wKey.isDown || spaceKey.isDown || this.cursors.up.isDown){
          this.game.state.start('Level3');
        }
      }
    }

  },
  youWin: function() {
    this.messageText = this.game.add.bitmapText(this.game.world.centerX - 350, 150,'minecraftia', '...because I love you.',32);
    this.messageText.tint = 0xf660ab;
    this.messageText.alpha = 1;
    this.youWinText = this.game.add.bitmapText(this.game.world.centerX - 350, 200, 'minecraftia','You never gave up.\nNeither did I.\nLet\'s go home.',32);
    this.youWinText.tint = 0x00bfff;
    win = true;

    this.twitterButton = this.game.add.button(450, 275,'twitter', this.twitter, this);
    this.twitterButton.fixedToCamera = true;

    deathwave.body.velocity.y = 0;

  },
  bounce: function(platform) {
    platform.body.velocity.x *= -1;
  },
  twitter: function() {
    window.open('http://twitter.com/share?text=I+died+'+Game.deaths+'+times+to+save+you.+at&via=rantt_&url=http://www.divideby5.com/games/ifyouweregone/', '_blank');
  },

  playerDead: function() {
    this.game.plugins.ScreenShake.start(40);

    Game.deaths += 1;
    this.deathText.setText('Deaths: ' + Game.deaths);

    player.alive = false;
    player.kill();
    this.emitter.x = player.x;
    this.emitter.y = player.y;
    this.emitter.start(true, 1000, null, 128);
  },

  playerMovement: function() {


    player.body.velocity.x = 0;

    if (aKey.isDown || this.cursors.left.isDown) {
      player.body.velocity.x = -300;
      facing = 'left';
    }
    if (dKey.isDown || this.cursors.right.isDown) {
      player.body.velocity.x = 300;
      facing = 'right';
    }

    // if (spaceKey.isDown) {
    //   player.body.velocity.y -= 30;
    // }

    if ((spaceKey.isDown || this.game.input.activePointer.isDown || this.cursors.up.isDown || wKey.isDown) && player.body.touching.down) {
        player.body.velocity.y = -700;
        if ( facing === 'left') {
          this.game.add.tween(player).to({angle: player.angle + 180}, 600, Phaser.Easing.Linear.None).start();
        }else {
        this.game.add.tween(player).to({angle: player.angle - 180}, 600, Phaser.Easing.Linear.None).start();
        }

    }

    spaceKey.onUp.add(function() {
      lowJump();
    },this);

    this.game.input.onUp.add(function() {
      lowJump();
    },this);

    wKey.onUp.add(function() {
      lowJump();
    },this);

    this.cursors.up.onUp.add(function() {
      lowJump();
    },this);

    function lowJump() {
      if (player.body.velocity.y < -200) {
        player.body.velocity.y = -200;
      }
    }


  },

};
