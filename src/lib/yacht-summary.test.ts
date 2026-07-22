import type { Story } from '@/lib/story-content'
import { describe, expect, it } from 'vitest'
import { projectYachtSummary } from './yacht-summary'

describe('Yacht Summary projection', () => {
  it('projects a complete Yacht Story into presentation-ready data', () => {
    expect(
      projectYachtSummary(
        yachtStory({
          builder: '  Beneteau ',
          cover: {
            alt: '  Lucy under sail ',
            filename: '  https://images.example/lucy.jpg '
          },
          length: ' 18 m ',
          priceFrom: ' € 19,000 / week ',
          totalCabins: '1',
          totalCrewMembers: 2,
          totalGuests: '6',
          type: ' Sailing yacht '
        })
      )
    ).toEqual({
      facts: [
        { kind: 'builder', text: 'Beneteau' },
        { kind: 'type', text: 'Sailing yacht' },
        { kind: 'length', text: '18 m' },
        { kind: 'guests', text: '6 Guests' },
        { kind: 'cabins', text: '1 Cabin' },
        { kind: 'crew', text: '2 Crew members' }
      ],
      href: '/our-fleet/lucy',
      image: {
        alt: 'Lucy under sail',
        src: 'https://images.example/lucy.jpg'
      },
      name: 'Lucy',
      priceLabel: 'From € 19,000 / week'
    })
  })

  it('applies required defaults and omits unavailable optional facts', () => {
    expect(
      projectYachtSummary(
        yachtStory({
          builder: ' ',
          cover: { alt: ' ', filename: 'lucy.jpg' },
          length: '',
          priceFrom: '',
          totalGuests: ' ',
          type: ' '
        })
      )
    ).toEqual({
      facts: [
        { kind: 'type', text: 'Yacht' },
        { kind: 'guests', text: 'On request' }
      ],
      href: '/our-fleet/lucy',
      image: { alt: 'Lucy', src: 'lucy.jpg' },
      name: 'Lucy',
      priceLabel: 'Price on request'
    })
  })

  it('preserves publisher-written counts and omits nonpositive numbers', () => {
    const summary = projectYachtSummary(
      yachtStory({
        cover: { filename: 'lucy.jpg' },
        totalCabins: 0,
        totalCrewMembers: '-2',
        totalGuests: ' Up to 8 '
      })
    )

    expect(summary.facts).toEqual([
      { kind: 'type', text: 'Yacht' },
      { kind: 'guests', text: 'Up to 8' }
    ])
  })

  it('rejects a Yacht Story without a usable cover', () => {
    expect(() =>
      projectYachtSummary(yachtStory({ cover: { filename: ' ' } }))
    ).toThrow(
      new TypeError(
        'Cannot project Yacht Summary for "Lucy" (uuid-lucy): cover.filename must be a non-empty string'
      )
    )
  })
})

function yachtStory(content: Record<string, unknown>): Story {
  return {
    id: 'uuid-lucy',
    kind: 'yacht',
    name: 'Lucy',
    slug: 'lucy',
    fullSlug: '/our-fleet/lucy/',
    content: {
      _uid: 'blok-lucy',
      component: 'yacht',
      ...content
    }
  }
}
