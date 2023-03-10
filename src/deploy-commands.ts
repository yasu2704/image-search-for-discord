import DotEnv from 'dotenv'
import { Routes, REST } from 'discord.js'
import ImageSearch from './commands/imageSearch'
import ChatGpt from './commands/gpt'

DotEnv.config()

const token = process.env.TOKEN ?? ''
const clientId = process.env.CLIENT_ID ?? ''
// const guildId = process.env.GUILD_ID ?? ''

const commands: unknown[] = []
commands.push(ImageSearch.data.toJSON())
commands.push(ChatGpt.data.toJSON())

const rest = new REST({ version: '10' }).setToken(token)

;(async () => {
  try {
    await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    })

    console.log('Successfully registered application commands.')
  } catch (error) {
    console.error(error)
  }
})()
