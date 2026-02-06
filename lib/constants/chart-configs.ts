/**
 * Chart Configurations
 * Centralized chart config for consistency across dashboard
 */

import type { ChartConfig } from "@/components/ui/chart"

/**
 * Chart configuration for API usage detail view
 */
export const detailChartConfig = {
  usage: {
    label: "API Calls",
    color: "hsl(217, 91%, 60%)",
  },
} satisfies ChartConfig
