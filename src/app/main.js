import { init, GameLoop, Sprite, initKeys, keyPressed } from 'kontra';
import { Jump } from './scripts/movement';
import { Movement } from './scripts/movement';
import { Collide } from './scripts/collision';

let { canvas, context } = init();
initKeys();

let timer = 0;
let currentTime = 0;

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

console.log(canvas.height)
let loop = GameLoop({  // create the main game loop
  update: function () { // game logic goes here
    Ground.update();
    Left_Wall.update();
    Right_Wall.update();
    Player_1.update();
    timer++;
    //Another variable that we can change the value of.
    currentTime = timer;

    let Player_Ground_Collide = Collide(Player_1, Ground);
    let Player_Left_Collide = Collide(Player_1, Left_Wall);
    let Player_Right_Collide = Collide(Player_1, Right_Wall);
    
    Jump(keyPressed('w'), Player_1);
    Movement({left: keyPressed('a'), right: keyPressed('d')}, Player_1);

    if (Player_Left_Collide === "l" || Player_Right_Collide === "r") {
      Player_1.dx = 0;
      Player_1.jumping = false;
    } else if (Player_Ground_Collide === "b") {
      Player_1.grounded = true;
      Player_1.jumping = false;
      //Set the timer back to 0 if the bottom is touching.
      timer = 0;
    } else if (Player_Ground_Collide === "t") {
      Player_1.dy = 0;
    }

    //If the jump has persisted across 14 frames, make the player go down.
    if(currentTime >= 14){
      Player_1.dy = 4;
    }

    
  },
  render: function () { // render the game state
    Player_1.render();
    Ground.render();
    Left_Wall.render();
    Right_Wall.render();
  }
});

loop.start();