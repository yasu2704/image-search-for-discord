import {
  CacheType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'
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
  ): Promise<void> {
    const embed = new EmbedBuilder()
      .setDescription(`<@${interaction.user.id}> が会話を開始しました。`)
      .setColor(Colors.Green)
      .addFields({
        name: `${interaction.user.username}`,
        value: `${interaction.options.getString('message')}`,
      })
    await interaction.reply({ embeds: [embed] })
    const response = await interaction.fetchReply()
    response.startThread({
      name: `${interaction.user.username} - ${interaction.options
        .getString('message')
        ?.substring(0, 30)}`,
      reason: 'gpt-bot',
      autoArchiveDuration: 60,
      rateLimitPerUser: 1,
    })
  },
}
