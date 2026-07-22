import type { StorySource, StorySourceOptions } from './catalog'

type MemoryStory = Record<string, unknown> & {
  content?: Record<string, unknown> & { component?: unknown }
  full_slug?: unknown
  is_startpage?: unknown
  position?: unknown
}

export function createMemoryStorySource(
  stories: readonly MemoryStory[]
): StorySource {
  return {
    async find(fullSlug) {
      return stories.find(story => story.full_slug === fullSlug) ?? null
    },

    async list(options) {
      const selected = stories.filter(story => matches(story, options))

      return options.sortBy === 'position:asc'
        ? selected.toSorted((left, right) => {
            const leftPosition =
              typeof left.position === 'number' ? left.position : 0
            const rightPosition =
              typeof right.position === 'number' ? right.position : 0
            return leftPosition - rightPosition
          })
        : selected
    }
  }
}

function matches(story: MemoryStory, options: StorySourceOptions): boolean {
  if (options.contentType && story.content?.component !== options.contentType) {
    return false
  }

  if (
    options.startsWith &&
    (typeof story.full_slug !== 'string' ||
      !story.full_slug.startsWith(options.startsWith))
  ) {
    return false
  }

  return !(options.excludeStartPage && story.is_startpage === true)
}
