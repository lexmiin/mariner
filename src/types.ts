import type { SbRichTextDoc } from '@storyblok/astro'

export type Breadcrumb = {
  href?: string
  label: string
}

export type BreadcrumbPlacement = 'auto' | 'bar' | 'overlay' | 'hidden'

export type ResolvedBreadcrumbPlacement = Exclude<BreadcrumbPlacement, 'auto'>

export type NavbarTone = 'default' | 'inverse'

export type Item = {
  slug: string
  name: string
  images: Asset[]
  cover: Asset
}

export type Asset = {
  filename: string
  alt: string
  content_type?: string
}

export type GalleryItem = {
  _uid: string
  component: 'galleryItem'
  image: Asset
  altText?: string
  caption?: string
}

export type Marina = Item & {
  type: string
  price: string | undefined
  capacity: string
}

export type Navigation = Omit<Item, 'images'> & {
  text: SbRichTextDoc
}

export type StoryblokLink = {
  linktype?: 'story' | 'url' | 'email' | 'asset'
  url?: string
  cached_url?: string
  anchor?: string
  target?: '_blank' | '_self'
  story?: {
    url?: string
    full_slug?: string
  }
}

export type NavigationLink = {
  id: string
  type: 'link'
  label: string
  href: string
  target?: '_blank' | '_self'
  featured: boolean
}

export type NavigationSection = {
  id: string
  type: 'section'
  label: string
  items: NavigationLink[]
}

export type NavigationItem = NavigationLink | NavigationSection
