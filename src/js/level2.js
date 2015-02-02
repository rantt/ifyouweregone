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
    scrollPosition = 0;

Game.Level2 = function(game) {
  this.game = game;
};

Game.Level2.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
		this.game.stage.backgroundColor = '#000';
    cutscene = false,

    background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, borderbmd);
    background.tileScale.set(4);
    background.tint = 0x444444;

    group = this.game.add.group();
    group.enableBody = true;

    this.borderLeft = this.game.add.tileSprite(0, 0, 32, this.game.height + 512, borderbmd, 0, group);
    this.borderLeft.enableBody = true;
    this.game.physics.arcade.enable(this.borderLeft);
    this.borderLeft.body.immovable = true;
    this.borderLeft.body.allowGravity = false;
    
    this.borderRight = this.game.add.tileSprite(this.game.width-32, 0, 32, this.game.height + 512, borderbmd, 0, group);
    this.borderRight.enableBody = true;
    this.game.physics.arcade.enable(this.borderRight);
    this.borderRight.body.immovable = true;
    this.borderRight.body.allowGravity = false;

    border = this.game.add.tileSprite(-512, this.game.height + 32, this.game.width + 512, 32, playerbmd, 0 , group);
    border.enableBody = true;
    border.enableyBody = true;
    this.game.physics.arcade.enable(border);
    border.body.immovable = true;
    border.body.allowGravity = false;
    border.tint = 0x000

    
    player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, playerbmd, 0, group);
    player.enableyBody = true;
    this.game.physics.arcade.enable(player);
    player.anchor.set(0.5);
    player.tint = 0xf660ab;
    player.body.allowGravity = false;
    player.body.gravity.y = 750;

    this.pillars = this.game.add.group();

    this.timer = this.game.time.events.loop(1500, this.addPillars, this);  
    // this.timer = this.game.time.events.loop(1400, this.addPillars, this);  

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

    Game.score = 16;
    this.deathText = this.game.add.bitmapText(Game.w - 264 , 16, 'minecraftia','Deaths:  '+Game.deaths, 32);
    this.playAgainText = this.game.add.bitmapText(this.game.world.centerX - 300, Game.h + 100, 'minecraftia','test',48);

    this.messageText = this.game.add.bitmapText(this.game.world.centerX - 300, this.game.world.centerY,'minecraftia', 'I\'d fall all over\nagain....',32);
    this.messageText.tint = 0xf660ab;
    this.game.add.tween(this.messageText).to({alpha: 0}, 1800).start();

  },

  update: function() {

    scrollPosition -= 6;


    if (Game.score < 31) {
      background.tilePosition.y = scrollPosition * 0.3;
      this.borderLeft.tilePosition.y = scrollPosition;
      this.borderRight.tilePosition.y = scrollPosition;

      if (player.alive === true) {

        this.game.physics.arcade.collide(player, this.pillars, this.hitPillar, null, this);
        this.game.physics.arcade.collide(group, player);
        this.playerMovement();

      }else {
        this.playAgainText.setText('Click to Try Again?');

        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { 
          this.game.add.tween(this.playAgainText).to({y: this.game.world.centerY - 100}, 255, Phaser.Easing.Linear.None).start();
        }, this);

        if (this.game.input.activePointer.isDown){
          this.pillars.forEach(function(p) {
            p.alive = false;
          });
          this.game.state.start('Level2');
        }
      }
    }else {
        
      if (cutscene === false) {
        console.log("I'm in");
        cutscene = true;
        player.body.velocity.x = 0;

        //Drop to Platform
        var p = this.game.add.tween(player).to({x: this.game.world.centerX, y : Game.h - 128}, 1000, Phaser.Easing.Linear.None, true);

        // Raise the Bottom Platform
        var b = this.game.add.tween(border).to({y : Game.h -  112}, 1000, Phaser.Easing.Linear.None, true);


        p.onComplete.add(function () {
          this.game.plugins.ScreenShake.start(40);
          this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { 
            this.game.state.start('Level3');
          },this);

        }, this);

      }
    }

  },
  hitPillar: function(plyr, pillar) {
    console.log('ouch');
      this.playerDead();
      shakeWorld = 40;
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
  addPillars: function() {
    if (player.alive === false) {
      return;
    }else {
      Game.score += 1;
    }
    var hole = Math.floor(Math.random() * 18) ;
     for (var i = 0; i < 23; i++) {
       if (i < hole || i > hole + 5) { 
         this.addPillar(i * 32 + 32, Game.h);   
       }
     }
  },
  addPillar: function(x,y) {

    var p;
    if (this.pillars.getFirstExists(false) === null) {
      p = this.add.sprite(x, y, playerbmd, 0); 
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

    p.tint = 0xff0000;

    this.game.physics.arcade.enable(p);

    if (Game.score < 31) {
      p.body.velocity.y = -250; 
    }else {
      p.body.velocity.x = 0;
      p.body.velocity.y = 0;
    }

  },

  playerMovement: function() {

    if (aKey.isDown) {
      player.body.velocity.x -= 20;
    }
    
    if (dKey.isDown) {
      player.body.velocity.x += 20;
    }

  },

};
