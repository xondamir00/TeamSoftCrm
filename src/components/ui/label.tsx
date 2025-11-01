import * as React from "react"
<<<<<<< HEAD
import { cn } from "@/lib/utils"

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  children?: React.ReactNode
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}
      </label>
    )
  }
)

Label.displayName = "Label"

=======
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

>>>>>>> 8e0034b0f601be5b26bbf6ef0f2803ad6acc3cad
export { Label }
