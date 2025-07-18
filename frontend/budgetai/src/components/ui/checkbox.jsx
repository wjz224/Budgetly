import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(
  ({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "h-5 w-5 shrink-0 rounded-sm border border-gray-400 bg-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white flex items-center justify-center",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="text-current">
        <CheckIcon className="w-3.5 h-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
