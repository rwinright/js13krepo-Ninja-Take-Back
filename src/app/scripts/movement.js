export const Jump = (jumpPressed, player, jumpTimer) => {

  if (jumpPressed) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      player.dy = -player.speed;
    }
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

