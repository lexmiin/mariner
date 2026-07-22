import { describe, expect, it } from 'vitest'
import { createStoryCatalog } from './story-content/catalog'
import { createMemoryStorySource } from './story-content/memory-adapter'
import { loadSiteSettings } from './site-settings'

describe('Site Settings', () => {
  it('loads and projects header and footer data for the site shell', async () => {
    const settings = await loadSiteSettings(
      catalog({
        headerItems: [
          {
            _uid: 'nav-home',
            component: 'navLink',
            label: ' Home ',
            featured: true,
            link: {
              linktype: 'story',
              cached_url: 'landing/',
              anchor: 'fleet'
            }
          },
          {
            _uid: 'nav-destinations',
            component: 'navSection',
            label: ' Destinations ',
            items: [
              {
                _uid: 'nav-croatia',
                component: 'navLink',
                label: ' Croatia ',
                link: {
                  linktype: 'story',
                  cached_url: 'destinations/croatia/',
                  target: '_blank'
                }
              }
            ]
          }
        ],
        footerNavigationLabel: ' Explore ',
        footerNavigationItems: [
          {
            _uid: 'footer-about',
            component: 'navLink',
            label: ' About ',
            link: { linktype: 'story', cached_url: 'about/' }
          }
        ],
        footerContactLabel: ' Enquiries ',
        footerContactHeading: ' Start planning your voyage ',
        footerContactLink: {
          linktype: 'story',
          cached_url: 'contact-us/'
        }
      })
    )

    expect(settings).toEqual({
      header: {
        items: [
          {
            id: 'nav-home',
            type: 'link',
            label: 'Home',
            href: '/#fleet',
            target: undefined,
            featured: true
          },
          {
            id: 'nav-destinations',
            type: 'section',
            label: 'Destinations',
            items: [
              {
                id: 'nav-croatia',
                type: 'link',
                label: 'Croatia',
                href: '/destinations/croatia',
                target: '_blank',
                featured: false
              }
            ]
          }
        ]
      },
      footer: {
        navigation: {
          label: 'Explore',
          items: [
            {
              id: 'footer-about',
              type: 'link',
              label: 'About',
              href: '/about',
              target: undefined,
              featured: false
            }
          ]
        },
        contact: {
          label: 'Enquiries',
          heading: 'Start planning your voyage',
          link: { href: '/contact-us', target: undefined }
        }
      }
    })
  })

  it('keeps optional settings absent with explicit empty defaults', async () => {
    await expect(loadSiteSettings(catalog({}))).resolves.toEqual({
      header: { items: [] },
      footer: {
        navigation: { label: '', items: [] },
        contact: { label: '', heading: '' }
      }
    })
  })

  it('supports the legacy links field for navigation sections', async () => {
    const settings = await loadSiteSettings(
      catalog({
        headerItems: [
          {
            _uid: 'nav-section',
            component: 'navSection',
            label: 'Company',
            links: [
              {
                _uid: 'nav-about',
                component: 'navLink',
                label: 'About',
                link: { linktype: 'story', cached_url: 'about/' }
              }
            ]
          }
        ]
      })
    )

    expect(settings.header.items[0]).toMatchObject({
      type: 'section',
      items: [{ href: '/about' }]
    })
  })

  it('fails precisely when the Site Settings Story is missing', async () => {
    const emptyCatalog = createStoryCatalog(
      createMemoryStorySource([]),
      'published'
    )

    await expect(loadSiteSettings(emptyCatalog)).rejects.toMatchObject({
      name: 'SiteSettingsError',
      code: 'missing-story',
      message: 'Site Settings Story "settings/site" was not found'
    })
  })

  it.each([
    ['headerItems', 'not-an-array'],
    ['footerNavigationItems', {}],
    ['footerContactHeading', 42]
  ])('rejects a malformed %s field', async (field, value) => {
    await expect(
      loadSiteSettings(catalog({ [field]: value }))
    ).rejects.toMatchObject({
      name: 'SiteSettingsError',
      code: 'invalid-content',
      message: expect.stringContaining(field)
    })
  })

  it('rejects malformed navigation instead of silently dropping it', async () => {
    await expect(
      loadSiteSettings(
        catalog({
          headerItems: [
            {
              _uid: 'nav-action',
              component: 'button',
              label: 'Book now'
            }
          ]
        })
      )
    ).rejects.toMatchObject({
      name: 'SiteSettingsError',
      code: 'invalid-content',
      message:
        'Invalid Site Settings Story: headerItems[0].component must be "navLink" or "navSection"'
    })
  })

  it('rejects a configured navigation link without a destination', async () => {
    await expect(
      loadSiteSettings(
        catalog({
          footerNavigationItems: [
            {
              _uid: 'footer-about',
              component: 'navLink',
              label: 'About',
              link: {}
            }
          ]
        })
      )
    ).rejects.toMatchObject({
      name: 'SiteSettingsError',
      code: 'invalid-content',
      message:
        'Invalid Site Settings Story: footerNavigationItems[0].link must resolve to a non-empty destination'
    })
  })
})

function catalog(content: Record<string, unknown>) {
  return createStoryCatalog(
    createMemoryStorySource([
      {
        uuid: 'uuid-site',
        name: 'Site',
        slug: 'site',
        full_slug: 'settings/site',
        content: {
          _uid: 'blok-site',
          component: 'siteSettings',
          ...content
        }
      }
    ]),
    'published'
  )
}
