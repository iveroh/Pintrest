import * as React from "react";
import ImageListPrimitive from '@mui/material/ImageList';
import ImageListItemPrimitive from '@mui/material/ImageListItem';

import { cn } from "@/lib/utils"

function ImageList({
  className,
  ...props
}: React.ComponentProps<typeof ImageListPrimitive>) {
  return (
    <ImageListPrimitive
      data-slot="image-list"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

function ImageListItem({
  className,
  ...props
}: React.ComponentProps<typeof ImageListItemPrimitive>) {
  return (
    <ImageListItemPrimitive
      data-slot="image-list-item"
      className={cn("overflow-hidden rounded-xl", className)}
      {...props}
    />
  )
}


export {ImageList, ImageListItem}