/// <reference types="phaser" />
import ExampleSpawner from "sprites/example/ExampleSpawner";
import SoundButton from "objects/soundButton";
import { IScore } from "typings/types";
declare class GameScene extends Phaser.Scene {
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
    constructor();
    create(): void;
    FormatTime(seconds: number): string;
    SetAnswer(message: Phaser.GameObjects.Image, exampleSpawner: ExampleSpawner): void;
    SpawnObjects(): void;
    SetScore(): void;
    UpdateScore(scores: number): void;
    ResetGame(): void;
}
export default GameScene;
