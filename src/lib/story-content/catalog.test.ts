import { describe, expect, it, vi } from 'vitest'
import {
  createStoryCatalog,
  StoryCatalogError,
  type StorySource
} from './catalog'
import { createMemoryStorySource } from './memory-adapter'

describe('Story Content Catalog', () => {
  it('returns a project-owned Story envelope', async () => {
    const catalog = createStoryCatalog(
      createMemoryStorySource([rawStory('page', 'about')]),
      'published'
    )

    await expect(catalog.findStory('page', 'about')).resolves.toEqual({
      id: 'uuid-about',
      kind: 'page',
      name: 'About',
      slug: 'about',
      fullSlug: 'about',
      content: {
        _uid: 'blok-about',
        component: 'page'
      }
    })
  })

  it('returns null for a missing Story', async () => {
    const catalog = createStoryCatalog(createMemoryStorySource([]), 'published')

    await expect(catalog.findStory('page', 'missing')).resolves.toBeNull()
  })

  it('returns complete kind collections and keeps landing in Pages', async () => {
    const catalog = createStoryCatalog(
      createMemoryStorySource([
        rawStory('page', 'landing'),
        rawStory('page', 'contact-us'),
        rawStory('destination', 'destinations', {
          fullSlug: 'destinations',
          isStartPage: true
        }),
        rawStory('destination', 'croatia', {
          fullSlug: 'destinations/croatia',
          position: 2
        }),
        rawStory('destination', 'greece', {
          fullSlug: 'destinations/greece',
          position: 1
        })
      ]),
      'published'
    )

    await expect(catalog.listStories('page')).resolves.toMatchObject([
      { slug: 'landing' },
      { slug: 'contact-us' }
    ])
    await expect(catalog.listStories('destination')).resolves.toMatchObject([
      { slug: 'greece' },
      { slug: 'croatia' }
    ])
  })

  it('owns canonical folders and relation resolution for individual reads', async () => {
    const source: StorySource = {
      find: vi.fn().mockResolvedValue(rawStory('page', 'landing')),
      list: vi.fn().mockResolvedValue([])
    }
    const catalog = createStoryCatalog(source, 'draft')

    await catalog.findStory('page', 'landing')

    expect(source.find).toHaveBeenCalledWith('landing', {
      version: 'draft',
      resolveRelations: ['topDestinations.destinations', 'featuredFleet.items']
    })
  })

  it('materializes configured relations for Page collection reads', async () => {
    const source: StorySource = {
      find: vi.fn().mockResolvedValue(null),
      list: vi.fn().mockResolvedValue([
        rawStory('page', 'charter-inspiration', {
          content: {
            body: [
              {
                _uid: 'blok-featured-fleet',
                component: 'featuredFleet',
                items: [
                  rawStory('yacht', 'lucy', {
                    fullSlug: 'our-fleet/lucy'
                  })
                ]
              }
            ]
          }
        })
      ])
    }
    const catalog = createStoryCatalog(source, 'published')

    await expect(catalog.listStories('page')).resolves.toMatchObject([
      {
        content: {
          body: [
            {
              items: [
                {
                  id: 'uuid-lucy',
                  kind: 'yacht',
                  fullSlug: 'our-fleet/lucy'
                }
              ]
            }
          ]
        }
      }
    ])
    expect(source.list).toHaveBeenCalledWith({
      version: 'published',
      contentType: 'page',
      resolveRelations: ['topDestinations.destinations', 'featuredFleet.items']
    })
  })

  it('normalizes configured resolved relations into project-owned Stories', async () => {
    const catalog = createStoryCatalog(
      createMemoryStorySource([
        rawStory('page', 'landing', {
          content: {
            body: [
              {
                _uid: 'blok-top-destinations',
                component: 'topDestinations',
                destinations: [
                  rawStory('destination', 'croatia', {
                    fullSlug: 'destinations/croatia'
                  })
                ]
              },
              {
                _uid: 'blok-featured-fleet',
                component: 'featuredFleet',
                items: [
                  rawStory('yacht', 'lucy', {
                    fullSlug: 'our-fleet/lucy'
                  })
                ]
              }
            ]
          }
        })
      ]),
      'published'
    )

    await expect(catalog.findStory('page', 'landing')).resolves.toMatchObject({
      content: {
        body: [
          {
            destinations: [
              {
                id: 'uuid-croatia',
                kind: 'destination',
                fullSlug: 'destinations/croatia'
              }
            ]
          },
          {
            items: [
              {
                id: 'uuid-lucy',
                kind: 'yacht',
                fullSlug: 'our-fleet/lucy'
              }
            ]
          }
        ]
      }
    })
  })

  it('rejects malformed configured resolved relations', async () => {
    const catalog = createStoryCatalog(
      createMemoryStorySource([
        rawStory('page', 'landing', {
          content: {
            body: [
              {
                _uid: 'blok-featured-fleet',
                component: 'featuredFleet',
                items: [rawStory('destination', 'croatia')]
              }
            ]
          }
        })
      ]),
      'published'
    )

    await expect(catalog.findStory('page', 'landing')).rejects.toMatchObject({
      name: 'StoryCatalogError',
      code: 'invalid-story',
      message: 'Invalid yacht Story: Story content.component must be "yacht"'
    })
  })

  it('owns settings paths and link resolution', async () => {
    const source: StorySource = {
      find: vi.fn().mockResolvedValue(
        rawStory('siteSettings', 'site', {
          fullSlug: 'settings/site'
        })
      ),
      list: vi.fn().mockResolvedValue([])
    }
    const catalog = createStoryCatalog(source, 'published')

    await catalog.findStory('siteSettings', 'site')

    expect(source.find).toHaveBeenCalledWith('settings/site', {
      version: 'published',
      resolveLinks: 'url'
    })
  })

  it('rejects malformed Story envelopes at the catalog seam', async () => {
    const source: StorySource = {
      find: vi.fn().mockResolvedValue({
        ...rawStory('page', 'about'),
        uuid: undefined
      }),
      list: vi.fn().mockResolvedValue([])
    }
    const catalog = createStoryCatalog(source, 'published')

    await expect(catalog.findStory('page', 'about')).rejects.toMatchObject({
      name: 'StoryCatalogError',
      code: 'invalid-story'
    })
  })

  it('turns source failures into catalog errors', async () => {
    const sourceError = new Error('Storyblok unavailable')
    const source: StorySource = {
      find: vi.fn().mockRejectedValue(sourceError),
      list: vi.fn().mockResolvedValue([])
    }
    const catalog = createStoryCatalog(source, 'published')

    await expect(catalog.findStory('page', 'about')).rejects.toEqual(
      new StoryCatalogError(
        'source-failure',
        'Unable to find page Story "about"',
        { cause: sourceError }
      )
    )
  })
})

function rawStory(
  component: string,
  slug: string,
  options: {
    content?: Record<string, unknown>
    fullSlug?: string
    isStartPage?: boolean
    position?: number
  } = {}
) {
  const name = slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  return {
    uuid: `uuid-${slug}`,
    name,
    slug,
    full_slug: options.fullSlug ?? slug,
    is_startpage: options.isStartPage ?? false,
    position: options.position ?? 0,
    content: {
      _uid: `blok-${slug}`,
      component,
      ...options.content
    }
  }
}
