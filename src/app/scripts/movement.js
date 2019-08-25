export const Jump = (jumpPressed, player) => {
  // player.scale(-1, 1)
  // player.context.canvas;
  if (jumpPressed) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      
      if (player.dy > -10) {
        player.dy -= 3.2;
      }
      // player.ddy -= .1;
    }
  }
  // else if (!jumpPressed && player.jumping) {
    //   //player.jumping = false;
    //   //player.dy += .3;
    // }
  }
  
  
  
  export const Movement = (keyPress, player) => {
    if (keyPress.right) {
    // right arrow
    player.facing = 'right'
    player.dx = player.speed;
    player.playAnimation('walk_right')
  } else if (keyPress.left) {
    // left arrow
    player.dx = -player.speed;
    player.facing = 'left'
    player.playAnimation('walk_left')
  } else {
    player.dx = 0;
    if(player.facing === 'left'){
      player.playAnimation('idle_left');
    } else {
      player.playAnimation('idle_right');
    }
  }
}

