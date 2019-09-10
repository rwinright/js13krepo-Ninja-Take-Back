import { init, GameLoop, Sprite, track, SpriteSheet, initKeys, keyPressed, initPointer, pointer, onPointerUp, pointerPressed, pointerOver } from 'kontra';
import { Jump } from './scripts/movement';
import { Movement } from './scripts/movement';
import { Collide } from './scripts/collision';
import { Item } from './scripts/item';
import p1_ss from './assets/player/P1_Walking.png';
import background_image from './assets/level/js13k-map.png';
import { playSound } from './assets/sfx/soundEffects';

let player_sprite = new Image();
player_sprite.src = p1_ss;

let background = new Image();
background.src = background_image;

(player_sprite, background).onload = function () {

  let { canvas, context } = init();

  initKeys();
  initPointer();

  let timer = 0;
  let gravity = .1;

  let platforms = [];
  let gui = [];
  let objects = [];

  let toggleHB = false;

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

  //background

  const Background = Sprite({
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    image: background
  })

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
    y: (canvas.height / 2) - 8,
    height: 216,
    width: 52,
    color: 'black',
    slowPlayer: false,
    isClimbable: true
  })

  const End = Sprite({//Dynamically adjusts to be next to right wall
    x: Right_Wall.x - 52,
    y: (canvas.height / 2) - 8,
    height: 216,
    width: 52,
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
    y: 100,
    height: 5,
    width: Ground_Slow.width / 4,
    color: 'brown',
    slowPlayer: false
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
  })

  //Get rid of this before production
  const Show_Hit_Boxes_Button = Sprite({
    x: Reset_Button.x - 90,
    y: 20,
    height: 30,
    width: 70,
    color: 'red',
    toggleHitboxes: () => {
      toggleHB = !toggleHB
      this.color = 'orange'
    }
  })

  //Items
  const Player_1 = Sprite({
    x: (Spawn.width + Left_Wall.width) - 20, // starting x,y position of the sprite based on spawn
    y: Spawn.y - 40,
    animations: P1_SpriteSheet.animations,
    width: 30,
    height: 30,
    facing: 'right', // Check player facing
    dx: 0,
    dy: 0,
    jumping: true,
    grounded: false,
    climbing: false,
    speed: 3,
    speed_base: 3,
    max_fall_speed: 10,
    name: 'Red',
    wins: false,
    confused: false,
    explode: false

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
    speed_base: 3,
    max_fall_speed: 10,
    name: "billy",
    wins: false,
    confused: false
  });

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

  const spring = new Item(140, 300, 10, 100, 'gold', false,
    function (player) {
      player.ddy = 0;
      player.dy = -9;
    });

  const portal = new Item(200, 200, 30, 10, 'purple', false,
    function (player) {
      player.x = 30;
      player.y = -Spawn.height;
      player.dx = 0;
    });

  const coffee = new Item(200, 190, 10, 15, 'brown', true,
    function (player) {
      if (this.active) {
        this.active = false;
        player.speed_base = 5;
      }
      playSound([1, , 0.3201, , 0.4743, 0.3202, , 0.0833, , 0.4207, 0.4278, , , , , , , , 1, , , , , 0.5])
    }
  )

  const bomb = new Item(330, 360, 20, 20, 'dimgray', true,
    function (player) {
      player.explode = true;
      if (this.active) {
        player.ddy = 0;
        player.dy = -5;
        player.ddx = 0;
        player.dx = -player.dx * 4;
        this.active = false;
      }
      playSound([3, , 0.3708, 0.5822, 0.3851, 0.0584, , -0.0268, , , , -0.0749, 0.7624, , , , , , 1, , , , , 0.5]) //Explosion sound
    }
  );

  const confuse = new Item(100, 100, 15, 10, 'pink', true,
    function (player) {
      if (this.active) {
        this.active = false;
        player.speed_base = -player.speed_base;
      }
    }
  );

  const turret = Sprite({
    x: 400,
    y: 350,
    height: 30,
    width: 20,
    color: 'DarkSlateGrey'
  })

  const bullet = Sprite({
    x: -100,
    y: -100,
    height: 5,
    width: 10,
    color: 'black'
  })

  //Technically not an 'object' so I'll set this as an invisible hitbox over the gem.
  const end_flag = new Item(752.5, 175, 16, 16, '#ed64644a', true,
    (player) => {
      if (!player.wins) {
        alert(`${player.name} wins!!!`);
        player.wins = true;
      }
      this.active = false;
    });

  platforms.push(Ground, Ground_Slow, Left_Wall, Right_Wall, Top_Wall, Spawn, End, Platform)

  gui.push(ItemBoxBottom, ItemBoxTop, ItemBoxLeft, ItemBoxRight, Divider);

  objects.push(spring, portal, coffee, bomb, confuse, turret, bullet, end_flag)

  //Text stuff!
  context.fillStyle = 'teal'
  context.font = '10px Courier New'

  let loop = GameLoop({  // create the main game loop
    update: function () { // game logic goes here

      applyGravity(Player_1);
      applyGravity(Player_2);

      applyPlatformCollision(Player_1);
      applyPlatformCollision(Player_2);

      Player_1.update()
      Player_2.update()
      bullet.update()
      //Test Item Update
      //Test Item drag and drop

      for (let i = 0; i < objects.length; i++) {
        //The last item should not move.
        //Probably add another "isMovable" property to the objects?
        if(!(objects[i] === objects[objects.length - 1]))
        track(objects[i])
        if (pointerOver(objects[i])) {
          if (pointerPressed('left')) {
            objects[i].x = pointer.x - objects[i].width / 2
            objects[i].y = pointer.y - objects[i].height / 2
          } else {
            objects[i].x = objects[i].x
            objects[i].y = objects[i].y
          }
        }

        //Make sure objects never go past/beyond spawn/end.
        //Unless the object is the end flag.
        if(!(objects[i] === objects[objects.length - 1])){
          if (objects[i].x <= 60) {
            objects[i].x = objects[i].x + Spawn.width / 12
          } else if ((objects[i].x + objects[i].width) >= 740) {
            objects[i].x = 740 - End.width - (objects[i].width/2)
          }
        }

        objects[i].update();

      }


      //GUI Buttons
      Reset_Button.update();
      Show_Hit_Boxes_Button.update();
      //Track pointer events on reset button
      track(Reset_Button);
      track(Show_Hit_Boxes_Button);
      //You can guess what this does.
      if (pointerOver(Reset_Button) && pointerPressed("left")) {
        onPointerUp(() => {
          Reset_Button.color = "red"
          Reset_Button.resetGame();
        })
      }

      if (pointerOver(Show_Hit_Boxes_Button) && pointerPressed("left")) {
        onPointerUp(() => {
          Show_Hit_Boxes_Button.color = "orange"
          Show_Hit_Boxes_Button.toggleHitboxes();
        })
      }

      //Basically just keeps track of loop-time.
      timer++;

      Jump(keyPressed('w'), Player_1, timer);
      Jump(keyPressed('up'), Player_2, timer);

      Movement({ left: keyPressed('a'), right: keyPressed('d') }, Player_1);
      Movement({ left: keyPressed('left'), right: keyPressed('right') }, Player_2);

      if (Player_1.collidesWith(Player_2)) {
        Player_1.x = Player_1.x + 1;
      }

      if (Player_2.collidesWith(Player_1)) {
        Player_2.x = Player_2.x - 1;
      }

    },

    render: function () { // render the game state

      Background.render();

      Player_1.render();
      Player_2.render();
      turret.render();
      bullet.render();

      //Just comment this back in if you wanna generate the platform hitboxes

      for (let i = 0; i < platforms.length; i++) {
        toggleHB ? platforms[i].render() : null;
      }

      for (let i = 0; i < objects.length; i++) {
        objects[i].render();
      }
      for (let i = 0; i < gui.length; i++) {
        gui[i].render();
      }

      Reset_Button.render();
      Show_Hit_Boxes_Button.render();

      //Text stuff!
      context.fillStyle = 'red'
      context.font = '12px Courier New'
      context.fillText(`x: ${Math.floor(pointer.x)}`, pointer.x + 15, pointer.y - 15);
      context.fillText(`y: ${Math.floor(pointer.y)}`, pointer.x + 15, pointer.y - 5);

      //Text stuff!
      context.fillStyle = 'white'
      context.font = '10px Courier New'
      context.fillText("RESET", Reset_Button.x + (Reset_Button.width / 2) - 12, Reset_Button.y + (Reset_Button.height / 2) + 2.5);
      context.fillText("THBs", Show_Hit_Boxes_Button.x + (Show_Hit_Boxes_Button.width / 2) - 12, Show_Hit_Boxes_Button.y + (Show_Hit_Boxes_Button.height / 2) + 2.5);
    }
  });

  function applyGravity(player) {
    if (player.dy < player.max_fall_speed && !player.climbing && player.dy < 10) {
      player.dy += gravity;
    }
  }

  function applyPlatformCollision(player) {

    for (let i = 0; i < platforms.length; i++) {
      let plat = platforms[i];
      platforms[i].update();

      let platformCol = Collide(player, platforms[i]);
      if (platformCol !== null && player.explode) {
        player.explode = false;
      }
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
        platforms[i].slowPlayer ? player.speed = 1.3 : player.speed = 3
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
        player.dy = 0;
      }

      //respawn if out of bounds
      if (player.x > canvas.width || player.y > canvas.height || player.x < 0 || player.y < 0) {
        player.x = 30;
        player.y = 170;
        player.dx = 0;
        player.ddy = 0;
      }

    }
    for (let i = 0; i < objects.length; i++) {
      let o = objects[i];
      if (player.collidesWith(o)) {
        o.effect(player);
      }
      if (!o.active) {
        objects = objects.filter(function (c) {
          return c != o;
        })
      }
    }

    if (player.collidesWith(turret)) {
      bullet.x = turret.x - 5;
      bullet.y = turret.y + 5;
      bullet.ddx = -.5;
      bullet.dx = -1;
    }

    if (player.collidesWith(bullet)) {
      player.dx = -6;
      player.dy = -1;
      playSound([3, , 0.3708, 0.5822, 0.3851, 0.0584, , -0.0268, , , , -0.0749, 0.7624, , , , , , 1, , , , , 0.5]) //Explosion sound
    }
  }
  loop.start();
}