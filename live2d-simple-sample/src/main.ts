/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LAppDelegate } from '@utils/live2d/lappdelegate';
import * as LAppDefine from '@utils/live2d/lappdefine';
import { LAppGlManager } from '@utils/live2d/lappglmanager';
import { LAppLive2DManager } from '@utils/live2d/lapplive2dmanager';


export function sadAnimation() {
  const live2dManager = LAppLive2DManager.getInstance()
  const model = live2dManager.getModel(0)
  model.startMotion('Sad', 0, LAppDefine.PriorityForce)
}

export function smileAnimation() {
  const live2dManager = LAppLive2DManager.getInstance()
  const model = live2dManager.getModel(0)
  model.startMotion('Smile', 0, LAppDefine.PriorityForce)
}

export function angryAnimation() {
  const live2dManager = LAppLive2DManager.getInstance()
  const model = live2dManager.getModel(0)
  model.startMotion('Angry', 0, LAppDefine.PriorityForce)
}

/**
 * ブラウザロード後の処理
 */
window.addEventListener(
  'load',
  (): void => {
    // Initialize WebGL and create the application instance
    if (
      !LAppGlManager.getInstance() ||
      !LAppDelegate.getInstance().initialize()
    ) {
      return;
    }

    LAppDelegate.getInstance().run();
  },
  { passive: true }
);

/**
 * 終了時の処理
 */
window.addEventListener(
  'beforeunload',
  (): void => LAppDelegate.releaseInstance(),
  { passive: true }
);

/**
 * Process when changing screen size.
 */
window.addEventListener(
  'resize',
  () => {
    if (LAppDefine.CanvasSize === 'auto') {
      LAppDelegate.getInstance().onResize();
    }
  },
  { passive: true }
);
