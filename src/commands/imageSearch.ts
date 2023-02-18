import DotEnv from 'dotenv'
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from 'discord.js'
import GoogleImages from 'google-images'

DotEnv.config()

const googleCseId = process.env.GOOGLE_CSE_ID ?? ''
const googleApiKey = process.env.GOOGLE_API_KEY ?? ''
const giClient = new GoogleImages(googleCseId, googleApiKey)

export default {
  data: new SlashCommandBuilder()
    .setName('i')
    .setDescription('Replies with Image!')
    .addStringOption((option) =>
      option.setName('query').setDescription('search keyword').setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const images = await giClient.search(
      `${interaction.options.getString('query')}`
    )
    if (images.length > 0) {
      const embed = new EmbedBuilder()
        .setTitle(`${interaction.options.getString('query')}`)
        .setImage(`${images[0].url}`)
      await interaction.reply({ embeds: [embed] })
    } else {
      await interaction.reply('APIの使用回数の上限に達したようです')
    }
  },
}
