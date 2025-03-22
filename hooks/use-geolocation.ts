"use client"

import { useState, useEffect } from "react"

interface Location {
  latitude: number
  longitude: number
  name?: string
}

export function useGeoLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Attempt to get location name using reverse geocoding
          // In a real app, you would use a geocoding service API
          // For this demo, we'll just use a placeholder
          const locationName = "Current Location"

          setLocation({
            latitude,
            longitude,
            name: locationName,
          })
        } catch (error) {
          // If reverse geocoding fails, still set the coordinates
          setLocation({
            latitude,
            longitude,
          })
        }

        setIsLoading(false)
      },
      (error) => {
        setError(`Error getting location: ${error.message}`)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  }, [])

  return { location, isLoading, error }
}

