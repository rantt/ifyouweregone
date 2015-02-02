/*global Game*/
Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {

        background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, borderbmd);
        background.tileScale.set(4);
        background.tint = 0x222222;

        border = this.game.add.tileSprite(-512, this.game.height - 32, this.game.width + 512, 32, borderbmd);
        border.enableBody = true;

        this.game.physics.arcade.enable(border);
        border.body.immovable = true;
        border.body.allowGravity = false;
        border.tint = 0x444444;

        var title = this.game.add.bitmapText(this.game.world.centerX - 300, this.game.world.centerY, 'minecraftia',"If you were gone...",48);
        title.tint = 0xf660ab;

    },
    update: function() {

      scrollPosition -= 6;
      border.tilePosition.x = scrollPosition;
      background.tilePosition.x = scrollPosition * 0.1;
      //Click to Start
      if (this.game.input.activePointer.isDown){
        // this.tween.stop();
        // this.game.state.start('Level1');
        // this.game.state.start('Level2');
        this.game.state.start('Level3');
      }
    }
};
