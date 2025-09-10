import { Background } from "../battle/background.js";
import Phaser from "../lib/phaser.js";
import { SceneTransition } from "../utils/transition-scene.js";

import { SCENE_KEYS } from "./scene-keys.js";

export class TestScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.TEST_SCENE,
    });
  }

  create() {
    console.log(`[${TestScene.name}:create] invoked`);
    const transition = new SceneTransition();
    transition.createInTransition(this);
    const bg = new Background(this);
    bg.showMenu();

    const { width, height } = this.scale;
    const shape = this.add.circle(20, 20, 20);

    // const transitionMask = shape.createGeometryMask();

    // Set transition mask ke camera
    // this.cameras.main.setMask(transitionMask);
  }
}
