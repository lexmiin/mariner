import type { Story } from '@/lib/story-content'
import { describe, expect, it } from 'vitest'
import { projectDestinationSummary } from './destination-summary'

describe('Destination Summary projection', () => {
  it('projects a complete Destination Story into presentation-ready data', () => {
    expect(
      projectDestinationSummary(
        destinationStory({
          cover: {
            alt: '  Balearic coast ',
            filename: '  https://images.example/balearic.jpg '
          },
          mapX: ' 50.81 ',
          mapY: 43.38,
          summary: '  Clear water and hidden coves. '
        })
      )
    ).toEqual({
      name: 'Balearic Islands',
      href: '/destinations/balearic-islands',
      description: 'Clear water and hidden coves.',
      image: {
        src: 'https://images.example/balearic.jpg',
        alt: 'Balearic coast'
      },
      mapPosition: { x: 50.81, y: 43.38 }
    })
  })

  it('omits optional facts and falls back to the Story name for alt text', () => {
    expect(
      projectDestinationSummary(
        destinationStory({
          cover: { alt: ' ', filename: 'balearic.jpg' },
          mapX: '',
          mapY: 43,
          summary: ' '
        })
      )
    ).toEqual({
      name: 'Balearic Islands',
      href: '/destinations/balearic-islands',
      image: { src: 'balearic.jpg', alt: 'Balearic Islands' }
    })
  })

  it.each([
    { mapX: 0, mapY: '100' },
    { mapX: '100', mapY: 0 }
  ])('keeps inclusive map-edge coordinates %#', ({ mapX, mapY }) => {
    expect(
      projectDestinationSummary(
        destinationStory({
          cover: { filename: 'balearic.jpg' },
          mapX,
          mapY
        })
      ).mapPosition
    ).toEqual({ x: Number(mapX), y: Number(mapY) })
  })

  it.each([
    { mapX: undefined, mapY: 50 },
    { mapX: 50, mapY: null },
    { mapX: 'not-a-number', mapY: 50 },
    { mapX: Number.POSITIVE_INFINITY, mapY: 50 },
    { mapX: -0.01, mapY: 50 },
    { mapX: 50, mapY: 100.01 }
  ])('omits an invalid map position %#', content => {
    const summary = projectDestinationSummary(
      destinationStory({ cover: { filename: 'balearic.jpg' }, ...content })
    )

    expect(summary).not.toHaveProperty('mapPosition')
  })

  it('rejects a Destination Story without a usable cover', () => {
    expect(() =>
      projectDestinationSummary(destinationStory({ cover: { filename: ' ' } }))
    ).toThrow(
      new TypeError(
        'Cannot project Destination Summary for "Balearic Islands" (uuid-balearic): cover.filename must be a non-empty string'
      )
    )
  })
})

function destinationStory(content: Record<string, unknown>): Story {
  return {
    id: 'uuid-balearic',
    kind: 'destination',
    name: 'Balearic Islands',
    slug: 'balearic-islands',
    fullSlug: '/destinations/balearic-islands/',
    content: {
      _uid: 'blok-balearic',
      component: 'destination',
      ...content
    }
  }
}
