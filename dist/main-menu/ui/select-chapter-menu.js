import Phaser from "../../lib/phaser.js";
import { SELECT_CHAPTER_ASSET_KEYS } from "../../assets/asset-keys.js";
import {
  MENU_UI_SELECT_NUMBER_STYLE,
  MENU_UI_TEXT_STYLE,
} from "../../battle/ui/menu/battle-menu-config.js";
import { CARD_CHAPTER_OPTIONS } from "../../common/selection-card.js";
import { DIRECTION } from "../../common/direction.js";
import { SCENE_KEYS } from "../../scenes/scene-keys.js";
import { MenuFunctionTools } from "../../tools/menu-function-tools.js";
import { exhaustiveGuard } from "../../utils/guard.js";
import { AUDIO_ASSETS_KEYS } from "../../assets/audio-asset-keys.js";
import { BgmManager } from "../../audio/bgmManager.js";

const SPOTLIGHT_POS = Object.freeze({
  x: 310,
  y: 335,
  rotate: 10,
});

// Konstanta untuk animasi spotlight
const SPOTLIGHT_ANIMATION = Object.freeze({
  DURATION: 300, // durasi animasi dalam ms
  EASE: "Power2.easeOut", // jenis easing
  SCALE_BOUNCE: 1.1, // skala bounce saat animasi
});

export class SelectChapterMenu {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {Phaser.GameObjects.Image} */
  #panePhaserImageGameObject;
  /** @type {Phaser.GameObjects.Container} */
  #selectChapterMenuPhaserContainerGameObject;
  /** @type {Phaser.GameObjects.Text} */
  #selectChapterTitleTextGameObject;
  /** @type {Phaser.GameObjects.Rectangle}*/
  #overlay;
  /** @type {import("../../common/selection-card.js").CardChapter } */
  #selectedCardChapter;
  #spotlight;
  #mask;
  /** @type {Phaser.Tweens.Tween} */
  #currentSpotlightTween;
  /**
   *
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.#scene = scene;
    this.#selectedCardChapter = CARD_CHAPTER_OPTIONS.CHAPTER_1;
    this.#overlay = this.#createOverlay();
    this.#currentSpotlightTween = null;
    this.#overlay.setDepth(1);
    // Pakai fungsi dari MenuFunctionTools
    this.#panePhaserImageGameObject = MenuFunctionTools.createPane(this.#scene);
    this.#selectChapterTitleTextGameObject = MenuFunctionTools.createTitleText(
      this.#scene,
      "PILIH CHAPTER",
      0,
      -100
    );

    this.#createSelectChapterMenu();

    this.#initSpotlight();
    this.#spotlight.setPosition(SPOTLIGHT_POS.x, SPOTLIGHT_POS.y);
  }

  /**
   *
   * @param {import("../../common/direction.js").Direction|'OK'|'CANCEL' } input
   */
  handlePlayerInput(input) {
    console.log(input);
    if (input === "OK") {
      this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
      this.#handlePayerChooseChapterMenu();
      return;
    }
    if (input === "CANCEL") {
      this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
      this.#handlePlayerChooseBackBtn();
      return;
    }
    this.#updateSelectedCardFromInput(input);
    this.#moveMainSpotlight();
  }
  #createSelectChapterMenu() {
    this.#selectChapterMenuPhaserContainerGameObject =
      this.#scene.add.container(
        this.#scene.cameras.main.centerX,
        this.#scene.cameras.main.centerY,
        [
          this.#selectChapterTitleTextGameObject,
          ...this.#getChapterCards(),
          ...this.#getConnectionPoints(),
          ...this.#getChapterCardTexts(),
        ]
      );
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} rotation
   */

  #createChapterCard(x, y, rotation) {
    return this.#scene.add
      .image(x, y, SELECT_CHAPTER_ASSET_KEYS.CHAPTER_CARD, 0)
      .setScale(0.35)
      .setRotation(Phaser.Math.DegToRad(rotation));
  }

  #getChapterCards() {
    const chapterCard1 = this.#createChapterCard(-200, 50, 10);
    const chapterCard2 = this.#createChapterCard(10, 75, -10);
    const chapterCard3 = this.#createChapterCard(200, 50, 10);

    // Layer 1: Chapter cards (paling bawah)
    chapterCard1.setDepth(1);
    chapterCard2.setDepth(1);
    chapterCard3.setDepth(1);

    this.chapterCards = [chapterCard1, chapterCard2, chapterCard3];
    return this.chapterCards;
  }

  /**
   *
   * @param {number} rotate
   */
  #createChapterCardText(rotate) {
    return this.#scene.add
      .text(0, 0, "Chapter", MENU_UI_TEXT_STYLE)
      .setRotation(Phaser.Math.DegToRad(rotate))
      .setLetterSpacing(-2)
      .setStroke("#707070", 0.5);
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {string} number
   * @param {number} rotate
   * @returns
   */
  #createChapterNumberText(x, y, number, rotate) {
    return this.#scene.add
      .text(x, y, number, MENU_UI_SELECT_NUMBER_STYLE)
      .setLetterSpacing(-2)
      .setStroke("#802A2C", 3)
      .setRotation(Phaser.Math.DegToRad(rotate));
  }
  #getChapterCardTexts() {
    const chapterCardText1 = this.#scene.add
      .container(-260, -55, [
        this.#createChapterCardText(10),
        this.#createChapterNumberText(-5, 20, "01", 10),
      ])
      .setDepth(3); // Layer 3: Text (paling atas)

    const chapterCardText2 = this.#scene.add
      .container(-85, -5, [
        this.#createChapterCardText(-10),
        this.#createChapterNumberText(5, 20, "02", -10),
      ])
      .setDepth(3); // Layer 3: Text (paling atas)

    const chapterCardText3 = this.#scene.add
      .container(140, -55, [
        this.#createChapterCardText(10),
        this.#createChapterNumberText(-5, 20, "03", 10),
      ])
      .setDepth(3); // Layer 3: Text (paling atas)

    this.chapterCardTexts = [
      chapterCardText1,
      chapterCardText2,
      chapterCardText3,
    ];

    return this.chapterCardTexts;
  }
  /**
   * Membuat rope/garis penghubung antara dua titik koordinat.
   * @param {{ x: number, y: number }} startPoint Titik awal
   * @param {{ x: number, y: number }} endPoint Titik akhir
   * @returns {Phaser.GameObjects.GameObject[]} Array berisi rope dan bulatan ujungnya
   */
  #createConnectingLine(startPoint, endPoint) {
    const connectingElements = [];

    const deltaX = endPoint.x - startPoint.x;
    const deltaY = endPoint.y - startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const lineX = (startPoint.x + endPoint.x) / 2;
    const lineY = (startPoint.y + endPoint.y) / 2;
    const lineLength = distance - 10;
    const angle = Math.atan2(deltaY, deltaX);

    // Layer 2: Connection lines (di atas cards, di bawah text)
    const connectingLine = this.#scene.add.rectangle(
      lineX,
      lineY,
      lineLength + 10,
      2,
      0x911f24
    );
    connectingLine.setRotation(angle).setDepth(2);

    // Layer 2: Connection circles (sama level dengan lines)
    const startCircle = this.#scene.add.circle(
      startPoint.x,
      startPoint.y,
      3,
      0x000000
    );
    startCircle.setDepth(2);

    const endCircle = this.#scene.add.circle(
      endPoint.x,
      endPoint.y,
      3,
      0x000000
    );
    endCircle.setDepth(2);

    connectingElements.push(connectingLine, startCircle, endCircle);
    return connectingElements;
  }

  #getConnectionPoints() {
    return [
      ...this.#createConnectingLine({ x: -185, y: -10 }, { x: 0, y: 15 }),
      ...this.#createConnectingLine({ x: 0, y: 15 }, { x: 210, y: -10 }),
    ];
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
   * @param {number} rotate
   * @returns {Phaser.GameObjects.Graphics} Graphics object untuk spotlight
   */
  #createSpotlightGraphics(x, y, rotate) {
    const spotlight = this.#scene.add.graphics();

    spotlight.fillStyle(0xffffff, 1);
    spotlight.fillEllipse(x, y, 180, 180).setRotation(rotate);
    spotlight.setDepth(100);

    return spotlight;
  }

  //  method #initSpotlight untuk menggunakan parameter manual
  #initSpotlight() {
    // Buat spotlight dengan parameter manual
    this.#spotlight = this.#createSpotlightGraphics(0, 0, 10);

    // Buat mask dari spotlight
    this.#mask = this.#spotlight.createGeometryMask().setInvertAlpha(true);

    // Terapkan mask ke overlay
    this.#overlay.setMask(this.#mask);

    this.#spotlight.setVisible(false);
  }

  // Method untuk update card selection berdasarkan input direction
  /**
   *
   * @param {import("../../common/direction.js").Direction } direction
   *
   */
  #updateSelectedCardFromInput(direction) {
    if (this.#selectedCardChapter === CARD_CHAPTER_OPTIONS.CHAPTER_1) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
          this.#selectedCardChapter = CARD_CHAPTER_OPTIONS.CHAPTER_2;
          return;
        case DIRECTION.LEFT:
          this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
          this.#selectedCardChapter = CARD_CHAPTER_OPTIONS.BACK_BTN;
          return;
        case DIRECTION.UP:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedCardChapter === CARD_CHAPTER_OPTIONS.CHAPTER_2) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedCardChapter = CARD_CHAPTER_OPTIONS.CHAPTER_3;
          this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
          return;
        case DIRECTION.LEFT:
          this.#selectedCardChapter = CARD_CHAPTER_OPTIONS.CHAPTER_1;
          this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
          return;
        case DIRECTION.UP:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedCardChapter === CARD_CHAPTER_OPTIONS.CHAPTER_3) {
      switch (direction) {
        case DIRECTION.LEFT:
          this.#selectedCardChapter = CARD_CHAPTER_OPTIONS.CHAPTER_2;
          this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
          return;
        case DIRECTION.UP:
        case DIRECTION.RIGHT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }
    if (this.#selectedCardChapter === CARD_CHAPTER_OPTIONS.BACK_BTN) {
      switch (direction) {
        case DIRECTION.RIGHT:
          this.#selectedCardChapter = CARD_CHAPTER_OPTIONS.CHAPTER_1;
          this.#scene.sound.play(AUDIO_ASSETS_KEYS.MOVE_MENU, { volume: 0.5 });
          return;
        case DIRECTION.UP:
        case DIRECTION.LEFT:
        case DIRECTION.DOWN:
        case DIRECTION.NONE:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    exhaustiveGuard(this.#selectedCardChapter);
  }

  #moveMainSpotlight() {
    switch (this.#selectedCardChapter) {
      case CARD_CHAPTER_OPTIONS.CHAPTER_1:
        this.#animateSpotlight(SPOTLIGHT_POS.x, SPOTLIGHT_POS.y, 10);
        return;
      case CARD_CHAPTER_OPTIONS.CHAPTER_2:
        this.#animateSpotlight(520, 360, -10);
        return;
      case CARD_CHAPTER_OPTIONS.CHAPTER_3:
        this.#animateSpotlight(710, SPOTLIGHT_POS.y, 10);
        return;
      case CARD_CHAPTER_OPTIONS.BACK_BTN:
        this.#animateSpotlight(50, 60, 0, 0.5, 0.5);
        return;
      default:
        exhaustiveGuard(this.#selectedCardChapter);
    }
  }

  #handlePayerChooseChapterMenu() {
    if (this.#selectedCardChapter === CARD_CHAPTER_OPTIONS.CHAPTER_1) {
      BgmManager.pause();
      this.#scene.scene.start(SCENE_KEYS.CHAPTER1_SCENE);
      return;
    }
    if (this.#selectedCardChapter === CARD_CHAPTER_OPTIONS.CHAPTER_2) {
      BgmManager.pause();
      this.#scene.scene.start(SCENE_KEYS.WORLD_SCENE);
      return;
    }
    if (this.#selectedCardChapter === CARD_CHAPTER_OPTIONS.CHAPTER_3) {
      this.#scene.scene.start(SCENE_KEYS.BATTLE_SCENE);

      return;
    }
    if (this.#selectedCardChapter === CARD_CHAPTER_OPTIONS.BACK_BTN) {
      this.#scene.scene.start(SCENE_KEYS.MENU_SCENE);

      return;
    }

    exhaustiveGuard(this.#selectedCardChapter);
  }

  #handlePlayerChooseBackBtn() {
    if (this.#selectedCardChapter !== CARD_CHAPTER_OPTIONS.BACK_BTN) {
      this.#selectedCardChapter = CARD_CHAPTER_OPTIONS.BACK_BTN;

      // Posisi sesuai dengan chapter card 3 (200, 50)
      this.#animateSpotlight(50, 60, 0, 0.5, 0.5);
      return;
    }
    if (this.#selectedCardChapter === CARD_CHAPTER_OPTIONS.BACK_BTN) {
      this.#scene.scene.start(SCENE_KEYS.MENU_SCENE);

      return;
    }
  }

  /**
   * Method untuk menganimasikan pergerakan spotlight dengan tweens
   * @param {number} targetX - posisi X tujuan
   * @param {number} targetY - posisi Y tujuan
   * @param {number} rotate - skala Y tujuan
   * @param {number} [targetScaleX = 1] - skala X tujuan
   * @param {number} [targetScaleY = 1] - skala Y tujuan
   */
  #animateSpotlight(
    targetX,
    targetY,
    rotate,
    targetScaleX = 1,
    targetScaleY = 1
  ) {
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
      rotation: rotate,
      ease: Phaser.Math.Easing.Elastic.Out,
    });
  }
}
