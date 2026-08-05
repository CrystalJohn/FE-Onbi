"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col",
        month: "w-full",
        month_caption:
          "flex h-9 justify-center items-center relative mx-0",
        caption_label: "text-sm font-medium",
        dropdowns: "flex items-center gap-2",
        dropdown: "bg-transparent outline-hidden",
        nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "absolute left-0 top-0 size-8",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "absolute right-0 top-0 size-8",
        ),
        month_grid: "mt-4 w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 rounded-md",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 rounded-md p-0 font-normal aria-selected:opacity-100",
        ),
        selected:
          "bg-primary text-primary-foreground rounded-md",
        today: "bg-accent text-accent-foreground rounded-md",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...props }) => {
          const Icon =
            orientation === "left" ? ChevronLeft : ChevronRight
          return (
            <Icon
              className={cn("size-4", className)}
              {...props}
            />
          )
        },
        // Custom Dropdown: native <select> → base-ui Select (project convention)
        Dropdown: ({ options, value, onChange }) => {
          if (!options?.length) return <></>;
          return (
            <Select
              value={String(value)}
              onValueChange={(v) => {
                if (onChange && v !== null) {
                  onChange({
                    target: { value: String(v) },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
              }}
            >
              <SelectTrigger className="first:grow">
                <SelectValue>
                  {options.find((o) => String(o.value) === String(value))?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start">
                {options.map((option) => (
                  <SelectItem
                    disabled={option.disabled}
                    key={option.value}
                    value={String(option.value)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
        DropdownNav: ({ children, ...rest }) => (
          <div className="flex w-full items-center gap-2" {...rest}>
            {children}
          </div>
        ),
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
