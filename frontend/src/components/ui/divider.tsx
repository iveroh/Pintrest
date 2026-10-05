import * as React from "react";
import DividerPrimitive from '@mui/material/Divider';
import { cn } from "@/lib/utils"

function Divider({
  className,
  ...props
}: React.ComponentProps<typeof DividerPrimitive>) {
  return (
    <DividerPrimitive
      data-slot="divider"
      className={cn("bg-border", className)}
      {...props}
    />
  )
}

export { Divider }