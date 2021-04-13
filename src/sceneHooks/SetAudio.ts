export const SetAudio = (scene: Phaser.Scene, soundName = "background", volume = 0.4, loop = false) => {
  scene.sound.get(`${soundName}`).play({ loop: loop, volume: volume });
};
