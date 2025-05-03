"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { useSimulation } from "@/context/simulation-context"
import { Vector3, type Group } from "three"

interface CompassProps {
  position: [number, number, number]
}

export function Compass({ position }: CompassProps) {
  const { magnetStrength, isRunning, rotationSpeed } = useSimulation()
  const needleRef = useRef<Group>(null)

  useFrame(() => {
    if (!needleRef.current) return

    const magnetPosition = new Vector3(-2.5, 0.5, 0)
    const wheelPosition = new Vector3(0, 0.5, 0)
    const compassPosition = new Vector3(...position)

    // Calculate influence from bar magnet
    const dirToMagnet = new Vector3().subVectors(compassPosition, magnetPosition)
    const distToMagnet = dirToMagnet.length()
    const magnetInfluence = (1 / (distToMagnet * distToMagnet)) * (magnetStrength / 100)

    // Calculate influence from rotating magnet
    const dirToWheel = new Vector3().subVectors(compassPosition, wheelPosition)
    const distToWheel = dirToWheel.length()
    const wheelInfluence = (1 / (distToWheel * distToWheel)) * (isRunning ? rotationSpeed / 100 : 0)

    // Calculate angle based on combined influences
    const angle = Math.atan2(
      dirToMagnet.x * magnetInfluence + dirToWheel.x * wheelInfluence,
      dirToMagnet.z * magnetInfluence + dirToWheel.z * wheelInfluence,
    )

    // Add some oscillation when the generator is running
    const oscillation = isRunning ? Math.sin(Date.now() / 200) * (rotationSpeed / 500) : 0

    // Update needle rotation
    needleRef.current.rotation.y = angle + oscillation
  })

  return (
    <group position={new Vector3(...position)}>
      {/* Compass base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Compass face */}
      <mesh castShadow receiveShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.01, 32]} />
        <meshStandardMaterial color="#FFF" />
      </mesh>

      {/* Compass needle */}
      <group ref={needleRef}>
        {/* North end (red) */}
        <mesh castShadow position={[0.15, 0.05, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.02]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>

        {/* South end (blue) */}
        <mesh castShadow position={[-0.15, 0.05, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.02]} />
          <meshStandardMaterial color="#3B82F6" />
        </mesh>

        {/* Center pin */}
        <mesh castShadow position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      </group>

      {/* Labels */}
      <Text
        position={[0, 0.05, 0.25]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.1}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        N
      </Text>

      <Text
        position={[0, 0.05, -0.25]}
        rotation={[0, 0, 0]}
        fontSize={0.1}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        S
      </Text>
    </group>
  )
}
