import type { Story } from '@/lib/story-content'
import type { SbBlokData } from '@storyblok/astro'

type YachtStoryContent = SbBlokData & {
  builder?: unknown
  cover?: {
    alt?: unknown
    filename?: unknown
  }
  length?: unknown
  priceFrom?: unknown
  totalCabins?: unknown
  totalCrewMembers?: unknown
  totalGuests?: unknown
  type?: unknown
}

export type YachtSummaryFactKind =
  'builder' | 'type' | 'length' | 'guests' | 'cabins' | 'crew'

export type YachtSummaryFact = {
  kind: YachtSummaryFactKind
  text: string
}

export type YachtSummary = {
  facts: YachtSummaryFact[]
  href: string
  image: {
    alt: string
    src: string
  }
  name: string
  priceLabel: string
}

export function projectYachtSummary(story: Story): YachtSummary {
  if (story.kind !== 'yacht') {
    throw new TypeError(
      `Cannot project Yacht Summary for "${story.name}" (${story.id}): expected a yacht Story`
    )
  }

  const content = story.content as YachtStoryContent
  const imageSrc = optionalText(content.cover?.filename)
  if (!imageSrc) {
    throw new TypeError(
      `Cannot project Yacht Summary for "${story.name}" (${story.id}): cover.filename must be a non-empty string`
    )
  }

  const facts: YachtSummaryFact[] = []
  addFact(facts, 'builder', optionalText(content.builder))
  addFact(facts, 'type', optionalText(content.type) ?? 'Yacht')
  addFact(facts, 'length', optionalText(content.length))
  addFact(
    facts,
    'guests',
    countText(content.totalGuests, 'Guest', 'Guests') ?? 'On request'
  )
  addFact(facts, 'cabins', countText(content.totalCabins, 'Cabin', 'Cabins'))
  addFact(
    facts,
    'crew',
    countText(content.totalCrewMembers, 'Crew member', 'Crew members')
  )

  const priceFrom = optionalText(content.priceFrom)

  return {
    facts,
    href: `/${story.fullSlug.replace(/^\/+|\/+$/g, '')}`,
    image: {
      alt: optionalText(content.cover?.alt) ?? story.name,
      src: imageSrc
    },
    name: story.name,
    priceLabel: priceFrom ? `From ${priceFrom}` : 'Price on request'
  }
}

function addFact(
  facts: YachtSummaryFact[],
  kind: YachtSummaryFactKind,
  text: string | undefined
): void {
  if (text) facts.push({ kind, text })
}

function optionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const normalized = value.trim()
  return normalized || undefined
}

function countText(
  value: unknown,
  singular: string,
  plural: string
): string | undefined {
  if (typeof value === 'number') {
    return positiveIntegerCount(value, singular, plural)
  }
  if (typeof value !== 'string') return undefined

  const normalized = value.trim()
  if (!normalized) return undefined
  if (/^[+-]?\d+(?:\.\d+)?$/.test(normalized)) {
    return positiveIntegerCount(Number(normalized), singular, plural)
  }

  return normalized
}

function positiveIntegerCount(
  value: number,
  singular: string,
  plural: string
): string | undefined {
  if (!Number.isInteger(value) || value <= 0) return undefined
  return `${value} ${value === 1 ? singular : plural}`
}
