export const Jump = (jumpPressed, player, jumpTimer) => {

  if (jumpPressed) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;

      if (player.dy > -10) {
        player.dy -= player.speed * 1.5;
      }
      // player.ddy -= .1;
    }
  }
  else if (!jumpPressed && player.jumping) {
    //player.jumping = false;
    //player.dy += .3;
  }
}



export const Movement = (keyPress, player) => {
  if (keyPress.right) {
    // right arrow
    player.dx = 3;
  } else if (keyPress.left) {
    // left arrow
    player.dx = -3;
  } else {
    player.dx = 0;
  }
}

