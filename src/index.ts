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
import { ChatCompletionRequestMessage } from 'openai'
import { chatGpt } from './util/chatGpt'

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

const chatGptCompletions = new Map<string, ChatCompletionRequestMessage[]>()

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
    switch (command.data.name) {
      case 'gpt': {
        const data = await Gpt.execute(
          interaction as ChatInputCommandInteraction<CacheType>
        )
        if (data) {
          chatGptCompletions.set(data.threadId, data.messages)
        }
        break
      }
      default:
        await command.execute(
          interaction as ChatInputCommandInteraction<CacheType>
        )
        break
    }
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
  if (!chatGptCompletions.has(message.channelId)) return
  const completionMessage = chatGptCompletions.get(message.channelId)
  if (completionMessage) {
    chatGptCompletions.set(message.channelId, [
      ...completionMessage,
      { role: 'user', content: message.content },
    ])
    const requestMessages = chatGptCompletions.get(message.channelId)
    await message.channel.sendTyping()
    const response = await chatGpt({ messages: requestMessages ?? [] })
    if (response) {
      message.channel.send(`${response?.content}`)
      chatGptCompletions.set(message.channelId, [
        ...(requestMessages ?? []),
        response,
      ])
    }
  }
})

client.login(token)
