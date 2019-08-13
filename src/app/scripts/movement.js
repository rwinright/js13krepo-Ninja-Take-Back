export const Jump = (jumpPressed, player, timer) => {
  //TODO: add jump and fall velocity - Will have to add a timer to the game loop
  let currentTime = 0;
  console.log(currentTime);
  if(jumpPressed){
    currentTime = timer / 60;
    console.log(currentTime)
    if(timer >= currentTime + 0.6){
      player.dy = -3;
    }
  } else if(!jumpPressed && player.y < 256 - player.height){
    player.dy = 2;
  }

  if(player.y >= 256 - player.height && !jumpPressed){
    player.dy = 0;
  }
}

