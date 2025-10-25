import * as React from "react"

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
      {...props}
    />
  )
}

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
      {...props}
    />
  )
}

// 🔹 CardContent
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => {
  return <div className={`text-gray-300 ${className}`} {...props} />
}
