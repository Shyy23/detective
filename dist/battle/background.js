import {
  BACKGROUND_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
} from "../assets/asset-keys.js";
import Phaser from "../lib/phaser.js";
export class Background {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {Phaser.GameObjects.Image} */
  #backgroundGameObject;
  /**
   *
   * @param {Phaser.Scene} scene the Phaser 3 scene that BattleMneu will be added to
   */
  constructor(scene) {
    this.#scene = scene;

    this.#backgroundGameObject = this.#scene.add
      .image(0, 0, BATTLE_BACKGROUND_ASSET_KEYS.FOREST)
      .setOrigin(0)
      .setAlpha(0);
  }

  showForest() {
    this.#backgroundGameObject
      .setTexture(BATTLE_BACKGROUND_ASSET_KEYS.FOREST)
      .setAlpha(1);
  }

  showCollectorRoom() {
    this.#backgroundGameObject
      .setTexture(BATTLE_BACKGROUND_ASSET_KEYS.COLLECTOR_ROOM)
      .setAlpha(1);
  }

  showMenu() {
    this.#backgroundGameObject
      .setTexture(BACKGROUND_ASSET_KEYS.MENU)
      .setAlpha(1);
  }
}
