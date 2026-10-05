import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a feed-friendly relative time string
 * Examples: "2t", "i går", "3d", "2u"
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  
  const diffInMs = now.getTime() - then.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  
  // Less than 1 minute
  if (diffInMinutes < 1) {
    return "nå";
  }
  
  // Less than 1 hour - show minutes
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  
  // Less than 24 hours - show hours
  if (diffInHours < 24) {
    return `${diffInHours}t`;
  }
  
  // Yesterday
  if (diffInDays === 1) {
    return "i går";
  }
  
  // Less than 7 days - show days
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }
  
  // Less than 4 weeks - show weeks
  if (diffInWeeks < 4) {
    return `${diffInWeeks}u`;
  }
  
  // More than 4 weeks - show actual date
  return then.toLocaleDateString("no-NO", {
    day: "numeric",
    month: "short",
    year: then.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
