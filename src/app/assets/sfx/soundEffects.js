import jsfxr from 'jsfxr';

export const playSound = (params) => {
  try {
    var soundURL = jsfxr(params);
    var player = new Audio();
    player.addEventListener('error', function(e) {
      console.log("Error: " + player.error.code);
    }, false);
    player.src = soundURL;
    player.play();
  } catch(e) {
    console.log(e.message);
  }
}