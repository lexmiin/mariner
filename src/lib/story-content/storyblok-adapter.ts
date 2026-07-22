import {
  useStoryblokApi,
  type ISbStoriesParams,
  type StoryblokClient
} from '@storyblok/astro'
import {
  createStoryCatalog,
  type StoryCatalog,
  type StorySource,
  type StorySourceOptions
} from './catalog'

export function getStoryCatalog(): StoryCatalog {
  const client = useStoryblokApi()
  const source = createStoryblokSource(client)

  return createStoryCatalog(source, import.meta.env.DEV ? 'draft' : 'published')
}

function createStoryblokSource(client: StoryblokClient): StorySource {
  return {
    async find(fullSlug, options) {
      try {
        const { data } = await client.get(
          `cdn/stories/${fullSlug}`,
          toStoryblokParams(options)
        )

        return data.story ?? null
      } catch (error) {
        if (isNotFound(error)) return null
        throw error
      }
    },

    async list(options) {
      return client.getAll('cdn/stories', toStoryblokParams(options), 'stories')
    }
  }
}

function toStoryblokParams(options: StorySourceOptions): ISbStoriesParams {
  return {
    version: options.version,
    content_type: options.contentType,
    starts_with: options.startsWith,
    is_startpage: options.excludeStartPage ? false : undefined,
    sort_by: options.sortBy,
    resolve_links: options.resolveLinks,
    resolve_relations: options.resolveRelations
  }
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    error.status === 404
  )
}
