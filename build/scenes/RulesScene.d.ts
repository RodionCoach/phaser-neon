import SoundButton from "objects/soundButton";
declare class RulesScene extends Phaser.Scene {
    soundControl: SoundButton;
    constructor();
    create(): void;
    ReturnToMainMenu(): void;
}
export default RulesScene;
