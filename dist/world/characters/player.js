import { CHARACTER_WORLD_ASSET_KEYS } from "../../assets/asset-keys.js";
import { DIRECTION } from "../../common/direction.js";
import { exhaustiveGuard } from "../../utils/guard.js";
import { Character } from "./character.js";

/**
 *  @typedef {Omit<import("./character.js").CharacterConfig, 'assetKey' | 'idleFrameConfig'>} PlayerConfig
 */

export class Player extends Character {
  /**
   *
   * @param {PlayerConfig} config
   */
  constructor(config) {
    super({
      ...config,
      assetKey: CHARACTER_WORLD_ASSET_KEYS.PLAYER,
      origin: { x: 0, y: 0.2 },
      idleFrameConfig: {
        DOWN: 7,
        LEFT: 10,
        RIGHT: 4,
        UP: 1,
        NONE: 7,
      },
    });
    // TODO
  }

  /**
   *
   * @param {import("../../common/direction.js").Direction} direction
   */
  moveCharacter(direction) {
    super.moveCharacter(direction);

    switch (this._direction) {
      case DIRECTION.DOWN:
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
      case DIRECTION.UP:
        if (
          !this._PhaserGameObject.anims.isPlaying ||
          this._PhaserGameObject.anims.currentAnim?.key !==
            `PLAYER_${this.direction}`
        ) {
          this._PhaserGameObject.play(`PLAYER_${this._direction}`);
        }
        break;
      case DIRECTION.NONE:
        break;
      default:
        exhaustiveGuard(this._direction);
    }
  }
}
