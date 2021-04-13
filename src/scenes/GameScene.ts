import ExampleSpawner from "sprites/example/ExampleSpawner";
import { SetAudio } from "sceneHooks/SetAudio";
import {
  GAME_RESOLUTION,
  GAME_HEALTH_POINTS,
  DEPTH_LAYERS,
  SOUND_BUTTON_POSITION,
  OBJECTS_NUMBER_PER_LEVEL,
} from "utils/constants";
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

    this.add
      .shader("sunShader", GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height, GAME_RESOLUTION.width, 120)
      .setOrigin(0.5, 1.0);
    this.add
      .image(0, GAME_RESOLUTION.height, "sun", "sun.png")
      .setOrigin(0, 1.0)
      .setDepth(DEPTH_LAYERS.three).alpha = 0.85;
    this.add
      .image(0, GAME_RESOLUTION.height, "sun", "score.png")
      .setAngle(-10.0)
      .setOrigin(0, 1.0)
      .setDepth(DEPTH_LAYERS.three);

    this.add
      .shader("sunShader", GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height, GAME_RESOLUTION.width, 120)
      .setOrigin(0.5, 1.0);
    this.add.image(0, GAME_RESOLUTION.height, "sun", "sun.png").setOrigin(0, 1.0).setDepth(DEPTH_LAYERS.three);
    this.add
      .image(0, GAME_RESOLUTION.height, "sun", "score.png")
      .setAngle(-10.0)
      .setOrigin(0, 1.0)
      .setDepth(DEPTH_LAYERS.three).alpha = 0.75;

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

    this.plusPts = this.add.text(71, 458, "", PTS_STYLE).setOrigin(1).setDepth(DEPTH_LAYERS.three).setVisible(false);
    this.add.text(20, 398, "Score", SCORE_LABEL_STYLE).setOrigin(0).setDepth(DEPTH_LAYERS.three);

    this.sound.add("background");
    this.sound.add("wrong");
    this.sound.add("missed");
    this.sound.add("solved");
    this.sound.add("ufoBeam");

    this.SpawnObjects();
    this.SetScore();
    SetAudio(this, "background", 0.4, true);
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
    this.exampleSpawner = new ExampleSpawner(this, OBJECTS_NUMBER_PER_LEVEL.level2);
    this.exampleSpawner.orderEventEmitter.on("rightOrder", () => {
      this.UpdateScore(100);
      this.SetAnswer(this.winMessage, this.exampleSpawner);
    });
    this.exampleSpawner.orderEventEmitter.on("wrongOrder", () => {
      this.SetAnswer(this.loseMessage, this.exampleSpawner);
    });
    this.exampleSpawner.GetExample();
  }

  PlaySolvedSound() {
    this.sound.get("solved").play();
  }

  PlayWrongSound() {
    this.sound.get("wrong").play();
  }

  PlayMissedSound() {
    this.sound.get("missed").play({ volume: 0.5 });
  }

  SetScore() {
    this.score = {
      pts: 0,
      textObject: this.make
        .text({
          x: 70,
          y: 425,
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
