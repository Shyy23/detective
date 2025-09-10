import { DATA_ASSET_KEYS, VN_CHAR_ASSET_KEYS } from "../assets/asset-keys.js";
import { Background } from "../battle/background.js";
import { CharacterVn } from "../chapter1/characters/character-vn.js";
import { Dialog } from "../chapter1/dialog.js";
import Phaser from "../lib/phaser.js";
import { Controls } from "../utils/controls.js";
import { SceneTransition } from "../utils/transition-scene.js";

import { SCENE_KEYS } from "./scene-keys.js";

export class Chapter1Scene extends Phaser.Scene {
  /** @type {Phaser.GameObjects.Rectangle}*/
  #overlay;
  /** @type {Dialog} */
  #dialogUi;
  /** @type {CharacterVn} */
  #object1;
  /** @type {CharacterVn} */
  #object2;
  /** @type {Controls} */
  #controls;

  constructor() {
    super({
      key: SCENE_KEYS.CHAPTER1_SCENE,
    });
  }

  create() {
    console.log(`[${Chapter1Scene.name}:create] invoked`);
    const transition = new SceneTransition();
    transition.createInTransition(this, {
      callback: () => {
        this.#dialogUi.showDialogModal(dialogData, () => {
          console.log("dialog");
        });
      },
    });
    const bg = new Background(this);
    bg.showMenu();

    this.#controls = new Controls(this);
    this.#dialogUi = new Dialog(this);
    this.#createObjects();

    // ✅ Ambil data dialog dari cache JSON
    const dialogJson = this.cache.json.get(DATA_ASSET_KEYS.CASE_INTRO);
    const dialogData = dialogJson.dialogs; // <-- ini array dialog
  }

  #createObjects() {
    this.#object1 = new CharacterVn({
      scene: this,
      position: { x: 100, y: 310 },
      assetKey: VN_CHAR_ASSET_KEYS.SOLVED_VN,
      scale: 0.5,
      name: "Solved",
    });
    this.#object2 = new CharacterVn({
      scene: this,
      position: { x: 930, y: 310 },
      assetKey: VN_CHAR_ASSET_KEYS.POLICE_VN,
      scale: 0.5,
      name: "Police",
    });
  }

  update() {
    const wasSpaceKeyPressed = this.#controls.wasSpaceKeyPressed();

    if (wasSpaceKeyPressed && this.#dialogUi.isVisible) {
      this.#dialogUi.handlePlayerInput("OK");
    }
  }
}
