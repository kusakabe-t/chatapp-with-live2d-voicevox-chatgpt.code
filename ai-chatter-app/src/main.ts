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
import { generateAudioBuffer, playAudioBuffer } from '@utils/voicevox/voicevox';
import { chatCompletion, getCharacterPrompt, ChatCompletionType } from '@utils/chatgpt/chatgpt';

const characterPrompt = getCharacterPrompt()

let messages: ChatCompletionType[] = [
  { role: "system", content: characterPrompt },
]

export async function sendChatGPTMessage(userMessage: string) {
  messages.push({ role: "user", content: userMessage })
  const response = await chatCompletion(messages)
  messages.push({ role: "assistant", content: response.content })

  const chatGPTMessage: { emotion: string; content: string } = JSON.parse(response.content)
  await playAudioMessage(chatGPTMessage.content, chatGPTMessage.emotion)
}

async function playAudioMessage(text: string, emotion: string) {
  const words = text.split(/(?<=[!！?？。、])/)
  const audioBufferQueue: { index: number, audioBuffer: AudioBuffer, arrayBuffer: ArrayBuffer }[] = []
  let isPlaying = false
  let currentPlayIndex = 0

  const audioContext = new AudioContext()

  // テキストから音声を生成
  textToSpeech(emotion)

  async function textToSpeech(emotion: string) {
    const speakerId = 60

    const processingPromises = words.map(async (word, index) => {
      console.info('start generateAudioBuffer', word, index)
      const audioData = await generateAudioBuffer(word, speakerId, audioContext);
      audioBufferQueue.push({ index, audioBuffer: audioData.audioBuffer, arrayBuffer: audioData.arrayBuffer });
      audioBufferQueue.sort((a, b) => a.index - b.index);
      console.warn('end generateAudioBuffer', word, index)

      // 再生が開始されていない場合は開始する
      if (!isPlaying) {
        isPlaying = true;
        playAudio();
      }
    });

    await Promise.all(processingPromises);

    // モーション再生
    const live2dManager = LAppLive2DManager.getInstance()
    const model = live2dManager.getModel(0)
    model.startMotion(emotion, 0, LAppDefine.PriorityForce)
  };

  async function playAudio() {
    while (audioBufferQueue.length > 0 && audioBufferQueue[0].index === currentPlayIndex) {
      const { audioBuffer, arrayBuffer } = audioBufferQueue.shift()!;
      const live2dManager = LAppLive2DManager.getInstance()
      const model = live2dManager.getModel(0)
      model.lipSync(arrayBuffer)
      await playAudioBuffer(audioBuffer, audioContext);
      currentPlayIndex++;
    }

    if (audioBufferQueue.length === 0 && currentPlayIndex === words.length) {
      isPlaying = false;
    } else {
      // 音声合成中のため、0.1秒後に再チェック
      setTimeout(playAudio, 100);
    }
  };
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
