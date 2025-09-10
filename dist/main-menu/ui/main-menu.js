import { MENU_ASSET_KEYS } from "../../assets/asset-keys.js";
import { AUDIO_ASSETS_KEYS } from "../../assets/audio-asset-keys.js";
import { BgmManager } from "../../audio/bgmManager.js";
import { DIRECTION } from "../../common/direction.js";
import { CARD_MENU_OPTIONS } from "../../common/selection-card.js";
import Phaser from "../../lib/phaser.js";
import { SCENE_KEYS } from "../../scenes/scene-keys.js";
import { exhaustiveGuard } from "../../utils/guard.js";
import { SceneTransition } from "../../utils/transition-scene.js";

const SPOTLIGHT_POS = Object.freeze({
  x: 515,
  y: 140,
});

// Konstanta untuk animasi spotlight
const SPOTLIGHT_ANIMATION = Object.freeze({
  DURATION: 300, // durasi animasi dalam ms

  SCALE_BOUNCE: 1.1, // skala bounce saat animasi
});

export class MainMenu {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {Phaser.GameObjects.Image} */
  #logo;
  /** @type {Phaser.GameObjects.Image} */
  #selectChapterCard;
  /** @type {Phaser.GameObjects.Image} */
  #settingCard;
  /** @type {import("../../common/selection-card.js").CardMenu} */
  #selectedCard;
  /** @type {Phaser.GameObjects.Rectangle}*/
  #overlay;
  #spotlight;
  #mask;
  /** @type {Phaser.Tweens.Tween} */
  #currentSpotlightTween;
  /** @type {boolean} */
  #isTransitionPlaying;

  /**
   *
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.#scene = scene;
    this.#selectedCard = CARD_MENU_OPTIONS.LOGO;
    this.#isTransitionPlaying = false;
    this.#currentSpotlightTween = null;
    if (!BgmManager.currentBgm || !BgmManager.currentBgm.isPlaying) {
      BgmManager.play(this.#scene, AUDIO_ASSETS_KEYS.BGM_MENU);
    }
    const transition = new SceneTransition();
    if (!this.#isTransitionPlaying) {
      transition.createInTransition(this.#scene, {
        callback: () => {
          this.#createUIElements();
          this.#isTransitionPlaying = false;
        },
      });
      this.#isTransitionPlaying = true;
    }
  }

  #createUIElements() {
    // UI Elements
    this.#logo = this.#scene.add
      .image(this.#scene.cameras.main.centerX, 140, MENU_ASSET_KEYS.LOGO)
      .setScale(0.75);
    this.#selectChapterCard = this.#scene.add
      .image(375, 300, MENU_ASSET_KEYS.CHAPTER_SELECT_CARD)
      .setScale(0.25);
    this.#settingCard = this.#scene.add
      .image(625, 300, MENU_ASSET_KEYS.SETTING_CARD)
      .setScale(0.25);

    this.#overlay = this.#createOverlay();

    this.#createSpotlightElement();
    this.#activateSpotlightMask();
    return;
  }

  /**
   *
   * @param {import("../../common/direction.js").Direction|'OK' } input
   */
  handlePlayerInput(input) {
    console.log(input);

    if (this.#isTransitionPlaying) {
      return;
    }
    if (input === "OK") {
      this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
      this.#handlePayerChooseChapterMenu();
      return;
    }

    this.#updateSelectedCardFromInput(input);
    this.#moveMainSpotlight();
  }
  #createOverlay() {
    const { width, height } = this.#scene.scale;
    return this.#scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.5
    );
  }

  // Fungsi untuk membuat spotlight Graphics dengan parameter card
  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns {Phaser.GameObjects.Graphics} Graphics object untuk spotlight
   */
  #createSpotlightGraphics(x, y) {
    const spotlight = this.#scene.add.graphics();

    spotlight.fillStyle(0xffffff, 1);
    spotlight.fillEllipse(x, y, 180, 180);
    spotlight.setDepth(100);

    return spotlight;
  }

  #createSpotlightElement() {
    // Buat spotlight graphics tapi jangan set mask ke camera dulu
    this.#spotlight = this.#createSpotlightGraphics(0, 0);
    this.#spotlight
      .setPosition(SPOTLIGHT_POS.x, SPOTLIGHT_POS.y)
      .setScale(2, 0.5)
      .setVisible(false); // Sembunyikan dulu

    // Buat mask tapi jangan terapkan ke camera dulu
    this.#mask = this.#spotlight.createGeometryMask().setInvertAlpha(true);
  }

  // Method untuk update card selection berdasarkan input direction
  /**
   *
   * @param {import("../../common/direction.js").Direction } direction
   *
   */
  #updateSelectedCardFromInput(direction) {
    if (this.#selectedCard === CARD_MENU_OPTIONS.LOGO) {
      switch (direction) {
        case DIRECTION.DOWN:
        case DIRECTION.LEFT:
        case DIRECTION.UP:
        case DIRECTION.RIGHT:
          this.#selectedCard = CARD_MENU_OPTIONS.SELECT_CHAPTER_CARD;
          this.#playSoundMoveEffect();
          return;

        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }
    if (this.#selectedCard === CARD_MENU_OPTIONS.SELECT_CHAPTER_CARD) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedCard = CARD_MENU_OPTIONS.SETTING_CARD;
          this.#playSoundMoveEffect();
          return;
        case DIRECTION.LEFT:
        case DIRECTION.UP:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }
    if (this.#selectedCard === CARD_MENU_OPTIONS.SETTING_CARD) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedCard = CARD_MENU_OPTIONS.SELECT_CHAPTER_CARD;
          this.#playSoundMoveEffect();
          return;
        case DIRECTION.RIGHT:
        case DIRECTION.UP:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    exhaustiveGuard(this.#selectedCard);
  }

  /**
   * Method untuk menganimasikan pergerakan spotlight dengan tweens
   * @param {number} targetX - posisi X tujuan
   * @param {number} targetY - posisi Y tujuan
   * @param {number} targetScaleX - skala X tujuan
   * @param {number} targetScaleY - skala Y tujuan
   */
  #animateSpotlight(targetX, targetY, targetScaleX, targetScaleY) {
    // Stop animasi sebelumnya jika ada
    if (this.#currentSpotlightTween) {
      this.#currentSpotlightTween.stop();
    }

    // Simpan posisi dan skala awal

    const startScaleX = this.#spotlight.scaleX;
    const startScaleY = this.#spotlight.scaleY;

    // Buat animasi dengan tweens
    this.#currentSpotlightTween = this.#scene.tweens.add({
      targets: this.#spotlight,
      x: targetX,
      y: targetY,
      scaleX: targetScaleX,
      scaleY: targetScaleY,
      duration: SPOTLIGHT_ANIMATION.DURATION,
      ease: Phaser.Math.Easing.Sine.Out,
      onStart: () => {
        // Efek bounce kecil di awal animasi
        this.#scene.tweens.add({
          targets: this.#spotlight,
          scaleX: startScaleX * 0.2,
          scaleY: startScaleY * 0.2,
          duration: 100,
          ease: Phaser.Math.Easing.Sine.InOut,
          yoyo: true,
          repeat: 0,
        });
      },
      onComplete: () => {
        this.#currentSpotlightTween = null;

        // Efek pulse halus setelah animasi selesai
        this.#scene.tweens.add({
          targets: this.#spotlight,
          alpha: 0.8,
          scaleX: startScaleX * SPOTLIGHT_ANIMATION.SCALE_BOUNCE,
          scaleY: startScaleY * SPOTLIGHT_ANIMATION.SCALE_BOUNCE,
          duration: 150,
          ease: Phaser.Math.Easing.Bounce.Out,
          yoyo: true,
          repeat: 0,
        });
      },
    });

    // Tambahan animasi rotasi halus untuk efek visual
    this.#scene.tweens.add({
      targets: this.#spotlight,
      duration: SPOTLIGHT_ANIMATION.DURATION,
      ease: Phaser.Math.Easing.Elastic.Out,
    });
  }
  #moveMainSpotlight() {
    switch (this.#selectedCard) {
      case CARD_MENU_OPTIONS.LOGO:
        this.#animateSpotlight(SPOTLIGHT_POS.x, SPOTLIGHT_POS.y, 2, 0.5);
        return;

      case CARD_MENU_OPTIONS.SELECT_CHAPTER_CARD:
        this.#animateSpotlight(375, 295, 1.05, 1.35);
        return;

      case CARD_MENU_OPTIONS.SETTING_CARD:
        this.#animateSpotlight(625, 295, 1.05, 1.35);
        return;

      default:
        exhaustiveGuard(this.#selectedCard);
    }
  }

  #playSoundMoveEffect() {
    return this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
  }

  #handlePayerChooseChapterMenu() {
    if (this.#selectedCard === CARD_MENU_OPTIONS.LOGO) {
      return;
    }
    if (this.#selectedCard === CARD_MENU_OPTIONS.SELECT_CHAPTER_CARD) {
      if (this.#currentSpotlightTween) {
        this.#currentSpotlightTween.stop();
      }
      this.#scene.scene.start(SCENE_KEYS.CHAPTER_SELECT_SCENE);
      return;
    }
    if (this.#selectedCard === CARD_MENU_OPTIONS.SETTING_CARD) {
      return;
    }
    exhaustiveGuard(this.#selectedCard);
  }
  #activateSpotlightMask() {
    // Terapkan spotlight mask ke overlay
    this.#overlay.setMask(this.#mask);
  }
}
