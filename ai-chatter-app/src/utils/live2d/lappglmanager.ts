/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

export let canvas: HTMLCanvasElement = null;
export let gl: WebGLRenderingContext = null;
export let instance: LAppGlManager = null;

/**
 * Cubism SDKのサンプルで使用するWebGLを管理するクラス
 */
export class LAppGlManager {
  /**
   * クラスのインスタンス（シングルトン）を返す。
   * インスタンスが生成されていない場合は内部でインスタンスを生成する。
   *
   * @return クラスのインスタンス
   */
  public static getInstance(): LAppGlManager {
    if (instance == null) {
      instance = new LAppGlManager();
    }

    return instance;
  }

  /**
   * クラスのインスタンス（シングルトン）を解放する。
   */
  public static releaseInstance(): void {
    if (instance != null) {
      instance.release();
    }

    instance = null;
  }

  constructor() {
    // キャンバスの作成
    canvas = document.createElement('canvas');

    // glコンテキストを初期化
    // @ts-ignore
    gl = canvas.getContext('webgl2');

    if (!gl) {
      // gl初期化失敗
      alert('Cannot initialize WebGL. This browser does not support.');
      gl = null;

      document.body.innerHTML =
        'This browser does not support the <code>&lt;canvas&gt;</code> element.';
    }
  }

  /**
   * 解放する。
   */
  public release(): void {}
}
