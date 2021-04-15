/// <reference types="phaser" />
export default class ExampleContainer extends Phaser.GameObjects.Container {
    sprite: Phaser.GameObjects.Sprite;
    textObject: Phaser.GameObjects.Text;
    answer: number;
    objectTextureNumber: number;
    id: number;
    constructor(scene: Phaser.Scene, x: number, y: number);
}
