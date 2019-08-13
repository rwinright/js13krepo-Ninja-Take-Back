export const Jump = (jumpPressed, player) => {
  //TODO: add jump and fall velocity - Will have to add a timer to the game loop

  if(jumpPressed){
    player.dy = -2;
  } else {
    player.dy = 1;
  }

  if(player.y >= 256 - player.height && !jumpPressed){
    player.dy = 0;
  }
}

