import {
  BUTTON_ASSET_KEYS,
  SETTING_MENU_ASSET_KEYS,
} from "../assets/asset-keys.js";
import Phaser from "../lib/phaser.js";

import { SCENE_KEYS } from "./scene-keys.js";

export class SettingScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.SETTING_SCENE,
    });
  }

  create() {
    console.log(`[${SettingScene.name}:create] invoked`);

    // Opsional: set depth, scale, dll
    const backBtn = this.add
      .image(50, 60, BUTTON_ASSET_KEYS.BACK)
      .setOrigin(0.5)
      .setScale(0.4)
      .setInteractive();

    const spotlightObjects = [backBtn];
  }

  #createSettingPane() {
    return this.add
      .image(
        this.cameras.main.centerX - 110,
        this.cameras.main.centerY - 50,
        SETTING_MENU_ASSET_KEYS.SETTING_PANE
      )
      .setOrigin(1) // Gambar dari pojok kiri atas texture
      .setScale(0.3);
  }
}
