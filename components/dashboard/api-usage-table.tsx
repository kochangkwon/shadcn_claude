"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { GripVertical, TrendingUp, TrendingDown } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type UsageStatus = "active" | "warning" | "exceeded"

interface UsageData {
  id: string
  type: string
  status: UsageStatus
  target: string
  limit: string
  reviewer: string
}

const initialData: UsageData[] = [
  {
    id: "1",
    type: "GPT-4 Turbo",
    status: "active",
    target: "850K/1M",
    limit: "1,000,000",
    reviewer: "John Smith"
  },
  {
    id: "2",
    type: "Claude 3 Opus",
    status: "active",
    target: "620K/1M",
    limit: "1,000,000",
    reviewer: "Sarah Johnson"
  },
  {
    id: "3",
    type: "Gemini Pro",
    status: "warning",
    target: "890K/1M",
    limit: "1,000,000",
    reviewer: "Mike Chen"
  },
  {
    id: "4",
    type: "Text Embeddings",
    status: "active",
    target: "340K/500K",
    limit: "500,000",
    reviewer: "Emily Davis"
  },
  {
    id: "5",
    type: "GPT-3.5 Turbo",
    status: "exceeded",
    target: "1.05M/1M",
    limit: "1,000,000",
    reviewer: "Alex Kim"
  },
  {
    id: "6",
    type: "Whisper API",
    status: "active",
    target: "125K/250K",
    limit: "250,000",
    reviewer: "Lisa Park"
  },
  {
    id: "7",
    type: "DALL-E 3",
    status: "warning",
    target: "45K/50K",
    limit: "50,000",
    reviewer: "Tom Wilson"
  },
  {
    id: "8",
    type: "Custom Fine-tuned Model",
    status: "active",
    target: "78K/200K",
    limit: "200,000",
    reviewer: "Rachel Green"
  }
]

// Generate chart data for detail view
const generateDetailChartData = () => {
  const data = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const baseValue = 20000 + Math.random() * 10000
    const usage = Math.floor(baseValue)

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      usage,
    })
  }

  return data
}

const detailChartConfig = {
  usage: {
    label: "API Calls",
    color: "hsl(217, 91%, 60%)",
  },
} satisfies ChartConfig

const getStatusBadge = (status: UsageStatus) => {
  switch (status) {
    case "active":
      return <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
    case "warning":
      return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Warning</Badge>
    case "exceeded":
      return <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Exceeded</Badge>
  }
}

export function ApiUsageTable() {
  const [data, setData] = React.useState(initialData)
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [draggedItem, setDraggedItem] = React.useState<UsageData | null>(null)
  const [dragOverId, setDragOverId] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<UsageData | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // Memoize chart data generation to prevent flickering on every render
  const detailChartData = React.useMemo(() => {
    if (!selectedItem) return []
    return generateDetailChartData()
  }, [selectedItem?.id])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map(item => item.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const handleDragStart = (e: React.DragEvent, item: UsageData) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = "move"
    // Add a custom drag image or data
    e.dataTransfer.setData("text/html", item.id)
  }

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverId(itemId)
  }

  const handleDragLeave = () => {
    setDragOverId(null)
  }

  const handleDrop = (e: React.DragEvent, targetItem: UsageData) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDragOverId(null)
      return
    }

    const newData = [...data]
    const draggedIndex = newData.findIndex(item => item.id === draggedItem.id)
    const targetIndex = newData.findIndex(item => item.id === targetItem.id)

    // Remove dragged item
    newData.splice(draggedIndex, 1)
    // Insert at target position
    newData.splice(targetIndex, 0, draggedItem)

    setData(newData)
    setDraggedItem(null)
    setDragOverId(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverId(null)
  }

  const allSelected = data.length > 0 && selectedRows.size === data.length
  const someSelected = selectedRows.size > 0 && selectedRows.size < data.length

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>API Usage Overview</CardTitle>
          <CardDescription>
            Current usage across all services and models
            {selectedRows.size > 0 && ` (${selectedRows.size} selected)`}
          </CardDescription>
        </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[30px]"></TableHead>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                  />
                </TableHead>
                <TableHead className="w-[200px] text-center">Type</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Target</TableHead>
                <TableHead className="text-center">Limit</TableHead>
                <TableHead className="text-center">Reviewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, item)}
                  onDragEnd={handleDragEnd}
                  className={`transition-colors ${
                    selectedRows.has(item.id) ? 'bg-muted/30' : ''
                  } ${draggedItem?.id === item.id ? 'opacity-50' : ''} ${
                    dragOverId === item.id ? 'border-t-2 border-primary' : ''
                  }`}
                >
                  <TableCell className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(item.id)}
                      onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                      aria-label={`Select ${item.type}`}
                    />
                  </TableCell>
                  <TableCell
                    className="font-medium cursor-pointer hover:text-primary hover:underline"
                    onClick={() => {
                      setSelectedItem(item)
                      setIsSheetOpen(true)
                    }}
                  >
                    {item.type}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="font-mono text-sm">{item.target}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{item.limit}</TableCell>
                  <TableCell className="text-right">{item.reviewer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto" showCloseButton={false}>
        {selectedItem && (
          <div className="space-y-6 px-6 py-6">
            {/* Title */}
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{selectedItem.type}</h2>
              <p className="text-sm text-muted-foreground">
                Showing total API calls for the last 6 months
              </p>
            </div>

            {/* Chart */}
            <div className="rounded-lg border bg-card p-4">
              <ChartContainer
                config={detailChartConfig}
                className="h-[200px] w-full"
              >
                <AreaChart
                  data={detailChartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    style={{ fontSize: '12px' }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    dataKey="usage"
                    type="natural"
                    fill="var(--color-usage)"
                    fillOpacity={0.4}
                    stroke="var(--color-usage)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Trending {selectedItem.status === "exceeded" ? "down" : "up"} by{" "}
                {selectedItem.status === "exceeded" ? "-2.3" : "5.2"}% this month
              </span>
              {selectedItem.status === "exceeded" ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              Showing total API calls for the last 6 months. This API model is currently being
              monitored for usage patterns and performance metrics. The usage statistics help you
              understand consumption patterns and plan capacity accordingly.
            </p>

            <Separator />

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-2">
                <Label htmlFor="header" className="text-sm font-medium">
                  Header
                </Label>
                <Input
                  id="header"
                  value={selectedItem.type}
                  readOnly
                  className="bg-muted/50"
                />
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Type
                  </Label>
                  <Select defaultValue={selectedItem.type}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={selectedItem.type}>{selectedItem.type}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select defaultValue={selectedItem.status}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="exceeded">Exceeded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Target and Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target" className="text-sm font-medium">
                    Target
                  </Label>
                  <Input
                    id="target"
                    value={selectedItem.target.split('/')[0]}
                    readOnly
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit" className="text-sm font-medium">
                    Limit
                  </Label>
                  <Input
                    id="limit"
                    value={selectedItem.limit}
                    readOnly
                    className="bg-muted/50"
                  />
                </div>
              </div>

              {/* Reviewer */}
              <div className="space-y-2">
                <Label htmlFor="reviewer" className="text-sm font-medium">
                  Reviewer
                </Label>
                <Select defaultValue={selectedItem.reviewer}>
                  <SelectTrigger id="reviewer" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={selectedItem.reviewer}>{selectedItem.reviewer}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full">
                Submit
              </Button>
              <Button variant="outline" className="w-full">
                Do
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
    </>
  )
}
