"use client"

import { motion } from "framer-motion"

interface EcoIllustrationProps {
  type?: "tree" | "plant" | "leaf" | "water" | "energy"
  size?: "sm" | "md" | "lg"
  className?: string
  animated?: boolean
}

export function EcoIllustration({ type = "tree", size = "md", className = "", animated = true }: EcoIllustrationProps) {
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const renderIllustration = () => {
    switch (type) {
      case "tree":
        return (
          <svg
            viewBox="0 0 100 100"
            className={`${sizeMap[size]} ${className}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M50 10C40 10 35 20 35 30C25 30 20 40 20 50C15 50 10 60 10 70C30 70 40 80 50 90C60 80 70 70 90 70C90 60 85 50 80 50C80 40 75 30 65 30C65 20 60 10 50 10Z"
              fill="#22c55e"
              initial={animated ? { scale: 0.8, opacity: 0.5 } : {}}
              animate={
                animated
                  ? {
                      scale: [0.8, 1, 0.9, 1],
                      opacity: [0.5, 0.8, 0.7, 0.8],
                    }
                  : {}
              }
              transition={
                animated
                  ? {
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }
                  : {}
              }
            />
            <motion.rect
              x="45"
              y="70"
              width="10"
              height="30"
              fill="#854d0e"
              initial={animated ? { y: 65, opacity: 0.5 } : {}}
              animate={
                animated
                  ? {
                      y: [65, 70, 68, 70],
                      opacity: [0.5, 1, 0.8, 1],
                    }
                  : {}
              }
              transition={
                animated
                  ? {
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: 0.5,
                    }
                  : {}
              }
            />
          </svg>
        )
      case "plant":
        return (
          <svg
            viewBox="0 0 100 100"
            className={`${sizeMap[size]} ${className}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M50 20C45 20 40 30 40 40C40 50 45 60 50 70"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="round"
              initial={animated ? { pathLength: 0 } : {}}
              animate={animated ? { pathLength: 1 } : {}}
              transition={
                animated
                  ? {
                      duration: 2,
                      ease: "easeInOut",
                    }
                  : {}
              }
            />
            <motion.path
              d="M50 20C55 20 60 30 60 40C60 50 55 60 50 70"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="round"
              initial={animated ? { pathLength: 0 } : {}}
              animate={animated ? { pathLength: 1 } : {}}
              transition={
                animated
                  ? {
                      duration: 2,
                      ease: "easeInOut",
                      delay: 0.5,
                    }
                  : {}
              }
            />
            <motion.path
              d="M50 70L50 90"
              stroke="#854d0e"
              strokeWidth="5"
              strokeLinecap="round"
              initial={animated ? { y: -5, opacity: 0 } : {}}
              animate={animated ? { y: 0, opacity: 1 } : {}}
              transition={
                animated
                  ? {
                      duration: 1,
                      ease: "easeInOut",
                      delay: 1.5,
                    }
                  : {}
              }
            />
            <motion.ellipse
              cx="30"
              cy="40"
              rx="10"
              ry="5"
              fill="#22c55e"
              initial={animated ? { scale: 0, opacity: 0 } : {}}
              animate={animated ? { scale: 1, opacity: 0.7 } : {}}
              transition={
                animated
                  ? {
                      duration: 1,
                      ease: "easeInOut",
                      delay: 2,
                    }
                  : {}
              }
            />
            <motion.ellipse
              cx="70"
              cy="50"
              rx="10"
              ry="5"
              fill="#22c55e"
              initial={animated ? { scale: 0, opacity: 0 } : {}}
              animate={animated ? { scale: 1, opacity: 0.7 } : {}}
              transition={
                animated
                  ? {
                      duration: 1,
                      ease: "easeInOut",
                      delay: 2.5,
                    }
                  : {}
              }
            />
          </svg>
        )
      case "leaf":
        return (
          <svg
            viewBox="0 0 100 100"
            className={`${sizeMap[size]} ${className}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M20 50C20 30 40 10 70 10C70 40 90 60 80 80C60 90 40 70 20 50Z"
              fill="#22c55e"
              initial={animated ? { scale: 0.8, rotate: -10 } : {}}
              animate={
                animated
                  ? {
                      scale: [0.8, 1, 0.9, 1],
                      rotate: [-10, 0, -5, 0],
                    }
                  : {}
              }
              transition={
                animated
                  ? {
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }
                  : {}
              }
            />
            <motion.path
              d="M20 50C30 60 50 70 80 80"
              stroke="#15803d"
              strokeWidth="2"
              initial={animated ? { pathLength: 0 } : {}}
              animate={animated ? { pathLength: 1 } : {}}
              transition={
                animated
                  ? {
                      duration: 3,
                      ease: "easeInOut",
                      delay: 0.5,
                    }
                  : {}
              }
            />
          </svg>
        )
      case "water":
        return (
          <svg
            viewBox="0 0 100 100"
            className={`${sizeMap[size]} ${className}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M50 10C40 30 20 50 20 70C20 85 35 90 50 90C65 90 80 85 80 70C80 50 60 30 50 10Z"
              fill="#0ea5e9"
              initial={animated ? { y: -5 } : {}}
              animate={animated ? { y: [0, -5, 0] } : {}}
              transition={
                animated
                  ? {
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }
                  : {}
              }
            />
            <motion.ellipse
              cx="35"
              cy="40"
              rx="5"
              ry="7"
              fill="#38bdf8"
              initial={animated ? { opacity: 0 } : {}}
              animate={animated ? { opacity: [0, 0.7, 0] } : {}}
              transition={
                animated
                  ? {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 1,
                    }
                  : {}
              }
            />
            <motion.ellipse
              cx="60"
              cy="60"
              rx="7"
              ry="5"
              fill="#38bdf8"
              initial={animated ? { opacity: 0 } : {}}
              animate={animated ? { opacity: [0, 0.7, 0] } : {}}
              transition={
                animated
                  ? {
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 0.5,
                    }
                  : {}
              }
            />
          </svg>
        )
      case "energy":
        return (
          <svg
            viewBox="0 0 100 100"
            className={`${sizeMap[size]} ${className}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              fill="#fbbf24"
              initial={animated ? { scale: 0.8 } : {}}
              animate={animated ? { scale: [0.8, 1, 0.9, 1] } : {}}
              transition={
                animated
                  ? {
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }
                  : {}
              }
            />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <motion.line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                stroke="#f59e0b"
                strokeWidth="2"
                initial={animated ? { opacity: 0.3, scale: 0.8 } : {}}
                animate={
                  animated
                    ? {
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1, 0.8],
                      }
                    : {}
                }
                transition={
                  animated
                    ? {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: i * 0.1,
                      }
                    : {}
                }
              />
            ))}
          </svg>
        )
      default:
        return null
    }
  }

  return renderIllustration()
}

