import {
  CacheType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} from 'discord.js'

export async function sendEmbed({
  interaction,
  message,
}: {
  interaction: ChatInputCommandInteraction<CacheType>
  message: string
}): Promise<void> {
  const embed = new EmbedBuilder()
    .setDescription(`<@${interaction.user.id}> が会話を開始しました。`)
    .setColor(Colors.Green)
    .addFields({
      name: `${interaction.user.username}`,
      value: `${message}`,
    })
  await interaction.reply({ embeds: [embed] })
}
