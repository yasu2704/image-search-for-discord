import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function chatGpt({
  messages,
}: {
  messages: ChatCompletionRequestMessage[]
}): Promise<ChatCompletionResponseMessage | undefined> {
  const { data } = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
  })
  return data.choices[0].message
}
