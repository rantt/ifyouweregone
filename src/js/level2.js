/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */


var group,
    // player,
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

    border = this.game.add.tileSprite(-512, this.game.height + 32, this.game.width + 512, 32, player.playerbmd, 0 , group);
    border.enableBody = true;
    border.enableyBody = true;
    this.game.physics.arcade.enable(border);
    border.body.immovable = true;
    border.body.allowGravity = false;
    border.tint = 0x000

    player.create(this.game.world.centerX, this.game.world.centerY - 100,2);

    this.pillars = this.game.add.group();

    this.timer = this.game.time.events.loop(1500, this.addPillars, this);  

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

        this.game.physics.arcade.collide(player.sprite, this.pillars, this.hitPillar, null, this);
        this.game.physics.arcade.collide(group, player.sprite);
        player.movements();

      }else {
        this.playAgainText.setText('Try Again?');

        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { 
          this.game.add.tween(this.playAgainText).to({y: this.game.world.centerY - 100}, 255, Phaser.Easing.Linear.None).start();
        }, this);

        if (this.game.input.activePointer.isDown || wKey.isDown || spaceKey.isDown || cursors.up.isDown){
          this.pillars.forEach(function(p) {
            p.alive = false;
          });
          player.alive = true;
          this.game.state.start('Level2');
        }
      }
    }else {
        
      if (cutscene === false) {
        cutscene = true;
        player.sprite.body.velocity.x = 0;

        //Drop to Platform
        var p = this.game.add.tween(player.sprite).to({x: this.game.world.centerX, y : Game.h - 128}, 1000, Phaser.Easing.Linear.None, true);

        // Raise the Bottom Platform
        var b = this.game.add.tween(border).to({y : Game.h -  112}, 1000, Phaser.Easing.Linear.None, true);


        p.onComplete.add(function () {
          this.game.plugins.ScreenShake.start(40);
          player.deadSnd.play();
          this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { 
            this.game.state.start('Level3');
          },this);

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

    if (Game.score < 31) {
      p.body.velocity.y = -250; 
    }else {
      p.body.velocity.x = 0;
      p.body.velocity.y = 0;
    }

  },

};
