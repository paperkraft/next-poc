"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Filter } from "lucide-react"
import { usePermissions } from "@/context/permission-context"

export function SearchWidget() {
  const { searchTerm, setSearchTerm, clearSearch, flattened, filterItemsBySearch } = usePermissions()

  const filteredCount = filterItemsBySearch(flattened, searchTerm).length

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search modules and groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {searchTerm && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>{filteredCount === 0 ? "No results found" : `Found ${filteredCount} modules`}</span>
              {filteredCount > 0 && (
                <Button variant="link" size="sm" onClick={clearSearch} className="h-auto p-0 text-blue-600">
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
