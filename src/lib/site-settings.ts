import { resolveStoryblokLink } from '@/lib/navigation'
import type { StoryCatalog } from '@/lib/story-content'
import type { NavigationItem, NavigationLink, NavigationSection } from '@/types'
import { z } from 'astro/zod'

export type SiteSettings = {
  header: {
    items: NavigationItem[]
  }
  footer: {
    navigation: {
      label: string
      items: NavigationLink[]
    }
    contact: {
      label: string
      heading: string
      link?: {
        href: string
        target?: '_blank' | '_self'
      }
    }
  }
}

type SiteSettingsErrorCode = 'missing-story' | 'invalid-content'

export class SiteSettingsError extends Error {
  readonly code: SiteSettingsErrorCode

  constructor(code: SiteSettingsErrorCode, message: string) {
    super(message)
    this.name = 'SiteSettingsError'
    this.code = code
  }
}

const optionalTextSchema = z
  .string()
  .trim()
  .nullish()
  .transform(value => value ?? '')
const requiredTextSchema = z.string().trim().min(1)
const optionalStringSchema = z
  .string()
  .nullish()
  .transform(value => value || undefined)
const optionalBooleanSchema = z
  .boolean()
  .nullish()
  .transform(value => value ?? false)
const optionalLinkTypeSchema = z
  .union([z.enum(['story', 'url', 'email', 'asset']), z.literal('')])
  .nullish()
  .transform(value => value || undefined)
const optionalTargetSchema = z
  .union([z.enum(['_blank', '_self']), z.literal('')])
  .nullish()
  .transform(value => value || undefined)
const storyblokLinkSchema = z.object({
  linktype: optionalLinkTypeSchema,
  url: optionalStringSchema,
  cached_url: optionalStringSchema,
  anchor: optionalStringSchema,
  target: optionalTargetSchema,
  story: z
    .object({
      url: optionalStringSchema,
      full_slug: optionalStringSchema
    })
    .nullish()
    .transform(value => value ?? undefined)
})
const navigationLinkSchema = z
  .object({
    _uid: requiredTextSchema,
    component: z.literal('navLink'),
    label: requiredTextSchema,
    link: storyblokLinkSchema,
    featured: optionalBooleanSchema
  })
  .transform((item, context): NavigationLink => {
    const href = resolveStoryblokLink(item.link)
    if (!href) {
      context.addIssue({
        code: 'custom',
        path: ['link'],
        message: 'must resolve to a non-empty destination'
      })
      return z.NEVER
    }

    return {
      id: item._uid,
      type: 'link',
      label: item.label,
      href,
      target: item.link.target,
      featured: item.featured
    }
  })
const sectionLinksSchema = z.array(navigationLinkSchema).nullish()
const navigationSectionSchema = z
  .object({
    _uid: requiredTextSchema,
    component: z.literal('navSection'),
    label: requiredTextSchema,
    items: sectionLinksSchema,
    links: sectionLinksSchema
  })
  .transform((section, context): NavigationSection => {
    const items = section.items ?? section.links
    if (!items?.length) {
      context.addIssue({
        code: 'custom',
        path: ['items'],
        message: items
          ? 'must contain at least one navigation link'
          : 'required'
      })
      return z.NEVER
    }

    return {
      id: section._uid,
      type: 'section',
      label: section.label,
      items
    }
  })
const navigationItemSchema = z.discriminatedUnion(
  'component',
  [navigationLinkSchema, navigationSectionSchema],
  { error: 'must be "navLink" or "navSection"' }
)
const optionalContactLinkSchema = storyblokLinkSchema
  .nullish()
  .transform(link => {
    if (!link) return undefined
    const href = resolveStoryblokLink(link)
    return href ? { href, target: link.target } : undefined
  })
const siteSettingsSchema = z
  .object({
    headerItems: z
      .array(navigationItemSchema)
      .nullish()
      .transform(items => items ?? []),
    footerNavigationItems: z
      .array(navigationLinkSchema)
      .nullish()
      .transform(items => items ?? []),
    footerNavigationLabel: optionalTextSchema,
    footerContactLabel: optionalTextSchema,
    footerContactHeading: optionalTextSchema,
    footerContactLink: optionalContactLinkSchema
  })
  .transform((content): SiteSettings => ({
    header: { items: content.headerItems },
    footer: {
      navigation: {
        label: content.footerNavigationLabel,
        items: content.footerNavigationItems
      },
      contact: {
        label: content.footerContactLabel,
        heading: content.footerContactHeading,
        ...(content.footerContactLink && {
          link: content.footerContactLink
        })
      }
    }
  }))

export async function loadSiteSettings(
  catalog: StoryCatalog
): Promise<SiteSettings> {
  const story = await catalog.findStory('siteSettings', 'site')
  if (!story) {
    throw new SiteSettingsError(
      'missing-story',
      'Site Settings Story "settings/site" was not found'
    )
  }

  const result = siteSettingsSchema.safeParse(story.content)
  if (!result.success) throw invalid(formatSchemaError(result.error))
  return result.data
}

function formatSchemaError(error: z.ZodError): string {
  const issue = error.issues[0]
  const path = issue.path.reduce<string>((result, segment) => {
    if (typeof segment === 'number') return `${result}[${segment}]`
    return result ? `${result}.${String(segment)}` : String(segment)
  }, '')

  return path ? `${path} ${issue.message}` : issue.message
}

function invalid(detail: string): SiteSettingsError {
  return new SiteSettingsError(
    'invalid-content',
    `Invalid Site Settings Story: ${detail}`
  )
}
