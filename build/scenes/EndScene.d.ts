/// <reference types="phaser" />
import { IInitData } from "typings/types";
declare class EndScene extends Phaser.Scene {
    currentScore: number;
    soundControl: Phaser.GameObjects.Image;
    constructor();
    init(data: IInitData): void;
    create(): void;
    IsBestScore(): string;
    RestartGame(): void;
    ReturnToMainMenu(): void;
}
export default EndScene;
