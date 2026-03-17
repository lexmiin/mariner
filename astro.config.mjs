import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import storyblok from '@storyblok/astro'
import { loadEnv } from 'vite'
import sitemap from '@astrojs/sitemap'

const env = loadEnv('', process.cwd(), 'STORYBLOK')

// https://astro.build/config
export default defineConfig({
  site: 'https://marinerworldwide.com',
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      components: {
        page: 'storyblok/Page',
        marina: 'storyblok/Item',
        marinaList: 'storyblok/MarinaList',
        navigationList: 'storyblok/NavigationList',
        navigation: 'storyblok/Navigation',
        navigationSection: 'storyblok/NavigationSection'
      },
      apiOptions: {
        region: 'eu'
      }
    })
  ]
})
