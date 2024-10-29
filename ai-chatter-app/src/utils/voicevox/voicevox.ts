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

export async function generateAudioBuffer(text: string, speakerId: number, audioContext: AudioContext): Promise<{ audioBuffer: AudioBuffer; arrayBuffer: ArrayBuffer }> {
  const audioQuery = await createQuery({ text, speakerId })
  const audioStream = await synthesis({ audioQuery, speakerId })
  if (!audioStream) {
    console.warn('audioStream is null')
    throw new Error('Audio stream is null')
  }

  return await decodeAudioFromStream(audioStream, audioContext)
}

export async function playAudioBuffer(audioBuffer: AudioBuffer, audioContext: AudioContext): Promise<void> {
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
): Promise<{audioBuffer: AudioBuffer; arrayBuffer: ArrayBuffer}> {
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

  const arrayBuffer = audioData.buffer.slice(0)

  return { audioBuffer: await audioContext.decodeAudioData(audioData.buffer), arrayBuffer};
}

async function synthesis({ audioQuery, speakerId }: { audioQuery: AudioQuery, speakerId: number }) {
  const response = await fetch(`http://localhost:8090/synthesis?speaker=${speakerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'audio/wav',
    },
    body: JSON.stringify({
      ...audioQuery,
      volumeScale: 3,
    }),
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
