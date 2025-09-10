import {
  BATTLE_ASSET_KEYS,
  BATTLE_CHAR_ASSET_KEYS,
  MONSTER_ASSET_KEYS,
} from "../assets/asset-keys.js";
import { BgmManager } from "../audio/bgmManager.js";
import {
  ATTACK_TARGET,
  AttackManager,
} from "../battle/attack/attack-manager.js";
import { Background } from "../battle/background.js";
import { EnemyBattleMonster } from "../battle/monster/enemy-battle-monster.js";
import { PlayerBattleMonster } from "../battle/monster/player-battle-monster.js";
import { BattleMenu } from "../battle/ui/menu/battle-menu.js";
import { DIRECTION } from "../common/direction.js";
import { SKIP_BATTLE_ANIMATIONS } from "../config.js";
import Phaser from "../lib/phaser.js";
import { Controls } from "../utils/controls.js";
import { createSceneTransition } from "../utils/scene-transition.js";
import { StateMachine } from "../utils/state-machine.js";
import { SCENE_KEYS } from "./scene-keys.js";

const BATTLE_STATES = Object.freeze({
  INTRO: "INTRO",
  PRE_BATTLE_INFO: "PRE_BATTLE_INFO",
  BRING_OUT_MONSTER: "BRING_OUT_MONSTER",
  PLAYER_INPUT: "PLAYER_INPUT",
  ENEMY_INPUT: "ENEMY_INPUT",
  BATTLE: "BATTLE",
  POST_ATTACK_CHECK: "POST_ATTACK_CHECK",
  FINISHED: "FINISHED",
  FLEE_ATTEMPT: "FLEE_ATTEMPT",
});

export class BattleScene extends Phaser.Scene {
  /** @type {BattleMenu} */
  #battleMenu;
  /** @type {Controls} */
  #controls;
  /** @type {EnemyBattleMonster} */
  #activeEnemyMonster;
  /** @type {PlayerBattleMonster} */
  #activePlayerMonster;
  /** @type {number} */
  #activePlayerAttackIndex;
  /** @type {StateMachine} */
  #battleStateMachine;
  /** @type {AttackManager} */
  #attackManager;
  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    });
  }

  init() {
    this.#activePlayerAttackIndex = -1;
  }
  create() {
    console.log(`[${BattleScene.name}:create] invoked`);
    // Create Main Background
    BgmManager.stop();

    const background = new Background(this);
    background.showCollectorRoom();

    //   Render the out player and enemy monster
    this.#activeEnemyMonster = new EnemyBattleMonster({
      scene: this,
      MonsterDetail: {
        name: BATTLE_CHAR_ASSET_KEYS.LIA,
        assetKey: BATTLE_CHAR_ASSET_KEYS.LIA,
        assetFrame: 0,
        currentHp: 25,
        maxHp: 25,
        attackIds: [1],
        baseAttack: 25,
        currentLevel: 5,
      },
      skipBattleAnimation: SKIP_BATTLE_ANIMATIONS,
    });

    this.#activePlayerMonster = new PlayerBattleMonster({
      scene: this,
      MonsterDetail: {
        name: BATTLE_CHAR_ASSET_KEYS.SOLVED,
        assetKey: BATTLE_CHAR_ASSET_KEYS.SOLVED,
        assetFrame: 0,
        currentHp: 25,
        maxHp: 25,
        attackIds: [2, 1],
        baseAttack: 5,
        currentLevel: 5,
      },
      skipBattleAnimation: SKIP_BATTLE_ANIMATIONS,
    });

    // render out the main and sub info panes
    this.#battleMenu = new BattleMenu(this, this.#activePlayerMonster);

    this.#createBattleStateMachine();
    this.#attackManager = new AttackManager(this, SKIP_BATTLE_ANIMATIONS);

    this.#controls = new Controls(this);
  }

  update() {
    this.#battleStateMachine.update();
    const wasSpaceKeyPressed = this.#controls.wasSpaceKeyPressed();
    const wasShiftKeyPressed = this.#controls.wasBackKeyPressed();

    // limit input based on the current battle state we are in
    // if we are not in the right battle state, return early and do not process input
    if (
      wasSpaceKeyPressed &&
      (this.#battleStateMachine.currentStateName ===
        BATTLE_STATES.PRE_BATTLE_INFO ||
        this.#battleStateMachine.currentStateName ===
          BATTLE_STATES.POST_ATTACK_CHECK ||
        this.#battleStateMachine.currentStateName ===
          BATTLE_STATES.FLEE_ATTEMPT)
    ) {
      this.#battleMenu.handlePlayerInput("OK");
      return;
    }

    if (
      this.#battleStateMachine.currentStateName !== BATTLE_STATES.PLAYER_INPUT
    ) {
      return;
    }

    if (wasSpaceKeyPressed) {
      this.#battleMenu.handlePlayerInput("OK");

      console.log(this.#battleMenu.selectedAttack);
      // Check If the player selected attack, an update display text
      if (this.#battleMenu.selectedAttack === undefined) {
        return;
      }

      this.#activePlayerAttackIndex = this.#battleMenu.selectedAttack;

      if (!this.#activePlayerMonster.attacks[this.#activePlayerAttackIndex]) {
        return;
      }
      console.log(
        `player selected the following move: ${this.#battleMenu.selectedAttack}`
      );
      this.#battleMenu.hideMonsterAttackSubMenu();
      this.#battleStateMachine.setState(BATTLE_STATES.ENEMY_INPUT);
    }

    if (wasShiftKeyPressed) {
      this.#battleMenu.handlePlayerInput("CANCEL");
      return;
    }

    const selectedDirection = this.#controls.getDirectionKeyjustPressed();
    if (selectedDirection !== DIRECTION.NONE) {
      this.#battleMenu.handlePlayerInput(selectedDirection);
    }
  }

  #playerAttack() {
    this.#battleMenu.updateInfoPaneMessageNoInputRequired(
      `${this.#activePlayerMonster.name} used ${
        this.#activePlayerMonster.attacks[this.#activePlayerAttackIndex].name
      }`,
      () => {
        this.time.delayedCall(500, () => {
          this.#attackManager.playAttackAnimation(
            this.#activePlayerMonster.attacks[this.#activePlayerAttackIndex]
              .animationName,
            ATTACK_TARGET.ENEMY,
            () => {
              this.#activeEnemyMonster.playTakeDamageAnimation(() => {
                this.#activeEnemyMonster.takeDamage(
                  this.#activePlayerMonster.baseAttack,
                  () => {
                    this.#enemyAttack();
                  }
                );
              });
            }
          );
        });
      },
      SKIP_BATTLE_ANIMATIONS
    );
  }

  #enemyAttack() {
    if (this.#activeEnemyMonster.isFainted) {
      this.#battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK);
      return;
    }

    this.#battleMenu.updateInfoPaneMessageNoInputRequired(
      `for ${this.#activeEnemyMonster.name} used ${
        this.#activeEnemyMonster.attacks[0].name
      }`,
      () => {
        this.time.delayedCall(500, () => {
          this.#attackManager.playAttackAnimation(
            this.#activeEnemyMonster.attacks[0].animationName,
            ATTACK_TARGET.PLAYER,
            () => {
              this.#activePlayerMonster.playTakeDamageAnimation(() => {
                this.#activePlayerMonster.takeDamage(
                  this.#activeEnemyMonster.baseAttack,
                  () => {
                    this.#battleStateMachine.setState(
                      BATTLE_STATES.POST_ATTACK_CHECK
                    );
                  }
                );
              });
            }
          );
        });
      },
      SKIP_BATTLE_ANIMATIONS
    );
  }

  #postBattleSequenceCheck() {
    if (this.#activeEnemyMonster.isFainted) {
      this.#activeEnemyMonster.playDeathAnimation(() => {
        this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
          [
            ` ${this.#activeEnemyMonster.name} fainted`,
            "You have gained some experience",
          ],
          () => {
            this.#battleStateMachine.setState(BATTLE_STATES.FINISHED);
          },
          SKIP_BATTLE_ANIMATIONS
        );
      });
      return;
    }

    if (this.#activePlayerMonster.isFainted) {
      this.#activePlayerMonster.playDeathAnimation(() => {
        this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
          [
            ` ${this.#activePlayerMonster.name} fainted`,
            "You have no more monsters , escaping to safety...",
          ],
          () => {
            this.#battleStateMachine.setState(BATTLE_STATES.FINISHED);
          },
          SKIP_BATTLE_ANIMATIONS
        );
      });
      return;
    }
    this.#battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT);
  }

  #transitionToNextScene() {
    this.cameras.main.fadeOut(2600, 0, 0, 0);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start(SCENE_KEYS.WORLD_SCENE);
      }
    );
  }

  #createBattleStateMachine() {
    this.#battleStateMachine = new StateMachine("battle", this);
    this.#battleStateMachine.addState({
      name: BATTLE_STATES.INTRO,
      onEnter: () => {
        // wait for any scene setup and transitions to complete
        createSceneTransition(this, {
          skipSceneTransition: SKIP_BATTLE_ANIMATIONS,
          callback: () => {
            this.#battleStateMachine.setState(BATTLE_STATES.PRE_BATTLE_INFO);
          },
        });
      },
    });
    this.#battleStateMachine.addState({
      name: BATTLE_STATES.PRE_BATTLE_INFO,
      onEnter: () => {
        // wait for enemy monster appear and notify playerr about the wild monster
        this.#activeEnemyMonster.playMonsterAppearAnimation(() => {
          this.#activeEnemyMonster.playMonsterHealthBarAppearAnimation(
            () => undefined
          );
          this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
            [` ${this.#activeEnemyMonster.name} appeared!`],
            () => {
              // wait for text animation to complete and move to next state
              this.#battleStateMachine.setState(
                BATTLE_STATES.BRING_OUT_MONSTER
              );
            },
            SKIP_BATTLE_ANIMATIONS
          );
        });
      },
    });
    this.#battleStateMachine.addState({
      name: BATTLE_STATES.BRING_OUT_MONSTER,
      onEnter: () => {
        // wait for player monster to appear on the screen and notify the player about monster
        this.#activePlayerMonster.playMonsterAppearAnimation(() => {
          this.#activePlayerMonster.playMonsterHealthBarAppearAnimation(
            () => undefined
          );
          this.#battleMenu.updateInfoPaneMessageNoInputRequired(
            `go ${this.#activePlayerMonster.name} !`,
            () => {
              // wait for text animation to complete and move to next state
              this.time.delayedCall(1200, () => {
                this.#battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT);
              });
            },
            SKIP_BATTLE_ANIMATIONS
          );
        });
      },
    });
    this.#battleStateMachine.addState({
      name: BATTLE_STATES.PLAYER_INPUT,
      onEnter: () => {
        this.#battleMenu.showMainBattleMenu();
      },
    });
    this.#battleStateMachine.addState({
      name: BATTLE_STATES.ENEMY_INPUT,
      onEnter: () => {
        // TODO: add feature in a future update
        // pick a random move for the enemy monster , and in the future implement some type of AI behavior
        this.#battleStateMachine.setState(BATTLE_STATES.BATTLE);
      },
    });
    this.#battleStateMachine.addState({
      name: BATTLE_STATES.BATTLE,
      onEnter: () => {
        // general battle flow
        // show attack used , brief pause
        // then play attack animation, brief pause
        // then play damage animation , brief pause
        // then play health bar animation , brief pause
        // then repeat the steps over above for the other monster

        this.#playerAttack();
      },
    });
    this.#battleStateMachine.addState({
      name: BATTLE_STATES.POST_ATTACK_CHECK,
      onEnter: () => {
        this.#postBattleSequenceCheck();
      },
    });
    this.#battleStateMachine.addState({
      name: BATTLE_STATES.FINISHED,
      onEnter: () => {
        this.#transitionToNextScene();
      },
    });
    this.#battleStateMachine.addState({
      name: BATTLE_STATES.FLEE_ATTEMPT,
      onEnter: () => {
        this.#battleMenu.updateInfoPaneMessagesAndWaitForInput(
          [`You got away safely`],
          () => {
            this.#battleStateMachine.setState(BATTLE_STATES.FINISHED);
          },
          SKIP_BATTLE_ANIMATIONS
        );
      },
    });

    // Start the state machine
    this.#battleStateMachine.setState("INTRO");
  }
}
