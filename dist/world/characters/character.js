import Phaser from "../../lib/phaser.js";
import { DIRECTION } from "../../common/direction.js";
import { getTargetPositionFromGameObjectPositionAndDirection } from "../../utils/grid-utils.js";
import { exhaustiveGuard } from "../../utils/guard.js";

/**
 * @typedef CharacterIdleFrameConfig
 * @type {object}
 * @property {number} LEFT
 * @property {number} RIGHT
 * @property {number} UP
 * @property {number} DOWN
 * @property {number} NONE
 */

/**
 * @typedef CharacterConfig
 * @type {object}
 * @property {Phaser.Scene} scene
 * @property {string} assetKey
 * @property {import("../../types/typedef.js").Coordinate} [origin={x:0,y:0}]
 * @property {import("../../types/typedef.js").Coordinate} position
 * @property {import("../../common/direction.js").Direction} direction
 * @property {() => void} [spriteGridMovementFinishedCallback]
 * @property {CharacterIdleFrameConfig} idleFrameConfig
 * @property {Phaser.Tilemaps.TilemapLayer} [collisionLayer]
 * @property {Character[]} [otherCharactersToCheckForCollisionsWith=[]]
 *
 */
export class Character {
  /** @type {Phaser.Scene} */
  _scene;
  /** @type {Phaser.GameObjects.Sprite} */
  _PhaserGameObject;
  /** @type {import("../../common/direction.js").Direction} */
  _direction;
  /** @type {boolean} */
  _isMoving;
  /** @type {import("../../types/typedef.js").Coordinate} */
  _targetPosition;
  /** @type {import("../../types/typedef.js").Coordinate} */
  _previousTargetPosition;
  /** @type {() => void | undefined} */
  _spriteGridMovementFinishedCallback;
  /** @type {CharacterIdleFrameConfig} */
  _idleFrameConfig;
  /** @type {import("../../types/typedef.js").Coordinate} */
  _origin;
  /** @type {Phaser.Tilemaps.TilemapLayer | undefined} */
  _collisionLayer;
  /** @type {Character[]} */
  _otherCharactersToCheckForCollisionsWith;
  /**
   *
   * @param {CharacterConfig} config
   */
  constructor(config) {
    this._scene = config.scene;
    this._direction = config.direction;
    this._isMoving = false;
    this._targetPosition = { ...config.position };
    this._previousTargetPosition = { ...config.position };
    this._idleFrameConfig = config.idleFrameConfig;
    this._origin = config.origin ? { ...config.origin } : { x: 0, y: 0 };
    this._collisionLayer = config.collisionLayer;
    this._otherCharactersToCheckForCollisionsWith =
      config.otherCharactersToCheckForCollisionsWith || [];
    this._PhaserGameObject = this._scene.add
      .sprite(
        config.position.x,
        config.position.y,
        config.assetKey,
        this._getIdleFrame()
      )
      .setOrigin(this._origin.x, this._origin.y);
    this._spriteGridMovementFinishedCallback =
      config.spriteGridMovementFinishedCallback;
  }

  /** @type {Phaser.GameObjects.Sprite} */
  get sprite() {
    return this._PhaserGameObject;
  }
  /** @type {boolean} */
  get isMoving() {
    return this._isMoving;
  }
  /** @type {import("../../common/direction.js").Direction} */
  get direction() {
    return this._direction;
  }

  /**
   *
   * @param {import("../../common/direction.js").Direction} direction
   */
  moveCharacter(direction) {
    if (this._isMoving) {
      return;
    }
    this._moveSprite(direction);
  }

  /**
   *
   * @param {Character} character
   * @returns {void}
   */
  addCharacterToCheckForCollisionsWith(character) {
    this._otherCharactersToCheckForCollisionsWith.push(character);
  }

  /**
   *
   * @param {DOMHighResTimeStamp} time
   * @returns {void}
   */
  update(time) {
    if (this._isMoving) {
      return;
    }

    const idleFrame =
      this._PhaserGameObject.anims.currentAnim?.frames[1].frame.name;
    this._PhaserGameObject.anims.stop();
    if (!idleFrame) {
      return;
    }
    switch (this._direction) {
      case DIRECTION.DOWN:
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
      case DIRECTION.UP:
        this._PhaserGameObject.setFrame(idleFrame);
        break;
      case DIRECTION.NONE:
        break;
      default:
        exhaustiveGuard(this._direction);
    }
  }

  _getIdleFrame() {
    return this._idleFrameConfig[this._direction];
  }
  /**
   *
   * @param {import("../../common/direction.js").Direction} direction
   * @returns {void}
   */
  _moveSprite(direction) {
    this._direction = direction;
    if (this._isBlockingTile()) {
      return;
    }
    this._isMoving = true;
    this.#handleSpriteMovement();
  }

  _isBlockingTile() {
    if (this._direction === DIRECTION.NONE) {
      return;
    }

    const targetPosition = { ...this._targetPosition };
    const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(
      targetPosition,
      this._direction
    );
    return (
      this.#doesPositionCollideWithCollisionLayer(updatedPosition) ||
      this.#doesPositionCollideWithOtherCharacter(updatedPosition)
    );
  }

  #handleSpriteMovement() {
    if (this._direction === DIRECTION.NONE) {
      return;
    }

    const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(
      this._targetPosition,
      this._direction
    );
    this._previousTargetPosition = { ...this._targetPosition };
    this._targetPosition.x = updatedPosition.x;
    this._targetPosition.y = updatedPosition.y;

    this._scene.add.tween({
      delay: 0,
      duration: 600,
      y: {
        from: this._PhaserGameObject.y,
        start: this._PhaserGameObject.y,
        to: this._targetPosition.y,
      },
      x: {
        from: this._PhaserGameObject.x,
        start: this._PhaserGameObject.x,
        to: this._targetPosition.x,
      },
      targets: this._PhaserGameObject,
      onComplete: () => {
        this._isMoving = false;
        this._previousTargetPosition = { ...this._targetPosition };
        if (this._spriteGridMovementFinishedCallback) {
          this._spriteGridMovementFinishedCallback();
        }
      },
    });
  }

  /**
   *
   * @param {import("../../types/typedef.js").Coordinate} position
   * @returns {boolean}
   */
  #doesPositionCollideWithCollisionLayer(position) {
    if (!this._collisionLayer) {
      return false;
    }

    const { x, y } = position;
    const tile = this._collisionLayer.getTileAtWorldXY(x, y, true);

    return tile.index !== -1;
  }

  /**
   *
   * @param {import("../../types/typedef.js").Coordinate} position
   * @returns {boolean}
   */
  #doesPositionCollideWithOtherCharacter(position) {
    const { x, y } = position;
    if (this._otherCharactersToCheckForCollisionsWith.length === 0) {
      return false;
    }

    const collidesWithACharacter =
      this._otherCharactersToCheckForCollisionsWith.some((character) => {
        return (
          (character._targetPosition.x === x &&
            character._targetPosition.y === y) ||
          (character._previousTargetPosition.x === x &&
            character._previousTargetPosition.y === y)
        );
      });
    return collidesWithACharacter;
  }
}
