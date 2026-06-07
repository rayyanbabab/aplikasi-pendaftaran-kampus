import { Loader2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps extends React.ComponentProps<'svg'> {
  size?: 'sm' | 'md' | 'lg' | string
}

function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
  }

  const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || 'size-6'

  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('animate-spin text-muted-foreground', sizeClass, className)}
      {...props}
    />
  )
}

export { Spinner }
