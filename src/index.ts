import DotEnv from 'dotenv'
import { Client, Collection, Intents, TextChannel } from 'discord.js'
import type { CommandInteraction } from 'discord.js'
import type { SlashCommandBuilder } from '@discordjs/builders'
import Ping from './commands/ping'

DotEnv.config()

const token = process.env.TOKEN ?? ''

if (token === '') {
    console.error('TOKEN is empty!')
    process.exit(1)
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const commands = new Collection<
    string,
    {
        data: SlashCommandBuilder
        execute(interaction: CommandInteraction): Promise<void>
    }
>()
commands.set(Ping.data.name, Ping)

client.once('ready', () => {
    console.log('Ready!')
})

client.on('interactionCreate', async (interaction) => {
    console.log(`${interaction.user.tag} in #${(interaction.channel as TextChannel).name} triggered an interaction.`)
    if (!interaction.isCommand()) return

    const command = commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
    }
})

client.login(process.env.TOKEN)
