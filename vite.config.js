import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        community: resolve(__dirname, 'community.html'),
        program: resolve(__dirname, 'program.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
