/// <reference types="phaser" />
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
declare class GUIContainer extends Phaser.GameObjects.Container {
    sprite: Phaser.GameObjects.Sprite;
    textObject: Phaser.GameObjects.Text;
    constructor({ scene, name, x, y, text, textStyle, texture, defaultFrame, frameHover, pressedFrame, depth, pointerDown, pointerUp, pointerOver, pointerOut, }: IGUIContainerConfig);
}
export { GUIContainer };
