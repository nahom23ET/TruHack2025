"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedGradientProps {
  className?: string
  children?: React.ReactNode
  colors?: string[]
  speed?: number
  interactive?: boolean
}

export function AnimatedGradient({
  className = "",
  children,
  colors = ["#22c55e", "#16a34a", "#15803d"],
  speed = 3,
  interactive = false,
}: AnimatedGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!interactive || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const element = containerRef.current
    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseenter", () => setIsHovered(true))
    element.addEventListener("mouseleave", () => setIsHovered(false))

    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseenter", () => setIsHovered(true))
      element.removeEventListener("mouseleave", () => setIsHovered(false))
    }
  }, [interactive])

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{
        backgroundPosition: interactive && isHovered ? `${mousePosition.x}px ${mousePosition.y}px` : "100% 50%",
      }}
      transition={{
        duration: interactive && isHovered ? 0 : speed,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "linear",
      }}
      style={{
        background: `linear-gradient(45deg, ${colors.join(", ")})`,
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </motion.div>
  )
}

