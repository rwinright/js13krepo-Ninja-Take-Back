import { init, GameLoop, Sprite, SpriteSheet, initKeys, keyPressed, initPointer, pointer } from 'kontra';
import { Jump } from './scripts/movement';
import { Movement } from './scripts/movement';
import { Collide } from './scripts/collision';
import p1_ss from './assets/player/P1_Walking.png';

let p1_spriteSheet = new Image();
p1_spriteSheet.src = p1_ss;

console.log(document.monetization)

p1_spriteSheet.onload = function () {

  let { canvas, context } = init();

  initKeys();
  initPointer();

  let timer = 0;
  let currentTime = 0;
  let gravity = .09;

  let platforms = [];

  //P1 Spritesheet function

  let P1_SpriteSheet = SpriteSheet({
    image: p1_spriteSheet,
    frameWidth: 72,
    frameHeight: 72,
    animations: {
      // create a named animation: walk
      walk_right: {
        frames: [4, 5, 6, 7],
        frameRate: 10
      },
      walk_left: {
        frames: [3, 2, 1, 0],
        frameRate: 10
      },
      idle_right: {
        frames: [4],
        frameRate: 1
      },
      idle_left: {
        frames: [3],
        frameRate: 1
      }
    }
  });

    //P1 Spritesheet function

    let P2_SpriteSheet = SpriteSheet({
      image: p1_spriteSheet,
      frameWidth: 72,
      frameHeight: 72,
      animations: {
        // create a named animation: walk
        walk_right: {
          frames: [4, 5, 6, 7],  // frames 0 through 9
          frameRate: 10
        },
        walk_left: {
          frames: [3, 2, 1, 0],
          frameRate: 10
        },
        idle_right: {
          frames: [4],
          frameRate: 1
        },
        idle_left: {
          frames: [3],
          frameRate: 1
        }
      }
    });

  //Ground

  const Ground = Sprite({
    x: 0,
    y: canvas.height - 10,
    width: canvas.width,
    height: 10,
    color: 'brown',
    slowPlayer: false
  })

  const Left_Wall = Sprite({
    x: 0,
    y: 0,
    height: canvas.height,
    width: 10,
    color: 'brown',
    slowPlayer: false
  })

  const Right_Wall = Sprite({
    x: canvas.width - 10,
    y: 0,
    height: canvas.height,
    width: 10,
    color: 'brown',
    slowPlayer: false
  })

  const Top_Wall = Sprite({
    x: 0,
    y: 0,
    height: 10,
    width: canvas.width,
    color: 'brown',
    slowPlayer: false
  })

  const Spawn = Sprite({ //Dynamically adjusts to be next to left wall
    x: Left_Wall.width,
    y: canvas.height / 2,
    height: 190,
    width: 50,
    color: 'black',
    slowPlayer: false
  })

  const End = Sprite({//Dynamically adjusts to be next to right wall
    x: Right_Wall.x - 50,
    y: canvas.height / 2,
    height: 190,
    width: 50,
    color: 'black',
    slowPlayer: false
  })

  const Ground_Slow = Sprite({ //Dynamically adjusts to be next to Ground and between the start/end
    x: Spawn.x + Spawn.width,
    y: canvas.height - 20,
    width: End.x - (Spawn.x + Spawn.width),
    height: 10,
    color: 'Green',
    slowPlayer: true
  })

  const Platform = Sprite({
    x: Ground_Slow.width / 2,
    // y: (Spawn.y + End.y) / 2,
    y: 360, // Set here for testing.
    height: 5,
    width: Ground_Slow.width / 4, //Interesting use of the ground slow.
    color: 'brown',
    slowPlayer: false
  })

  const Player_1 = Sprite({
    x: (Spawn.width + Left_Wall.width) - 20, // starting x,y position of the sprite based on spawn
    y: Spawn.y - 40,
    animations: P1_SpriteSheet.animations,
    // color: 'red',
    // anchor: {x: 0.5, y: 0.5},
    width: 20,
    height: 20,
    facing: 'right', // Check player facing
    dx: 0,
    dy: 0,
    jumping: true,
    grounded: false,
    speed: 3,
    max_fall_speed: 10
  });

  const Player_2 = Sprite({
    x: (Spawn.width + Left_Wall.width) - 40,        // starting x,y position of the sprite based on spawn
    y: Spawn.y - 80,
    animations: P2_SpriteSheet.animations,
    // color: 'blue',
    width: 20,
    height: 20,
    facing: 'right',
    dx: 0,
    dy: 0,
    jumping: true,
    grounded: false,
    speed: 3,
    max_fall_speed: 10
  });

  platforms.push(Ground, Left_Wall, Right_Wall, Top_Wall, Spawn, End, Platform, Ground_Slow);

  //Text stuff!
  context.fillStyle = 'black'
  context.font = '10px Courier New'

  let loop = GameLoop({  // create the main game loop
    update: function () { // game logic goes here

      applyGravity(Player_1);
      applyGravity(Player_2);

      applyCollision(Player_1);
      applyCollision(Player_2);

      Player_1.update();
      Player_2.update();

      //Basically just keeps track of loop-time.
      timer++;
      currentTime = timer / 60;

      //Collision collections

      Jump(keyPressed('w'), Player_1, timer);
      Jump(keyPressed('up'), Player_2, timer);

      Movement({ left: keyPressed('a'), right: keyPressed('d') }, Player_1);
      Movement({ left: keyPressed('left'), right: keyPressed('right') }, Player_2);

      const playerCol = Collide(Player_1, Player_2);

      //player collisions

      if (playerCol === "l" || playerCol === "r") {
        Player_1.dx = 0;
        Player_2.dx = 0;
      } else if (playerCol === "b" || playerCol === "t") {
        Player_1.dy = -1;
        Player_2.dy = -1;
      }

    },

    render: function () { // render the game state
      Player_1.render();
      Player_2.render();
      for (let i = 0; i < platforms.length; i++) {
        platforms[i].render();
      }


      // Good-ass mouse tool
      context.fillText(`x: ${Math.floor(pointer.x)}`, pointer.x + 15, pointer.y - 15);
      context.fillText(`y: ${Math.floor(pointer.y)}`, pointer.x + 15, pointer.y - 5);

    }
  });

  function applyGravity(player) {
    if (player.grounded && !player.jumping) {
      player.dy = 0;
    } else {
      if (player.dy < player.max_fall_speed) {
        player.dy += gravity;
      }
    }
  }

  function applyCollision(player) {

    for (let i = 0; i < platforms.length; i++) {
      platforms[i].update();

      let platformCol = Collide(player, platforms[i]);

      if (platformCol === "l" || platformCol === "r") {
        player.dx = 0;
      }
      else if (platformCol === "b") {
        player.dy = 0;
        player.jumping = false;
        player.grounded = true;
        // added a slow property to platforms as I believe we 'may' be using this property more.
        platforms[i].slowPlayer ? player.speed = 1.3 : player.speed = 3
      }
      else if (platformCol === "t") {
        player.dy = 0;
      }

    }
  }

  loop.start();
}