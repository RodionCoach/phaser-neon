import SoundButton from "objects/soundButton";
declare class StartScene extends Phaser.Scene {
    soundControl: SoundButton;
    constructor();
    create(): void;
    StartGame(): void;
    HowToPlay(): void;
}
export default StartScene;
