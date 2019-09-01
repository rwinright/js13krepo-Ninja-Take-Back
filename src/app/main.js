import { init, GameLoop, Sprite, track, SpriteSheet, initKeys, keyPressed, initPointer, pointer, onPointerUp, onPointerDown, pointerPressed, pointerOver  } from 'kontra';
import { Jump } from './scripts/movement';
import { Movement } from './scripts/movement';
import { Collide } from './scripts/collision';
import p1_ss from './assets/player/P1_Walking.png';

let player_sprite = new Image();
player_sprite.src = p1_ss;

player_sprite.onload = function () {

  let { canvas, context } = init();

  initKeys();
  initPointer();

  let timer = 0;
  let gravity = .09;

  let platforms = [];

  //P1 Spritesheet function

  let P1_SpriteSheet = SpriteSheet({
    image: player_sprite,
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
      image: player_sprite,
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
    slowPlayer: false,
    hurtPlayer: false
  })

  const Left_Wall = Sprite({
    x: 0,
    y: 0,
    height: canvas.height,
    width: 10,
    color: 'brown',
    slowPlayer: false,
    hurtPlayer: false
  })

  const Right_Wall = Sprite({
    x: canvas.width - 10,
    y: 0,
    height: canvas.height,
    width: 10,
    color: 'brown',
    slowPlayer: false,
    hurtPlayer: false
  })

  const Top_Wall = Sprite({
    x: 0,
    y: 0,
    height: 10,
    width: canvas.width,
    color: 'brown',
    slowPlayer: false,
    hurtPlayer: false
  })

  const Spawn = Sprite({ //Dynamically adjusts to be next to left wall
    x: Left_Wall.width,
    y: canvas.height / 2,
    height: 190,
    width: 50,
    color: 'black',
    slowPlayer: false,
    hurtPlayer: false
  })

  const End = Sprite({//Dynamically adjusts to be next to right wall
    x: Right_Wall.x - 50,
    y: canvas.height / 2,
    height: 190,
    width: 50,
    color: 'black',
    slowPlayer: false,
    hurtPlayer: false
  })

  const Ground_Slow = Sprite({ //Dynamically adjusts to be next to Ground and between the start/end
    x: Spawn.x + Spawn.width,
    y: canvas.height - 20,
    width: End.x - (Spawn.x + Spawn.width),
    height: 10,
    color: 'Green',
    slowPlayer: true,
    hurtPlayer: true
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

  const Reset_Button = Sprite({
    x: 710,
    y: 20,
    height: 30,
    width: 70, //Interesting use of the ground slow.
    color: 'green',
    resetGame: ()=>{
      location.reload();
    }
  })

  const Player_1 = Sprite({
    x: (Spawn.width + Left_Wall.width) - 20, // starting x,y position of the sprite based on spawn
    y: Spawn.y - 40,
    animations: P1_SpriteSheet.animations,
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

  let loop = GameLoop({  // create the main game loop
    update: function () { // game logic goes here

      applyGravity(Player_1);
      applyGravity(Player_2);

      applyCollision(Player_1);
      applyCollision(Player_2);

      Player_1.update()
      Player_2.update()

      Reset_Button.update();
      //Track pointer events on reset button
      track(Reset_Button);
      //You can guess what this does.
      if(pointerOver(Reset_Button) && pointerPressed("left")){
        onPointerUp(()=>{
          Reset_Button.color = "red"
          Reset_Button.resetGame();
        })
      }
      

      //Basically just keeps track of loop-time.
      timer++;

      Jump(keyPressed('w'), Player_1, timer);
      Jump(keyPressed('up'), Player_2, timer);

      Movement({ left: keyPressed('a'), right: keyPressed('d') }, Player_1);
      Movement({ left: keyPressed('left'), right: keyPressed('right') }, Player_2);

      if(Player_1.collidesWith(Player_2)){
        Player_1.x = Player_1.x + 1;
      }

      if(Player_2.collidesWith(Player_1)){
        Player_2.x = Player_2.x - 1;
      }


    },

    render: function () { // render the game state

      Player_1.render();
      Player_2.render();

      for (let i = 0; i < platforms.length; i++) {
        platforms[i].render();
      }

      Reset_Button.render();

      // Good-ass mouse tool

      //Text stuff!
      context.fillStyle = 'red'
      context.font = '12px Courier New'
      context.fillText(`x: ${Math.floor(pointer.x)}`, pointer.x + 15, pointer.y - 15);
      context.fillText(`y: ${Math.floor(pointer.y)}`, pointer.x + 15, pointer.y - 5);

      //Text stuff!
      context.fillStyle = 'white'
      context.font = '10px Courier New'
      context.fillText("RESET", Reset_Button.x + (Reset_Button.width / 2) - 12, Reset_Button.y + (Reset_Button.height / 2) + 2.5);

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
        platforms[i].slowPlayer ? player.speed = 1.3 : player.speed = 3
      }
      else if (platformCol === "t") {
        player.dy = 0;
      }

    }
  }

  loop.start();
}