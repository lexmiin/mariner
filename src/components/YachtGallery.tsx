import { ChevronRight } from 'lucide-react'
import FullscreenImageViewer from './FullscreenImageViewer'
import type { Asset } from '@/types'

export default function YachtGallery({
  images,
  yachtName
}: {
  images: Asset[]
  yachtName: string
}) {
  return (
    <FullscreenImageViewer images={images} title={`${yachtName} gallery`}>
      {openImage => (
        <div className="mt-10 sm:mt-12">
          <div className="grid gap-1 sm:grid-cols-2">
            {images.slice(0, 3).map((image, index) => (
              <button
                aria-label={`Open image ${index + 1} of ${yachtName}`}
                className={`group bg-secondary relative overflow-hidden outline-none ${index === 0 ? 'aspect-16/10 sm:col-span-2' : 'aspect-4/3'}`}
                key={image.filename}
                onClick={() => openImage(index)}
                type="button"
              >
                <img
                  alt={image.alt || `${yachtName} gallery image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-out)] pointer-fine:group-hover:scale-[1.025] motion-reduce:group-hover:scale-100 motion-reduce:transition-none"
                  loading="lazy"
                  src={image.filename}
                />
                <span className="bg-overlay/0 group-hover:bg-overlay/10 absolute inset-0 transition-colors" />
              </button>
            ))}
          </div>
          <button
            className="font-cinzel text-accent decoration-primary hover:text-foreground focus-visible:outline-ring mx-auto mt-7 flex items-center gap-3 text-sm tracking-[0.08em] uppercase underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            onClick={() => openImage(0)}
            type="button"
          >
            Show more{' '}
            <ChevronRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </FullscreenImageViewer>
  )
}
