import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

build({
  entryPoints: ['src/index.ts', 'src/deploy-commands.ts'],
  bundle: true,
  platform: 'node',
  outdir: 'dist',
  sourcemap: true,
  minify: true,
  plugins: [nodeExternalsPlugin()],
})
