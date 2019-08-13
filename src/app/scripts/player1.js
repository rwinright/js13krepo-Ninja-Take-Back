export const Bounce = (player) => {
  if(player.x <= 0){
    player.dx = 3.2;
  } else if(player.x >= 256 - player.width){
    player.dx = -3.2;
  }

  if(player.y <= 0){
    player.dy = 3.5
  } else if(player.y >= 256 - player.height){
    player.dy = -3.2;
  }
}