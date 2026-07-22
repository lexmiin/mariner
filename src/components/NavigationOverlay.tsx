import { Dialog } from '@base-ui/react/dialog'
import { useState } from 'react'
import type { NavigationItem, NavigationLink } from '@/types'

interface Props {
  items: NavigationItem[]
  currentPath: string
}

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61555472023366'
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/_m_a_r_i_n_e_r_/'
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@marinerworldwide'
  }
] as const

function getPathname(href: string) {
  return href.startsWith('http')
    ? ''
    : new URL(href, 'https://marinerworldwide.com').pathname
}

function isActiveLink(link: NavigationLink, currentPath: string) {
  return getPathname(link.href) === currentPath
}

export default function NavigationOverlay({ items, currentPath }: Props) {
  const [open, setOpen] = useState(false)
  const links = items.filter(
    (item): item is NavigationLink => item.type === 'link'
  )
  const sections = items.filter(item => item.type === 'section')

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="group inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium tracking-[0.16em] text-current uppercase opacity-80 transition-[opacity,scale] duration-[var(--motion-duration-press)] ease-[var(--motion-ease-out)] hover:opacity-100 active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
        <span
          className="relative grid h-5 w-6 place-items-center"
          aria-hidden="true"
        >
          <span className="absolute h-px w-6 -translate-y-1 bg-current transition-transform duration-200 group-data-[popup-open]:translate-y-0 group-data-[popup-open]:rotate-45 motion-reduce:transition-none" />
          <span className="absolute h-px w-6 bg-current transition-opacity duration-150 group-data-[popup-open]:opacity-0 motion-reduce:transition-none" />
          <span className="absolute h-px w-6 translate-y-1 bg-current transition-transform duration-200 group-data-[popup-open]:translate-y-0 group-data-[popup-open]:-rotate-45 motion-reduce:transition-none" />
        </span>
        <span className="hidden lg:inline">Menu</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-9998 bg-slate-950/10 opacity-100 backdrop-blur-sm transition-opacity duration-300 ease-[var(--motion-ease-out)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Viewport className="fixed inset-0 z-9999 overflow-y-auto">
          <Dialog.Popup className="flex min-h-full flex-col bg-linear-to-br from-white via-slate-50 to-cyan-50/80 text-slate-900 opacity-100 transition-[opacity,translate] duration-300 ease-[var(--motion-ease-out)] data-[starting-style]:-translate-y-3 data-[starting-style]:opacity-0 data-[ending-style]:-translate-y-3 data-[ending-style]:opacity-0 motion-reduce:transition-none">
            <Dialog.Title className="sr-only">Site navigation</Dialog.Title>

            <div className="grid min-h-20 grid-cols-[1fr_auto_1fr] items-center border-b border-slate-900/10 px-5 sm:px-8 lg:px-12">
              <Dialog.Close className="inline-flex min-h-11 cursor-pointer items-center gap-3 justify-self-start text-sm font-medium tracking-[0.16em] uppercase opacity-70 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900">
                <span
                  className="relative grid h-5 w-6 place-items-center"
                  aria-hidden="true"
                >
                  <span className="absolute h-px w-6 rotate-45 bg-current" />
                  <span className="absolute h-px w-6 -rotate-45 bg-current" />
                </span>
                <span className="hidden lg:inline">Close</span>
              </Dialog.Close>

              <a
                href="/"
                className="font-cinzel justify-self-center text-sm font-semibold tracking-[0.12em]"
                onClick={() => setOpen(false)}
              >
                MARINERWORLDWIDE
              </a>
              <div aria-hidden="true" />
            </div>

            <nav
              aria-label="Site navigation"
              className="mx-auto w-full max-w-6xl flex-1 px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-24"
            >
              {links.length > 0 && (
                <div className="border-b border-slate-900/10 pb-12 sm:pb-14">
                  <ul className="flex flex-wrap gap-x-7 gap-y-4 sm:gap-x-10">
                    {links.map(link => (
                      <li key={link.id}>
                        <a
                          href={link.href}
                          target={link.target}
                          rel={
                            link.target === '_blank' ? 'noreferrer' : undefined
                          }
                          aria-current={
                            isActiveLink(link, currentPath) ? 'page' : undefined
                          }
                          className="text-base font-medium tracking-[0.08em] uppercase opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 aria-[current=page]:opacity-100"
                          onClick={() => setOpen(false)}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sections.length > 0 && (
                <div className="grid gap-x-12 gap-y-12 pt-12 sm:grid-cols-2 sm:pt-14 lg:grid-cols-3 lg:gap-y-16">
                  {sections.map(section => (
                    <section key={section.id}>
                      <h2 className="text-xs font-semibold tracking-[0.18em] text-cyan-800 uppercase">
                        {section.label}
                      </h2>
                      <ul className="mt-5 space-y-3">
                        {section.items.map(link => (
                          <li key={link.id}>
                            <a
                              href={link.href}
                              target={link.target}
                              rel={
                                link.target === '_blank'
                                  ? 'noreferrer'
                                  : undefined
                              }
                              aria-current={
                                isActiveLink(link, currentPath)
                                  ? 'page'
                                  : undefined
                              }
                              className="text-xl font-medium tracking-tight text-slate-800 transition-colors hover:text-cyan-800 focus-visible:text-cyan-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 aria-[current=page]:text-cyan-800 sm:text-2xl"
                              onClick={() => setOpen(false)}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </nav>

            <footer className="mx-auto mt-auto flex w-full max-w-6xl flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-900/10 px-5 py-7 sm:px-8 lg:px-12">
              <span className="text-xs font-semibold tracking-[0.18em] text-cyan-800 uppercase">
                Follow us
              </span>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {socialLinks.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium tracking-[0.08em] uppercase opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
