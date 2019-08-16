import { init, GameLoop, Sprite, initKeys, keyPressed } from 'kontra';
import { Jump } from './scripts/movement';
import { Movement } from './scripts/movement';
import { Collide } from './scripts/collision';

let { canvas, context } = init();
initKeys();

let timer = 0;
let currentTime = 0;
let gravity = 0.4;

let platforms = [];

const Player_1 = Sprite({
  x: (canvas.width / 2) - 20,        // starting x,y position of the sprite
  y: 40,
  color: 'red',
  width: 20,
  height: 20,
  dx: 0,
  dy: 0,
  jumping: false,
  grounded: false,
  speed: 3
});

const Ground = Sprite({
  x: 0,
  y: canvas.height - 10,
  width: canvas.width,
  height: 10,
  color: 'brown'
})

const Left_Wall = Sprite({
  x: 0,
  y: 0,
  height: canvas.height,
  width: 10,
  color: 'brown'
})

const Right_Wall = Sprite({
  x: canvas.width - 10,
  y: 0,
  height: canvas.height,
  width: 10,
  color: 'brown'
})

const Platform = Sprite({
  x: canvas.width/2,
  y: 220,
  height: 5,
  width: 40,
  color: 'brown'
})

platforms.push(Ground, Left_Wall, Right_Wall, Platform)

console.log(platforms)

console.log(canvas.height)
let loop = GameLoop({  // create the main game loop
  update: function () { // game logic goes here
    Player_1.update();

    //Basically just keeps track of loop-time.
    timer++;
    currentTime = timer/60;

    //Collision collections
    
    Jump(keyPressed('w'), Player_1, timer);
    Movement({left: keyPressed('a'), right: keyPressed('d')}, Player_1);

    //platform collisions
    for(let i = 0; i < platforms.length; i++){
      platforms[i].update();
      // console.log(platform)
      let platformCol = Collide(Player_1, platforms[i])
      if (platformCol === "l" || platformCol === "r") {
        Player_1.dx = 0;
        Player_1.jumping = false;
      } else if (platformCol === "b") {
        Player_1.grounded = true;
        Player_1.jumping = false;
        timer = 0;
      } else if (platformCol === "t") {
        Player_1.dy = -1;
      }
    }

    Player_1.dy += gravity;
    
  },
  render: function () { // render the game state
    Player_1.render();
    for(let i = 0; i < platforms.length; i++){
      platforms[i].render();
    }
  }
});

loop.start();