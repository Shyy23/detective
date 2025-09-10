import {
  ATTACK_ASSET_KEYS,
  BACKGROUND_ASSET_KEYS,
  BATTLE_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
  BATTLE_CHAR_ASSET_KEYS,
  BUTTON_ASSET_KEYS,
  CHARACTER_WORLD_ASSET_KEYS,
  DATA_ASSET_KEYS,
  HEALTH_BAR_ASSET_KEYS,
  MENU_ASSET_KEYS,
  MONSTER_ASSET_KEYS,
  SELECT_CHAPTER_ASSET_KEYS,
  UI_ASSET_KEYS,
  VN_CHAR_ASSET_KEYS,
  WORLD_ASSET_KEYS,
} from "../assets/asset-keys.js";
import Phaser from "../lib/phaser.js";
import { SCENE_KEYS } from "./scene-keys.js";
import { FONT_ASSET_NAME } from "../assets/font-keys.js";
import { WebFontFileLoader } from "../assets/web-font-file-loader.js";
import { AUDIO_ASSETS_KEYS } from "../assets/audio-asset-keys.js";
import { DataUtils } from "../utils/data-utils.js";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    });
    console.log(SCENE_KEYS.PRELOAD_SCENE);
  }

  preload() {
    console.log(`[${PreloadScene.name}:preload] invoked`);
    const oriPath = "assets/images/ori";
    const monsterTamerAssetPath = "assets/images/monster-tamer";
    const kenneyAssetPath = "assets/images/kenneys-assets";
    const pimenAssetPath = "assets/images/pimen";
    const axulArtAssetPath = "assets/images/axulart";
    const pbGamesAssetPath = "assets/images/parabellum-games";
    const dataAssetPath = "assets/data";

    // Background
    // this.load.image(BACKGROUND_ASSET_KEYS.MENU, `${oriPath}/bg-menu.png`);
    this.load.image(
      BACKGROUND_ASSET_KEYS.MENU,
      `${oriPath}/bg/background-menu.png`
    );
    this.load.image(
      BATTLE_BACKGROUND_ASSET_KEYS.FOREST,
      `${monsterTamerAssetPath}/battle-backgrounds/forest-background.png`
    );
    this.load.image(
      BATTLE_BACKGROUND_ASSET_KEYS.COLLECTOR_ROOM,
      `${monsterTamerAssetPath}/battle-backgrounds/room-collector-background.png`
    );

    // Menu Assets
    this.load.image(MENU_ASSET_KEYS.LOGO, `${oriPath}/logo2.png`);
    this.load.image(
      MENU_ASSET_KEYS.CHAPTER_SELECT_CARD,
      `${oriPath}/menu/select-chapter-card.png`
    );
    this.load.image(
      MENU_ASSET_KEYS.SETTING_CARD,
      `${oriPath}/menu/setting-card.png`
    );

    // Battle Assets
    this.load.image(
      BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,
      `${oriPath}/ui/ui-health-bg.png`
    );

    // Setting Assets
    this.load.image(MENU_ASSET_KEYS.PANE, `${oriPath}/menu/pane.png`);

    // Select Chapter Assets
    this.load.image(
      SELECT_CHAPTER_ASSET_KEYS.CHAPTER_CARD,
      `${oriPath}/menu/chapter-select/chapter-card.png`
    );
    // Health Bar Assets
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
      `${kenneyAssetPath}/ui-space-expansion/barHorizontal_green_right.png`
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.MIDDLE,
      `${kenneyAssetPath}/ui-space-expansion/barHorizontal_green_mid.png`
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
      `${kenneyAssetPath}/ui-space-expansion/barHorizontal_green_left.png`
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW,
      `${kenneyAssetPath}/ui-space-expansion/barHorizontal_shadow_right.png`
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW,
      `${kenneyAssetPath}/ui-space-expansion/barHorizontal_shadow_mid.png`
    );
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW,
      `${kenneyAssetPath}/ui-space-expansion/barHorizontal_shadow_left.png`
    );

    // Monster Assets
    this.load.image(
      MONSTER_ASSET_KEYS.FROSTSABER,
      `${monsterTamerAssetPath}/monsters/frostsaber.png`
    );
    this.load.image(
      MONSTER_ASSET_KEYS.AQUAVALOR,
      `${monsterTamerAssetPath}/monsters/aquavalor.png`
    );

    this.load.image(
      BATTLE_CHAR_ASSET_KEYS.LIA,
      `${oriPath}/battle/char/battle-char-pelaku.png`
    );

    // BTN Assets
    this.load.image(BUTTON_ASSET_KEYS.BACK, `${oriPath}/menu/back-btn.png`);

    // UI Assets
    this.load.image(
      UI_ASSET_KEYS.CURSOR,
      `${monsterTamerAssetPath}/ui/cursor.png`
    );
    this.load.image(
      UI_ASSET_KEYS.CURSOR_WHITE,
      `${monsterTamerAssetPath}/ui/cursor_white.png`
    );

    // Load Json Data
    this.load.json(DATA_ASSET_KEYS.ATTACKS, `${dataAssetPath}/attacks.json`);
    this.load.json(
      DATA_ASSET_KEYS.ANIMATIONS,
      `${dataAssetPath}/animations.json`
    );
    this.load.json(
      DATA_ASSET_KEYS.CASE_INTRO,
      `${dataAssetPath}/case_intro.json`
    );
    // Font Assets

    // load custom fonts
    this.load.addFile(
      new WebFontFileLoader(this.load, [
        FONT_ASSET_NAME.KENNY_FUTURE_NARROW,
        FONT_ASSET_NAME.PIXELIFY,
      ])
    );

    // Load attack assets
    this.load.spritesheet(
      BATTLE_CHAR_ASSET_KEYS.SOLVED,
      `${oriPath}/character/battle/solved.png`,
      {
        frameWidth: 100,
        frameHeight: 124,
      }
    );
    this.load.spritesheet(
      ATTACK_ASSET_KEYS.ICE_SHARD,
      `${pimenAssetPath}/ice-attack/active.png`,
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      ATTACK_ASSET_KEYS.ICE_SHARD_START,
      `${pimenAssetPath}/ice-attack/start.png`,
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      ATTACK_ASSET_KEYS.SLASH,
      `${pimenAssetPath}/slash.png`,
      {
        frameWidth: 48,
        frameHeight: 48,
      }
    );

    // World Assets
    this.load.image(
      WORLD_ASSET_KEYS.WORLD_BACKGROUND,
      `${monsterTamerAssetPath}/map/level_background.png`
    );
    this.load.tilemapTiledJSON(
      WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL,
      `${dataAssetPath}/level.json`
    );
    this.load.image(
      WORLD_ASSET_KEYS.WORLD_COLLISION,
      `${monsterTamerAssetPath}/map/collision.png`
    );
    this.load.image(
      WORLD_ASSET_KEYS.WORLD_FOREGROUND,
      `${monsterTamerAssetPath}/map/level_foreground.png`
    );
    this.load.image(
      WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE,
      `${monsterTamerAssetPath}/map/encounter.png`
    );
    this.load.image(WORLD_ASSET_KEYS.WORLD_ORI_BG, `${oriPath}/bg/bgworld.png`);

    // Character World Assets
    this.load.spritesheet(
      CHARACTER_WORLD_ASSET_KEYS.PLAYER,
      `${axulArtAssetPath}/character/custom.png`,
      {
        frameWidth: 64,
        frameHeight: 88,
      }
    );
    this.load.spritesheet(
      CHARACTER_WORLD_ASSET_KEYS.SOLVED_WORLD,
      `${oriPath}/character/world/solved_world.png`,
      {
        frameWidth: 71,
        frameHeight: 87.5,
      }
    );
    this.load.spritesheet(
      CHARACTER_WORLD_ASSET_KEYS.NPC,
      `${pbGamesAssetPath}/characters.png`,
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );

    // Char Vn Assets
    this.load.image(
      VN_CHAR_ASSET_KEYS.SOLVED_VN,
      `${oriPath}/character/vn/solved-vn.png`
    );
    this.load.image(
      VN_CHAR_ASSET_KEYS.POLICE_VN,
      `${oriPath}/character/vn/police-vn.png`
    );
    this.load.image(
      VN_CHAR_ASSET_KEYS.LIA_VN,
      `${oriPath}/character/vn/lia-vn.png`
    );

    // audioAsset
    this.load.audio(
      AUDIO_ASSETS_KEYS.BGM_MENU,
      `${oriPath}/audio/backsound.mp3`
    );
    this.load.audio(
      AUDIO_ASSETS_KEYS.MOVE_MENU,
      `${oriPath}/audio/move-menu.wav`
    );
  }

  create() {
    console.log(`[${PreloadScene.name}:create] invoked`);
    this.#createAnimations();
    this.scene.start(SCENE_KEYS.CHAPTER1_SCENE);
  }

  #createAnimations() {
    const animations = DataUtils.getAnimations(this);

    animations.forEach((animation) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, {
            frames: animation.frames,
          })
        : this.anims.generateFrameNumbers(animation.assetKey);

      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
        delay: animation.delay,
        yoyo: animation.yoyo,
      });
    });
  }
}
