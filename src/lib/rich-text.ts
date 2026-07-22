import type { SbRichTextDoc } from '@storyblok/astro'

export function isRichTextEmpty(t?: SbRichTextDoc) {
  if (!t) return true

  if (t.content.length === 1) {
    const content = t.content[0]
    if (!('content' in content)) {
      return true
    }
  }

  return false
}
