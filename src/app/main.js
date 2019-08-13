import { init, GameLoop, Sprite } from 'kontra';
import { Bounce } from './scripts/player1.js';

let { canvas, context } = init();

const Player_1 = Sprite({
  x: 100,        // starting x,y position of the sprite
  y: 80,
  color: 'red',  // fill color of the sprite rectangle
  width: 40,     // width and height of the sprite rectangle
  height: 40,
  dx: 2,          // move the sprite 2px to the right every frame
  dy: 2
});

let loop = GameLoop({  // create the main game loop
  update: function () { // game logic goes here
    Player_1.update();
    Bounce(Player_1);
  },
  render: function () { // render the game state
    Player_1.render();
  }
});

loop.start();