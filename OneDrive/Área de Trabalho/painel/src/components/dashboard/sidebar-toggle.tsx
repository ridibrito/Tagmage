"use client"

import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="text-gray-600 hover:text-gray-900"
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  )
}


