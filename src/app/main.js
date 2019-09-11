import { init, GameLoop, Sprite, track, SpriteSheet, initKeys, keyPressed, initPointer, pointer, onPointerUp, pointerPressed, pointerOver } from 'kontra';
import { Jump } from './scripts/movement';
import { Movement } from './scripts/movement';
import { Collide } from './scripts/collision';
import { Item } from './scripts/item';
import p1_ss from './assets/player/P1_Walking.png';
import background_image from './assets/level/js13k-map.png';
import { playSound } from './assets/sfx/soundEffects';
import { ClickNDrag } from './scripts/ClickNDrag';
import { Gui } from './scripts/Gui';

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
  let gui = Gui(canvas);
  let objects = [];

  let toggleHB = false;
  let turntime = 0;

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
    height: 200,
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
    isClimbable: true
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
    x: Ground_Slow.width / 2.5,
    // y: (Spawn.y + End.y) / 2,
    y: 250,
    height: 5,
    width: Ground_Slow.width / 3,
    color: 'red',
    slowPlayer: false
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
    speed: 2.5,
    speed_base: 2.5,
    max_fall_speed: 10,
    name: 'Red',
    wins: false,
    confused: false,
    explode: false,
    objects: [],
    ammo: 100,
    shootTime: 60
  });

  const Player_2 = Sprite({
    x: canvas.width - 40,        // starting x,y position of the sprite based on spawn
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
    speed: 2.5,
    speed_base: 2.5,
    max_fall_speed: 10,
    name: "billy",
    wins: false,
    confused: false,
    objects: [],
    ammo: 100,
    shootTime: 60
  });

  let currentPlayer = Player_1;

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

  const Swap_Turn_Button = Sprite({
    x: Reset_Button.x - 180,
    y: 20,
    height: 30,
    width: 70,
    color: 'green'
  })
  const spring = new Item(140, 25, 10, 100, 'gold', false,
    function (player) {
      player.ddy = 0;
      player.dy = -9;
    });

  // const portal = new Item(90, 30, 30, 10, 'purple', false,
  //   function (player) {
  //     player.x = 30;
  //     player.y = -Spawn.height;
  //     player.dx = 0;
  //   });

  const coffee = new Item(60, 30, 10, 15, 'brown', true,
    function (player) {
      if (this.active) {
        this.active = false;
        player.speed_base *= 1.1;
      }
      playSound([1, , 0.3201, , 0.4743, 0.3202, , 0.0833, , 0.4207, 0.4278, , , , , , , , 1, , , , , 0.5])
    }
  )

  const bomb = new Item(120, 30, 20, 20, 'dimgray', true,
    function (player) {
      player.explode = true;
      if (this.active) {
        player.ddy = 0;
        player.dy = -5;
        player.ddx = 0;
        player.dx = -player.dx * 1.5;
        this.active = false;
      }
      playSound([3, , 0.3708, 0.5822, 0.3851, 0.0584, , -0.0268, , , , -0.0749, 0.7624, , , , , , 1, , , , , 0.5]) //Explosion sound
    }
  );

  const confuse = new Item(280, 25, 15, 10, 'pink', true,
    function (player) {
      if (this.active) {
        this.active = false;
        player.speed_base = -player.speed_base;
      }
    }
  );

  const star = new Item(0, 0, 10, 10, 'gray', true,
    function (player) {
      if (this.active) {
        player.ammo += 5;
        this.active = false;
      }
    })

  const itemPlatform = new Item(100, 100, 5, 50, 'green', false,
    function (player) {
      let platformCol = Collide(player, this);
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
        // platforms[i].slowPlayer ? player.speed = 1.3 : player.speed = 3
        player.climbing = false;
        player.speed = player.speed_base;
      }
      else if (platformCol === "t") {
        player.dy = 0;
        player.climbing = false;
      }
    })

  // const turret = new Item(400, 350, 30, 20, 'DarkSlateGrey', false, function () {

  // })

  // const bullet = Sprite({
  //   x: -100,
  //   y: -100,
  //   height: 5,
  //   width: 10,
  //   color: 'black'
  // })

  //Technically not an 'object' so I'll set this as an invisible hitbox over the gem.
  const end_flag = new Item(752.5, 175, 16, 16, '#ed64644a', true,
    (player) => {
      if (!player.wins) {
        alert(`${player.name} wins!!!`);
        player.wins = true;
      }
      this.active = false;
    });
  end_flag.isMoveable = false;

  const Gem1 = new Item(32, 180, 10, 10, 'green', true,
    function (player) {
      if (player !== this.placer && this.active) {
        player.wins = true;
        this.active = false;
      }
    })

  const Gem2 = new Item(canvas.width - 32, 180, 10, 10, 'red', true,
    function (player) {
      if (player !== this.placer && this.active) {
        player.wins = true;
        this.active = false;
      }
    })

  Gem1.placer = Player_1;
  Gem2.placer = Player_2;

  platforms.push(gui[1], Ground, Ground_Slow, Left_Wall, Right_Wall, Top_Wall, Spawn, End, Platform)

  objects.push(spring, coffee, bomb, confuse, itemPlatform, star);

  for (let i = 0; i < 4; i++) {
    let o1 = PickRandomObject();
    o1.placer = Player_1;
    o1.y = 25;
    Player_1.objects[i] = o1;

    let o2 = PickRandomObject();
    o2.placer = Player_2;
    o2.y = 25;
    Player_2.objects[i] = o2;
  }

  for (let i = 0; i < Player_1.objects.length; i++) {
    let o = Player_1.objects[i];
    o.x = Player_1.objects[i].x + (i * 50);
  }

  for (let i = 0; i < Player_2.objects.length; i++) {
    let o = Player_2.objects[i];
    o.x = canvas.width / 2 + 100 + (i * 50);
  }

  Player_1.objects.push(Gem1);
  Player_2.objects.push(Gem2);

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

      for (let i = 0; i < Player_1.objects.length; i++) {
        Player_1.objects[i].update();
        track(Player_1.objects[i]);
        ClickNDrag(Player_1.objects[i], currentPlayer);
        ClearStart(Player_1.objects[i]);

      }
      for (let i = 0; i < Player_2.objects.length; i++) {
        Player_2.objects[i].update();
        track(Player_2.objects[i]);
        ClickNDrag(Player_2.objects[i], currentPlayer);
        ClearStart(Player_2.objects[i]);
      }

      for (let i = 0; i < objects.length; i++) {
        //The last item should not move.
        //Make sure objects never go past/beyond spawn/end.
        //Unless the object is the end flag.



      }


      //GUI Buttons
      Reset_Button.update();
      // Show_Hit_Boxes_Button.update();
      //Track pointer events on reset button
      track(Reset_Button);
      // track(Show_Hit_Boxes_Button);
      track(Swap_Turn_Button);
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

      turntime++;

      if (keyPressed('t') && turntime > 50) {
        if (currentPlayer === Player_1) {
          currentPlayer = Player_2;
        } else if (currentPlayer === Player_2) {
          currentPlayer = Player_1;
        }
        turntime = 0;
      }

      //Basically just keeps track of loop-time.
      timer++;

      Jump(keyPressed('w'), Player_1, timer);
      Jump(keyPressed('up'), Player_2, timer);

      Movement({ left: keyPressed('a'), right: keyPressed('d') }, Player_1);
      Movement({ left: keyPressed('left'), right: keyPressed('right') }, Player_2);
      if (Player_1.shootTime > 60) {
        Shoot(keyPressed('e'), Player_1);
      }

      if (Player_2.shootTime > 60) {
        Shoot(keyPressed('space'), Player_2);
      }
      Player_1.shootTime++;
      Player_2.shootTime++;
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
      end_flag.render();
      // turret.render();
      // bullet.render();

      //Just comment this back in if you wanna generate the platform hitboxes

      for (let i = 0; i < platforms.length; i++) {
        toggleHB ? platforms[i].render() : null;
      }


      for (let i = 0; i < Player_1.objects.length; i++) {

        let o1 = Player_1.objects[i];
        if (o1.active) {
          o1.render();
        }
      }
      for (let i = 0; i < Player_2.objects.length; i++) {

        let o2 = Player_2.objects[i];
        if (o2.active) {
          o2.render();
        }
      }
      for (let i = 0; i < gui.length; i++) {
        gui[i].render();
      }
      Platform.render();
      Reset_Button.render();

      //Text stuff!
      context.fillStyle = 'red'
      context.font = '12px Courier New'
      context.fillText(`x: ${Math.floor(pointer.x)}`, pointer.x + 15, pointer.y - 15);
      context.fillText(`y: ${Math.floor(pointer.y)}`, pointer.x + 15, pointer.y - 5);

      //Text stuff!
      context.fillStyle = 'white'
      context.font = '10px Courier New'
      context.fillText("RESET", Reset_Button.x + (Reset_Button.width / 2) - 12, Reset_Button.y + (Reset_Button.height / 2) + 2.5);
      if (currentPlayer !== null) {
        context.fillText(currentPlayer.name + " Turn", Swap_Turn_Button.x + (Swap_Turn_Button.width / 2) - 12, Swap_Turn_Button.y + (Swap_Turn_Button.height / 2) + 2.5);
      }
      else {
        context.fillText("RACE TO THE FINISH!!", Swap_Turn_Button.x + (Swap_Turn_Button.width / 2) - 12, Swap_Turn_Button.y + (Swap_Turn_Button.height / 2) + 2.5);
      }
      context.fillText("THBs", Show_Hit_Boxes_Button.x + (Show_Hit_Boxes_Button.width / 2) - 12, Show_Hit_Boxes_Button.y + (Show_Hit_Boxes_Button.height / 2) + 2.5);
    }
  });

  function applyGravity(player) {
    if (player.dy < player.max_fall_speed && !player.climbing && player.dy < 10) {
      player.dy += gravity;
    }
  }

  function PickRandomObject() {
    let index = Math.floor(Math.random() * (objects.length));
    let o = objects[index];
    let output = new Item(o.x, o.y, o.height, o.width, o.color, o.pick, o.effect);
    return output;
  }

  function applyObjectCollision(player, inputs) {
    for (let i = 0; i < inputs.length; i++) {
      let o = inputs[i];
      if (player.collidesWith(o)) {
        o.effect(player);
      }
      if (!o.active) {
        Player_1.objects = Player_1.objects.filter(function (c) {
          return c != o;
        })
        Player_2.objects = Player_2.objects.filter(function (c) {
          return c != o;
        })
      }
    }
  }

  function ClearStart(object) {
    if (object.isBullet) {

    }
    else if (object.x <= 80) {
      object.x = object.x + Spawn.width / 12
    } else if ((object.x + object.width) >= 740) {
      object.x = 740 - End.width - (object.width / 2)
    }
  }

  function Shoot(shootpressed, player) {
    if (shootpressed) {
      if (player.ammo > 0) {
        player.ammo--;
        player.shootTime = 0;
        let bullet = new Item(player.x + player.width / 1.5, player.y + player.height / 2, 10, 10, 'red', false,
          function (player) {
            if (player !== bullet.placer) {
              player.wins = false;
            }
          });

        bullet.placer = player;
        if (player.facing === 'right') {
          bullet.dx = 10;
        }
        else {
          bullet.dx = -10;
        }
        bullet.isBullet = true;
        player.objects.push(bullet);
        console.log(bullet.dx);
        objects.push(bullet);
      }
    }
  }

  function applyPlatformCollision(player) {

    applyObjectCollision(player, Player_1.objects);
    applyObjectCollision(player, Player_2.objects);
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
        player.explode
      }

      //respawn if out of bounds
      if (player.x > canvas.width || player.y > canvas.height || player.x < 0 || player.y < 0) {
        player.x = 30;
        player.y = 170;
        player.dx = 0;
        player.ddy = 0;
      }

    }


    // if (player.collidesWith(turret)) {
    //   bullet.x = turret.x - 5;
    //   bullet.y = turret.y + 5;
    //   bullet.ddx = -.5;
    //   bullet.dx = -1;
    // }

    // if (player.collidesWith(bullet)) {
    //   player.dx = -1;
    //   player.dy = -1;
    // }

  }
  loop.start();
}