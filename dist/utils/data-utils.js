import { DATA_ASSET_KEYS } from "../assets/asset-keys.js";

export class DataUtils {
  /**
   *
   * @param {Phaser.Scene} scene
   * @param {number} attackId
   * @returns {import("../types/typedef.js").Attack | undefined}
   */
  static getMonsterAttack(scene, attackId) {
    /** @type {import("../types/typedef.js").Attack[]} */
    const data = scene.cache.json.get(DATA_ASSET_KEYS.ATTACKS);
    return data.find((attack) => attack.id === attackId);
  }

  /**
   *
   * @param {Phaser.Scene} scene
   * @returns {import("../types/typedef.js").Animation[]}
   */
  static getAnimations(scene) {
    const data = scene.cache.json.get(DATA_ASSET_KEYS.ANIMATIONS);
    return data;
  }
}
