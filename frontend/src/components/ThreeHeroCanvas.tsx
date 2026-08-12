import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ThreeHeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Particle geometry
    const particleCount = 140
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const scales = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20

      scales[i] = Math.random() * 0.8 + 0.3
      speeds[i] = Math.random() * 0.03 + 0.01
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))

    // Soft glowing particle texture created dynamically via Canvas
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0, 'rgba(255, 180, 100, 0.95)')
      gradient.addColorStop(0.3, 'rgba(245, 158, 11, 0.5)')
      gradient.addColorStop(1, 'rgba(234, 88, 12, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 64, 64)
    }

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.PointsMaterial({
      size: 1.5,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / container.clientWidth - 0.5) * 2
      mouseY = -((e.clientY - rect.top) / container.clientHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Handle Resize
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      const posArr = geometry.attributes.position.array as Float32Array

      // Float particles upward like warmth / steam
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += speeds[i]
        posArr[i * 3] += Math.sin(elapsedTime * 0.8 + i) * 0.02

        // Reset particle to bottom when reaching top
        if (posArr[i * 3 + 1] > 20) {
          posArr[i * 3 + 1] = -20
          posArr[i * 3] = (Math.random() - 0.5) * 50
        }
      }
      geometry.attributes.position.needsUpdate = true

      // Gentle system rotation responding to mouse
      particleSystem.rotation.y = elapsedTime * 0.05 + mouseX * 0.1
      particleSystem.rotation.x = mouseY * 0.1

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    />
  )
}
