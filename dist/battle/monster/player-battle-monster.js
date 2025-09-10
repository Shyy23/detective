import { FONT_ASSET_NAME } from "../../assets/font-keys.js";
import { BattleMonster } from "./battle-monster.js";

/** @type {import("../../types/typedef.js").Coordinate} */
const PLAYER_POSITION = Object.freeze({
  x: 256,
  y: 316,
});

export class PlayerBattleMonster extends BattleMonster {
  /** @type {Phaser.GameObjects.Text} */
  #healthBarTextGameObject;
  /**
   *
   * @param {import("../../types/typedef.js").BattleMonsterConfig} config
   */
  constructor(config) {
    super(config, PLAYER_POSITION);
    this._phaserGameObject.setScale(1.5);
    this._phaserHealthBarGameContainer.setPosition(556, 318);

    this.#addHealthBarComponents();
  }

  #setHealthBarText() {
    this.#healthBarTextGameObject.setText(
      `${this._currentHealth}/${this._maxHealth}`
    );
  }
  #addHealthBarComponents() {
    this.#healthBarTextGameObject = this._scene.add
      .text(443, 80, "", {
        fontFamily: FONT_ASSET_NAME.KENNY_FUTURE_NARROW,
        color: "#DDD393",
        fontSize: "16px",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);
    this.#setHealthBarText();

    this._phaserHealthBarGameContainer.add(this.#healthBarTextGameObject);
  }
  /**
   *
   * @param {number} damage
   * @param {() => void} [callback]
   */
  takeDamage(damage, callback) {
    super.takeDamage(damage, callback);
    this.#setHealthBarText();
  }

  /**
   * @param {() => void} callback
   * @returns {void}
   */
  playMonsterAppearAnimation(callback) {
    const startXPos = -30;
    const endXPos = PLAYER_POSITION.x;
    this._phaserGameObject.setPosition(startXPos, PLAYER_POSITION.y);
    this._phaserGameObject.setAlpha(1);

    if (this._skipBattleAnimation) {
      this._phaserGameObject.setX(endXPos);
      callback();
      return;
    }

    this._scene.tweens.add({
      delay: 0,
      duration: 800,
      x: {
        from: startXPos,
        start: startXPos,
        to: endXPos,
      },
      targets: this._phaserGameObject,
      onComplete: () => {
        callback();
      },
    });
  }
  /**
   * @param {() => void} callback
   * @returns {void}
   */
  playMonsterHealthBarAppearAnimation(callback) {
    const startXPos = 800;
    const endXPos = this._phaserHealthBarGameContainer.x;
    this._phaserHealthBarGameContainer.setPosition(
      startXPos,
      this._phaserHealthBarGameContainer.y
    );
    this._phaserHealthBarGameContainer.setAlpha(1);

    if (this._skipBattleAnimation) {
      this._phaserHealthBarGameContainer.setX(endXPos);
      callback();
      return;
    }
    this._scene.tweens.add({
      delay: 0,
      duration: 800,
      x: {
        from: startXPos,
        start: startXPos,
        to: endXPos,
      },
      targets: this._phaserHealthBarGameContainer,
      onComplete: () => {
        callback();
      },
    });
  }

  /**
   * @param {() => void} callback
   * @returns {void}
   */
  playDeathAnimation(callback) {
    const startYPos = this._phaserGameObject.y;
    const endYPos = startYPos + 400;

    if (this._skipBattleAnimation) {
      this._phaserGameObject.setY(endYPos);
      callback();
      return;
    }

    this._scene.tweens.add({
      delay: 0,
      duration: 1600,
      y: {
        from: startYPos,
        start: startYPos,
        to: endYPos,
      },
      targets: this._phaserGameObject,
      onComplete: () => {
        callback();
      },
    });
  }
}
