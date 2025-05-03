"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Vector3, type Group, type PointLight } from "three"

interface LightbulbProps {
  position: [number, number, number]
  brightness: number
}

export function Lightbulb({ position, brightness }: LightbulbProps) {
  const lightRef = useRef<PointLight>(null)
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = brightness * 2
    }

    if (groupRef.current) {
      // Slight random movement when the bulb is on
      if (brightness > 0.1) {
        groupRef.current.position.y = position[1] + Math.sin(Date.now() / 500) * 0.01
      }
    }
  })

  return (
    <group position={new Vector3(...position)} ref={groupRef}>
      {/* Bulb base */}
      <mesh castShadow position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Bulb glass */}
      <mesh castShadow position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial
          color="#FFFFE0"
          transparent={true}
          opacity={0.8}
          emissive="#FFFFE0"
          emissiveIntensity={brightness}
        />
      </mesh>

      {/* Filament */}
      <mesh castShadow position={[0, 0, 0]}>
        <torusGeometry args={[0.05, 0.01, 16, 32]} />
        <meshStandardMaterial color="#FFA500" emissive="#FFA500" emissiveIntensity={brightness * 2} />
      </mesh>

      {/* Light source */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={brightness * 2}
        distance={5}
        decay={2}
        color="#FFFFE0"
      />
    </group>
  )
}
