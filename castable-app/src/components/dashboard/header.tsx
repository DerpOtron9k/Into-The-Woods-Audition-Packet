'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Search } from 'lucide-react'

export function DashboardHeader() {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              placeholder="Search shows, characters, or applicants..."
              type="search"
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />
          <div className="flex items-center gap-x-2">
            <Badge variant="outline" className="hidden sm:inline-flex">
              Free Plan
            </Badge>
            <span className="text-sm text-muted-foreground hidden sm:block">
              1 of 1 shows • 0 of 25 applicants
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

