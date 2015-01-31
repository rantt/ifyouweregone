/*global Game*/

var game = new Phaser.Game(this.w, this.h, Phaser.AUTO, 'game');

game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Level1', Game.Level1);
game.state.add('Level2', Game.Level2);

game.state.start('Boot');
