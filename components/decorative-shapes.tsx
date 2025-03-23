"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface DecorativeShapesProps {
  variant?: "circles" | "squares" | "triangles" | "mixed"
  count?: number
  className?: string
  colors?: string[]
}

export function DecorativeShapes({
  variant = "circles",
  count = 5,
  className = "",
  colors = ["#22c55e", "#16a34a", "#15803d", "#4ade80"],
}: DecorativeShapesProps) {
  // Use useMemo to generate shapes only when dependencies actually change
  const shapes = useMemo(() => {
    const newShapes = []
    const getShapeType = (variant: string) => {
      switch (variant) {
        case "circles":
          return "circle"
        case "squares":
          return "square"
        case "triangles":
          return "triangle"
        default:
          return "circle"
      }
    }

    const types = variant === "mixed" ? ["circle", "square", "triangle"] : [getShapeType(variant)]

    for (let i = 0; i < count; i++) {
      newShapes.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 10 + Math.random() * 30,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 15 + Math.random() * 20,
      })
    }

    return newShapes
  }, [variant, count, colors]) // Only regenerate shapes when these props change

  const renderShape = (shape: any) => {
    switch (shape.type) {
      case "circle":
        return (
          <motion.div
            key={shape.id}
            className="absolute rounded-full"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
              opacity: 0.2,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0.8, 1],
              opacity: [0, 0.2, 0.15, 0.2],
              x: [0, -20, 20, 0],
              y: [0, 20, -20, 0],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: shape.delay,
            }}
          />
        )
      case "square":
        return (
          <motion.div
            key={shape.id}
            className="absolute rounded-md"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
              opacity: 0.2,
            }}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{
              scale: [0, 1, 0.8, 1],
              opacity: [0, 0.2, 0.15, 0.2],
              rotate: [0, 90, 180, 270, 360],
              x: [0, 20, -20, 0],
              y: [0, -20, 20, 0],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: shape.delay,
            }}
          />
        )
      case "triangle":
        return (
          <motion.div
            key={shape.id}
            className="absolute clip-path-triangle"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
              opacity: 0.2,
            }}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{
              scale: [0, 1, 0.8, 1],
              opacity: [0, 0.2, 0.15, 0.2],
              rotate: [0, 120, 240, 360],
              x: [0, -20, 20, 0],
              y: [0, 20, -20, 0],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: shape.delay,
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>{shapes.map(renderShape)}</div>
  )
}

