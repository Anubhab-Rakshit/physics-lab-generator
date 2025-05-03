"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useSimulation } from "@/context/simulation-context"
import { Vector3, Color, ArrowHelper } from "three"

export default function MagneticField() {
  const { showMagneticField, magnetStrength, isRunning, rotationSpeed } = useSimulation()
  const groupRef = useRef(null)

  // Create a grid of arrows to represent the magnetic field
  const fieldSize = 8
  const fieldResolution = 12
  const fieldHeight = 1

  // Create field positions
  const fieldPositions = useMemo(() => {
    const positions = []

    for (let x = -fieldSize / 2; x <= fieldSize / 2; x += fieldSize / fieldResolution) {
      for (let z = -fieldSize / 2; z <= fieldSize / 2; z += fieldSize / fieldResolution) {
        positions.push(new Vector3(x, fieldHeight, z))
      }
    }

    return positions
  }, [])

  // Create arrows
  const arrows = useMemo(() => {
    return fieldPositions.map((position) => {
      const dir = new Vector3(0, 1, 0).normalize()
      const arrow = new ArrowHelper(dir, position, 0.2, 0x3b82f6, 0.05, 0.03)
      return arrow
    })
  }, [fieldPositions])

  // Add arrows to the scene
  useEffect(() => {
    if (!groupRef.current) return

    // Add all arrows to the group
    arrows.forEach((arrow) => {
      groupRef.current.add(arrow)
    })

    // Cleanup function to remove arrows
    return () => {
      if (!groupRef.current) return
      arrows.forEach((arrow) => {
        groupRef.current.remove(arrow)
      })
    }
  }, [arrows])

  // Update the magnetic field arrows
  useFrame(() => {
    if (!showMagneticField || !groupRef.current) return

    const wheelPosition = new Vector3(0, 0.5, 0)
    const magnetPosition = new Vector3(-2.5, 0.5, 0)
    const strength = magnetStrength / 100

    arrows.forEach((arrow, i) => {
      const position = fieldPositions[i]

      // Calculate field direction from the bar magnet
      const dirToMagnet = new Vector3().subVectors(position, magnetPosition)
      const distToMagnet = dirToMagnet.length()
      const magnetInfluence = (1 / (distToMagnet * distToMagnet)) * strength

      // Calculate field direction from the rotating magnet
      const dirToWheel = new Vector3().subVectors(position, wheelPosition)
      const distToWheel = dirToWheel.length()
      const wheelInfluence = (1 / (distToWheel * distToWheel)) * (isRunning ? rotationSpeed / 100 : 0)

      // Combine the influences
      const fieldDirection = new Vector3(
        dirToMagnet.x * magnetInfluence + dirToWheel.x * wheelInfluence,
        0,
        dirToMagnet.z * magnetInfluence + dirToWheel.z * wheelInfluence,
      ).normalize()

      // Calculate field strength (for color)
      const fieldStrength = magnetInfluence + wheelInfluence

      // Update arrow
      arrow.setDirection(fieldDirection)
      arrow.setLength(0.2 * fieldStrength, 0.05 * fieldStrength, 0.03 * fieldStrength)

      // Update color based on field strength
      const arrowColor = new Color().setHSL(0.6, 1, 0.5 * fieldStrength + 0.2)
      arrow.setColor(arrowColor)
    })
  })

  return <group ref={groupRef} visible={showMagneticField} />
}
