/**
 * Status Badge Utilities
 * Reusable badge components for different status types
 */

import { Badge } from "@/components/ui/badge"
import type { UsageStatus } from "@/lib/types/dashboard"

/**
 * Get appropriate badge component based on status
 */
export function getStatusBadge(status: UsageStatus) {
  switch (status) {
    case "active":
      return (
        <Badge
          variant="secondary"
          className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
        >
          Active
        </Badge>
      )
    case "warning":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
        >
          Warning
        </Badge>
      )
    case "exceeded":
      return (
        <Badge
          variant="secondary"
          className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
        >
          Exceeded
        </Badge>
      )
  }
}

/**
 * Status color mapping for charts and other visualizations
 */
export const statusColors = {
  active: "hsl(142, 71%, 45%)",
  warning: "hsl(38, 92%, 50%)",
  exceeded: "hsl(0, 84%, 60%)",
} as const
