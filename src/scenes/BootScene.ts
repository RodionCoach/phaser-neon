import { PATH_SPRITES, LOADER_FILL_COLOR } from "../constants";

class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene",
    });
  }
  preload() {
    const progress = this.add.graphics();

    // Register a load progress event to show a load bar
    this.load.on("progress", (value: number) => {
      progress.clear();
      progress.fillStyle(LOADER_FILL_COLOR, 1);
      progress.fillRect(0, +this.sys.game.config.height / 2, +this.sys.game.config.width * value, 60);
    });

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on("complete", () => {
      progress.destroy();
      this.scene.start("StartScene");
    });

    this.load.multiatlas("objects", `${PATH_SPRITES}/objects/objects.json`, `${PATH_SPRITES}/objects`);
    this.load.multiatlas("buttonBackground", `${PATH_SPRITES}/button/button.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("volume", `${PATH_SPRITES}/button/volume.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("gui", `${PATH_SPRITES}/gui/gui.json`, `${PATH_SPRITES}/gui`);
    this.load.multiatlas("count", `${PATH_SPRITES}/count/count.json`, `${PATH_SPRITES}/count`);
    this.load.image("backgroundGame", "./assets/img/Back_background.png");
    this.load.image("backgroundPrimary", "./assets/img/Back_background_primary.png");
    this.load.image("backgroundSecondary", "./assets/img/Back_background_secondary.png");
    this.load.image("backgroundRules", "./assets/img/Back_background_card.png");
    this.load.image("backgroundScore", "./assets/img/Back_background_score.png");
    this.load.image("pause", "./assets/img/pause.png");
    this.load.image("score", "./assets/img/score.png");
    this.load.image("back_grid", "./assets/img/back_grid.png");
    this.load.image("rocks", "./assets/img/rocks.png");
    this.load.image("sun", "./assets/img/sun.png");
    this.load.image("sunGrid", "./assets/img/sun_grid.png");

    this.load.audio("background", "./assets/sounds/space_back.mp3");
    this.load.audio("solved", "./assets/sounds/correct.mp3");
    this.load.audio("wrong", "./assets/sounds/wrong.mp3");
    this.load.audio("gameOver", "./assets/sounds/end.mp3");
    this.load.audio("click", "./assets/sounds/click_on_object.mp3");

    this.load.glsl("pannerShader", "./assets/shaders/panner.glsl");
    this.load.glsl("sunShader", "./assets/shaders/sun.glsl");

    this.load.rexWebFont({
      google: {
        families: ["Lato:400,700,900"],
      },
    });
  }
}

export default BootScene;
