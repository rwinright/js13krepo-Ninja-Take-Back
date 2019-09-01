import { init, GameLoop, Sprite, initKeys, keyPressed, initPointer, pointer } from 'kontra';
import { Jump } from './scripts/movement';
import { Movement } from './scripts/movement';
import { Collide } from './scripts/collision';
import p1_ss from './assets/player/P1_Walking.png';


let { canvas, context } = init();
initKeys();
initPointer();

let timer = 0;
let currentTime = 0;
let gravity = 0.02;

let platforms = [];
let gui = [];
let objects = [];

let player_sprite = new Image();
player_sprite.src = p1_ss;

player_sprite.onload = function () {

  let { canvas, context } = init();

  initKeys();
  initPointer();

  let timer = 0;
  let gravity = .09;

  let platforms = [];
  let items = [];

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


const Player_1 = Sprite({
  x: (canvas.width / 2) - 20,        // starting x,y position of the sprite
  y: 40,
  color: 'red',
  width: 20,
  height: 20,
  dx: 0,
  dy: 0,
  jumping: true,
  grounded: false,
  speed: 3,
  speed_base: 3,
  max_fall_speed: 4,
  animations: P1_SpriteSheet.animations,
  facing: 'right', // Check player facing
  climbing: false
});

const Player_2 = Sprite({
  x: (canvas.width) - 200,        // starting x,y position of the sprite
  y: 40,
  color: 'blue',
  width: 20,
  height: 20,
  dx: 0,
  dy: 0,
  jumping: true,
  grounded: false,
  speed: 3,
  speed_base: 3,
  animations: P1_SpriteSheet.animations,
  facing: 'right', // Check player facing
  max_fall_speed: 4,
  climbing: false
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
  color: 'brown',
  name: "wallL"
})

const Right_Wall = Sprite({
  x: canvas.width - 10,
  y: 0,
  height: canvas.height,
  width: 10,
  color: 'brown',
  name: "wallR"
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
  y: canvas.height / 2,
  height: 190,
  width: 50,
  color: 'black',
  isClimbable: true

})

const End = Sprite({//Dynamically adjusts to be next to right wall
  x: Right_Wall.x - 50,
  y: canvas.height / 2,
  height: 190,
  width: 50,
  color: 'black',
  isClimbable: false
})

const Ground_Slow = Sprite({//Dynamically adjusts to be next to Ground and between the start/end
  x: Spawn.x + Spawn.width,
  y: canvas.height - 20,
  width: End.x - (Spawn.x + Spawn.width),
  height: 10,
  color: 'Green'
})

const Platform = Sprite({
  x: Ground_Slow.width / 2,
  y: (Spawn.y + End.y) / 2,
  height: 5,
  width: Ground_Slow.width / 4,
  color: 'brown'
})

const ItemBoxBottom = Sprite({
  x: 0,
  y: 50,
  height: 10,
  width: canvas.width,
  color: 'black'
})

const ItemBoxTop = Sprite({
  x: 0,
  y: 0,
  width: canvas.width,
  height: 10,
  color: 'black'
})

const ItemBoxLeft = Sprite({
  x: 0,
  y: 0,
  height: 50,
  width: 15,
  color: 'black'
})

const ItemBoxRight = Sprite({
  height: 50,
  width: 15,
  x: canvas.width - 15,
  y: 0,
  color: 'black'
})

const Divider = Sprite({
  height: 50,
  width: 20,
  x: canvas.width / 2,
  y: 0,
  color: 'black'
})

const rocket = Sprite({
  x: 140,
  y: 200,
  height: 10,
  width: 100
})

const portal = Sprite({
  x: 200,
  y: 200,
  height: 20,
  width: 10,
  color: 'purple'
})

const coffee = Sprite({
  x: 490,
  y: 170,
  width: 10,
  height: 15,
  color: 'brown'
})

 const Reset_Button = Sprite({
    x: 710,
    y: 20,
    height: 30,
    width: 70,
    color: 'green',
    resetGame: () => {
      location.reload();
    }
  });

platforms.push(Ground, Ground_Slow, Left_Wall, Right_Wall, Top_Wall, Spawn, End, Platform)

gui.push(ItemBoxBottom, ItemBoxTop, ItemBoxLeft, ItemBoxRight, Divider);

objects.push(rocket, portal, coffee)

//Text stuff!
context.fillStyle = 'teal'
context.font = '10px Courier New'
let loop = GameLoop({  // create the main game loop
  update: function () { // game logic goes here
    Player_1.update();
    Player_2.update();
    applyGravity(Player_1);
      applyGravity(Player_2);

      applyPlatformCollision(Player_1);
      applyPlatformCollision(Player_2);
    for (let i = 0; i < gui.length; i++) {
      gui[i].update();
    }
    for (let i = 0; i < items.length; i++) {
        track(items[i])
        if (pointerOver(items[i])) {
          if (pointerPressed('left')) {
            items[i].x = pointer.x - items[i].width / 2
            items[i].y = pointer.y - items[i].height / 2
          } else {
            items[i].x = items[i].x
            items[i].y = items[i].y
          }
        }
        applyItemCollision(Player_1, items[i]);
        applyItemCollision(Player_2, items[i])
        items[i].update();

      }
     Reset_Button.update();
      //Track pointer events on reset button
      track(Reset_Button);
      //You can guess what this does.
      if (pointerOver(Reset_Button) && pointerPressed("left")) {
        onPointerUp(() => {
          Reset_Button.color = "red"
          Reset_Button.resetGame();
        })
      },

 
      

      

     



    render: function () { // render the game state

      Player_1.render();
      Player_2.render();

      //Test Item Rendering
      Test_Item.render();

      for (let i = 0; i < platforms.length; i++) {
        platforms[i].render();
      }
      
      for (let i = 0; i < objects.length; i++) {
        objects[i].render();
      }
      
      for (let i = 0; i < gui.length; i++) {
        gui[i].render();
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

  },

function applyGravity(player) {
  if (player.ddy < player.max_fall_speed && !player.climbing && player.dy < 10) {
    player.ddy += gravity;
  }
}


function applyCollision(player) {

  for (let i = 0; i < platforms.length; i++) {
    let plat = platforms[i];
    platforms[i].update();

    let platformCol = Collide(player, platforms[i]);

    if (platformCol === "l" || platformCol === "r") {
      player.dx = 0;
      if (plat.isClimbable) {
        player.dy = -10;

      }
    }
    else if (platformCol === "b") {
      player.dy = 0;
      player.ddy = 0;
      player.jumping = false;
      player.grounded = true;
      player.climbing = false;
      player.speed = player.speed_base;
    }
    else if (platformCol === "t") {
      player.dy = 0;
      player.climbing = false;
    }
    let slowCol = Collide(player, Ground_Slow);

    if (slowCol === "b") {
      player.speed = player.speed_base / 2;
    }



    //respawn if out of bounds
    if (player.x > canvas.width || player.y > canvas.height || player.x < 0 || player.y < 0) {
      player.x = 30;
      player.y = 170;
      player.dx = 0;
      player.ddy = 0;
    }

  }
  if (player.collidesWith(rocket)) {
    player.ddy = 0;
    player.dy = -9;
  }

  if (player.collidesWith(portal)) {
    player.x = 30;
    player.y = 185;
  }

  if (player.collidesWith(coffee)) {
    objects = objects.filter(function (c) {
      return c != coffee;
    })

    player.speed_base = 5;

  }
}


loop.start();

