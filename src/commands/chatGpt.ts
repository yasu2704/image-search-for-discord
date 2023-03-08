import {
  CacheType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import { Configuration, OpenAIApi } from 'openai'
import DotEnv from 'dotenv'

DotEnv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

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
    const message = interaction.options.getString('message')
    const embed = new EmbedBuilder()
      .setDescription(`<@${interaction.user.id}> が会話を開始しました。`)
      .setColor(Colors.Green)
      .addFields({
        name: `${interaction.user.username}`,
        value: `${message}`,
      })
    await interaction.reply({ embeds: [embed] })
    const response = await interaction.fetchReply()
    const thread = await response.startThread({
      name: `${interaction.user.username} - ${message?.substring(0, 30)}`,
      reason: 'gpt-bot',
      autoArchiveDuration: 60,
      rateLimitPerUser: 1,
    })
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `${interaction.options.getString('message')}`,
        },
      ],
    })
    await thread.send({
      content: `${completion.data.choices[0].message?.content}`,
    })
  },
}
