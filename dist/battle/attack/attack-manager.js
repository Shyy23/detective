import { exhaustiveGuard } from "../../utils/guard.js";
import { ATTACK_KEYS } from "./attack-keys.js";
import { IceShard } from "./ice-shard.js";
import { Slash } from "./slash.js";

/**
 * @typedef {keyof typeof ATTACK_TARGET} AttackTarget
 */

/** @enum {AttackTarget} */
export const ATTACK_TARGET = Object.freeze({
  PLAYER: "PLAYER",
  ENEMY: "ENEMY",
});

export class AttackManager {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {boolean} */
  #skipBattleAnimation;
  /** @type {IceShard} */
  #iceShardAttack;
  /** @type {Slash} */
  #slashAttack;

  /**
   *
   * @param {Phaser.Scene} scene
   * @param {boolean} skipBattleAnimation
   */
  constructor(scene, skipBattleAnimation) {
    this.#scene = scene;
    this.#skipBattleAnimation = skipBattleAnimation;
  }

  /**
   *
   * @param {import("./attack-keys").AttackKeys} attack
   * @param {AttackTarget} target
   * @param {() => void} [callback]
   * @returns {void}
   */
  playAttackAnimation(attack, target, callback) {
    if (this.#skipBattleAnimation) {
      callback();
      return;
    }

    // if attack target is enemy
    let x = 745;
    let y = 140;
    if (target === ATTACK_TARGET.PLAYER) {
      x = 256;
      y = 344;
    }

    switch (attack) {
      case ATTACK_KEYS.ICE_SHARD:
        if (!this.#iceShardAttack) {
          this.#iceShardAttack = new IceShard(this.#scene, { x, y });
        }
        this.#iceShardAttack.gameObject.setPosition(x, y);
        this.#iceShardAttack.playAnimation(callback);
        break;
      case ATTACK_KEYS.SLASH:
        if (!this.#slashAttack) {
          this.#slashAttack = new Slash(this.#scene, { x, y });
        }
        this.#slashAttack.gameObject.setPosition(x, y);
        this.#slashAttack.playAnimation(callback);
        break;
      default:
        exhaustiveGuard(attack);
    }
  }
}
