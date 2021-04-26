import SoundButton from "objects/soundButton";
declare class PauseScene extends Phaser.Scene {
    soundControl: SoundButton;
    constructor();
    create(): void;
    ResumeGame(): void;
    RestartGame(): void;
    ReturnToMainMenu(): void;
}
export default PauseScene;
