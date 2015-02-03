/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */


var group,
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
   
    floor = this.game.add.tileSprite(-512, this.game.world.height - 112, this.game.width + 512, 32, player.playerbmd, 0 , group);
    floor.enableBody = true;
    floor.enableyBody = true;
    this.game.physics.arcade.enable(floor);
    floor.body.immovable = true;
    floor.body.allowGravity = false;
    floor.tint = 0x000

    deathwave = this.game.add.tileSprite(-512, this.game.world.height - 32, this.game.width + 512, 32, player.playerbmd);
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
    // ceiling.checkWorldBounds = true;
    // ceiling.outOfBoundsKill = true;
    ceiling.body.immovable = true;

    blue = this.game.add.sprite(this.game.world.centerX, 96, player.playerbmd);
    blue.enableBody = true;
    this.game.physics.arcade.enable(blue);
    // blue.body.collideWorldBounds = true;
    blue.anchor.set(0.5);
    blue.tint = 0x00bfff;
    blue.body.immovable = true;

    player.create(this.game.world.centerX, this.game.world.height - 128, 3);
    this.game.camera.follow(player.sprite, Phaser.Camera.FOLLOW_PLATFORMER);

    this.platforms = this.add.group();

    var direction = 1;  
    for (var i = 1800;i >= 200;i-=200) {
      this.addPlatform(i, direction);
      direction *= -1;
    }

    this.deathText = this.game.add.bitmapText(Game.w - 264 , 16, 'minecraftia','Deaths:  '+Game.deaths, 32);
    this.deathText.fixedToCamera = true;
    this.playAgainText = this.game.add.bitmapText(this.game.world.centerX - 300, - 100, 'minecraftia','test',32);

    this.messageText = this.game.add.bitmapText(this.game.world.centerX - 300, this.game.world.height - 400,'minecraftia', 'I\'d climb the talest \nmountain....',32);
    this.messageText.tint = 0xf660ab;
    this.game.add.tween(this.messageText).to({alpha: 0}, 1800).start();

  },
  addPlatform: function(height, direction) {
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
    // platform.checkWorldBounds = true;
    // platform.outOfBoundsKill = true;
    platform.body.immovable = true;

    platform.body.velocity.x = this.rnd.between(100, 150) * direction;

  },
  update: function() {
    this.game.physics.arcade.collide(group, player.sprite);
    this.game.physics.arcade.collide(player.sprite, blue, this.youWin, null, this);
    this.game.physics.arcade.overlap(this.platforms, group, this.bounce, null, this);

    if (win === false) {
      background.tilePosition.y = -(this.game.camera.y * 0.3);
      if (player.alive === true) {

        this.game.physics.arcade.collide(this.platforms, player.sprite);
        
        this.game.physics.arcade.overlap(player.sprite, deathwave, function() {
          player.isDead();
          Game.deaths += 1;
          this.deathText.setText('Deaths: ' + Game.deaths);
        }, null, this);

        player.movements();

      }else {
        this.playAgainText.setText("Don't Give Up!");
        this.playAgainText.tint = 0x00bfff;

        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { 
          this.game.add.tween(this.playAgainText).to({y: 200}, 255, Phaser.Easing.Linear.None).start();
          if (this.game.input.activePointer.isDown || wKey.isDown || spaceKey.isDown || cursors.up.isDown){
            player.alive = true;
            this.game.state.start('Level3');
          }
        }, this);
          
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
    window.open('http://twitter.com/share?text=I+died+'+Game.deaths+'+times+to+save+you.+at&via=rantt_&url=http://www.divideby5.com/games/ifyouweregone/&hashtags=ifyouweregone,1GAM', '_blank');
  },

};
