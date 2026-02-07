/**
 * Dashboard Types
 * Centralized type definitions for dashboard components
 */

export type UsageStatus = "active" | "warning" | "exceeded"

export interface UsageData {
  id: string
  type: string
  status: UsageStatus
  target: string
  limit: string
  reviewer: string
}

export interface ChartDataPoint {
  date: string
  usage: number
}
