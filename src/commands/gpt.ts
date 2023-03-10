import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { ChatCompletionRequestMessage } from 'openai'
import { chatGpt } from '../util/chatGpt'
import { sendEmbed } from '../util/embed'
import DotEnv from 'dotenv'

DotEnv.config()

export default {
  data: new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('Replies with GPT!')
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('input message')
        .setRequired(true)
    ),
  async execute(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<
    { threadId: string; messages: ChatCompletionRequestMessage[] } | undefined
  > {
    if (interaction.channel?.isThread()) return undefined

    const message = interaction.options.getString('message')
    if (!message) return undefined

    // send embed
    await sendEmbed({ interaction, message })

    // create thread
    const response = await interaction.fetchReply()
    const thread = await response.startThread({
      name: `${interaction.user.username} - ${message?.substring(0, 30)}`,
      reason: 'gpt-bot',
      autoArchiveDuration: 60,
      rateLimitPerUser: 1,
    })

    await thread.sendTyping()

    const completionResponse = await chatGpt({
      messages: [
        {
          role: 'user',
          content: `${message}`,
        },
      ],
    })

    if (!completionResponse) return undefined
    // send completion response
    await thread.send({
      content: `${completionResponse.content}`,
    })

    return {
      threadId: thread.id,
      messages: [
        {
          role: 'user',
          content: `${message}`,
        },
        completionResponse,
      ],
    }
  },
}
