/// <reference types="phaser" />
import ExampleSpawner from "sprites/example/ExampleSpawner";
import SoundButton from "objects/soundButton";
import { IScore, GlowObjectType } from "typings/types";
declare class GameScene extends Phaser.Scene {
    startedRopeEffect: boolean;
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
    rope: Phaser.GameObjects.Rope;
    ropePath: Phaser.Curves.Spline;
    lineShader: Phaser.GameObjects.Shader;
    scoreBack: GlowObjectType;
    private interpolatorForPath;
    constructor();
    create(): void;
    update(): void;
    SetRope(): void;
    FormatTime(seconds: number): string;
    SetAnswer(message: Phaser.GameObjects.Image, exampleSpawner: ExampleSpawner): void;
    SpawnObjects(): void;
    SetScore(): void;
    UpdateScore(scores: number): void;
    ResetGame(): void;
}
export default GameScene;
