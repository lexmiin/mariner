import type { SbBlokData } from '@storyblok/astro'

export type StoryKind =
  'page' | 'destination' | 'yacht' | 'marina' | 'navigation' | 'siteSettings'

export type StoryContentVersion = 'draft' | 'published'

export type Story<TContent extends SbBlokData = SbBlokData> = {
  id: string
  kind: StoryKind
  name: string
  slug: string
  fullSlug: string
  content: TContent
}

export type StoryCatalog = {
  findStory(kind: StoryKind, slug: string): Promise<Story | null>
  listStories(kind: StoryKind): Promise<Story[]>
}

export type StorySourceOptions = {
  version: StoryContentVersion
  contentType?: string
  startsWith?: string
  excludeStartPage?: boolean
  sortBy?: 'position:asc'
  resolveLinks?: 'url'
  resolveRelations?: string[]
}

export type StorySource = {
  find(fullSlug: string, options: StorySourceOptions): Promise<unknown | null>
  list(options: StorySourceOptions): Promise<unknown[]>
}

type StoryCatalogErrorCode = 'invalid-story' | 'source-failure'

export class StoryCatalogError extends Error {
  readonly code: StoryCatalogErrorCode

  constructor(
    code: StoryCatalogErrorCode,
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options)
    this.name = 'StoryCatalogError'
    this.code = code
  }
}

type StoryKindSpec = {
  contentType: string
  folder?: string
  excludeStartPage?: boolean
  sortBy?: 'position:asc'
}

const storyKindSpecs: Record<StoryKind, StoryKindSpec> = {
  page: { contentType: 'page' },
  destination: {
    contentType: 'destination',
    folder: 'destinations',
    excludeStartPage: true,
    sortBy: 'position:asc'
  },
  yacht: {
    contentType: 'yacht',
    folder: 'our-fleet',
    excludeStartPage: true,
    sortBy: 'position:asc'
  },
  marina: { contentType: 'marina' },
  navigation: { contentType: 'navigation' },
  siteSettings: { contentType: 'siteSettings', folder: 'settings' }
}

type StoryRelationSpec = {
  component: string
  field: string
  kind: StoryKind
}

type StoryReadProfile = {
  resolveLinks?: 'url'
  relations?: StoryRelationSpec[]
}

const storyKindReadProfiles: Partial<Record<StoryKind, StoryReadProfile>> = {
  page: {
    relations: [
      {
        component: 'topDestinations',
        field: 'destinations',
        kind: 'destination'
      },
      { component: 'featuredFleet', field: 'items', kind: 'yacht' }
    ]
  }
}

const storyReadProfiles: Record<string, StoryReadProfile> = {
  'siteSettings:site': { resolveLinks: 'url' }
}

export function createStoryCatalog(
  source: StorySource,
  version: StoryContentVersion
): StoryCatalog {
  return {
    async findStory(kind, slug) {
      const canonicalSlug = normalizeSlug(slug)
      const spec = storyKindSpecs[kind]
      const fullSlug = joinSlug(spec.folder, canonicalSlug)
      const profile = storyReadProfile(kind, canonicalSlug)
      const rawStory = await readSource(
        `find ${kind} Story "${canonicalSlug}"`,
        () =>
          source.find(fullSlug, {
            version,
            ...storySourceOptions(profile)
          })
      )

      return rawStory === null
        ? null
        : normalizeStory(rawStory, kind, profile?.relations)
    },

    async listStories(kind) {
      const spec = storyKindSpecs[kind]
      const profile = storyReadProfile(kind)
      const rawStories = await readSource(`list ${kind} Stories`, () =>
        source.list({
          version,
          contentType: spec.contentType,
          startsWith: spec.folder ? `${spec.folder}/` : undefined,
          excludeStartPage: spec.excludeStartPage,
          sortBy: spec.sortBy,
          ...storySourceOptions(profile)
        })
      )

      return rawStories.map(rawStory =>
        normalizeStory(rawStory, kind, profile?.relations)
      )
    }
  }
}

function storyReadProfile(
  kind: StoryKind,
  slug?: string
): StoryReadProfile | undefined {
  const kindProfile = storyKindReadProfiles[kind]
  const storyProfile = slug ? storyReadProfiles[`${kind}:${slug}`] : undefined

  if (!kindProfile) return storyProfile
  if (!storyProfile) return kindProfile

  return {
    ...kindProfile,
    ...storyProfile,
    relations: [
      ...(kindProfile.relations ?? []),
      ...(storyProfile.relations ?? [])
    ]
  }
}

function storySourceOptions(
  profile: StoryReadProfile | undefined
): Pick<StorySourceOptions, 'resolveLinks' | 'resolveRelations'> {
  return {
    ...(profile?.resolveLinks && { resolveLinks: profile.resolveLinks }),
    ...(profile?.relations && {
      resolveRelations: profile.relations.map(
        relation => `${relation.component}.${relation.field}`
      )
    })
  }
}

async function readSource<T>(
  action: string,
  read: () => Promise<T>
): Promise<T> {
  try {
    return await read()
  } catch (error) {
    if (error instanceof StoryCatalogError) throw error

    throw new StoryCatalogError('source-failure', `Unable to ${action}`, {
      cause: error
    })
  }
}

function normalizeStory(
  rawStory: unknown,
  kind: StoryKind,
  relations: StoryRelationSpec[] = []
): Story {
  if (!isRecord(rawStory)) {
    throw invalidStory(kind, 'Story must be an object')
  }

  const { content, full_slug: fullSlug, name, slug, uuid } = rawStory
  const expectedComponent = storyKindSpecs[kind].contentType

  if (typeof uuid !== 'string' || !uuid) {
    throw invalidStory(kind, 'Story uuid must be a non-empty string')
  }
  if (typeof name !== 'string' || !name) {
    throw invalidStory(kind, 'Story name must be a non-empty string')
  }
  if (typeof slug !== 'string' || !slug) {
    throw invalidStory(kind, 'Story slug must be a non-empty string')
  }
  if (typeof fullSlug !== 'string' || !fullSlug) {
    throw invalidStory(kind, 'Story full_slug must be a non-empty string')
  }
  if (!isRecord(content)) {
    throw invalidStory(kind, 'Story content must be an object')
  }
  if (typeof content._uid !== 'string' || !content._uid) {
    throw invalidStory(kind, 'Story content._uid must be a non-empty string')
  }
  if (content.component !== expectedComponent) {
    throw invalidStory(
      kind,
      `Story content.component must be "${expectedComponent}"`
    )
  }

  return {
    id: uuid,
    kind,
    name,
    slug,
    fullSlug,
    content: normalizeResolvedRelations(content, relations, kind) as SbBlokData
  }
}

function normalizeResolvedRelations(
  value: unknown,
  relations: StoryRelationSpec[],
  ownerKind: StoryKind
): unknown {
  if (Array.isArray(value)) {
    return value.map(item =>
      normalizeResolvedRelations(item, relations, ownerKind)
    )
  }
  if (!isRecord(value)) return value

  const normalized = Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      normalizeResolvedRelations(child, relations, ownerKind)
    ])
  )

  for (const relation of relations) {
    if (value.component !== relation.component || !(relation.field in value)) {
      continue
    }

    const relatedStories = value[relation.field]
    if (!Array.isArray(relatedStories)) {
      throw invalidStory(
        ownerKind,
        `Resolved relation ${relation.component}.${relation.field} must be an array`
      )
    }

    normalized[relation.field] = relatedStories.map(relatedStory =>
      normalizeStory(relatedStory, relation.kind)
    )
  }

  return normalized
}

function invalidStory(kind: StoryKind, detail: string): StoryCatalogError {
  return new StoryCatalogError(
    'invalid-story',
    `Invalid ${kind} Story: ${detail}`
  )
}

function normalizeSlug(slug: string): string {
  const normalized = slug.replace(/^\/+|\/+$/g, '')
  if (!normalized) throw new TypeError('Story slug must not be empty')
  return normalized
}

function joinSlug(folder: string | undefined, slug: string): string {
  if (!folder || slug === folder || slug.startsWith(`${folder}/`)) return slug
  return `${folder}/${slug}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
