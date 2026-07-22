import { Popover } from '@base-ui/react/popover'
import { WhatsApp } from '@/components/icons/WhatsApp'

type WhatsAppWidgetProps = {
  phoneNumber?: string
  initialMessage?: string
}

export default function WhatsAppWidget({
  phoneNumber = '',
  initialMessage = "Hello, I'd like to plan a yacht charter with Mariner Worldwide."
}: WhatsAppWidgetProps) {
  const normalizedPhoneNumber = phoneNumber.replace(/\D/g, '')
  const whatsappUrl = normalizedPhoneNumber
    ? `https://wa.me/${normalizedPhoneNumber}?text=${encodeURIComponent(initialMessage)}`
    : undefined

  return (
    <Popover.Root modal>
      <Popover.Trigger
        aria-label="Toggle WhatsApp chat preview"
        className="fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 grid size-15 cursor-pointer place-items-center rounded-full border-0 bg-[#25d366] shadow-[0_.75rem_2rem_rgb(15_23_42/24%)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan-300 max-sm:right-[max(.75rem,env(safe-area-inset-right))] max-sm:bottom-[max(.75rem,env(safe-area-inset-bottom))]"
      >
        <span
          aria-hidden="true"
          className="absolute -inset-1.5 animate-ping rounded-full border border-[#25d366]/45 motion-reduce:animate-none"
        />
        <span
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-full p-1"
        >
          <WhatsApp className="storke-white size-full bg-[#25d366] text-white" />
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          side="top"
          align="end"
          sideOffset={14}
          collisionPadding={12}
          className="z-50"
        >
          <Popover.Popup className="w-[min(25rem,calc(100vw-2rem))] origin-(--transform-origin) scale-100 overflow-hidden rounded-[1.25rem] bg-white opacity-100 shadow-[0_1.5rem_4rem_rgb(15_23_42/24%)] transition-[scale,opacity] duration-200 ease-[cubic-bezier(.23,1,.32,1)] outline-none data-ending-style:scale-[.96] data-ending-style:opacity-0 data-starting-style:scale-[.96] data-starting-style:opacity-0 motion-reduce:scale-100 motion-reduce:transition-opacity max-sm:w-[calc(100vw-1.5rem)]">
            <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 bg-linear-to-br from-[#064e46] to-[#075e54] p-4.5 text-white">
              <span
                aria-hidden="true"
                className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/10"
              >
                <img
                  src="/images/logo-dark.png"
                  alt=""
                  className="size-7 object-contain"
                />
              </span>

              <span className="grid min-w-0 gap-0.5">
                <Popover.Title className="font-cinzel overflow-hidden text-sm font-bold tracking-[0.06em] text-ellipsis whitespace-nowrap uppercase">
                  Mariner Worldwide
                </Popover.Title>
                <Popover.Description className="m-0 text-xs text-white/75">
                  Usually replies within a few minutes
                </Popover.Description>
              </span>

              <Popover.Close
                aria-label="Close WhatsApp chat preview"
                className="grid size-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan-300"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5 fill-none stroke-current stroke-[1.5] [stroke-linecap:round]"
                >
                  <path d="M5 5l14 14M19 5 5 19" />
                </svg>
              </Popover.Close>
            </header>

            <div className="relative grid min-h-64 gap-3.5 overflow-hidden bg-[#eee9df] p-4.5 max-sm:min-h-56">
              <div
                aria-hidden="true"
                className="absolute -right-8 -bottom-14 w-52 rotate-12 text-[#075e54]/6"
              >
                <svg
                  viewBox="0 0 160 160"
                  className="fill-none stroke-current stroke-4"
                >
                  <path d="M80 18v124M18 80h124M36 36l88 88M124 36l-88 88" />
                  <circle cx="80" cy="80" r="48" />
                  <circle cx="80" cy="80" r="12" />
                </svg>
              </div>

              <p className="relative z-10 m-0 w-fit max-w-[88%] rounded-[.25rem_1rem_1rem] bg-white px-4 py-3.5 text-[.95rem] leading-6 text-slate-600 shadow-[0_.35rem_1rem_rgb(15_23_42/8%)]">
                Welcome aboard. Tell us where you would like to go, and we’ll
                help shape the voyage.
              </p>
              <p className="relative z-10 m-0 w-fit max-w-[88%] self-end justify-self-end rounded-[1rem_.25rem_1rem_1rem] bg-[#d9fdd3] px-4 py-3.5 text-[.95rem] leading-6 text-slate-600 shadow-[0_.35rem_1rem_rgb(15_23_42/8%)]">
                I’d like to plan a yacht charter.
              </p>
            </div>

            <footer className="p-4.5">
              <a
                className="flex min-h-12.5 w-full appearance-none items-center justify-center gap-2.5 rounded-full border-0 bg-[#25d366] px-4 py-3 text-sm leading-tight font-bold tracking-[0.015em] text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  aria-hidden="true"
                  className="grid size-6 shrink-0 place-items-center rounded-full p-0.5"
                >
                  <WhatsApp className="size-full bg-[#25d366] text-white" />
                </span>
                Continue in WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </footer>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
