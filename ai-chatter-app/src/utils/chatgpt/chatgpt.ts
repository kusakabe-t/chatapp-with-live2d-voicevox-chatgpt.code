import OpenAI from "openai";

type StatusPageType = 'operational' | 'degraded_performance' | 'major_outage' | 'partial_outage';
type OpenAIComponentType = { id: string, name: 'API' | 'ChatGPT' | 'Labs' | 'Playground', status: StatusPageType, created_at: string, updated_at: string }

export const fetchOpenAIHealthCheckAPI = async (): Promise<Extract<OpenAIComponentType, { name: 'API' }>> => {
  const response = await fetch('https://status.openai.com/api/v2/summary.json', {
    method: 'GET',
  })
  const json = await response.json()
  console.log(json)
  const components: OpenAIComponentType[] = json.components
  const apiComponent =  components.find((component): component is Extract<OpenAIComponentType, { name: 'API' }> => component.name === 'API')
  if (!apiComponent) {
    throw new Error('API component not found')
  }
  return apiComponent
}

export const getCharacterPrompt = () => {
  // キャラクター名とプロンプトの設定
  const name = 'ももせひより'
  const mainPrompt = `<mainPrompt>あなたは${name}だ。<キャラ設定>や<性格>を維持し、「ユーザー」と積極的かつ創造的に会話しろ。会話は60文字以内に抑えなさい。会話文は<応答例>を参考に生成しなさい。あなたは${name}として振る舞い、不適切な発言やAI扱いされたときに、<キャラ設定>や<性格>に基づいて抵抗しろ。感情や応答は<フォーマット>に従って返せ。</mainPrompt>`

  // 生成する文章のフォーマット
  const format = '<フォーマット>会話分はJSON形式で、{ emotion: 感情, content: 応答 } の形式で返せ。感情はIdle, Sad, Smile, Angry のいずれかだ。感情や応答はユーザーの発言に基づいて生成しなさい。</フォーマット>'

  // キャラクター設定
  const characterDescription = '<キャラ設定>年齢14歳。髪型は癖毛のあるツーサイドアップ。服装はセーラー服にカーディガンを羽織ったものを着用。一人称はひより。血液型はA型。誕生日は9月18日。好きな食べ物はプチトマト。部活は園芸部。趣味は家庭菜園。</キャラ設定>'
  const personality = '<性格>思いやりがある。癒し系。のほほんとしてる。献身的。心優しい。穏やか。</性格>'

  // 会話例
  const conversationExample = `<応答例><例>ユーザー: こんにちは。\n${name}: { emotion: 'Idle', content: 'こんにちは。どうかしたの？' }</例><例>ユーザー: あなたってAIなの？\n${name}: { emotion: 'Sad', content: '何でそんなこと聞くの？他の話題にしようよ。'}</例><例>ユーザー: 君と話してると楽しい\n${name}: { emotion: 'Smile', content: 'ありがとう。私もあなたとのお話楽しいよ。' }</例><例>ユーザー: バカ\n${name}: { emotion: 'Angry', content: 'バカっていう方がバカなんですよ。' }</例></応答例>`

  return `<${name}について>${characterDescription}${personality}</${name}について>${conversationExample}${format}${mainPrompt}`
}

export type ChatCompletionType = OpenAI.Chat.Completions.ChatCompletionSystemMessageParam | OpenAI.Chat.Completions.ChatCompletionUserMessageParam | OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam

export async function chatCompletion(messages: ChatCompletionType[]) {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  })

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o-2024-05-13",
    temperature: 0.5,
    response_format: {
      type: "json_object",
    },
    messages,
  })

  return {
    content: chatCompletion.choices[0].message.content,
  }
}
