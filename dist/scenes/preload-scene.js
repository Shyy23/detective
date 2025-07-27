import {
  BACKGROUND_ASSET_KEYS,
  MENU_ASSET_KEYS,
} from "../assets/asset-keys.js";
import Phaser from "../lib/phaser.js";
import { SCENE_KEYS } from "./scene-keys.js";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
      active: true,
    });
    console.log(SCENE_KEYS.PRELOAD_SCENE);
  }

  //   init() {
  //     console.log("init");
  //   }
  preload() {
    const oriPath = "assets/images/ori";

    // Background
    // this.load.image(BACKGROUND_ASSET_KEYS.MENU, `${oriPath}/bg-menu.png`);
    this.load.image(BACKGROUND_ASSET_KEYS.MENU, `${oriPath}/asset.png`);

    // Menu Assets
    this.load.image(MENU_ASSET_KEYS.LOGO, `${oriPath}/logo.png`);
  }
  create() {
    console.log("create");
    console.log(this.textures.get(BACKGROUND_ASSET_KEYS.MENU));
    this.add
      .image(0, 0, BACKGROUND_ASSET_KEYS.MENU)
      .setOrigin(0)
      .setDisplaySize(1024, 768);
  }
  //   update() {
  //     console.log("update");
  //   }
}
