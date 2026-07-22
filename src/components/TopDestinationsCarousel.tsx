import type { DestinationSummary } from '@/lib/destination-summary'
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

type Props = {
  destinations: DestinationSummary[]
}

export default function TopDestinationsCarousel({ destinations }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps'
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div
      className="overflow-hidden"
      ref={emblaRef}
      aria-label="Featured destinations"
    >
      <div className="flex gap-3 lg:gap-4">
        {destinations.map(destination => (
          <article
            className="bg-inverse min-w-0 flex-[0_0_100%] overflow-hidden lg:flex-[0_0_42%]"
            key={destination.href}
          >
            <a className="group relative block" href={destination.href}>
              <img
                alt={destination.image.alt}
                className="h-112 w-full object-cover transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] pointer-fine:group-hover:scale-105 motion-reduce:group-hover:scale-100 sm:h-132"
                src={destination.image.src}
              />
              <div className="from-overlay/80 via-overlay/10 absolute inset-0 bg-linear-to-t to-transparent" />
              <div className="text-inverse-foreground absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <h3 className="font-cinzel text-2xl tracking-[0.08em] sm:text-3xl">
                  {destination.name}
                </h3>
                {destination.description && (
                  <p className="text-inverse-foreground/85 mt-3 max-w-xs text-base leading-7">
                    {destination.description}
                  </p>
                )}
              </div>
            </a>
          </article>
        ))}
      </div>

      <div
        className="mt-6 flex items-center gap-2"
        aria-label="Carousel navigation"
      >
        {scrollSnaps.map((_, index) => (
          <button
            aria-label={`Show destination ${index + 1}`}
            aria-current={selectedIndex === index ? 'true' : undefined}
            className="focus-visible:before:outline-ring group relative h-px w-8 before:absolute before:-inset-x-3 before:-inset-y-5 before:content-[''] hover:cursor-pointer focus-visible:before:outline-2 focus-visible:before:outline-offset-2"
            key={index}
            onClick={() => scrollTo(index)}
            type="button"
          >
            <span
              aria-hidden="true"
              className={`block h-px w-full origin-left transition-[scale,background-color] duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-in-out)] motion-reduce:transition-colors ${
                selectedIndex === index
                  ? 'bg-foreground scale-x-100'
                  : 'bg-border scale-x-50 pointer-fine:group-hover:bg-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
