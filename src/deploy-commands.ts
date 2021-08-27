import DotEnv from 'dotenv'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import Ping from './commands/ping'

DotEnv.config()

const token = process.env.TOKEN ?? ''
const clientId = process.env.CLIENT_ID ?? ''
const guildId = process.env.GUILD_ID ?? ''

const commands: unknown[] = []
commands.push(Ping.data.toJSON())

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        })

        console.log('Successfully registered application commands.')
    } catch (error) {
        console.error(error)
    }
})()
