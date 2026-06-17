import * as React from "react"
import { cn } from "../lib/utils"

const SelectContext = React.createContext({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
})

const Select = ({ value, defaultValue, onValueChange, children }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const [open, setOpen] = React.useState(false)
  const controlled = value !== undefined
  const currentValue = controlled ? value : internalValue

  const handleChange = (newValue) => {
    if (!controlled) setInternalValue(newValue)
    if (onValueChange) onValueChange(newValue)
    setOpen(false)
  }

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext)
  return (
    <button
      ref={ref}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <span className="ml-2 opacity-50">▾</span>
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(SelectContext)
  if (!open) return null
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "top-full mt-1",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext)
  return (
    <div
      ref={ref}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        ctx.value === value && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
