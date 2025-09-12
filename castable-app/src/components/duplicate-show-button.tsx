'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DuplicateShowButtonProps {
  showId: string
  showTitle: string
}

export function DuplicateShowButton({ showId, showTitle }: DuplicateShowButtonProps) {
  const [isDuplicating, setIsDuplicating] = useState(false)
  const router = useRouter()

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    
    try {
      const response = await fetch('/api/shows', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: showId }),
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate show')
      }

      const data = await response.json()
      
      // Refresh the page to show the new duplicated show
      router.refresh()
      
      // Optional: Show a success message
      console.log('Show duplicated successfully:', data.message)
    } catch (error) {
      console.error('Error duplicating show:', error)
      // Optional: Show an error message to the user
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDuplicate}
      disabled={isDuplicating}
      title={`Duplicate "${showTitle}"`}
    >
      {isDuplicating ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <Copy className="h-4 w-4 mr-1" />
      )}
      Duplicate
    </Button>
  )
}


