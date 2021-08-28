import DotEnv from 'dotenv'
import { Client, Collection, Intents } from 'discord.js'
import type { CommandInteraction } from 'discord.js'
import type { SlashCommandBuilder } from '@discordjs/builders'
import ImageSearch from './commands/imageSearch'

DotEnv.config()

const token = process.env.TOKEN ?? ''

if (token === '') {
    console.error('TOKEN is empty!')
    process.exit(1)
}

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

const commands = new Collection<
    string,
    {
        data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
        execute(interaction: CommandInteraction): Promise<void>
    }
>()
commands.set(ImageSearch.data.name, ImageSearch)

client.once('ready', () => {
    console.log('Ready!')
})

client.on('interactionCreate', async (interaction) => {
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
