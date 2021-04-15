import { GAME_RESOLUTION } from "../constants";

class CountdownScene extends Phaser.Scene {
  constructor() {
    super({
      key: "CountdownScene",
    });
  }

  create() {
    this.add.image(0, 0, "backgroundSecondary").setOrigin(0);
    this.add
      .shader("pannerShader", GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height, GAME_RESOLUTION.width, 350, [
        "back_grid",
      ])
      .setOrigin(0.5, 1.0);

    let count = 3;

    const countdownText = this.add
      .image(GAME_RESOLUTION.width / 2, GAME_RESOLUTION.height / 2, "count", `${count}.png`)
      .setOrigin(0.5, 0.5)
      .setScale(0.8, 0.8);

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
          value: "2.0",
          duration: 500,
          yoyo: true,
          repeat: 0,
          loop: count - 1,
          ease: "Quad.easeInOut",
        },
        scaleY: {
          value: "2.0",
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
        countdownText.setTexture("count", `${count}.png`);
      },
      onComplete: () => {
        this.scene.stop("CountdownScene");
        this.scene.start("GameScene");
      },
    });
  }
}

export default CountdownScene;
