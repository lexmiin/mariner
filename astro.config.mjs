import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import { storyblok } from '@storyblok/astro'
import { loadEnv } from 'vite'
import sitemap from '@astrojs/sitemap'
import mkcert from 'vite-plugin-mkcert'

import tailwindcss from '@tailwindcss/vite'

const env = loadEnv('', process.cwd(), 'STORYBLOK')

// https://astro.build/config
export default defineConfig({
  site: 'https://marinerworldwide.com',

  image: {
    domains: ['a.storyblok.com']
  },

  integrations: [
    react(),
    sitemap(),
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      components: {
        page: 'storyblok/Page',
        destinationMap: 'storyblok/DestinationMap',
        destinationList: 'storyblok/DestinationList',
        destination: 'storyblok/Destination',
        hero: 'storyblok/Hero',
        pageIntro: 'storyblok/PageIntro',
        section: 'storyblok/Section',
        accordion: 'storyblok/Accordion',
        gallery: 'storyblok/Gallery',
        mediaContentSplit: 'storyblok/MediaContentSplit',
        videoHero: 'storyblok/VideoHero',
        topDestinations: 'storyblok/TopDestinations',
        featuredFleet: 'storyblok/FeaturedFleet',
        yacht: 'storyblok/Yacht',
        yachtList: 'storyblok/YachtList',
        contactForm: 'storyblok/ContactForm',
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
  ],

  vite: {
    plugins: [mkcert(), tailwindcss()]
  }
})
