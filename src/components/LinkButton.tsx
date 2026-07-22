import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type LinkButtonProps = ComponentPropsWithoutRef<'a'>

export default function LinkButton({
  children,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={cn(
        'bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-ring inline-flex px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase transition-[color,background-color,scale] duration-[var(--motion-duration-press)] ease-[var(--motion-ease-out)] active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-4',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
