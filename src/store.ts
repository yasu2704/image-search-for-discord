import { ChatCompletionRequestMessage } from 'openai'

const completions = new Map<string, ChatCompletionRequestMessage[]>()

export function pushToCompletions({
  channelId,
  messages,
}: {
  channelId: string
  messages: ChatCompletionRequestMessage
}): void {
  completions.set(channelId, [...(completions.get(channelId) ?? []), messages])
}

export function getCompletionMessages({
  channelId,
}: {
  channelId: string
}): ChatCompletionRequestMessage[] {
  const message = completions.get(channelId)
  if (message) return message
  return []
}

export function hasCompletion({ channelId }: { channelId: string }): boolean {
  return completions.has(channelId)
}

const chatGptFlag = { status: false }

export function isChatGpt(): boolean {
  return chatGptFlag.status
}

export function setChatGpt(flag: boolean): void {
  chatGptFlag.status = flag
}
