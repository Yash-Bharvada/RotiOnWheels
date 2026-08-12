import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Check, X } from 'lucide-react'
import { useState, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Button({ className, variant='default', size='default', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'outline'|'ghost'|'secondary'; size?: 'default'|'sm'|'lg' }) {
  return <button className={cn('inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', variant === 'default' && 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md', variant === 'outline' && 'border border-border bg-background hover:bg-secondary', variant === 'ghost' && 'hover:bg-secondary', variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80', size === 'default' && 'h-11 px-5', size === 'sm' && 'h-9 px-4 text-xs', size === 'lg' && 'h-14 px-7 text-base', className)} {...props} />
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('rounded-2xl border bg-card text-card-foreground shadow-sm', className)} {...props} /> }
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} /> }
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h3 className={cn('text-xl font-semibold tracking-tight', className)} {...props} /> }
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p className={cn('text-sm text-muted-foreground', className)} {...props} /> }
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('p-6 pt-0', className)} {...props} /> }
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('flex items-center p-6 pt-0', className)} {...props} /> }

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn('flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} {...props} /> }
export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) { return <LabelPrimitive.Root className={cn('text-sm font-medium leading-none', className)} {...props} /> }
export function Badge({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', className)} {...props} /> }
export function Progress({ value, className }: { value: number; className?: string }) { return <div className={cn('h-2 w-full overflow-hidden rounded-full bg-secondary', className)}><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} /></div> }

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) { return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} /> }
export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) { return <RadioGroupPrimitive.Item className={cn('aspect-square h-4 w-4 rounded-full border border-primary text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} {...props}><RadioGroupPrimitive.Indicator className="flex items-center justify-center"><span className="h-2 w-2 rounded-full bg-primary" /></RadioGroupPrimitive.Indicator></RadioGroupPrimitive.Item> }

export function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) { return <DialogPrimitive.Root {...props} /> }
export function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) { return <DialogPrimitive.Trigger {...props} /> }
export function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) { return <DialogPrimitive.Portal {...props} /> }
export function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) { return <DialogPrimitive.Close {...props} /> }
export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & { children?: ReactNode }) { return <DialogPortal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" /><DialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 grid max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-background p-6 shadow-xl', className)} {...props}>{children}<DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 opacity-70 hover:bg-secondary"><X className="h-4 w-4" /></DialogPrimitive.Close></DialogPrimitive.Content></DialogPortal> }
export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} /> }
export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) { return <DialogPrimitive.Title className={cn('text-lg font-semibold', className)} {...props} /> }
export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) { return <DialogPrimitive.Description className={cn('text-sm text-muted-foreground', className)} {...props} /> }

export function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-base font-semibold transition-colors hover:text-primary"
      >
        <span>{title}</span>
        <span className={`transform transition-transform ${open ? 'rotate-180 text-primary' : 'text-muted-foreground'}`}>
          ↓
        </span>
      </button>
      {open && <div className="mt-3 text-sm leading-relaxed text-muted-foreground animate-fadeIn">{children}</div>}
    </div>
  )
}

export { Check }

