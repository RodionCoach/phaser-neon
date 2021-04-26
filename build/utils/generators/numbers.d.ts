import { ILevelConfig } from "typings/types";
interface IExample {
    id: number;
    text: string;
}
declare type ExampleType = (config: ILevelConfig) => IExample[];
export declare const exampleGenerator: ExampleType;
export {};
