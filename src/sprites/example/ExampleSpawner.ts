import ExampleContainer from "./ExampleContainer";
import { exampleGenerator } from "utils/generators/numbers";
import { numbersArrayGenerator } from "utils/generators/numbersArrayGenerator";
import { TOTAL_EXAMPLES, DEPTH_LAYERS } from "utils/constants";
import { EXAMPLES_STYLE } from "utils/styles";
import { shuffle } from "utils/shuffle";
import { RandomPlacePluginType, ILevelConfig } from "typings/types";

export default class ExampleSpawner extends Phaser.GameObjects.GameObject {
  order: number;
  levelConfig: ILevelConfig;
  examples: ExampleContainer[];
  orderEventEmitter: Phaser.Events.EventEmitter;
  constructor(scene: Phaser.Scene, levelConfig: ILevelConfig) {
    super(scene, "");
    this.orderEventEmitter = new Phaser.Events.EventEmitter();
    this.order = 0;
    this.examples = [];
    this.levelConfig = levelConfig;
    this.CreateAnimations(scene);
    this.examples = Array.from({ length: TOTAL_EXAMPLES }, () => {
      const exampleContainer: ExampleContainer = new ExampleContainer(scene, 0, 0);
      exampleContainer.setDepth(DEPTH_LAYERS.two);
      exampleContainer.sprite.setTexture("planets", "disappearance/planet5/0001.png");
      exampleContainer.textObject.setStyle(EXAMPLES_STYLE).setOrigin(0.5, 0.5).setPosition(0, 0);
      exampleContainer.sprite.on(
        Phaser.Animations.Events.ANIMATION_COMPLETE,
        () => {
          if (exampleContainer.sprite.anims.currentAnim.key.match(/disappearance/)) {
            exampleContainer.setVisible(false);
            if (
              exampleContainer.id === this.levelConfig.numbersAmount - 1 &&
              this.order === this.levelConfig.numbersAmount
            ) {
              this.orderEventEmitter.emit("rightOrder");
            }
          } else {
            exampleContainer.textObject.setVisible(true);
          }
        },
        this,
      );
      return exampleContainer;
    });
  }

  GetExample(levelConfig?: ILevelConfig) {
    if (levelConfig) {
      this.levelConfig = levelConfig;
    }
    this.order = 0;
    const examples = exampleGenerator(this.levelConfig);
    const randArrayForPlanetSprite = shuffle(numbersArrayGenerator(5));
    this.examples.forEach((exampleContainer, index) => {
      if (examples[index]) {
        exampleContainer.id = examples[index].id;
        exampleContainer.setVisible(true);
        exampleContainer.planetTextureNumber = randArrayForPlanetSprite[index];
        exampleContainer.textObject.setText(examples[index].text);
        exampleContainer.sprite.anims.play({
          key: `appearancePlanet${exampleContainer.planetTextureNumber}`,
        });
        exampleContainer.sprite.removeListener("pointerdown");
        const shape = new Phaser.Geom.Circle(exampleContainer.sprite.width / 2, exampleContainer.sprite.height / 2, 60);
        exampleContainer.sprite
          .setInteractive({ hitArea: shape, hitAreaCallback: Phaser.Geom.Circle.Contains, useHandCursor: true })
          .on("pointerdown", () => {
            if (this.CheckOrder(examples[index].id)) {
              exampleContainer.textObject.setVisible(false);
              exampleContainer.sprite.anims.play({
                key: `disappearancePlanet${exampleContainer.planetTextureNumber}`,
              });
            }
          });
      } else {
        exampleContainer.setVisible(false);
      }
    });
    this.SetExamplesRandomPosition();
  }

  SetExamplesRandomPosition() {
    const plugin = <RandomPlacePluginType>this.scene.plugins.get("rexRandomPlace");
    plugin.randomPlace(this.examples, {
      radius: 75,
      area: new Phaser.Geom.Rectangle(145, 110, 510, 340),
    });
  }

  CheckOrder(order: number): boolean {
    if (order === this.order) {
      this.order += 1;
      return true;
    } else {
      this.examples.forEach(exampleContainer => {
        exampleContainer.setVisible(false);
      });
      this.orderEventEmitter.emit("wrongOrder");
      return false;
    }
  }

  CreateAnimations(scene: Phaser.Scene) {
    for (let i = 1; i < 6; i += 1) {
      const frameNamesAppearance = scene.anims.generateFrameNames("planets", {
        start: 1,
        end: 6,
        zeroPad: 4,
        prefix: `appearance/planet${i}/`,
        suffix: ".png",
      });
      scene.anims.create({ key: `appearancePlanet${i}`, frames: frameNamesAppearance, frameRate: 20, repeat: 0 });

      const frameNamesDisappearance = scene.anims.generateFrameNames("planets", {
        start: 1,
        end: 8,
        zeroPad: 4,
        prefix: `disappearance/planet${i}/`,
        suffix: ".png",
      });
      scene.anims.create({ key: `disappearancePlanet${i}`, frames: frameNamesDisappearance, frameRate: 20, repeat: 0 });
    }
  }
}
