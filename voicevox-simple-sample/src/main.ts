type AudioQuery = {
  accent_phrases: {
    // いくつかパラメーターが存在しますが、API実行時に指定しません
    [key: string]: any,
  }[],
  intonationScale: number,
  outputSamplingRate: number,
  outputStereo: boolean,
  pitchScale: number,
  speedScale: number,
  volumeScale: number,
  // その他にもパラメーターが存在しますが、ここでは省略しています。
  [key: string]: any,
}

export async function getVoicevoxSpeakers() {
  const response = await fetch('http://localhost:8090/speakers')
  if (!response.ok) {
    throw new Error(`Failed to fetch speakers: ${response.statusText}`);
  }
  return await response.json()
}

export async function playAudioMessage(text: string, speakerId: number) {
  const words = text.split(/(?<=[!！?？。、])/)
  const audioBufferQueue: { index: number, audioBuffer: AudioBuffer }[] = []
  let isPlaying = false
  let currentPlayIndex = 0

  const audioContext = new AudioContext()

  // テキストから音声を生成
  textToSpeech()

  async function textToSpeech() {
    const processingPromises = words.map(async (word, index) => {
      console.info('start generateAudioBuffer', word, index)
      const audioBuffer = await generateAudioBuffer(word, speakerId, audioContext);
      audioBufferQueue.push({ index, audioBuffer });
      audioBufferQueue.sort((a, b) => a.index - b.index);
      console.warn('end generateAudioBuffer', word, index)

      // 再生が開始されていない場合は開始する
      if (!isPlaying) {
        isPlaying = true;
        playAudio();
      }
    });

    await Promise.all(processingPromises);
  };

  async function playAudio() {
    while (audioBufferQueue.length > 0 && audioBufferQueue[0].index === currentPlayIndex) {
      const { audioBuffer } = audioBufferQueue.shift()!;
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

async function generateAudioBuffer(text: string, speakerId: number, audioContext: AudioContext): Promise<AudioBuffer> {
  const audioQuery = await createQuery({ text, speakerId })
  const audioStream = await synthesis({ audioQuery, speakerId })
  if (!audioStream) {
    console.warn('audioStream is null')
    throw new Error('Audio stream is null')
  }

  return await decodeAudioFromStream(audioStream, audioContext)
}

async function playAudioBuffer(audioBuffer: AudioBuffer, audioContext: AudioContext): Promise<void> {
  return new Promise(resolve => {
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.onended = () => resolve()
    source.start()
  })
}

async function decodeAudioFromStream(
  audioStream: ReadableStream<Uint8Array>,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  const reader = audioStream.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;
      chunks.push(value);
      totalLength += value.length;
    }
  } finally {
    reader.releaseLock();
  }

  const audioData = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    audioData.set(chunk, offset);
    offset += chunk.length;
  }

  return await audioContext.decodeAudioData(audioData.buffer);
}

async function synthesis({ audioQuery, speakerId }: { audioQuery: AudioQuery, speakerId: number }) {
  const response = await fetch(`http://localhost:8090/synthesis?speaker=${speakerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'audio/wav',
    },
    body: JSON.stringify(audioQuery),
  })

  return response.body
}

async function createQuery({ text, speakerId }: { text: string, speakerId: number }) {
  const response = await fetch(`http://localhost:8090/audio_query?text=${text}&speaker=${speakerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}
