import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { InteractiveGalleryItem } from './GalleryCollection'

type Props = {
  items: InteractiveGalleryItem[]
  label: string
  onImageClick: (index: number) => void
}

export default function GalleryCarousel({ items, label, onImageClick }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps'
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrevious, setCanScrollPrevious] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateControls = useCallback(() => {
    if (!emblaApi) return

    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrevious(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    updateControls()
    emblaApi.on('select', updateControls)
    emblaApi.on('reInit', updateControls)

    return () => {
      emblaApi.off('select', updateControls)
      emblaApi.off('reInit', updateControls)
    }
  }, [emblaApi, updateControls])

  return (
    <div aria-label={label} aria-roledescription="carousel" role="region">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 sm:gap-4">
          {items.map((item, index) => (
            <figure
              aria-label={`${index + 1} of ${items.length}`}
              aria-roledescription="slide"
              className="min-w-0 flex-[0_0_88%] sm:flex-[0_0_72%] lg:flex-[0_0_62%]"
              key={item._uid}
              role="group"
              {...item.editable}
            >
              <button
                aria-label={`Open image ${index + 1} in fullscreen`}
                className="bg-muted block aspect-16/10 w-full overflow-hidden outline-none"
                onClick={() => onImageClick(index)}
                type="button"
              >
                <img
                  alt={item.altText || item.image.alt || ''}
                  className="h-full w-full object-cover transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] pointer-fine:hover:scale-[1.025] motion-reduce:hover:scale-100 motion-reduce:transition-none"
                  decoding="async"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  src={item.image.filename}
                />
              </button>
              {item.caption && (
                <figcaption className="text-muted-foreground mt-3 text-xs leading-5 tracking-[0.04em]">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex items-center gap-3">
          <button
            aria-label="Previous image"
            className="border-border text-foreground hover:bg-secondary focus-visible:outline-ring inline-flex size-11 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!canScrollPrevious}
            onClick={() => emblaApi?.scrollPrev()}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
          <button
            aria-label="Next image"
            className="border-border text-foreground hover:bg-secondary focus-visible:outline-ring inline-flex size-11 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!canScrollNext}
            onClick={() => emblaApi?.scrollNext()}
            type="button"
          >
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
          <p className="text-muted-foreground ml-2 text-xs tracking-[0.16em] uppercase tabular-nums">
            <span className="text-foreground">{selectedIndex + 1}</span>
            <span aria-hidden="true"> / </span>
            <span className="sr-only"> of </span>
            {items.length}
          </p>
        </div>
      )}
    </div>
  )
}
