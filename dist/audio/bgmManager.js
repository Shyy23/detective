export class BgmManager {
  /** @type {Phaser.Sound.BaseSound | null} */
  static currentBgm = null;

  /**
   * Play BGM baru, stop dulu kalau ada yang lama
   * @param {Phaser.Scene} scene
   * @param {string} key - key audio yang sudah di-preload
   * @param {Phaser.Types.Sound.SoundConfig} [config]
   */
  static play(scene, key, config = { loop: true, volume: 0.5 }) {
    if (BgmManager.currentBgm && BgmManager.currentBgm.isPlaying) {
      BgmManager.currentBgm.stop();
    }
    BgmManager.currentBgm = scene.sound.add(key, config);
    BgmManager.currentBgm.play();
  }

  /** Stop BGM aktif */
  static stop() {
    if (BgmManager.currentBgm && BgmManager.currentBgm.isPlaying) {
      BgmManager.currentBgm.stop();
      BgmManager.currentBgm = null;
    }
  }

  /** Pause BGM aktif */
  static pause() {
    if (BgmManager.currentBgm && BgmManager.currentBgm.isPlaying) {
      BgmManager.currentBgm.pause();
    }
  }

  /** Resume BGM */
  static resume() {
    if (BgmManager.currentBgm && BgmManager.currentBgm.isPaused) {
      BgmManager.currentBgm.resume();
    }
  }
}
