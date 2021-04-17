import ExampleSpawner from "sprites/example/ExampleSpawner";
import { SetAudio } from "sceneHooks/SetAudio";
import { GAME_RESOLUTION, GAME_HEALTH_POINTS, DEPTH_LAYERS, SOUND_BUTTON_POSITION, PATH_CONFIG } from "../constants";
import { SCORE_LABEL_STYLE, TIMER_STYLE, SCORE_STYLE, PTS_STYLE } from "utils/styles";
import complexitySelector from "utils/selector";
import SoundButton from "objects/soundButton";
import { IScore } from "typings/types";

class GameScene extends Phaser.Scene {
  startedRopeEffect: boolean;
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
  rope: Phaser.GameObjects.Rope;
  ropePath: Phaser.Curves.Spline;
  lineShader: Phaser.GameObjects.Shader;
  particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private interpolatorForPath: { t: number };

  constructor() {
    super({
      key: "GameScene",
    });

    this.currentLifes = GAME_HEALTH_POINTS;
    this.prevHealthPoints = 0;
    this.startedRopeEffect = false;
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

    this.lineShader = this.add
      .shader("lineShader", 0, 0, PATH_CONFIG.width, PATH_CONFIG.height)
      .setRenderToTexture("line");

    const curve = new Phaser.Curves.Spline([0, 0, 0, 0]);
    const points = curve.getPoints(1);
    this.rope = this.add.rope(0, 0, "line", undefined, points, true).setDepth(DEPTH_LAYERS.one);

    const particles = this.add.particles("flares");

    this.particleEmitter = particles.createEmitter({
      frame: ["red" /*, "blue" , "green", "yellow"*/],
      speed: { min: -400, max: 400 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.25, end: 0 },
      lifespan: 750,
      gravityY: 800,
      quantity: 50,
      blendMode: "SCREEN",
    });
    this.particleEmitter.stop();

    this.SpawnObjects();
    this.SetScore();
    SetAudio(this, "background", 0.5, true);
  }

  SetRope() {
    this.startedRopeEffect = true;
    this.lineShader.height = PATH_CONFIG.height;
    const tmpPoints: number[] = [];
    this.exampleSpawner.examples.forEach(v => {
      tmpPoints.push(v.x, v.y);
      this.particleEmitter.explode(50, v.x, v.y);
    });
    tmpPoints.push(120, 450);
    this.ropePath = new Phaser.Curves.Spline(tmpPoints);

    this.interpolatorForPath = { t: 0 };

    this.tweens.add({
      targets: this.interpolatorForPath,
      t: 1,
      ease: "Sine.easeInOut",
      duration: 600,
      yoyo: false,
      repeat: -1,
    });
  }

  update() {
    if (this.startedRopeEffect) {
      const index = Math.floor(this.interpolatorForPath.t * PATH_CONFIG.numPoints);
      const points = this.ropePath
        .getPoints(PATH_CONFIG.numPoints)
        .slice(index, Phaser.Math.Clamp(index + Math.floor(PATH_CONFIG.numPoints / 2), 1, PATH_CONFIG.numPoints));
      if (points.length > 1) {
        this.rope.setPoints(points);
        this.lineShader.height =
          PATH_CONFIG.height * Phaser.Math.Clamp(Math.abs(this.interpolatorForPath.t - 1.0) + 0.35, 0.25, 1.0);
      } else {
        this.rope.setPoints([new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(0, 0)]);
        this.startedRopeEffect = false;
      }
      this.rope.updateVertices();
    }
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
    const level = complexitySelector();
    this.exampleSpawner = new ExampleSpawner(this, level);
    this.exampleSpawner.orderEventEmitter.on("rightOrder", () => {
      this.SetRope();
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
