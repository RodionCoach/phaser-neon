import { GAME_RESOLUTION } from "utils/constants";
import { COUNTDOWN_STYLE } from "utils/styles";

class CountdownScene extends Phaser.Scene {
  constructor() {
    super({
      key: "CountdownScene",
    });
  }

  create() {
    this.add.image(0, 0, "backgroundSecondary").setOrigin(0);

    let count = 3;

    const halfScreenWidth = GAME_RESOLUTION.width / 2;
    const halfScreenHeight = GAME_RESOLUTION.height / 2;
    const countdownText = this.add.text(0, 0, `${count}`, COUNTDOWN_STYLE);
    countdownText.setPosition(halfScreenWidth, halfScreenHeight).setOrigin(0.5, 0.5);
    countdownText.setScale(0.4, 0.4);
    this.tweens.add({
      targets: countdownText,
      props: {
        alpha: {
          value: {
            getStart: (target, key, value) => {
              return value + 0.75;
            },
            getEnd: () => {
              return 0;
            },
          },
          duration: 1000,
          yoyo: false,
          repeat: 0,
          loop: count - 1,
          ease: "Quad.easeInOut",
        },
        scaleX: {
          value: "1.0",
          duration: 500,
          yoyo: true,
          repeat: 0,
          loop: count - 1,
          ease: "Quad.easeInOut",
        },
        scaleY: {
          value: "1.0",
          duration: 500,
          yoyo: true,
          repeat: 0,
          loop: count - 1,
          ease: "Quad.easeInOut",
        },
      },
      loop: count - 1,
      onLoop: () => {
        count -= 1;
        countdownText.setText(`${count}`);
      },
      onComplete: () => {
        this.scene.stop("CountdownScene");
        this.scene.start("GameScene");
      },
    });
  }
}

export default CountdownScene;
