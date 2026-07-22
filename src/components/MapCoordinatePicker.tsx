import { MapPin } from 'lucide-react'
import { useState, type MouseEvent } from 'react'

type Coordinates = {
  x: number
  y: number
}

const formatCoordinates = ({ x, y }: Coordinates) =>
  `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`

export default function MapCoordinatePicker() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [copyStatus, setCopyStatus] = useState('')

  const selectCoordinates = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.min(
      100,
      Math.max(0, ((event.clientX - rect.left) / rect.width) * 100)
    )
    const y = Math.min(
      100,
      Math.max(0, ((event.clientY - rect.top) / rect.height) * 100)
    )

    setCoordinates({ x, y })
    setCopyStatus('')
  }

  const copyCoordinate = async (axis: keyof Coordinates) => {
    if (!coordinates) return

    const value = coordinates[axis].toFixed(2)

    try {
      await navigator.clipboard.writeText(value)
      setCopyStatus(`Copied ${axis.toUpperCase()} to clipboard.`)
    } catch {
      setCopyStatus(`Copy ${axis.toUpperCase()} manually: ${value}`)
    }
  }

  return (
    <main className="bg-secondary/70 text-foreground min-h-screen px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="border-border flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
              Publisher tool
            </p>
            <h1 className="font-cinzel mt-3 text-3xl tracking-[0.04em] sm:text-4xl">
              Map coordinate picker
            </h1>
            <p
              id="coordinate-picker-instructions"
              className="text-muted-foreground mt-3 max-w-2xl text-base leading-6"
            >
              Click an exact location on the map, then copy the values into the
              destination&apos;s
              <code className="bg-secondary text-foreground mx-1 rounded px-1.5 py-0.5 text-sm">
                x
              </code>
              and
              <code className="bg-secondary text-foreground mx-1 rounded px-1.5 py-0.5 text-sm">
                y
              </code>
              CMS fields. Values are percentages of the full map image.
            </p>
          </div>

          <div className="border-border bg-card shadow-card min-w-64 rounded-lg border px-5 py-4">
            {coordinates ? (
              <>
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
                  Selected coordinates
                </p>
                <p className="text-card-foreground mt-2 font-mono text-lg">
                  {formatCoordinates(coordinates)}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  x {coordinates.x.toFixed(2)}% · y {coordinates.y.toFixed(2)}%
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => copyCoordinate('x')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-ring rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Copy X
                  </button>
                  <button
                    type="button"
                    onClick={() => copyCoordinate('y')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-ring rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Copy Y
                  </button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-base leading-7">
                Select a location on the map to get coordinates.
              </p>
            )}
            <p
              className="text-muted-foreground mt-3 text-xs"
              aria-live="polite"
            >
              {copyStatus}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="bg-card shadow-card focus-visible:ring-ring/50 relative mt-10 block w-full cursor-crosshair overflow-hidden rounded-lg outline-none focus-visible:ring-4"
          onClick={selectCoordinates}
          aria-describedby="coordinate-picker-instructions"
          aria-label="Select a location on the destination map"
        >
          <img
            src="/images/map.webp"
            alt="World map used to select a destination location"
            className="pointer-events-none block h-auto w-full select-none"
            draggable="false"
          />
          {coordinates && (
            <span
              className="text-primary pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full drop-shadow-md"
              style={{ left: `${coordinates.x}%`, top: `${coordinates.y}%` }}
              aria-hidden="true"
            >
              <MapPin
                size={40}
                strokeWidth={1.75}
                fill="currentColor"
                color="white"
              />
            </span>
          )}
        </button>
      </div>
    </main>
  )
}
