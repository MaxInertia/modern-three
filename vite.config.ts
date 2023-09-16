import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
// @ts-ignore
import gltf from 'vite-plugin-gltf'
import { resolve } from 'pathe'

export default defineConfig({
  resolve: {
    alias: {
      '/@': resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.glb'],
  plugins: [glsl(), gltf()],
})
