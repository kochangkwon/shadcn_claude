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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { GripVertical } from "lucide-react"

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
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                  />
                </TableHead>
                <TableHead className="w-[30px]"></TableHead>
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
                  className={`cursor-move transition-colors ${
                    selectedRows.has(item.id) ? 'bg-muted/30' : ''
                  } ${draggedItem?.id === item.id ? 'opacity-50' : ''} ${
                    dragOverId === item.id ? 'border-t-2 border-primary' : ''
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(item.id)}
                      onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                      aria-label={`Select ${item.type}`}
                    />
                  </TableCell>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">{item.type}</TableCell>
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
  )
}
