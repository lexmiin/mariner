import { describe, expect, it } from 'vitest'
import { resolvePageChrome, type PageBlok } from './page-chrome'

type ExpectedPageChrome = ReturnType<typeof resolvePageChrome>

describe('Page Chrome', () => {
  it.each([
    ['auto', 'hero', 'overlay', true, 'inverse'],
    ['auto', 'pageIntro', 'bar', false, 'default'],
    ['auto', undefined, 'bar', false, 'default'],
    ['bar', 'hero', 'bar', false, 'default'],
    ['bar', 'pageIntro', 'bar', false, 'default'],
    ['bar', undefined, 'bar', false, 'default'],
    ['overlay', 'hero', 'overlay', true, 'inverse'],
    ['overlay', 'pageIntro', 'bar', false, 'default'],
    ['overlay', undefined, 'bar', false, 'default'],
    ['hidden', 'hero', 'hidden', true, 'inverse'],
    ['hidden', 'pageIntro', 'hidden', false, 'default'],
    ['hidden', undefined, 'hidden', false, 'default']
  ] satisfies Array<
    [
      placement: string,
      firstComponent: string | undefined,
      breadcrumbPlacement: ExpectedPageChrome['breadcrumbPlacement'],
      navbarOverlap: boolean,
      initialNavbarTone: ExpectedPageChrome['initialNavbarTone']
    ]
  >)(
    'resolves %s breadcrumbs with a %s lead block',
    (
      placement,
      firstComponent,
      breadcrumbPlacement,
      navbarOverlap,
      initialNavbarTone
    ) => {
      expect(resolvePageChrome(pageBlok(placement, firstComponent))).toEqual({
        breadcrumbPlacement,
        navbarOverlap,
        initialNavbarTone
      })
    }
  )

  it('treats an invalid placement as auto', () => {
    expect(resolvePageChrome(pageBlok('sideways', 'videoHero'))).toEqual({
      breadcrumbPlacement: 'overlay',
      navbarOverlap: true,
      initialNavbarTone: 'inverse'
    })
  })
})

function pageBlok(
  breadcrumbPlacement: string,
  firstComponent?: string
): PageBlok {
  return {
    _uid: 'page',
    component: 'page',
    breadcrumbPlacement,
    body: firstComponent ? [{ _uid: 'lead', component: firstComponent }] : []
  }
}
