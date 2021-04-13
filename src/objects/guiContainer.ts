interface IButtonStyle {
  fontSize: string;
  fixedHeight: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle?: string;
  color: string;
  align: string;
}

interface IGUIContainerConfig {
  scene: Phaser.Scene;
  name: string;
  x: number;
  y: number;
  text?: string;
  textStyle?: IButtonStyle;
  texture: string;
  defaultFrame: string;
  frameHover?: string;
  pressedFrame?: string;
  depth?: number;
  pointerDown?: () => void;
  pointerUp?: () => void;
  pointerOver?: () => void;
  pointerOut?: () => void;
}

class GUIContainer extends Phaser.GameObjects.Container {
  sprite: Phaser.GameObjects.Sprite;
  textObject: Phaser.GameObjects.Text;

  constructor({
    scene,
    name,
    x,
    y,
    text = "",
    textStyle,
    texture,
    defaultFrame,
    frameHover = defaultFrame,
    pressedFrame = defaultFrame,
    depth = 1,
    pointerDown = () => {},
    pointerUp = () => {},
    pointerOver = () => {},
    pointerOut = () => {},
  }: IGUIContainerConfig) {
    super(scene, x, y);
    scene.add.existing(this);

    this.setName(name).setDepth(depth).setSize(1, 1);

    this.sprite = scene.add.sprite(0, 0, texture, defaultFrame).disableInteractive().setOrigin(0.5);
    this.add(this.sprite);

    this.textObject = scene.add.text(0, 0, text, textStyle).disableInteractive().setOrigin(0.5);
    this.add(this.textObject);

    this.sprite
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.sprite.setTexture(texture, pressedFrame);
        pointerDown();
      })
      .on("pointerup", () => {
        this.sprite.setTexture(texture, defaultFrame);
        pointerUp();
      })
      .on("pointerover", () => {
        this.sprite.setTexture(texture, frameHover);
        pointerOver();
      })
      .on("pointerout", () => {
        this.sprite.setTexture(texture, defaultFrame);
        pointerOut();
      });
  }
}

export { GUIContainer };
