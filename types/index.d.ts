import type { Collection } from 'discord.js'
import ImageSearch from '../src/commands/imageSearch'
import Gpt from '../src/commands/gpt'

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, typeof ImageSearch | typeof Gpt>
  }
}
