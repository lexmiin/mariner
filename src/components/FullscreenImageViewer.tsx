import { Dialog } from '@base-ui/react/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import type { Asset } from '@/types'

interface Props {
  children: (openImage: (index: number) => void) => ReactNode
  images: Asset[]
  title: string
}

export default function FullscreenImageViewer({
  children,
  images,
  title
}: Props) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%')

  const openImage = (index: number) => {
    setActiveIndex(index)
    setZoomed(false)
    setOpen(true)
  }

  const showPrevious = () => {
    setZoomed(false)
    setActiveIndex(index => (index - 1 + images.length) % images.length)
  }

  const showNext = () => {
    setZoomed(false)
    setActiveIndex(index => (index + 1) % images.length)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) setZoomed(false)
  }

  const handleImageClick = (event: MouseEvent<HTMLImageElement>) => {
    if (zoomed) return setZoomed(false)

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    setZoomOrigin(`${x}% ${y}%`)
    setZoomed(true)
  }

  if (images.length === 0) return null
  const activeImage = images[activeIndex]

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {children(openImage)}
      <Dialog.Portal>
        <Dialog.Backdrop className="bg-overlay fixed inset-0 z-50 min-h-dvh transition-opacity duration-300 ease-[var(--motion-ease-out)] data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup
          className="bg-overlay text-inverse-foreground fixed inset-0 z-50 flex min-h-dvh flex-col transition-opacity duration-300 ease-[var(--motion-ease-out)] outline-none data-ending-style:opacity-0 data-starting-style:opacity-0"
          onClick={event => {
            const target = event.target as HTMLElement
            if (!target.closest('[data-viewer-interactive]')) {
              handleOpenChange(false)
            }
          }}
          onKeyDownCapture={event => {
            if (images.length < 2) return
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              showPrevious()
            }
            if (event.key === 'ArrowRight') {
              event.preventDefault()
              showNext()
            }
          }}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Description className="sr-only">
            Fullscreen image viewer. Use the arrow buttons or keyboard arrow
            keys to move between images.
          </Dialog.Description>
          <div className="relative z-20 flex h-16 shrink-0 items-center justify-between px-5 sm:px-7">
            <p className="text-inverse-foreground/70 text-xs font-semibold tracking-[0.14em] tabular-nums">
              {activeIndex + 1} / {images.length}
            </p>
            <Dialog.Close
              className="text-inverse-foreground/80 hover:bg-inverse-foreground/10 hover:text-inverse-foreground focus-visible:outline-ring grid size-11 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              data-viewer-interactive
            >
              <span className="sr-only">Close viewer</span>
              <X aria-hidden="true" size={25} strokeWidth={1.5} />
            </Dialog.Close>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 pb-5 sm:px-20 sm:pb-8">
            <img
              alt={activeImage.alt || `${title} image ${activeIndex + 1}`}
              className={`relative z-10 max-h-full max-w-full object-contain transition-transform duration-[var(--motion-duration-ui)] ease-[var(--motion-ease-in-out)] select-none motion-reduce:transition-none ${zoomed ? 'scale-[2.5] cursor-zoom-out' : 'cursor-zoom-in'}`}
              data-viewer-interactive
              draggable={false}
              onClick={handleImageClick}
              src={activeImage.filename}
              style={{ transformOrigin: zoomOrigin }}
            />
            {images.length > 1 && (
              <>
                <ViewerButton
                  label="Previous image"
                  position="left"
                  onClick={showPrevious}
                />
                <ViewerButton
                  label="Next image"
                  position="right"
                  onClick={showNext}
                />
              </>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function ViewerButton({
  label,
  onClick,
  position
}: {
  label: string
  onClick: () => void
  position: 'left' | 'right'
}) {
  const Icon = position === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      aria-label={label}
      className={`bg-overlay/50 text-inverse-foreground/80 hover:bg-inverse-foreground/10 hover:text-inverse-foreground focus-visible:outline-ring absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${position === 'left' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'}`}
      data-viewer-interactive
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" size={27} strokeWidth={1.5} />
    </button>
  )
}
