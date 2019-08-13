import { init, GameLoop, Sprite, initKeys, keyPressed } from 'kontra';
import { Jump } from './scripts/movement.js';

let { canvas, context } = init();
initKeys();

const Player_1 = Sprite({
  x: (canvas.width/2) -20,        // starting x,y position of the sprite
  y: 40,
  color: 'red',  // fill color of the sprite rectangle
  width: 40,     // width and height of the sprite rectangle
  height: 40,
  dx: 0,          // move the sprite 2px to the right every frame
  dy: 0
});

let loop = GameLoop({  // create the main game loop
  update: function () { // game logic goes here
    Player_1.update();
    Jump(keyPressed('w'), Player_1);
  },
  render: function () { // render the game state
    Player_1.render();
  }
});

loop.start();