/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */



var group,
    ground,
    background,
    cutscene = false,
    scrollPosition = 0;

Game.Level1 = function(game) {
  this.game = game;
};

Game.Level1.prototype = {
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);
		this.game.stage.backgroundColor = '#000';

    background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, borderbmd);
    background.tileScale.set(4);
    background.tint = 0x444444;

    border = this.game.add.tileSprite(-512, this.game.height - 32, this.game.width + 512, 32, borderbmd);
    border.enableBody = true;

    this.game.physics.arcade.enable(border);
    border.body.immovable = true;
    border.body.allowGravity = false;

    player.create(128, this.game.world.centerY);

    this.pillars = this.game.add.group();

    this.timer = this.game.time.events.loop(1500, this.addPillars, this);  

    // Music
    this.music = this.game.add.sound('music');
    this.music.volume = 0.5;
    this.music.play('',0,1,true);

    Game.score = 0;

    this.deathText = this.game.add.bitmapText(Game.w - 230 , 16, 'minecraftia','Deaths: '+Game.deaths, 32);
    this.playAgainText = this.game.add.bitmapText(Game.w + 100, this.game.world.centerY, 'minecraftia','test',48);

    this.messageText = this.game.add.bitmapText(this.game.world.centerX - 300, this.game.world.centerY,'minecraftia', 'I\'d run through fire...',32);
    this.messageText.tint = 0xf660ab;
    this.game.add.tween(this.messageText).to({alpha: 0}, 1800).start();
 

  },
  update: function() {

    scrollPosition -= 6;
    if (Game.score < 16) {

      border.tilePosition.x = scrollPosition;
      background.tilePosition.x = scrollPosition * 0.1;

      if (player.alive === true) {
        this.game.physics.arcade.collide(player.sprite, this.pillars, this.hitPillar, null, this);
        this.game.physics.arcade.collide(border, player.sprite);
        player.movements();
      }else {

        this.playAgainText.setText('Try Again?');

        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { 
            this.game.add.tween(this.playAgainText).to({x: this.game.world.centerX-300}, 355, Phaser.Easing.Linear.None).start();
        }, this);
          
        if (this.game.input.activePointer.isDown || wKey.isDown || spaceKey.isDown || cursors.up.isDown){
          this.pillars.forEach(function(p) {
            p.alive = false;
          });
          this.music.stop();
          player.alive = true;
          this.game.state.start('Level1');
        }
      }

     
    }else {
      background.tilePosition.y = scrollPosition * 0.3;
      if (cutscene === false) {
        this.game.time.events.remove(this.timer); 

        cutscene = true;
        player.sprite.body.velocity.y = 0;
        player.sprite.body.allowGravity = false;
        var p = this.game.add.tween(player.sprite).to({x: this.game.world.centerX, y : this.game.world.centerY - 100}, 2000, Phaser.Easing.Linear.None, true);

          this.pillars.forEach(function(p) {
            p.body.velocity.x = 0;
            p.body.velocity.y = -500;
          });


        p.onComplete.add(function () {
          this.game.state.start('Level2');
        }, this);
      }
      
    }

  },
  hitPillar: function(plyr, pillar) {

    player.isDead();

    Game.deaths += 1;
    this.deathText.setText('Deaths: ' + Game.deaths);

  },
  addPillars: function() {
    if (player.alive === false) {
      return;
    }else {
      Game.score += 1;
    }
    var hole = Math.floor(Math.random() * 7) ;
     for (var i = 0; i < 9; i++) {
       if (i !== hole && i !== hole + 1 && i !== hole + 2) { 
         this.addPillar(800, i * 32 + 280);   
       }
     }
  },
  addPillar: function(x,y) {

    var p;
    if (this.pillars.getFirstExists(false) === null) {
      p = this.add.sprite(x, y, player.playerbmd, 0); 
      this.game.physics.arcade.enable(p);
      p.checkWorldBounds = true;
      p.outOfBoundsKill = true;
      p.body.immovable = true;
      this.pillars.add(p);
    }else {
      p = this.pillars.getFirstExists(false);
      p.reset(x, y);
    }

    p.tint = 0xff0000;

    this.game.physics.arcade.enable(p);

    if (Game.score < 16) {
      p.body.velocity.x = -355; 
    }else {
      p.body.velocity.x = 0;
      p.body.velocity.y = -500;
    }
  },

};
