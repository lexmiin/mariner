import type {
  BreadcrumbPlacement,
  NavbarTone,
  ResolvedBreadcrumbPlacement
} from '@/types'
import type { SbBlokData } from '@storyblok/astro'

export type PageBlok = SbBlokData & {
  body?: SbBlokData[]
  breadcrumbPlacement?: string
}

type LeadBlockCapabilities = {
  supportsBreadcrumbOverlay: boolean
  navbarTone: NavbarTone
}

const defaultLeadBlockCapabilities: LeadBlockCapabilities = {
  supportsBreadcrumbOverlay: false,
  navbarTone: 'default'
}

const leadBlockCapabilities: Record<string, LeadBlockCapabilities> = {
  hero: {
    supportsBreadcrumbOverlay: true,
    navbarTone: 'inverse'
  },
  videoHero: {
    supportsBreadcrumbOverlay: true,
    navbarTone: 'inverse'
  }
}

const breadcrumbPlacements = new Set<BreadcrumbPlacement>([
  'auto',
  'bar',
  'overlay',
  'hidden'
])

export function resolvePageChrome(blok: PageBlok): {
  breadcrumbPlacement: ResolvedBreadcrumbPlacement
  navbarOverlap: boolean
  initialNavbarTone: NavbarTone
} {
  const firstComponent = blok.body?.[0]?.component
  const leadBlock =
    typeof firstComponent === 'string'
      ? (leadBlockCapabilities[firstComponent] ?? defaultLeadBlockCapabilities)
      : defaultLeadBlockCapabilities
  const configuredPlacement = breadcrumbPlacements.has(
    blok.breadcrumbPlacement as BreadcrumbPlacement
  )
    ? (blok.breadcrumbPlacement as BreadcrumbPlacement)
    : 'auto'
  const breadcrumbPlacement =
    configuredPlacement === 'auto' || configuredPlacement === 'overlay'
      ? leadBlock.supportsBreadcrumbOverlay
        ? 'overlay'
        : 'bar'
      : configuredPlacement
  const navbarOverlap =
    breadcrumbPlacement === 'overlay' ||
    (breadcrumbPlacement === 'hidden' && leadBlock.supportsBreadcrumbOverlay)

  return {
    breadcrumbPlacement,
    navbarOverlap,
    initialNavbarTone: navbarOverlap ? leadBlock.navbarTone : 'default'
  }
}
