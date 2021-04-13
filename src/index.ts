import "phaser";
import BootScene from "scenes/BootScene";
import StartScene from "scenes/StartScene";
import GameScene from "scenes/GameScene";
import PauseScene from "scenes/PauseScene";
import RulesScene from "scenes/RulesScene";
import CountdownScene from "scenes/CountdownScene";
import EndScene from "scenes/EndScene";
import WebFontLoaderPlugin from "phaser3-rex-plugins/plugins/webfontloader-plugin.js";
import RandomPlacePlugin from "phaser3-rex-plugins/plugins/randomplace-plugin.js";

import { GAME_RESOLUTION, BACKGROUND_COLOR } from "./utils/constants";

const config = {
  type: Phaser.WEBGL,
  pixelArt: false,
  roundPixels: true,
  parent: "content",
  width: GAME_RESOLUTION.width,
  height: GAME_RESOLUTION.height,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    max: {
      width: 800,
      height: 600,
    },
  },
  backgroundColor: BACKGROUND_COLOR,
  plugins: {
    global: [
      {
        key: "rexWebFontLoader",
        plugin: WebFontLoaderPlugin,
        start: true,
      },
      {
        key: "rexRandomPlace",
        plugin: RandomPlacePlugin,
        start: true,
      },
    ],
  },
  scene: [BootScene, CountdownScene, StartScene, GameScene, PauseScene, EndScene, RulesScene],
};

new Phaser.Game(config);
