"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { useSimulation } from "@/context/simulation-context"
import { Vector3, type Group } from "three"

interface FieldMeterProps {
  position: [number, number, number]
}

export function FieldMeter({ position }: FieldMeterProps) {
  const { magnetStrength, isRunning, rotationSpeed } = useSimulation()
  const needleRef = useRef<Group>(null)
  const [fieldStrength, setFieldStrength] = useState(0)

  useFrame(() => {
    if (!needleRef.current) return

    const magnetPosition = new Vector3(-2.5, 0.5, 0)
    const wheelPosition = new Vector3(0, 0.5, 0)
    const meterPosition = new Vector3(...position)

    // Calculate influence from bar magnet
    const dirToMagnet = new Vector3().subVectors(meterPosition, magnetPosition)
    const distToMagnet = dirToMagnet.length()
    const magnetInfluence = (1 / (distToMagnet * distToMagnet)) * (magnetStrength / 100)

    // Calculate influence from rotating magnet
    const dirToWheel = new Vector3().subVectors(meterPosition, wheelPosition)
    const distToWheel = dirToWheel.length()
    const wheelInfluence = (1 / (distToWheel * distToWheel)) * (isRunning ? rotationSpeed / 100 : 0)

    // Calculate total field strength
    const strength = Math.min(1, magnetInfluence + wheelInfluence)
    setFieldStrength(strength)

    // Update needle rotation (from -PI/4 to PI/4 based on strength)
    needleRef.current.rotation.z = -Math.PI / 4 + (strength * Math.PI) / 2
  })

  return (
    <group position={new Vector3(...position)}>
      {/* Meter base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* Meter face */}
      <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[0.5, 0.01, 0.3]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>

      {/* Meter scale */}
      <group position={[0, 0.07, 0]}>
        {/* Scale markings */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-0.2 + i * 0.1, 0, 0.1]}>
            <boxGeometry args={[0.01, 0.01, 0.05]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        ))}

        {/* Needle */}
        <group ref={needleRef} position={[0, 0, 0]}>
          <mesh castShadow position={[0.15, 0, 0]}>
            <boxGeometry args={[0.3, 0.02, 0.01]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>

          {/* Needle pivot */}
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        </group>
      </group>

      {/* Field strength display */}
      <Text
        position={[0, 0.07, -0.1]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.05}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {(fieldStrength * 100).toFixed(0)}%
      </Text>

      {/* Label */}
      <Text
        position={[0, 0.15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.06}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Field Strength
      </Text>
    </group>
  )
}
