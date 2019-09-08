import { playSound }  from '../assets/sfx/soundEffects';

export const Jump = (jumpPressed, player) => {
  if (jumpPressed) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      playSound([0,,0.1812,,0.1349,0.4524,,0.2365,,,,,,0.0819,,,,,1,,,,,0.5]);
      if (player.dy > -20) {
        player.dy -= 5;
      }
      //jump sound!
    }
  }
}



export const Movement = (keyPress, player) => {
  if (player.explode) {

  }
  else if (keyPress.right) {
    // right arrow
    player.facing = 'right'
    if (player.confused) {
      player.dx = -player.speed;
    }
    else {
      player.dx = player.speed;
    }
    player.playAnimation('walk_right')

  }
  else if (keyPress.left) {
    // left arrow
    if (player.confused) {
      player.dx = player.speed;
    }
    else {
      player.dx = -player.speed;
    }
    player.facing = 'left'
    player.playAnimation('walk_left')
  }
  else {
    player.dx = 0;
    if (player.facing === 'left') {
      player.playAnimation('idle_left');
    } else {
      player.playAnimation('idle_right');
    }
  }
}

