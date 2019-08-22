
import { init, GameLoop, Sprite, initKeys, keyPressed, initPointer, pointer } from 'kontra';
import { Jump } from './scripts/movement';
import { Movement } from './scripts/movement';
import { Collide } from './scripts/collision';


let { canvas, context } = init();
initKeys();
initPointer();

let timer = 0;
let currentTime = 0;
let gravity = 0.01;

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
  speed: 3,
  max_fall_speed: 10
});

const Player_2 = Sprite({
  x: (canvas.width) - 200,        // starting x,y position of the sprite
  y: 40,
  color: 'blue',
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
  x: canvas.width-10,
  y: 0,
  height: canvas.height,
  width: 10,
  color: 'brown'
})

const Top_Wall = Sprite({
  x: 0,
  y: 0,
  height: 10,
  width: canvas.width,
  color: 'brown'
})

const Spawn = Sprite({ //Dynamically adjusts to be next to left wall
  x: Left_Wall.width,
  y: canvas.height/2,
  height: 190,
  width: 50,
  color: 'black'
})

const End = Sprite({//Dynamically adjusts to be next to right wall
  x: Right_Wall.x-50,
  y: canvas.height/2,
  height: 190,
  width: 50,
  color: 'black'
})

const Ground_Slow = Sprite({//Dynamically adjusts to be next to Ground and between the start/end
  x: Spawn.x + Spawn.width,
  y: canvas.height - 20,
  width: End.x - (Spawn.x + Spawn.width),
  height: 10,
  color: 'Green'
})

const Platform = Sprite({
  x: Ground_Slow.width/2,
  y: (Spawn.y+End.y)/2,
  height: 5,
  width: Ground_Slow.width/4,
  color: 'brown'
})

const Player_1 = Sprite({
  x: (Spawn.width + Left_Wall.width) - 20,        // starting x,y position of the sprite based on spawn
  y: Spawn.y -40,
  color: 'red',
  width: 20,
  height: 20,
  dx: 0,
  dy: 0,
  jumping: false,
  grounded: false,
  speed: 3
});

const Player_2 = Sprite({
  x: (Spawn.width + Left_Wall.width) - 40,        // starting x,y position of the sprite based on spawn
  y: Spawn.y -80,
  color: 'blue',
  width: 20,
  height: 20,
  dx: 0,
  dy: 0,
  jumping: false,
  grounded: false,
  speed: 3
});
platforms.push(Ground, Left_Wall, Right_Wall, Top_Wall, Spawn, End, Ground_Slow, Platform)

//Text stuff!
context.fillStyle = 'black'
context.font = '10px Courier New'

console.log(canvas.height)
let loop = GameLoop({  // create the main game loop
  update: function () { // game logic goes here
    Player_1.update();
    Player_2.update();

    applyGravity(Player_1);
    applyGravity(Player_2);
    //Basically just keeps track of loop-time.
    timer++;
    currentTime = timer / 60;

    //Collision collections

    Jump(keyPressed('w'), Player_1, timer);
    Jump(keyPressed('w'), Player_2, timer);
    Movement({ left: keyPressed('a'), right: keyPressed('d') }, Player_1);
    Movement({ left: keyPressed('left'), right: keyPressed('right') }, Player_2)

    let playerCol = Collide(Player_1, Player_2);

    //player collisions

    if (playerCol === "l" || playerCol === "r") {
      Player_1.dx = 0;
      Player_2.dx = 0;
    } else if (playerCol === "b" || playerCol === "t") {
      Player_1.dy = 0;
      Player_2.dy = 0;
    }


    //platform collisions
    for (let i = 0; i < platforms.length; i++) {
      platforms[i].update();
      // console.log(platform)
      let platformCol1 = Collide(Player_1, platforms[i]);
      let platformCol2 = Collide(Player_2, platforms[i]);
      if (platformCol1 === "l" || platformCol1 === "r") {
        Player_1.dx = 0;
        Player_1.jumping = false;
        Player_2.dx = 0;
        Player_2.jumping = false;
      } else if (platformCol1 === "b") {
        Player_1.grounded = true;
        Player_1.jumping = false;
        Player_2.grounded = true;
        Player_2.jumping = false;
        timer = 0;
      } else if (platformCol1 === "t") {
        Player_1.dy = 0;
        Player_2.dy = 0;
      }

      if (platformCol2 === "l" || platformCol2 === "r") {
        Player_1.dx = 0;
        Player_1.jumping = false;
        Player_2.dx = 0;
        Player_2.jumping = false;
      } else if (platformCol2 === "b") {
        Player_1.grounded = true;
        Player_1.jumping = false;
        Player_2.grounded = true;
        Player_2.jumping = false;
        timer = 0;
      } else if (platformCol2 === "t") {
        Player_1.dy = 0;
        Player_2.dy = 0;
      }
    }

  },
  render: function () { // render the game state
    Player_1.render();
    Player_2.render();
    for (let i = 0; i < platforms.length; i++) {
      platforms[i].render();
    }


    // Good ass mouse tool
    context.fillText(`x: ${Math.floor(pointer.x)}`, pointer.x + 15, pointer.y - 15);
    context.fillText(`y: ${Math.floor(pointer.y)}`, pointer.x + 15, pointer.y - 5);

  }
});

function applyGravity(player) {
  if (player.ddy < player.max_fall_speed && !player.grounded) {
    player.ddy += gravity;
  }
  else {
    player.ddy = 0;
  }
}

loop.start();
