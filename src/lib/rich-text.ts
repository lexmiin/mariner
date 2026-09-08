import type { StoryblokRichTextDoc } from '@storyblok/richtext'

export function isRichTextEmpty(t?: StoryblokRichTextDoc) {
  if (!t) return true

  if (t.content.length === 1) {
    const content = t.content[0]
    if (!('content' in content)) {
      return true
    }
  }

  return false
}
