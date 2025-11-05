'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function Select({ value, defaultValue, onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '')
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  
  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
    setOpen(false)
  }

  return (
    <SelectContext.Provider value={{ 
      value: currentValue, 
      onValueChange: handleValueChange,
      open,
      setOpen,
      triggerRef
    }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  const context = React.useContext(SelectContext)

  if (!context) {
    throw new Error('SelectTrigger must be used within Select')
  }

  const { open, setOpen, triggerRef } = context

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        // Verificar se o clique não foi no content também
        const content = document.querySelector('[data-select-content]')
        if (content && !content.contains(event.target as Node)) {
          setOpen(false)
        }
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, setOpen, triggerRef])

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0090DB]',
        className
      )}
      {...props}
    >
      {children}
      <svg
        className={cn('h-4 w-4 opacity-50 transition-transform', open && 'rotate-180')}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = React.useContext(SelectContext)
  const [label, setLabel] = React.useState<string>('')

  React.useEffect(() => {
    if (!context) return
    // Buscar o label do item selecionado
    const items = document.querySelectorAll('[data-select-value]')
    items.forEach((item) => {
      if ((item as HTMLElement).dataset.selectValue === context.value) {
        setLabel((item as HTMLElement).textContent || '')
      }
    })
  }, [context?.value])

  return <span>{label || placeholder || 'Selecione...'}</span>
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export function SelectContent({ children, className }: SelectContentProps) {
  const context = React.useContext(SelectContext)

  if (!context) {
    throw new Error('SelectContent must be used within Select')
  }

  const { open, triggerRef } = context

  if (!open) return null

  return (
    <div
      data-select-content
      className={cn(
        'absolute z-50 mt-1 w-full min-w-[8rem] max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg',
        className
      )}
      style={{
        top: triggerRef.current 
          ? `${triggerRef.current.offsetHeight + 4}px` 
          : '100%',
        width: triggerRef.current 
          ? `${triggerRef.current.offsetWidth}px` 
          : '100%'
      }}
    >
      {children}
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const context = React.useContext(SelectContext)

  if (!context) {
    throw new Error('SelectItem must be used within Select')
  }

  const { value: currentValue, onValueChange } = context

  const handleClick = () => {
    onValueChange(value)
  }

  return (
    <div
      data-select-value={value}
      onClick={handleClick}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100',
        currentValue === value && 'bg-brand-50 text-[#0090DB]',
        className
      )}
    >
      {children}
    </div>
  )
}
