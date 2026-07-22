import type { Story } from '@/lib/story-content'
import type { SbBlokData } from '@storyblok/astro'

type DestinationStoryContent = SbBlokData & {
  cover?: {
    alt?: unknown
    filename?: unknown
  }
  mapX?: unknown
  mapY?: unknown
  summary?: unknown
}

export type DestinationMapPosition = {
  x: number
  y: number
}

export type DestinationSummary = {
  name: string
  href: string
  description?: string
  image: {
    src: string
    alt: string
  }
  mapPosition?: DestinationMapPosition
}

export function projectDestinationSummary(story: Story): DestinationSummary {
  if (story.kind !== 'destination') {
    throw new TypeError(
      `Cannot project Destination Summary for "${story.name}" (${story.id}): expected a destination Story`
    )
  }

  const content = story.content as DestinationStoryContent
  const imageSrc = optionalText(content.cover?.filename)
  if (!imageSrc) {
    throw new TypeError(
      `Cannot project Destination Summary for "${story.name}" (${story.id}): cover.filename must be a non-empty string`
    )
  }

  const description = optionalText(content.summary)
  const mapPosition = projectMapPosition(content.mapX, content.mapY)

  return {
    name: story.name,
    href: `/${story.fullSlug.replace(/^\/+|\/+$/g, '')}`,
    ...(description && { description }),
    image: {
      src: imageSrc,
      alt: optionalText(content.cover?.alt) ?? story.name
    },
    ...(mapPosition && { mapPosition })
  }
}

function projectMapPosition(
  mapX: unknown,
  mapY: unknown
): DestinationMapPosition | undefined {
  const x = percentage(mapX)
  const y = percentage(mapY)

  return x === undefined || y === undefined ? undefined : { x, y }
}

function percentage(value: unknown): number | undefined {
  const candidate =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number(value.trim())
        : undefined

  if (
    candidate === undefined ||
    !Number.isFinite(candidate) ||
    candidate < 0 ||
    candidate > 100
  ) {
    return undefined
  }

  return candidate
}

function optionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const normalized = value.trim()
  return normalized || undefined
}
