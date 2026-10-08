import * as React from 'react'
/* eslint-disable react-refresh/only-export-components --
   `buttonVariants` is part of this primitive's public API; callers style links
   with it, so it belongs beside the component. */
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl2 border border-transparent text-[13.5px] font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-150 hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-45 disabled:hover:translate-y-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand-solid text-white shadow-[0_6px_20px_-10px_rgba(255,45,45,.9)] hover:bg-[#e63a3a]',
        ghost: 'border-white/15 bg-white/[0.045] text-ink hover:border-white/25 hover:bg-white/[0.09]',
        quiet: 'border-white/15 text-ink-muted hover:border-white/25 hover:text-ink',
        bare: 'text-ink-muted hover:text-ink',
      },
      size: {
        sm: 'px-3 py-2',
        md: 'px-4 py-2.5',
        lg: 'rounded-xl3 px-5 py-3 text-[15px]',
        icon: 'px-3 py-2.5',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. an <a>) while keeping button styling. */
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
