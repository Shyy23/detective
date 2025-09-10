// tools/MenuFunctionTools.js
import Phaser from "../lib/phaser.js";
import { MENU_ASSET_KEYS } from "../assets/asset-keys.js";
import { MENU_UI_TITLE_STYLE } from "../battle/ui/menu/battle-menu-config.js";

export class MenuFunctionTools {
  /**
   * Membuat pane background.
   * @param {Phaser.Scene} scene
   * @param {number} scale
   * @returns {Phaser.GameObjects.Image}
   */

  static createPane(scene, scale = 0.3) {
    return scene.add
      .image(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY,
        MENU_ASSET_KEYS.PANE,
        0
      )
      .setOrigin(0.5)
      .setScale(scale)
      .setDepth(0);
  }

  /**
   * Membuat title text dinamis.
   * @param {Phaser.Scene} scene
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @returns {Phaser.GameObjects.Text}
   */
  static createTitleText(scene, text, x = 0, y = 0) {
    return scene.add
      .text(x, y, text, MENU_UI_TITLE_STYLE)
      .setLetterSpacing(-2)
      .setOrigin(0.5)
      .setStroke("#76261B", 6);
  }
}
