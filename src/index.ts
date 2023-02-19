import DotEnv from 'dotenv'
import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
} from 'discord.js'
import ImageSearch from './commands/imageSearch'

DotEnv.config()

const token = process.env.TOKEN ?? ''

if (token === '') {
  console.error('TOKEN is empty!')
  process.exit(1)
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

client.commands = new Collection()

client.commands.set(ImageSearch.data.name, ImageSearch)

client.once('ready', () => {
  console.log('Ready!')
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) return

  try {
    await command.execute(interaction as ChatInputCommandInteraction<CacheType>)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    })
  }
})

client.login(token)
