import type { Collection } from 'discord.js'
import ImageSearch from '../src/commands/imageSearch'

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, typeof ImageSearch>
  }
}
