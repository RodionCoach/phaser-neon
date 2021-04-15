/// <reference types="phaser" />
import ExampleContainer from "./ExampleContainer";
import { ILevelConfig } from "typings/types";
export default class ExampleSpawner extends Phaser.GameObjects.GameObject {
    order: number;
    levelConfig: ILevelConfig;
    examples: ExampleContainer[];
    orderEventEmitter: Phaser.Events.EventEmitter;
    constructor(scene: Phaser.Scene, levelConfig: ILevelConfig);
    GetExample(levelConfig?: ILevelConfig): void;
    SetExamplesRandomPosition(): void;
    CheckOrder(order: number): boolean;
    CreateAnimations(scene: Phaser.Scene): void;
}
