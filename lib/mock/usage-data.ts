/**
 * Mock Data for API Usage
 * Separated from UI components for better maintainability
 */

import type { UsageData, ChartDataPoint } from "@/lib/types/dashboard"

/**
 * Initial mock data for API usage table
 */
export const initialUsageData: UsageData[] = [
  {
    id: "1",
    type: "GPT-4 Turbo",
    status: "active",
    target: "850K/1M",
    limit: "1,000,000",
    reviewer: "John Smith",
  },
  {
    id: "2",
    type: "Claude 3 Opus",
    status: "active",
    target: "620K/1M",
    limit: "1,000,000",
    reviewer: "Sarah Johnson",
  },
  {
    id: "3",
    type: "Gemini Pro",
    status: "warning",
    target: "890K/1M",
    limit: "1,000,000",
    reviewer: "Mike Chen",
  },
  {
    id: "4",
    type: "Text Embeddings",
    status: "active",
    target: "340K/500K",
    limit: "500,000",
    reviewer: "Emily Davis",
  },
  {
    id: "5",
    type: "GPT-3.5 Turbo",
    status: "exceeded",
    target: "1.05M/1M",
    limit: "1,000,000",
    reviewer: "Alex Kim",
  },
  {
    id: "6",
    type: "Whisper API",
    status: "active",
    target: "125K/250K",
    limit: "250,000",
    reviewer: "Lisa Park",
  },
  {
    id: "7",
    type: "DALL-E 3",
    status: "warning",
    target: "45K/50K",
    limit: "50,000",
    reviewer: "Tom Wilson",
  },
  {
    id: "8",
    type: "Custom Fine-tuned Model",
    status: "active",
    target: "78K/200K",
    limit: "200,000",
    reviewer: "Rachel Green",
  },
]

/**
 * Generate mock chart data for detail view
 * Creates 7 days of usage data with random variations
 */
export function generateDetailChartData(): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const baseValue = 20000 + Math.random() * 10000
    const usage = Math.floor(baseValue)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      usage,
    })
  }

  return data
}
