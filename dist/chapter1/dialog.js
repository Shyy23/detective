import Phaser from "../lib/phaser.js";
import {
  NAME_VN_TEXT_STYLE,
  VN_UI_TEXT_STYLE,
  WORLD_UI_TEXT_STYLE,
} from "../battle/ui/menu/battle-menu-config.js";
import { UI_ASSET_KEYS, VN_CHAR_ASSET_KEYS } from "../assets/asset-keys.js";
import { CharacterVn } from "./characters/character-vn.js";
import { animateText } from "../utils/text-utils.js";

export class Dialog {
  /** @type {Phaser.Scene} */
  #scene;
  /** @type {number} */
  #padding;
  /** @type {number} */
  #width;
  /** @type {number} */
  #height;
  /** @type {Phaser.GameObjects.Container} */
  #container;
  /** @type {boolean} */
  #isVisible;
  /** @type {Phaser.GameObjects.Image} */
  #userInputCursor;
  /** @type {Phaser.Tweens.Tween} */
  #userInputCursorTween;
  /** @type {Phaser.GameObjects.Text} */
  #nameText;
  /** @type {Phaser.GameObjects.Text} */
  #uiText;
  /** @type {any[]} */
  #dialogData;
  /** @type {number} */
  #currentDialogIndex;
  /** @type {boolean} */
  #isAnimationPlaying;
  /** @type {() => void} */
  #onDialogEndCallback;
  /**
   *
   * @param {Phaser.Scene} scene
   *
   */
  constructor(scene) {
    this.#scene = scene;
    this.#createDialogPane();
    this.hideDialogModal();
  }

  get isVisible() {
    return this.#isVisible;
  }

  get isAnimationPlaying() {
    return this.#isAnimationPlaying;
  }

  #createDialogPane() {
    this.#padding = 4;
    this.#width = this.#scene.scale.width - this.#padding * 2;
    this.#height = 124;
    const panel = this.#scene.add
      .rectangle(
        this.#padding,
        this.#scene.scale.height - this.#height - this.#padding,
        this.#width,
        this.#height,
        0x4b2f23
      )
      .setOrigin(0)
      .setStrokeStyle(8, 0x704c32, 1); //0x704c32
    this.#nameText = this.#scene.add.text(20, 460, "name", {
      ...NAME_VN_TEXT_STYLE,
      ...{ wordWrap: { width: this.#width - 18 } },
    });
    this.#uiText = this.#scene.add.text(20, 495, "under working", {
      ...VN_UI_TEXT_STYLE,
      ...{ wordWrap: { width: this.#width - 18 } },
    });

    this.#container = this.#scene.add
      .container(0, 0, [panel, this.#uiText, this.#nameText])
      .setDepth(2);
    this.#createPlayerInputCursor();
  }

  handlePlayerInput(input) {
    if (input !== "OK") return;

    if (this.#isAnimationPlaying) {
      return;
    }

    // Lanjut ke dialog berikutnya
    this.#currentDialogIndex++;
    this.showCurrentDialog();
  }
  /**
   * @param {any[]} dialogData - array of dialog objects from JSON
   * @param {() => void} [callback]
   */
  showDialogModal(dialogData, callback) {
    if (!dialogData || dialogData.length === 0) return;
    this.#onDialogEndCallback = callback;
    this.#dialogData = [...dialogData];
    this.#currentDialogIndex = 0;
    this.#container.setAlpha(1);
    this.#isVisible = true;
    this.#userInputCursorTween.restart();
    this.showCurrentDialog();
  }

  showCurrentDialog() {
    if (
      !this.#dialogData ||
      this.#currentDialogIndex >= this.#dialogData.length
    ) {
      if (this.#onDialogEndCallback) {
        this.#onDialogEndCallback();
      }
      return;
    }

    const current = this.#dialogData[this.#currentDialogIndex];
    this.#nameText.setText(current.speaker || "");
    this.#uiText.setText("");

    // Animasi teks (opsional — jika ingin efek ketik)
    this.#isAnimationPlaying = true;
    animateText(this.#scene, this.#uiText, current.text, {
      delay: 30,
      callback: () => {
        this.#isAnimationPlaying = false;
        this.#userInputCursorTween.resume(); // munculkan cursor saat selesai animasi
      },
    });

    // Opsional: ubah background sesuai data
    // this.#scene.events.emit('change-background', current.background);
  }

  nextDialog() {
    if (this.#isAnimationPlaying) {
      // Skip animasi — langsung tampilkan full teks
      this.#uiText.setText(this.#dialogData[this.#currentDialogIndex].text);
      this.#isAnimationPlaying = false;
      this.#userInputCursorTween.resume();
      return;
    }

    this.#currentDialogIndex++;
    this.showCurrentDialog();
  }
  hideDialogModal() {
    this.#container.setAlpha(0);
    this.#userInputCursorTween.pause();
    this.#isVisible = false;
  }

  #createPlayerInputCursor() {
    const y = 550;
    this.#userInputCursor = this.#scene.add.image(
      this.#width - 16,
      y,
      UI_ASSET_KEYS.CURSOR_WHITE
    );
    this.#userInputCursor.setAngle(90).setScale(2.5, 2);

    this.#userInputCursorTween = this.#scene.add.tween({
      delay: 0,
      duration: 500,
      repeat: -1,
      y: {
        from: y,
        start: y,
        to: y + 6,
      },
      targets: this.#userInputCursor,
    });
    this.#userInputCursorTween.pause();
    this.#container.add(this.#userInputCursor);
  }
}
