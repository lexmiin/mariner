import type { RichTextType } from 'storyblok-rich-text-astro-renderer'

export type Item = {
  slug: string
  name: string
  images: Asset[]
  cover: Asset
}

export type Asset = {
  filename: string
  alt: string
}

export type Marina = Item & {
  type: string
  price: string | undefined
  capacity: string
}

export type Navigation = Omit<Item, 'images'> & {
  text: RichTextType
}
