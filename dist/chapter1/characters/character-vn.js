/**
 * @typedef CharacterConfig
 * @type {object}
 * @property {Phaser.Scene} scene
 * @property {string} assetKey
 * @property {import("../../types/typedef.js").Coordinate} position
 * @property {number} scale
 * @property {string} name
 *
 */

export class CharacterVn {
  /** @type {Phaser.Scene} */
  _scene;
  /** @type {Phaser.GameObjects.Image} */
  _PhaserGameObject;

  /**
   *
   * @param {CharacterConfig} config
   */
  constructor(config) {
    this._scene = config.scene;
    this._PhaserGameObject = this._scene.add
      .image(config.position.x, config.position.y, config.assetKey)
      .setScale(config.scale);
  }
}
