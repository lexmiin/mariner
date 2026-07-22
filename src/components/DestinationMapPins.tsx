import { Popover } from '@base-ui/react/popover'
import type {
  DestinationMapPosition,
  DestinationSummary
} from '@/lib/destination-summary'
import { MapPin } from 'lucide-react'
import { useState } from 'react'
import LinkButton from './LinkButton'

export type PositionedDestinationSummary = DestinationSummary & {
  mapPosition: DestinationMapPosition
}

export default function DestinationMapPins({
  destinations
}: {
  destinations: PositionedDestinationSummary[]
}) {
  return (
    <div className="absolute inset-0">
      {destinations.map(destination => (
        <DestinationPin key={destination.href} destination={destination} />
      ))}
    </div>
  )
}

function DestinationPin({
  destination
}: {
  destination: PositionedDestinationSummary
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={`text-primary focus-visible:ring-primary-foreground focus-visible:ring-offset-primary absolute z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-full place-items-center drop-shadow-md transition-transform duration-[var(--motion-duration-press)] ease-[var(--motion-ease-out)] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          open
            ? 'scale-110 motion-reduce:scale-100'
            : 'pointer-fine:hover:scale-110 focus-visible:scale-110 motion-reduce:focus-visible:scale-100'
        }`}
        style={{
          left: `${destination.mapPosition.x}%`,
          top: `${destination.mapPosition.y}%`
        }}
        aria-label={`Show information about ${destination.name}`}
      >
        <MapPin
          size={36}
          strokeWidth={1.75}
          fill="currentColor"
          color="white"
          aria-hidden="true"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="top"
          align="center"
          sideOffset={20}
          className="z-30"
        >
          <Popover.Popup className="bg-popover text-popover-foreground shadow-popover w-[min(24rem,calc(100vw-3rem))] origin-[var(--transform-origin)] overflow-hidden text-center transition-[scale,opacity] duration-[var(--motion-duration-popover)] ease-[var(--motion-ease-out)] outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 motion-reduce:scale-100 motion-reduce:transition-opacity">
            <div className="relative aspect-video">
              <img
                src={destination.image.src}
                alt=""
                className="h-full w-full object-cover"
              />
              <Popover.Close
                className="text-inverse-foreground focus-visible:outline-ring absolute top-3 right-4 grid size-8 place-items-center text-2xl font-light transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label={`Close ${destination.name} information`}
              >
                ×
              </Popover.Close>
            </div>
            <div className="px-6 py-8">
              <Popover.Title className="font-cinzel text-foreground text-2xl tracking-[0.06em]">
                {destination.name}
              </Popover.Title>
              {destination.description && (
                <Popover.Description className="text-muted-foreground mx-auto mt-4 max-w-md text-base leading-6">
                  {destination.description}
                </Popover.Description>
              )}
              <LinkButton href={destination.href} className="mt-6">
                Find out more
              </LinkButton>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
