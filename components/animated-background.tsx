"use client"

import { useEffect, useRef } from "react"

interface AnimatedBackgroundProps {
  variant?: "leaves" | "bubbles" | "particles"
  intensity?: "low" | "medium" | "high"
  className?: string
}

export function AnimatedBackground({
  variant = "leaves",
  intensity = "medium",
  className = "",
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Determine number of elements based on intensity
    let count = 20
    switch (intensity) {
      case "low":
        count = 10
        break
      case "medium":
        count = 20
        break
      case "high":
        count = 40
        break
    }

    // Create elements based on variant
    const elements: any[] = []

    if (variant === "leaves") {
      for (let i = 0; i < count; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 5 + Math.random() * 15,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 0.5 - 0.25,
          color: `rgba(34, 197, 94, ${0.1 + Math.random() * 0.2})`,
          type: Math.floor(Math.random() * 3), // 0: oval, 1: pointed, 2: round
        })
      }
    } else if (variant === "bubbles") {
      for (let i = 0; i < count; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 5 + Math.random() * 20,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: -0.1 - Math.random() * 0.5,
          color: `rgba(34, 197, 94, ${0.1 + Math.random() * 0.1})`,
        })
      }
    } else if (variant === "particles") {
      for (let i = 0; i < count * 2; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 1 + Math.random() * 3,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: `rgba(34, 197, 94, ${0.2 + Math.random() * 0.3})`,
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      elements.forEach((el) => {
        if (variant === "leaves") {
          ctx.save()
          ctx.translate(el.x, el.y)
          ctx.rotate((el.rotation * Math.PI) / 180)
          ctx.fillStyle = el.color

          // Draw different leaf shapes
          if (el.type === 0) {
            // Oval leaf
            ctx.beginPath()
            ctx.ellipse(0, 0, el.size, el.size / 2, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.beginPath()
            ctx.moveTo(0, -el.size / 2)
            ctx.lineTo(0, el.size / 2)
            ctx.strokeStyle = el.color
            ctx.lineWidth = 1
            ctx.stroke()
          } else if (el.type === 1) {
            // Pointed leaf
            ctx.beginPath()
            ctx.moveTo(0, -el.size)
            ctx.bezierCurveTo(el.size / 2, -el.size / 2, el.size / 2, el.size / 2, 0, el.size)
            ctx.bezierCurveTo(-el.size / 2, el.size / 2, -el.size / 2, -el.size / 2, 0, -el.size)
            ctx.fill()
          } else {
            // Round leaf
            ctx.beginPath()
            ctx.arc(0, 0, el.size / 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.beginPath()
            ctx.moveTo(-el.size / 2, 0)
            ctx.lineTo(el.size / 2, 0)
            ctx.strokeStyle = el.color
            ctx.lineWidth = 1
            ctx.stroke()
          }

          ctx.restore()

          // Update position and rotation
          el.x += el.speedX
          el.y += el.speedY
          el.rotation += el.rotationSpeed

          // Wrap around screen
          if (el.x < -el.size) el.x = canvas.width + el.size
          if (el.x > canvas.width + el.size) el.x = -el.size
          if (el.y < -el.size) el.y = canvas.height + el.size
          if (el.y > canvas.height + el.size) el.y = -el.size
        } else if (variant === "bubbles") {
          ctx.beginPath()
          ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2)
          ctx.fillStyle = el.color
          ctx.fill()

          // Update position
          el.x += el.speedX
          el.y += el.speedY

          // Reset when off screen
          if (el.y < -el.radius * 2) {
            el.y = canvas.height + el.radius
            el.x = Math.random() * canvas.width
          }
          if (el.x < -el.radius) el.x = canvas.width + el.radius
          if (el.x > canvas.width + el.radius) el.x = -el.radius
        } else if (variant === "particles") {
          ctx.beginPath()
          ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2)
          ctx.fillStyle = el.color
          ctx.fill()

          // Update position
          el.x += el.speedX
          el.y += el.speedY

          // Wrap around screen
          if (el.x < -el.radius) el.x = canvas.width + el.radius
          if (el.x > canvas.width + el.radius) el.x = -el.radius
          if (el.y < -el.radius) el.y = canvas.height + el.radius
          if (el.y > canvas.height + el.radius) el.y = -el.radius
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [variant, intensity])

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} />
}

