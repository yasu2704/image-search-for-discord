import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { chatGpt } from '../util/chatGpt'
import { sendEmbed } from '../util/embed'
import DotEnv from 'dotenv'
import {
  getCompletionMessages,
  isChatGpt,
  pushToCompletions,
  setChatGpt,
} from '../store'

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
  ): Promise<void> {
    if (interaction.channel?.isThread()) return
    if (!isChatGpt()) {
      if (
        interaction.user.id !== process.env.ADMIN_ID ||
        (interaction.user.id === process.env.ADMIN_ID &&
          interaction.options.getString('message') !== 'start')
      ) {
        await interaction.reply({
          content: 'ChatGPT機能は現在停止中です',
          ephemeral: true,
        })
      } else {
        if (interaction.options.getString('message') === 'start') {
          setChatGpt(true)
          await interaction.reply({
            content: 'ChatGPT機能を再開しました',
          })
        }
      }
      return
    } else {
      if (
        interaction.user.id === process.env.ADMIN_ID &&
        interaction.options.getString('message') === 'stop'
      ) {
        setChatGpt(false)
        await interaction.reply({
          content: 'ChatGPT機能を停止しました',
        })
        return
      }
    }

    const message = interaction.options.getString('message')
    if (!message) return

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

    // set store
    pushToCompletions({
      channelId: thread.id,
      messages: { role: 'user', content: `${message}` },
    })

    await thread.sendTyping()

    const completionResponse = await chatGpt({
      messages: getCompletionMessages({ channelId: thread.id }),
    })

    if (!completionResponse) return
    pushToCompletions({
      channelId: thread.id,
      messages: completionResponse,
    })

    // send completion response
    await thread.send({
      content: `${completionResponse.content}`,
    })
  },
}
