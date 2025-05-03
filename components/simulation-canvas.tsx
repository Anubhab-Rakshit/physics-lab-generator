"use client"

import { useRef, useEffect } from "react"
import { useSimulation } from "@/context/simulation-context"

export default function SimulationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const {
    waterFlow,
    magnetStrength,
    showMagneticField,
    coilLoops,
    loopArea,
    showElectrons,
    rotationSpeed,
    isRunning,
    showCompass,
    showFieldMeter,
    bulbBrightness,
  } = useSimulation()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let animationFrameId: number
    let lastTime = 0
    let wheelRotation = 0
    let waterParticles: { x: number; y: number; speed: number }[] = []
    let electronPositions: { x: number; y: number; progress: number }[] = []

    // Initialize electron positions
    const initElectrons = () => {
      electronPositions = []
      for (let i = 0; i < 10; i++) {
        electronPositions.push({
          x: 0,
          y: 0,
          progress: i * 0.1,
        })
      }
    }

    // Initialize water particles
    const initWaterParticles = () => {
      waterParticles = []
      const particleCount = Math.floor(waterFlow / 5) + 1

      for (let i = 0; i < particleCount; i++) {
        waterParticles.push({
          x: canvas.width * 0.25,
          y: canvas.height * 0.15 + Math.random() * 20,
          speed: 1 + Math.random() * 2,
        })
      }
    }

    initElectrons()
    initWaterParticles()

    // Draw functions
    const drawBackground = () => {
      // Black background
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawMagneticField = () => {
      if (!showMagneticField) return

      const fieldSize = Math.min(canvas.width, canvas.height) * 0.8
      const fieldResolution = 20
      const fieldStep = fieldSize / fieldResolution
      const fieldCenterX = canvas.width * 0.5
      const fieldCenterY = canvas.height * 0.5

      // Draw magnetic field lines
      for (let x = -fieldSize / 2; x <= fieldSize / 2; x += fieldStep) {
        for (let z = -fieldSize / 2; z <= fieldSize / 2; z += fieldStep) {
          const posX = fieldCenterX + x
          const posY = fieldCenterY + z * 0.5 // Apply perspective by scaling Y

          // Calculate field direction from the bar magnet
          const magnetX = canvas.width * 0.5
          const magnetY = canvas.height * 0.5
          const dirX = posX - magnetX
          const dirY = posY - magnetY
          const dist = Math.sqrt(dirX * dirX + dirY * dirY)
          const magnetInfluence = (1 / (dist * dist)) * (magnetStrength / 100) * 5000

          // Calculate field strength for color
          const fieldStrength = Math.min(1, magnetInfluence / 10000)

          // Skip drawing if field is too weak
          if (fieldStrength < 0.1) continue

          // Calculate field angle
          const fieldAngle = Math.atan2(dirY, dirX)
          const fieldLength = Math.min(fieldStep * 0.4, fieldStrength * 10)

          // Draw arrow
          ctx.save()
          ctx.translate(posX, posY)
          ctx.rotate(fieldAngle)

          // Arrow body
          ctx.strokeStyle = `rgba(${255 * (1 - fieldStrength)}, 0, ${255 * fieldStrength}, ${fieldStrength * 0.8})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(fieldLength, 0)
          ctx.stroke()

          // Arrow head
          ctx.beginPath()
          ctx.moveTo(fieldLength, 0)
          ctx.lineTo(fieldLength - 3, -2)
          ctx.lineTo(fieldLength - 3, 2)
          ctx.closePath()
          ctx.fillStyle = ctx.strokeStyle
          ctx.fill()

          ctx.restore()
        }
      }
    }

    const drawBarMagnet = () => {
      const magnetX = canvas.width * 0.5
      const magnetY = canvas.height * 0.5
      const magnetWidth = 120
      const magnetHeight = 30

      // Draw magnet body
      ctx.fillStyle = "#777"
      ctx.beginPath()
      ctx.rect(magnetX - magnetWidth / 2, magnetY - magnetHeight / 2, magnetWidth, magnetHeight)
      ctx.fill()

      // Draw north pole (red)
      ctx.fillStyle = "#EF4444"
      ctx.beginPath()
      ctx.rect(magnetX, magnetY - magnetHeight / 2, magnetWidth / 2, magnetHeight)
      ctx.fill()

      // Draw south pole (blue)
      ctx.fillStyle = "#3B82F6"
      ctx.beginPath()
      ctx.rect(magnetX - magnetWidth / 2, magnetY - magnetHeight / 2, magnetWidth / 2, magnetHeight)
      ctx.fill()

      // Draw labels
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 24px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("N", magnetX + magnetWidth / 4, magnetY)
      ctx.fillText("S", magnetX - magnetWidth / 4, magnetY)
    }

    const drawWaterTap = () => {
      const tapX = canvas.width * 0.25
      const tapY = canvas.height * 0.1

      // Draw pipe
      ctx.fillStyle = "#CCC"
      ctx.beginPath()
      ctx.rect(tapX - 50, tapY - 10, 100, 20)
      ctx.fill()

      // Draw curved pipe
      ctx.beginPath()
      ctx.arc(tapX - 50, tapY, 20, -Math.PI / 2, Math.PI / 2, false)
      ctx.fill()

      // Draw vertical pipe
      ctx.beginPath()
      ctx.rect(tapX - 70, tapY, 20, 30)
      ctx.fill()

      // Draw tap valve
      ctx.fillStyle = "#888"
      ctx.beginPath()
      ctx.arc(tapX, tapY - 10, 15, 0, Math.PI * 2)
      ctx.fill()

      // Draw valve handle
      ctx.fillStyle = "#4B83F2"
      ctx.beginPath()
      ctx.arc(tapX, tapY - 10, 10, 0, Math.PI * 2)
      ctx.fill()

      // Draw valve stem
      ctx.fillStyle = "#CCC"
      ctx.beginPath()
      ctx.rect(tapX - 3, tapY - 25, 6, 15)
      ctx.fill()

      // Draw valve knob
      ctx.fillStyle = "#4B83F2"
      ctx.beginPath()
      ctx.arc(tapX, tapY - 30, 8, 0, Math.PI * 2)
      ctx.fill()

      // Draw rotation indicator based on water flow
      const rotationAngle = (waterFlow / 100) * Math.PI
      ctx.strokeStyle = "#FFF"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(tapX, tapY - 30)
      ctx.lineTo(tapX + Math.cos(rotationAngle) * 6, tapY - 30 + Math.sin(rotationAngle) * 6)
      ctx.stroke()
    }

    const drawWaterFlow = () => {
      if (waterFlow === 0 || !isRunning) return

      const tapX = canvas.width * 0.25
      const tapY = canvas.height * 0.1
      const wheelY = canvas.height * 0.5

      // Update existing particles
      waterParticles.forEach((particle, index) => {
        // Move particle down
        particle.y += particle.speed * (waterFlow / 20)

        // Remove particles that hit the wheel or go off screen
        if (particle.y > wheelY - 50 || particle.y > canvas.height) {
          waterParticles.splice(index, 1)
        }
      })

      // Add new particles if needed
      if (isRunning && waterParticles.length < waterFlow / 2) {
        const newParticleCount = Math.floor(waterFlow / 10) + 1

        for (let i = 0; i < newParticleCount; i++) {
          waterParticles.push({
            x: tapX + (Math.random() * 10 - 5),
            y: tapY + 10,
            speed: 2 + Math.random() * 3,
          })
        }
      }

      // Draw particles
      ctx.fillStyle = "#4B83F2"
      waterParticles.forEach((particle) => {
        const size = 2 + Math.random() * 3
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1

      // Draw water stream
      if (waterFlow > 0 && isRunning) {
        const gradient = ctx.createLinearGradient(tapX, tapY + 10, tapX, wheelY - 50)
        gradient.addColorStop(0, "rgba(75, 131, 242, 0.9)")
        gradient.addColorStop(1, "rgba(75, 131, 242, 0.3)")

        ctx.fillStyle = gradient

        // Stream width based on flow rate
        const streamWidth = Math.max(2, waterFlow / 10)

        ctx.beginPath()
        ctx.moveTo(tapX - streamWidth, tapY + 10)
        ctx.lineTo(tapX + streamWidth, tapY + 10)
        ctx.lineTo(tapX + streamWidth * 2, wheelY - 50)
        ctx.lineTo(tapX - streamWidth * 2, wheelY - 50)
        ctx.closePath()
        ctx.fill()
      }
    }

    const drawWaterWheel = () => {
      const wheelX = canvas.width * 0.25
      const wheelY = canvas.height * 0.5
      const wheelRadius = 60

      // Draw wheel
      ctx.save()
      ctx.translate(wheelX, wheelY)
      ctx.rotate(wheelRotation)

      // Wheel rim
      ctx.fillStyle = "#8B4513"
      ctx.beginPath()
      ctx.arc(0, 0, wheelRadius, 0, Math.PI * 2)
      ctx.fill()

      // Inner wheel
      ctx.fillStyle = "#A0522D"
      ctx.beginPath()
      ctx.arc(0, 0, wheelRadius * 0.8, 0, Math.PI * 2)
      ctx.fill()

      // Wheel spokes
      ctx.strokeStyle = "#8B4513"
      ctx.lineWidth = 5
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * wheelRadius * 0.9, Math.sin(angle) * wheelRadius * 0.9)
        ctx.stroke()
      }

      // Wheel paddles
      ctx.fillStyle = "#8B4513"
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        ctx.save()
        ctx.translate(Math.cos(angle) * wheelRadius * 0.7, Math.sin(angle) * wheelRadius * 0.7)
        ctx.rotate(angle + Math.PI / 2)
        ctx.fillRect(-15, -2, 30, 4)
        ctx.restore()
      }

      // Magnet on wheel
      ctx.fillStyle = "#3B82F6" // Blue (South)
      ctx.beginPath()
      ctx.rect(wheelRadius * 0.6, -10, 20, 20)
      ctx.fill()

      ctx.fillStyle = "#EF4444" // Red (North)
      ctx.beginPath()
      ctx.rect(-wheelRadius * 0.6 - 20, -10, 20, 20)
      ctx.fill()

      // RPM display
      ctx.restore()
      ctx.fillStyle = "#222"
      ctx.beginPath()
      ctx.arc(wheelX, wheelY, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#FFF"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${rotationSpeed.toFixed(1)}`, wheelX, wheelY - 5)
      ctx.font = "8px Arial"
      ctx.fillText("RPM", wheelX, wheelY + 5)
    }

    const drawPickupCoil = () => {
      const coilX = canvas.width * 0.65
      const coilY = canvas.height * 0.5
      const coilWidth = 40 + (loopArea / 100) * 40
      const coilHeight = 80 + (loopArea / 100) * 40

      // Draw coil base
      ctx.fillStyle = "#444"
      ctx.beginPath()
      ctx.ellipse(coilX, coilY + coilHeight / 2 + 10, coilWidth / 2, 10, 0, 0, Math.PI * 2)
      ctx.fill()

      // Draw coil
      ctx.strokeStyle = "#FFA500"
      ctx.lineWidth = 3

      // Draw multiple loops based on coilLoops
      const loopSpacing = coilHeight / (coilLoops + 1)
      for (let i = 0; i < coilLoops; i++) {
        // Calculate vertical position for each loop

        const loopY = coilY - coilHeight / 2 + (i + 1) * loopSpacing

        // Draw front half of loop (ellipse)
        ctx.beginPath()
        ctx.ellipse(coilX, loopY, coilWidth / 2, coilWidth / 6, 0, 0, Math.PI)
        ctx.stroke()

        // Draw back half of loop (ellipse) with dashed line
        ctx.setLineDash([2, 2])
        ctx.beginPath()
        ctx.ellipse(coilX, loopY, coilWidth / 2, coilWidth / 6, 0, Math.PI, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])

        // Connect to next loop if not the last one
        if (i < coilLoops - 1) {
          const nextLoopY = coilY - coilHeight / 2 + (i + 2) * loopSpacing
          ctx.beginPath()
          ctx.moveTo(coilX + coilWidth / 2, loopY)
          ctx.lineTo(coilX + coilWidth / 2, nextLoopY)
          ctx.stroke()
        }
      }

      // Draw wires from coil to lightbulb
      ctx.strokeStyle = "#FFA500"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(coilX + coilWidth / 2, coilY - coilHeight / 2 + loopSpacing)
      ctx.lineTo(coilX + coilWidth / 2, coilY - coilHeight / 2)
      ctx.lineTo(canvas.width * 0.5, coilY - coilHeight / 2)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.3 + 20)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(coilX - coilWidth / 2, coilY + coilHeight / 2)
      ctx.lineTo(coilX - coilWidth / 2 - 20, coilY + coilHeight / 2)
      ctx.lineTo(canvas.width * 0.5 - 20, coilY + coilHeight / 2)
      ctx.lineTo(canvas.width * 0.5 - 20, canvas.height * 0.3 + 20)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.3 + 20)
      ctx.stroke()

      // Draw electrons
      if (showElectrons && isRunning) {
        electronPositions.forEach((electron, i) => {
          // Update electron position along the coil
          const t = electron.progress
          const loopIndex = Math.floor(t * coilLoops)
          const loopProgress = (t * coilLoops) % 1

          const loopY = coilY - coilHeight / 2 + (loopIndex + 1) * loopSpacing

          // Calculate position on the ellipse
          const angle = loopProgress * Math.PI * 2
          const xRadius = coilWidth / 2
          const yRadius = coilWidth / 6

          electron.x = coilX + Math.cos(angle) * xRadius
          electron.y = loopY + Math.sin(angle) * yRadius

          // Only show electrons on the visible part of the coil
          if (angle > Math.PI && angle < Math.PI * 2) {
            return
          }

          // Draw electron
          ctx.fillStyle = "#00BFFF"
          ctx.beginPath()
          ctx.arc(electron.x, electron.y, 4, 0, Math.PI * 2)
          ctx.fill()

          // Add glow effect
          const gradient = ctx.createRadialGradient(electron.x, electron.y, 0, electron.x, electron.y, 8)
          gradient.addColorStop(0, "rgba(0, 191, 255, 0.8)")
          gradient.addColorStop(1, "rgba(0, 191, 255, 0)")
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(electron.x, electron.y, 8, 0, Math.PI * 2)
          ctx.fill()

          // Add minus sign
          ctx.fillStyle = "#FFFFFF"
          ctx.font = "bold 8px Arial"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("-", electron.x, electron.y)
        })
      }
    }

    const drawLightbulb = () => {
      const bulbX = canvas.width * 0.5
      const bulbY = canvas.height * 0.3

      // Draw bulb base
      ctx.fillStyle = "#888"
      ctx.beginPath()
      ctx.rect(bulbX - 10, bulbY + 20, 20, 15)
      ctx.fill()

      // Draw bulb socket
      ctx.fillStyle = "#555"
      ctx.beginPath()
      ctx.rect(bulbX - 15, bulbY + 15, 30, 10)
      ctx.fill()

      // Draw bulb glass with brightness
      const glowIntensity = bulbBrightness
      ctx.fillStyle = `rgba(255, 255, 224, ${0.3 + glowIntensity * 0.7})`
      ctx.beginPath()
      ctx.arc(bulbX, bulbY, 20, 0, Math.PI)
      ctx.arc(bulbX, bulbY, 20, Math.PI, Math.PI * 2)
      ctx.fill()

      // Draw filament
      ctx.strokeStyle = `rgba(255, 165, 0, ${0.5 + glowIntensity * 0.5})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(bulbX - 10, bulbY + 5)
      ctx.quadraticCurveTo(bulbX, bulbY - 10, bulbX + 10, bulbY + 5)
      ctx.stroke()

      // Draw light rays when bulb is on
      if (glowIntensity > 0.1) {
        ctx.strokeStyle = `rgba(255, 255, 224, ${glowIntensity * 0.7})`
        ctx.lineWidth = 1

        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2
          const length = 20 + glowIntensity * 30

          ctx.beginPath()
          ctx.moveTo(bulbX + Math.cos(angle) * 20, bulbY + Math.sin(angle) * 20)
          ctx.lineTo(bulbX + Math.cos(angle) * (20 + length), bulbY + Math.sin(angle) * (20 + length))
          ctx.stroke()
        }

        // Add glow effect
        const gradient = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, 50)
        gradient.addColorStop(0, `rgba(255, 255, 224, ${glowIntensity * 0.5})`)
        gradient.addColorStop(1, "rgba(255, 255, 224, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(bulbX, bulbY, 50, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawCompass = () => {
      if (!showCompass) return

      const compassX = canvas.width * 0.85
      const compassY = canvas.height * 0.5
      const compassRadius = 20

      // Calculate compass needle angle based on magnetic field
      const magnetX = canvas.width * 0.5
      const magnetY = canvas.height * 0.5
      const wheelX = canvas.width * 0.25
      const wheelY = canvas.height * 0.5

      // Calculate influence from bar magnet
      const dirToMagnet = { x: compassX - magnetX, y: compassY - magnetY }
      const distToMagnet = Math.sqrt(dirToMagnet.x * dirToMagnet.x + dirToMagnet.y * dirToMagnet.y)
      const magnetInfluence = (1 / (distToMagnet * distToMagnet)) * (magnetStrength / 100)

      // Calculate influence from rotating magnet
      const dirToWheel = { x: compassX - wheelX, y: compassY - wheelY }
      const distToWheel = Math.sqrt(dirToWheel.x * dirToWheel.x + dirToWheel.y * dirToWheel.y)
      const wheelInfluence = (1 / (distToWheel * distToWheel)) * (isRunning ? rotationSpeed / 100 : 0)

      // Calculate angle based on combined influences
      const angle = Math.atan2(
        dirToMagnet.y * magnetInfluence + dirToWheel.y * wheelInfluence,
        dirToMagnet.x * magnetInfluence + dirToWheel.x * wheelInfluence,
      )

      // Add some oscillation when the generator is running
      const oscillation = isRunning ? Math.sin(Date.now() / 200) * (rotationSpeed / 500) : 0
      const needleAngle = angle + oscillation

      // Draw compass base
      ctx.fillStyle = "#222"
      ctx.beginPath()
      ctx.arc(compassX, compassY, compassRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw compass face
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.arc(compassX, compassY, compassRadius - 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw compass needle
      ctx.save()
      ctx.translate(compassX, compassY)
      ctx.rotate(needleAngle)

      // North end (red)
      ctx.fillStyle = "#EF4444"
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(compassRadius - 5, -3)
      ctx.lineTo(compassRadius - 5, 3)
      ctx.closePath()
      ctx.fill()

      // South end (blue)
      ctx.fillStyle = "#3B82F6"
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-compassRadius + 5, -3)
      ctx.lineTo(-compassRadius + 5, 3)
      ctx.closePath()
      ctx.fill()

      ctx.restore()

      // Draw labels
      ctx.fillStyle = "#000"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("N", compassX, compassY - compassRadius - 5)
      ctx.fillText("S", compassX, compassY + compassRadius + 5)
    }

    const drawFieldMeter = () => {
      if (!showFieldMeter) return

      const meterX = canvas.width * 0.85
      const meterY = canvas.height * 0.7
      const meterWidth = 60
      const meterHeight = 40

      // Calculate field strength
      const magnetX = canvas.width * 0.5
      const magnetY = canvas.height * 0.5
      const wheelX = canvas.width * 0.25
      const wheelY = canvas.height * 0.5

      // Calculate influence from bar magnet
      const dirToMagnet = { x: meterX - magnetX, y: meterY - magnetY }
      const distToMagnet = Math.sqrt(dirToMagnet.x * dirToMagnet.x + dirToMagnet.y * dirToMagnet.y)
      const magnetInfluence = (1 / (distToMagnet * distToMagnet)) * (magnetStrength / 100)

      // Calculate influence from rotating magnet
      const dirToWheel = { x: meterX - wheelX, y: meterY - wheelY }
      const distToWheel = Math.sqrt(dirToWheel.x * dirToWheel.x + dirToWheel.y * dirToWheel.y)
      const wheelInfluence = (1 / (distToWheel * distToWheel)) * (isRunning ? rotationSpeed / 100 : 0)

      // Calculate total field strength
      const fieldStrength = Math.min(1, magnetInfluence + wheelInfluence)

      // Draw meter base
      ctx.fillStyle = "#444"
      ctx.beginPath()
      ctx.rect(meterX - meterWidth / 2, meterY - meterHeight / 2, meterWidth, meterHeight)
      ctx.fill()

      // Draw meter face
      ctx.fillStyle = "#FFF"
      ctx.beginPath()
      ctx.rect(meterX - meterWidth / 2 + 5, meterY - meterHeight / 2 + 5, meterWidth - 10, meterHeight - 10)
      ctx.fill()

      // Draw scale markings
      for (let i = 0; i < 5; i++) {
        const x = meterX - meterWidth / 2 + 10 + i * ((meterWidth - 20) / 4)

        ctx.fillStyle = "#000"
        ctx.beginPath()
        ctx.rect(x, meterY, 1, 5)
        ctx.fill()
      }

      // Draw needle
      const needleAngle = -Math.PI / 4 + fieldStrength * (Math.PI / 2)
      const needleLength = meterWidth / 2 - 10

      ctx.save()
      ctx.translate(meterX, meterY)
      ctx.rotate(needleAngle)

      ctx.strokeStyle = "#EF4444"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(needleLength, 0)
      ctx.stroke()

      ctx.restore()

      // Draw field strength value
      ctx.fillStyle = "#000"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${(fieldStrength * 100).toFixed(0)}%`, meterX, meterY + 10)

      // Draw label
      ctx.fillStyle = "#FFF"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Field Strength", meterX, meterY - meterHeight / 2 - 10)
    }

    // Animation loop
    const animate = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update wheel rotation
      if (isRunning) {
        wheelRotation += (deltaTime / 1000) * (rotationSpeed / 10)
      }

      // Update electron positions
      if (showElectrons && isRunning) {
        electronPositions.forEach((electron) => {
          electron.progress = (electron.progress + (deltaTime / 5000) * (rotationSpeed / 20)) % 1
        })
      }

      // Draw scene
      drawBackground()
      if (showMagneticField) drawMagneticField()
      drawBarMagnet()
      drawWaterTap()
      drawWaterFlow()
      drawWaterWheel()
      drawPickupCoil()
      drawLightbulb()
      if (showCompass) drawCompass()
      if (showFieldMeter) drawFieldMeter()

      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animationFrameId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [
    waterFlow,
    magnetStrength,
    showMagneticField,
    coilLoops,
    loopArea,
    showElectrons,
    rotationSpeed,
    isRunning,
    showCompass,
    showFieldMeter,
    bulbBrightness,
  ])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
