import ExampleSpawner from "sprites/example/ExampleSpawner";
import { SetAudio } from "sceneHooks/SetAudio";
import { GAME_RESOLUTION, GAME_HEALTH_POINTS, DEPTH_LAYERS, SOUND_BUTTON_POSITION, LEVELS } from "../constants";
import { SCORE_LABEL_STYLE, TIMER_STYLE, SCORE_STYLE, PTS_STYLE } from "utils/styles";
import SoundButton from "objects/soundButton";
import { IScore } from "typings/types";

class GameScene extends Phaser.Scene {
  currentLifes: number;
  prevHealthPoints: number;
  initialTime: number;
  exampleSpawner: ExampleSpawner;
  plusPts: Phaser.GameObjects.Text;
  timerText: Phaser.GameObjects.Text;
  winMessage: Phaser.GameObjects.Image;
  loseMessage: Phaser.GameObjects.Image;
  soundControl: SoundButton;
  score: IScore;

  constructor() {
    super({
      key: "GameScene",
    });

    this.currentLifes = GAME_HEALTH_POINTS;
    this.prevHealthPoints = 0;
  }

  create() {
    this.soundControl = new SoundButton({
      scene: this,
      x: SOUND_BUTTON_POSITION.x,
      y: SOUND_BUTTON_POSITION.y,
      texture: "volume",
      frameOn: "default.png",
      frameOff: "pressed.png",
    });
    const pauseControl = this.add
      .image(776, 21, "pause")
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      ?.setDepth(DEPTH_LAYERS.four);
    pauseControl.on("pointerdown", () => {
      this.scene.launch("PauseScene");
      this.scene.pause();
    });

    this.add.image(0, 0, "backgroundGame").setOrigin(0).setDepth(DEPTH_LAYERS.zero);
    this.add
      .shader("sunShader", GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height, 430, 430, ["sun", "sunGrid"])
      .setOrigin(0.5, 1.0);
    this.add.image(0, 470, "rocks").setOrigin(0, 1.0).setDepth(DEPTH_LAYERS.zero);
    this.add
      .shader("pannerShader", GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height, GAME_RESOLUTION.width, 260, [
        "back_grid",
      ])
      .setOrigin(0.5, 0.5);
    this.loseMessage = this.add
      .image(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2, "gui", "lose_message.png")
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH_LAYERS.three)
      .setVisible(false);
    this.winMessage = this.add
      .image(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2, "gui", "win_message.png")
      .setOrigin(0.5, 0.5)
      .setDepth(DEPTH_LAYERS.three)
      .setVisible(false);
    this.add
      .image(GAME_RESOLUTION.width / 2, 7, "gui", "time.png")
      .setOrigin(0.5, 0)
      .setDepth(DEPTH_LAYERS.three);
    this.timerText = this.add
      .text(GAME_RESOLUTION.width / 2, 25, "2:00", TIMER_STYLE)
      .setOrigin(0.5, 0)
      .setDepth(DEPTH_LAYERS.three);
    this.add.image(0, 369, "score").setOrigin(0).setDepth(DEPTH_LAYERS.three);

    this.initialTime = 120;
    const timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.initialTime > 0) {
          this.initialTime -= 1;
          this.timerText.setText(this.FormatTime(this.initialTime));
        } else {
          timer.destroy();
          this.ResetGame();
        }
      },
      callbackScope: this,
      loop: true,
    });

    this.plusPts = this.add.text(60, 503, "", PTS_STYLE).setOrigin(1).setDepth(DEPTH_LAYERS.three).setVisible(false);
    this.add.text(9, 443, "Score", SCORE_LABEL_STYLE).setOrigin(0).setDepth(DEPTH_LAYERS.three);

    this.sound.add("background");
    this.sound.add("wrong");
    this.sound.add("solved");
    this.sound.add("click");

    this.SpawnObjects();
    this.SetScore();
    SetAudio(this, "background", 0.5, true);
  }

  FormatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const partInSeconds = `${seconds % 60}`.padStart(2, "0");

    return `${minutes}:${partInSeconds}`;
  }

  SetAnswer(message: Phaser.GameObjects.Image, exampleSpawner: ExampleSpawner) {
    message.setVisible(true);
    this.time.addEvent({
      delay: 500,
      callback: () => {
        message.setVisible(false);
        exampleSpawner.GetExample();
      },
      callbackScope: this,
    });
  }

  SpawnObjects() {
    this.exampleSpawner = new ExampleSpawner(this, LEVELS.level4);
    this.exampleSpawner.orderEventEmitter.on("rightOrder", () => {
      this.UpdateScore(100);
      this.SetAnswer(this.winMessage, this.exampleSpawner);
      SetAudio(this, "solved", 0.5);
    });
    this.exampleSpawner.orderEventEmitter.on("wrongOrder", () => {
      this.SetAnswer(this.loseMessage, this.exampleSpawner);
      SetAudio(this, "wrong", 0.5);
    });
    this.exampleSpawner.GetExample();
  }

  SetScore() {
    this.score = {
      pts: 0,
      textObject: this.make
        .text({
          x: 59,
          y: 470,
          text: "0",
          origin: {
            x: 1,
            y: 0,
          },
          style: SCORE_STYLE,
          add: true,
        })
        .setDepth(DEPTH_LAYERS.three),
    };

    this.score.textObject.setText(`${this.score.pts}`);
  }

  UpdateScore(scores: number) {
    this.score.pts += scores;
    this.score.textObject.setText(`${this.score.pts}`);
    this.plusPts.setText(`+${scores}`).setVisible(true);
    this.time.addEvent({
      delay: 1000,
      callback: () => this.plusPts.setVisible(false),
      callbackScope: this,
    });
  }

  ResetGame() {
    this.scene.stop("GameScene");
    this.sound.stopAll();
    this.scene.start("EndScene", {
      currentScore: this.score.pts,
    });
  }
}

export default GameScene;
