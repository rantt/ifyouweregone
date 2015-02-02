/*global Game*/

var game = new Phaser.Game(this.Game.w, this.Game.h, Phaser.AUTO, 'game');

game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Level1', Game.Level1);
game.state.add('Level2', Game.Level2);
game.state.add('Level3', Game.Level3);

game.state.start('Boot');
