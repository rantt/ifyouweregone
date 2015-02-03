/*global Game*/

var wKey,
    aKey,
    sKey,
    dKey,
    spaceKey,
    cursors;


var Player = function(game) {
  this.game = game;
  this.sprite = null;
  this.alive = true;
  this.facing = 'right';
  this.playerbmd = null;
  this.debris = null;
  this.level = 0;
};

Player.prototype = {
  preload: function() {
    //Draw a white square
    this.playerbmd = this.game.add.bitmapData(32, 32);
    this.playerbmd.ctx.strokeStyle = '#000';
    this.playerbmd.ctx.rect(0, 0, 32, 32);
    this.playerbmd.ctx.fillStyle = '#fff';
    this.playerbmd.ctx.fill();

    this.debris = this.game.add.bitmapData(8, 8);
    this.debris.ctx.strokeStyle = '#000';
    this.debris.ctx.rect(0, 0, 32, 32);
    this.debris.ctx.fillStyle = '#f660ab';
    this.debris.ctx.fill();

    this.game.load.audio('jump','assets/audio/jump.wav');
    this.game.load.audio('dead','assets/audio/dead.wav');
  },
  create: function(x, y, lvl) {

    // this.sprite = this.game.add.sprite(128, this.game.world.centerY, this.playerbmd);
    this.sprite = this.game.add.sprite(x, y, this.playerbmd);
    this.level = lvl;

    this.game.physics.arcade.enable(this.sprite);
    this.sprite.enableBody = true;
    this.sprite.anchor.set(0.5);
    this.sprite.tint = 0xf660ab;

    if (lvl !== 2) {
      this.sprite.body.gravity.y = 750;
    }else {
      this.sprite.body.allowGravity = false;
    }
    
    console.log(this.sprite.body.velocity.y);

    //Setup WASD and extra keys
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.emitter = this.game.add.emitter(0, 0, 100);
    this.emitter.makeParticles(this.debris);
    this.emitter.gravity = 500;
    this.emitter.minParticleSpeed.setTo(-200, -200);
    this.emitter.maxParticleSpeed.setTo(200, 200);
  
    cursors = this.game.input.keyboard.createCursorKeys();

    //Add SFX
    this.deadSnd = this.game.add.sound('dead');
    this.deadSnd.volume = 0.5;

    this.jumpSnd = this.game.add.sound('jump');
    this.jumpSnd.volume = 0.5;


  },
  frontFlip: function() {
     if (this.flipping) {
       return;
     } 
     this.flipping = true;
     var t;
     if ( this.facing !== 'left') {
       var f = this.game.add.tween(this.sprite).to({angle: this.sprite.angle + 180}, 600, Phaser.Easing.Linear.None).start();
     }else {
       var f = this.game.add.tween(this.sprite).to({angle: this.sprite.angle - 180}, 600, Phaser.Easing.Linear.None).start();
     }
     f.onComplete.add(function() {
       this.flipping = false;
     },this);

  },
  movements: function() {
    self = this;

    if (this.level === 2) {
      if (aKey.isDown || cursors.left.isDown) {
        this.sprite.body.velocity.x -= 20;
      }
      
      if (dKey.isDown || cursors.right.isDown) {
        this.sprite.body.velocity.x += 20;
      }

    }else {
      if ((spaceKey.isDown || this.game.input.activePointer.isDown || cursors.up.isDown || wKey.isDown) && this.sprite.body.touching.down) {
          this.jumpSnd.play();
          this.sprite.body.velocity.y = -600;
          this.frontFlip();
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

      cursors.up.onUp.add(function() {
        lowJump();
      },this);

      function lowJump() {
        if (self.sprite.body.velocity.y < -200) {
          self.sprite.body.velocity.y = -200;
        }
      }

      if (this.level === 3) {
        this.sprite.body.velocity.x = 0;

        if (aKey.isDown || cursors.left.isDown) {
          this.sprite.body.velocity.x = -300;
          this.facing = 'left';
        }
        if (dKey.isDown || cursors.right.isDown) {
          this.sprite.body.velocity.x = 300;
          this.facing = 'right';
        }

      }

    }
    
  },
  isDead: function() {
    this.game.plugins.ScreenShake.start(40);
    this.deadSnd.play();

    this.alive = false;
    this.flipping = false;
    this.sprite.kill();
    this.emitter.x = this.sprite.x;
    this.emitter.y = this.sprite.y;
    this.emitter.start(true, 1000, null, 128);
  },


};
