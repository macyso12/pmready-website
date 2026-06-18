import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        community: resolve(__dirname, 'community.html'),
        program: resolve(__dirname, 'program.html'),
        fellowship: resolve(__dirname, 'fellowship.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
