import { DEPTH_LAYERS, GAME_RESOLUTION, SOUND_BUTTON_POSITION } from "utils/constants";
import { BUTTON_STYLE } from "utils/styles";
import SoundButton from "objects/soundButton";
import { GUIContainer } from "objects/guiContainer";

class PauseScene extends Phaser.Scene {
  soundControl: SoundButton;

  constructor() {
    super({
      key: "PauseScene",
    });
  }

  create() {
    this.add.image(0, 0, "backgroundPrimary").setOrigin(0);

    this.soundControl = new SoundButton({
      scene: this,
      x: SOUND_BUTTON_POSITION.x,
      y: SOUND_BUTTON_POSITION.y,
      texture: "volume",
      frameOn: "default.png",
      frameOff: "pressed.png",
    });

    const containerButton = this.add
      .container(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2)
      .setName("containerButton")
      .setDepth(DEPTH_LAYERS.one);

    const distanceBetweenButtons = 25;

    const buttonRestart = new GUIContainer({
      scene: this,
      name: "buttonRestart",
      x: 0,
      y: 0,
      text: "RESTART",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.RestartGame();
      },
    });
    containerButton.add(buttonRestart);

    const buttonResume = new GUIContainer({
      scene: this,
      name: "buttonResume",
      x: 0,
      y: -buttonRestart.sprite.height - distanceBetweenButtons,
      text: "RESUME",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.ResumeGame();
      },
    });
    containerButton.add(buttonResume);

    const buttonReturn = new GUIContainer({
      scene: this,
      name: "buttonReturn",
      x: 0,
      y: buttonRestart.sprite.height + distanceBetweenButtons,
      text: "MAIN MENU",
      textStyle: BUTTON_STYLE,
      texture: "buttonBackground",
      defaultFrame: "default.png",
      frameHover: "hover.png",
      pressedFrame: "pressed.png",
      depth: DEPTH_LAYERS.one,
      pointerDown: () => {
        this.ReturnToMainMenu();
      },
    });
    containerButton.add(buttonReturn);
  }

  ResumeGame() {
    this.scene.resume("GameScene");
    this.scene.stop("PauseScene");
  }

  RestartGame() {
    this.sound.stopAll();
    this.scene.stop("GameScene");
    this.scene.start("CountdownScene");
  }

  ReturnToMainMenu() {
    this.sound.stopAll();
    this.scene.stop("GameScene");
    this.scene.stop("PauseScene");
    this.scene.start("StartScene");
  }
}

export default PauseScene;
