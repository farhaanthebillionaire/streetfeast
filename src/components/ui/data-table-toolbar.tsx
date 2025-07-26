import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Search } from "lucide-react"

import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  filterOptions?: {
    label: string
    value: string
    options: { label: string; value: string }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  filterOptions = [],
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      {searchKey && (
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search...`}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-9 h-10 w-full sm:w-[300px]"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Filter Dropdowns */}
        {filterOptions.map((filter) => (
          <div key={filter.value} className="min-w-[150px]">
            <Select
              value={(
                table.getColumn(filter.value)?.getFilterValue() as string
              )?.toString()}
              onValueChange={(value) =>
                table.getColumn(filter.value)?.setFilterValue(value)
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={`Filter by ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-10">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
