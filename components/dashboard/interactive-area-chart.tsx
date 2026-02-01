"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Mock data generator
const generateMockData = (days: number) => {
  const data = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate realistic API call patterns with higher values
    const baseValue = 180000 + Math.random() * 80000
    const weekdayMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1.0
    const trendMultiplier = 1 + (i / days) * 0.3 // Upward trend
    const apiCalls = Math.floor(baseValue * weekdayMultiplier * trendMultiplier)
    const tokens = Math.floor(apiCalls * (250 + Math.random() * 100))

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      apiCalls,
      tokens: Math.floor(tokens / 1000), // Convert to thousands
    })
  }

  return data
}

const chartConfig = {
  apiCalls: {
    label: "API Calls",
    color: "hsl(217, 91%, 60%)", // Bright blue
  },
  tokens: {
    label: "Tokens (K)",
    color: "hsl(142, 76%, 56%)", // Bright green
  },
} satisfies ChartConfig

type TimeRange = "7days" | "30days" | "3months"

export function InteractiveAreaChart() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("7days")
  const [mounted, setMounted] = React.useState(false)

  // Fix hydration issue: generate data only on client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const data = React.useMemo(() => {
    if (!mounted) return [] // Return empty array on server

    switch (timeRange) {
      case "7days":
        return generateMockData(7)
      case "30days":
        return generateMockData(30)
      case "3months":
        return generateMockData(90)
      default:
        return generateMockData(7)
    }
  }, [timeRange, mounted])

  const total = React.useMemo(
    () => ({
      apiCalls: data.reduce((acc, curr) => acc + curr.apiCalls, 0),
      tokens: data.reduce((acc, curr) => acc + curr.tokens, 0),
    }),
    [data]
  )

  // Show loading state on server/initial render
  if (!mounted) {
    return (
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>API Usage Analytics</CardTitle>
            <CardDescription>
              Loading chart data...
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>API Usage Analytics</CardTitle>
          <CardDescription>
            Showing total API calls and token usage
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.apiCalls.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.apiCalls.toLocaleString()}
            </span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.tokens.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.tokens.toLocaleString()}K
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="mb-4 flex justify-end">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value) setTimeRange(value as TimeRange)
            }}
            className="border border-border rounded-lg p-0.5"
          >
            <ToggleGroupItem
              value="3months"
              aria-label="Last 3 months"
              className="h-7 px-3 text-xs rounded-md border border-transparent data-[state=on]:border-border data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem
              value="30days"
              aria-label="Last 30 days"
              className="h-7 px-3 text-xs rounded-md border border-transparent data-[state=on]:border-border data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem
              value="7days"
              aria-label="Last 7 days"
              className="h-7 px-3 text-xs rounded-md border border-transparent data-[state=on]:border-border data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="tokens"
              type="natural"
              fill="var(--color-tokens)"
              fillOpacity={0.4}
              stroke="var(--color-tokens)"
              stackId="a"
            />
            <Area
              dataKey="apiCalls"
              type="natural"
              fill="var(--color-apiCalls)"
              fillOpacity={0.4}
              stroke="var(--color-apiCalls)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
