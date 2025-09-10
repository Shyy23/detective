import Phaser from "./lib/phaser.js";
import { SCENE_KEYS } from "./scenes/scene-keys.js";
import { PreloadScene } from "./scenes/preload-scene.js";
import { BattleScene } from "./scenes/battle-scene.js";
import { MenuScene } from "./scenes/menu-scene.js";
import { SettingScene } from "./scenes/setting-scene.js";
import { ChapterSelectScene } from "./scenes/chapter-select-scene.js";
import { TestScene } from "./scenes/test-scene.js";
import { WorldScene } from "./scenes/world-scene.js";
import { Chapter1Scene } from "./scenes/chapter1-scene.js";

// game-config.js
export const GAME_CONFIG = {
  type: Phaser.AUTO,
  pixelArt: false,
  scale: {
    parent: "game-container",
    width: 1024,
    height: 576,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#000000",
};

export const game = new Phaser.Game(GAME_CONFIG);

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
game.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene);
game.scene.add(SCENE_KEYS.MENU_SCENE, MenuScene);
game.scene.add(SCENE_KEYS.SETTING_SCENE, SettingScene);
game.scene.add(SCENE_KEYS.CHAPTER_SELECT_SCENE, ChapterSelectScene);
game.scene.add(SCENE_KEYS.TEST_SCENE, TestScene);
game.scene.add(SCENE_KEYS.WORLD_SCENE, WorldScene);
game.scene.add(SCENE_KEYS.CHAPTER1_SCENE, Chapter1Scene);
game.scene.start(SCENE_KEYS.PRELOAD_SCENE);
