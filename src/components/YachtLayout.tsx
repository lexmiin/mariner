import FullscreenImageViewer from './FullscreenImageViewer'
import type { Asset } from '@/types'

export default function YachtLayout({
  images,
  yachtName
}: {
  images: Asset[]
  yachtName: string
}) {
  return (
    <FullscreenImageViewer images={images} title={`${yachtName} layout`}>
      {openImage => (
        <div className="grid grid-cols-2 gap-2 pb-8 lg:grid-cols-4">
          {images.map((image, index) => (
            <button
              aria-label={`Open layout image ${index + 1} of ${yachtName}`}
              className="group bg-card focus-visible:outline-ring min-w-0 p-1 focus-visible:outline-2 focus-visible:outline-offset-2"
              key={image.filename}
              onClick={() => openImage(index)}
              type="button"
            >
              <img
                alt={image.alt || `${yachtName} layout ${index + 1}`}
                className="aspect-[4/3] w-full object-contain transition-opacity group-hover:opacity-75"
                loading="lazy"
                src={image.filename}
              />
            </button>
          ))}
        </div>
      )}
    </FullscreenImageViewer>
  )
}
