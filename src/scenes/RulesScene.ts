import {
  RULES_TEXT,
  GAME_RESOLUTION,
  TEXT_AREA_CONFIG_FOR_RULES,
  DEPTH_LAYERS,
  SOUND_BUTTON_POSITION,
} from "utils/constants";
import { BUTTON_STYLE, RULES_STYLE } from "utils/styles";
import SoundButton from "objects/soundButton";
import { GUIContainer } from "objects/guiContainer";

class RulesScene extends Phaser.Scene {
  soundControl: SoundButton;

  constructor() {
    super({
      key: "RulesScene",
    });
  }

  create() {
    this.add.image(0, 0, "backgroundRules").setOrigin(0);

    this.soundControl = new SoundButton({
      scene: this,
      x: SOUND_BUTTON_POSITION.x,
      y: SOUND_BUTTON_POSITION.y,
      texture: "volume",
      frameOn: "default.png",
      frameOff: "pressed.png",
    });

    const container = this.add
      .container(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2)
      .setName("textArea")
      .setDepth(DEPTH_LAYERS.one);

    const rulesText = this.add.text(0, -TEXT_AREA_CONFIG_FOR_RULES.y, RULES_TEXT, RULES_STYLE).setOrigin(0.5);
    container.add(rulesText);

    const buttonReturn = new GUIContainer({
      scene: this,
      name: "buttonReturn",
      x: 0,
      y: TEXT_AREA_CONFIG_FOR_RULES.height / 2 + TEXT_AREA_CONFIG_FOR_RULES.y / 2,
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
    container.add(buttonReturn);
  }

  ReturnToMainMenu() {
    this.scene.start("StartScene");
  }
}

export default RulesScene;
