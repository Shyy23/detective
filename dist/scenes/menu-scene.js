import { AUDIO_ASSETS_KEYS } from "../assets/audio-asset-keys.js";

import { Background } from "../battle/background.js";
import { DIRECTION } from "../common/direction.js";
import Phaser from "../lib/phaser.js";
import { MainMenu } from "../main-menu/ui/main-menu.js";
import { Controls } from "../utils/controls.js";

import { SCENE_KEYS } from "./scene-keys.js";

export class MenuScene extends Phaser.Scene {
  /** @type {MainMenu} */
  #mainMenu;
  /** @type {Controls} */
  #controls;

  constructor() {
    super({
      key: SCENE_KEYS.MENU_SCENE,
    });
  }

  create() {
    console.log(`[${MenuScene.name}:create] invoked`);
    const background = new Background(this);
    background.showMenu();

    this.#mainMenu = new MainMenu(this);

    this.#controls = new Controls(this);
  }

  update() {
    const wasEnterKeyPressed = this.#controls.wasEnterKeyPressed();

    if (wasEnterKeyPressed) {
      this.#mainMenu.handlePlayerInput("OK");
    }

    const selectedDirection = this.#controls.getDirectionKeyjustPressed();

    if (selectedDirection !== DIRECTION.NONE) {
      this.#mainMenu.handlePlayerInput(selectedDirection);
    }
  }
}
