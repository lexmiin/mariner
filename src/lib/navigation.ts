import type { StoryblokLink } from '@/types'

export function resolveStoryblokLink(link: StoryblokLink): string {
  const value = link.url || link.story?.url || link.cached_url || ''

  if (!value) return ''

  const isAbsolute = /^(?:[a-z]+:)?\/\//i.test(value)
  const isSpecial = value.startsWith('/') || value.startsWith('#')
  const href =
    link.linktype === 'email' && !value.startsWith('mailto:')
      ? `mailto:${value}`
      : isAbsolute || isSpecial || value.startsWith('mailto:')
        ? value
        : `/${value}`
  const pathname =
    href.length > 1 && href.endsWith('/') ? href.slice(0, -1) : href
  const normalizedPathname = pathname === '/landing' ? '/' : pathname

  return link.anchor
    ? `${normalizedPathname}#${link.anchor}`
    : normalizedPathname
}
