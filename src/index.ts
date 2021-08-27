import DotEnv from 'dotenv'
import { Client, Intents } from 'discord.js'

DotEnv.config()

const token = process.env.TOKEN ?? ''

if (token === '') {
    console.error('TOKEN is empty!')
    process.exit(1)
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
    console.log('Ready!')
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const {commandName} = interaction

    switch (commandName) {
        case 'ping':
            await interaction.reply('Pong!')
            break
        case 'server':
            await interaction.reply(`Server name: ${interaction.guild?.name}\nTotal members: ${interaction.guild?.memberCount}`)
            break
        case 'user':
            await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`)
            break
    }
})

client.login(process.env.TOKEN)

