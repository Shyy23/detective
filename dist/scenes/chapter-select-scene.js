import {
  BACKGROUND_ASSET_KEYS,
  BUTTON_ASSET_KEYS,
} from "../assets/asset-keys.js";
import { BgmManager } from "../audio/bgmManager.js";
import { DIRECTION } from "../common/direction.js";
import Phaser from "../lib/phaser.js";
import { SelectChapterMenu } from "../main-menu/ui/select-chapter-menu.js";
import { Controls } from "../utils/controls.js";

import { SCENE_KEYS } from "./scene-keys.js";

export class ChapterSelectScene extends Phaser.Scene {
  /** @type {SelectChapterMenu} */
  #selectChapterMenu;

  /** @type {Phaser.GameObjects.Image} */
  #backBtnPhaserImageGameObject;
  /** @type {Controls} */
  #controls;

  constructor() {
    super({
      key: SCENE_KEYS.CHAPTER_SELECT_SCENE,
    });
  }

  create() {
    console.log(`[${ChapterSelectScene.name}:create] invoked`);
    BgmManager.resume();
    // render out the background
    this.add.image(0, 0, BACKGROUND_ASSET_KEYS.MENU).setOrigin(0);

    this.#selectChapterMenu = new SelectChapterMenu(this);

    this.#backBtnPhaserImageGameObject = this.add
      .image(50, 60, BUTTON_ASSET_KEYS.BACK)
      .setOrigin(0.5)
      .setScale(0.4)
      .setInteractive();

    this.#controls = new Controls(this);
  }

  update() {
    const wasEnterKeyPressed = this.#controls.wasEnterKeyPressed();
    const wasEsckeyPressed = this.#controls.wasEscKeyPressed();

    if (wasEnterKeyPressed) {
      this.#selectChapterMenu.handlePlayerInput("OK");
    }
    if (wasEsckeyPressed) {
      this.#selectChapterMenu.handlePlayerInput("CANCEL");
    }
    const selectedDirection = this.#controls.getDirectionKeyjustPressed();

    if (selectedDirection !== DIRECTION.NONE) {
      this.#selectChapterMenu.handlePlayerInput(selectedDirection);
    }
  }
}
