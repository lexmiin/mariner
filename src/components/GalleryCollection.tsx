import type { GalleryItem } from '@/types'
import FullscreenImageViewer from './FullscreenImageViewer'
import GalleryCarousel from './GalleryCarousel'

type GalleryLayout = 'editorialGrid' | 'mosaic' | 'carousel'

export type InteractiveGalleryItem = GalleryItem & {
  editable?: {
    'data-blok-c'?: string
    'data-blok-uid'?: string
  }
}

type Props = {
  items: InteractiveGalleryItem[]
  label: string
  layout: GalleryLayout
}

export default function GalleryCollection({ items, label, layout }: Props) {
  const images = items.map(item => ({
    ...item.image,
    alt: item.altText || item.image.alt || ''
  }))

  return (
    <FullscreenImageViewer images={images} title={label}>
      {openImage =>
        layout === 'carousel' ? (
          <GalleryCarousel
            items={items}
            label={label}
            onImageClick={openImage}
          />
        ) : layout === 'mosaic' ? (
          <div className="gallery-mosaic grid gap-1 sm:grid-cols-2 md:auto-rows-52 md:grid-cols-12 lg:auto-rows-64">
            {items.map((item, index) => (
              <figure
                className="group bg-inverse relative min-h-72 overflow-hidden md:min-h-0"
                key={item._uid}
                {...item.editable}
              >
                <button
                  aria-label={`Open image ${index + 1} in fullscreen`}
                  className="h-full w-full outline-none"
                  onClick={() => openImage(index)}
                  type="button"
                >
                  <img
                    alt={item.altText || item.image.alt || ''}
                    className="h-full w-full object-cover transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] pointer-fine:group-hover:scale-[1.025] motion-reduce:group-hover:scale-100 motion-reduce:transition-none"
                    decoding="async"
                    loading="lazy"
                    src={item.image.filename}
                  />
                  {item.caption && (
                    <div className="from-overlay/75 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
                  )}
                </button>
                {item.caption && (
                  <figcaption className="text-inverse-foreground pointer-events-none absolute inset-x-0 bottom-0 p-4 text-xs leading-5 tracking-[0.04em] sm:p-5">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <div className="gallery-editorial grid gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-6 md:gap-y-8">
            {items.map((item, index) => (
              <figure
                className="gallery-editorial-item min-w-0"
                key={item._uid}
                {...item.editable}
              >
                <button
                  aria-label={`Open image ${index + 1} in fullscreen`}
                  className="bg-muted focus-visible:outline-ring block aspect-4/3 w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4"
                  onClick={() => openImage(index)}
                  type="button"
                >
                  <img
                    alt={item.altText || item.image.alt || ''}
                    className="h-full w-full object-cover"
                    decoding="async"
                    loading="lazy"
                    src={item.image.filename}
                  />
                </button>
                {item.caption && (
                  <figcaption className="text-muted-foreground mt-3 max-w-xl text-xs leading-5 tracking-[0.04em]">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )
      }
    </FullscreenImageViewer>
  )
}
