import { SlashCommandBuilder } from 'discord.js'
import type { CommandInteraction } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Pong!')
  },
}
