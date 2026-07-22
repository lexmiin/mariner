import { useForm, ValidationError } from '@formspree/react'
import {
  useEffect,
  useRef,
  type HTMLInputTypeAttribute,
  type ReactNode
} from 'react'
import { toast } from 'sonner'

export default function ContactForm() {
  const [state, handleSubmit] = useForm(import.meta.env.PUBLIC_FORM_ID)
  const form = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (!state.succeeded) return

    toast.success('Message has been sent!')
    form.current?.reset()
  }, [state.succeeded])

  return (
    <form ref={form} onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <div className="grid gap-7 sm:gap-8">
        <div className="grid gap-7 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="fullname">Full name</Label>
            <Input
              autoComplete="name"
              id="fullname"
              name="fullname"
              type="text"
            />
            <ValidationError
              className="text-destructive text-sm leading-5"
              prefix="Full name"
              field="fullname"
              errors={state.errors}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input autoComplete="email" id="email" name="email" type="email" />
            <ValidationError
              className="text-destructive text-sm leading-5"
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">How can we help?</Label>
          <textarea
            id="message"
            name="message"
            className="border-input bg-background text-foreground placeholder:text-muted-foreground/65 focus:border-primary focus-visible:outline-ring min-h-40 w-full resize-y border px-4 py-3 leading-6 transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2"
            placeholder="Tell us about your plans, preferred dates, or any questions."
            required
          />
          <ValidationError
            className="text-destructive text-sm leading-5"
            prefix="Message"
            field="message"
            errors={state.errors}
          />
        </div>

        <button
          type="submit"
          disabled={state.submitting}
          className="bg-primary text-primary-foreground hover:bg-accent focus-visible:outline-ring group flex min-h-12 w-full items-center justify-center gap-3 px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50 sm:w-fit sm:min-w-52"
        >
          {state.submitting ? 'Sending message' : 'Send message'}
          <span
            aria-hidden="true"
            className="text-base leading-none transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 motion-reduce:transition-none"
          >
            &rarr;
          </span>
        </button>
      </div>
    </form>
  )
}

function Label({
  htmlFor,
  children
}: {
  htmlFor: string
  children: ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-muted-foreground text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
    >
      {children}
    </label>
  )
}

function Input({
  type = 'text',
  ...props
}: {
  id: string
  name: string
  type: HTMLInputTypeAttribute
  autoComplete?: string
}) {
  return (
    <input
      {...props}
      type={type}
      required
      className="border-input bg-background text-foreground placeholder:text-muted-foreground/65 focus:border-primary focus-visible:outline-ring h-12 w-full border px-4 transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2"
    />
  )
}
