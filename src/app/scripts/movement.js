export const Jump = (jumpPressed, player) => {

  if (jumpPressed) {
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      player.dy = 1 * -player.speed;
    }
  }
}

