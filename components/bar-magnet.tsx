"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { useSimulation } from "@/context/simulation-context"
import { Vector3, type Group } from "three"

interface BarMagnetProps {
  position: [number, number, number]
}

export function BarMagnet({ position }: BarMagnetProps) {
  const { magnetStrength } = useSimulation()
  const groupRef = useRef<Group>(null)

  // Scale the magnet based on the strength
  useFrame(() => {
    if (groupRef.current) {
      const scale = 0.5 + (magnetStrength / 100) * 0.5
      groupRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group position={new Vector3(...position)} ref={groupRef}>
      {/* North pole */}
      <mesh castShadow position={[0.4, 0, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.3]} />
        <meshStandardMaterial color="#EF4444" />
        <Text
          position={[0, 0, 0.2]}
          rotation={[0, 0, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          N
        </Text>
      </mesh>

      {/* South pole */}
      <mesh castShadow position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.3]} />
        <meshStandardMaterial color="#3B82F6" />
        <Text
          position={[0, 0, 0.2]}
          rotation={[0, 0, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          S
        </Text>
      </mesh>

      {/* Handle */}
      <mesh castShadow position={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  )
}
