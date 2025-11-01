import * as React from "react"

<<<<<<< HEAD
// 🔹 CardProps interfeysi
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

// 🔹 Card asosiy komponenti
export const Card: React.FC<CardProps> = ({ className = "", ...props }) => {
  return (
    <div
      className={`rounded-xl border border-gray-800 bg-gray-900 shadow-lg p-5 ${className}`}
=======
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
>>>>>>> 8e0034b0f601be5b26bbf6ef0f2803ad6acc3cad
      {...props}
    />
  )
}

<<<<<<< HEAD
// 🔹 CardHeader
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => {
  return <div className={`mb-4 ${className}`} {...props} />
}

// 🔹 CardTitle
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <h2
      className={`text-lg font-semibold text-white tracking-tight ${className}`}
=======
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
>>>>>>> 8e0034b0f601be5b26bbf6ef0f2803ad6acc3cad
      {...props}
    />
  )
}

<<<<<<< HEAD
// 🔹 CardContent
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => {
  return <div className={`text-gray-300 ${className}`} {...props} />
=======
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
>>>>>>> 8e0034b0f601be5b26bbf6ef0f2803ad6acc3cad
}
