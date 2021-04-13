import { PATH_SPRITES } from "utils/constants";

class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene",
    });
  }
  preload() {
    const progressBox = this.add.graphics();
    const progress = this.add.graphics();

    // Register a load progress event to show a load bar
    this.load.on("progress", (value: number) => {
      progress.clear();
      progressBox.fillStyle(0xfffffff, 0.8);
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, +this.sys.game.config.height / 2, +this.sys.game.config.width * value, 60);
    });

    // Register a load complete event to launch the title screen when all files are loaded
    this.load.on("complete", () => {
      progress.destroy();
      progressBox.destroy();
      this.scene.start("StartScene");
    });

    this.load.multiatlas("planets", `${PATH_SPRITES}/planets/planets.json`, `${PATH_SPRITES}/planets`);
    this.load.multiatlas("buttonBackground", `${PATH_SPRITES}/button/button.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("volume", `${PATH_SPRITES}/button/volume.json`, `${PATH_SPRITES}/button`);
    this.load.multiatlas("gui", `${PATH_SPRITES}/gui/gui.json`, `${PATH_SPRITES}/gui`);
    this.load.multiatlas("sun", `${PATH_SPRITES}/sun/sun.json`, `${PATH_SPRITES}/sun`);
    this.load.image("backgroundGame", "./assets/img/Back_background.png");
    this.load.image("backgroundPrimary", "./assets/img/Back_background_primary.png");
    this.load.image("backgroundSecondary", "./assets/img/Back_background_secondary.png");
    this.load.image("backgroundRules", "./assets/img/Back_background_card.png");
    this.load.image("backgroundScore", "./assets/img/Back_background_score.png");
    this.load.image("pause", "./assets/img/pause.png");

    this.load.audio("background", "./assets/sounds/background.mp3");
    this.load.audio("solved", "./assets/sounds/solved_problem.mp3");
    this.load.audio("wrong", "./assets/sounds/wrong_answer.mp3");
    this.load.audio("missed", "./assets/sounds/missed_problem.mp3");
    this.load.audio("gameOver", "./assets/sounds/end_of_the_game.mp3");
    this.load.audio("ufoBeam", "./assets/sounds/ufo_beam.mp3");

    this.load.glsl("sunShader", "./assets/shaders/sun.glsl");

    this.load.rexWebFont({
      google: {
        families: ["Lato:400,700,900"],
      },
    });
  }
}

export default BootScene;
