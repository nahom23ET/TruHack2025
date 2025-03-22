"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useEcoStore } from "@/lib/store"

export function Globe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { impactStats } = useEcoStore()

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 200

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(100, 64, 64)

    // Earth texture
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load("/placeholder.svg?height=1024&width=2048")
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpScale: 0.5,
    })

    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(earth)

    // Add atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(102, 64, 64)
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x0077ff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Add impact markers based on stats
    const addImpactMarkers = () => {
      // Scale impact stats to determine number of markers
      const totalImpact =
        impactStats.carbonSaved + impactStats.waterSaved + impactStats.wasteSaved + impactStats.energySaved
      const numMarkers = Math.min(Math.floor(totalImpact / 100), 20) // Cap at 20 markers

      for (let i = 0; i < numMarkers; i++) {
        // Random position on globe
        const phi = Math.random() * Math.PI * 2 // longitude
        const theta = Math.random() * Math.PI // latitude

        const x = 100 * Math.sin(theta) * Math.cos(phi)
        const y = 100 * Math.cos(theta)
        const z = 100 * Math.sin(theta) * Math.sin(phi)

        // Create marker
        const markerGeometry = new THREE.SphereGeometry(2, 16, 16)
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x22c55e),
          transparent: true,
          opacity: 0.8,
        })

        const marker = new THREE.Mesh(markerGeometry, markerMaterial)
        marker.position.set(x, y, z)
        scene.add(marker)

        // Add pulse effect
        const pulseGeometry = new THREE.SphereGeometry(2, 16, 16)
        const pulseMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x22c55e),
          transparent: true,
          opacity: 0.4,
        })

        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
        pulse.position.set(x, y, z)
        pulse.scale.set(1, 1, 1)
        pulse.userData = {
          originalScale: 1,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          maxScale: 2 + Math.random() * 2,
        }
        scene.add(pulse)
      }
    }

    addImpactMarkers()

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = true
    controls.minDistance = 120
    controls.maxDistance = 300
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate Earth
      earth.rotation.y += 0.001
      atmosphere.rotation.y += 0.001

      // Pulse effect for markers
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData && child.userData.pulseSpeed) {
          child.scale.x += child.userData.pulseSpeed
          child.scale.y += child.userData.pulseSpeed
          child.scale.z += child.userData.pulseSpeed

          if (child.scale.x >= child.userData.maxScale) {
            child.scale.set(child.userData.originalScale, child.userData.originalScale, child.userData.originalScale)
          }
        }
      })

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          }
        }
      })
    }
  }, [impactStats])

  return <div ref={containerRef} className="w-full h-full" />
}

