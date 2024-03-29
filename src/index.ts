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
import Gpt from './commands/gpt'
import { chatGpt } from './util/chatGpt'
import {
  getCompletionMessages,
  hasCompletion,
  pushToCompletions,
} from './store'

DotEnv.config()

const token = process.env.TOKEN ?? ''

if (token === '') {
  console.error('TOKEN is empty!')
  process.exit(1)
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.commands = new Collection()

client.commands.set(ImageSearch.data.name, ImageSearch)
client.commands.set(Gpt.data.name, Gpt)

client.once('ready', () => {
  const bot_invite_url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=328565073920&scope=bot`
  console.log(`Invite URL: ${bot_invite_url}`)
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

client.on(Events.MessageCreate, async (message) => {
  if (!message.channel.isThread()) return
  if (message.author.bot) return
  if (!hasCompletion({ channelId: message.channelId })) return

  pushToCompletions({
    channelId: message.channelId,
    messages: { role: 'user', content: message.content },
  })

  await message.channel.sendTyping()
  const completionResponse = await chatGpt({
    messages: getCompletionMessages({ channelId: message.channelId }),
  })
  if (completionResponse) {
    pushToCompletions({
      channelId: message.channelId,
      messages: completionResponse,
    })
    await message.channel.send({
      content: `${completionResponse.content}`,
    })
  }
})

client.login(token)
