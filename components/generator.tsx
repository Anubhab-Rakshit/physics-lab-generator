"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useSimulation } from "@/context/simulation-context"
import type { Group, Mesh } from "three"
import { Lightbulb } from "./lightbulb"
import { BarMagnet } from "./bar-magnet"
import { PickupCoil } from "./pickup-coil"
import { Compass } from "./compass"
import { FieldMeter } from "./field-meter"

export default function Generator() {
  const { rotationSpeed, isRunning, bulbBrightness, showCompass, showFieldMeter } = useSimulation()

  const groupRef = useRef<Group>(null)
  const wheelRef = useRef<Mesh>(null)

  // Rotate the wheel based on the rotation speed
  useFrame((_, delta) => {
    if (isRunning && wheelRef.current) {
      wheelRef.current.rotation.z += delta * (rotationSpeed / 10)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Base platform */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Generator wheel */}
      <group position={[0, 0.5, 0]}>
        <mesh ref={wheelRef} castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial color="#8B4513" />

          {/* Wheel spokes */}
          {[...Array(8)].map((_, i) => (
            <mesh
              key={i}
              castShadow
              position={[Math.cos((i * Math.PI) / 4) * 0.7, 0, Math.sin((i * Math.PI) / 4) * 0.7]}
            >
              <boxGeometry args={[0.1, 0.1, 1.4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          ))}

          {/* Magnet on the wheel */}
          <group position={[0, 0, 0]}>
            <mesh castShadow position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.2, 0.6, 0.2]} />
              <meshStandardMaterial color="#3B82F6" />
            </mesh>
            <mesh castShadow position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.2, 0.6, 0.2]} />
              <meshStandardMaterial color="#EF4444" />
            </mesh>
          </group>
        </mesh>

        {/* RPM display */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

      {/* Bar magnet */}
      <BarMagnet position={[-2.5, 0.5, 0]} />

      {/* Pickup coil */}
      <PickupCoil position={[2.5, 0.5, 0]} />

      {/* Lightbulb */}
      <Lightbulb position={[0, 2, 0]} brightness={bulbBrightness} />

      {/* Compass (optional) */}
      {showCompass && <Compass position={[2, 0.2, 2]} />}

      {/* Field meter (optional) */}
      {showFieldMeter && <FieldMeter position={[-2, 0.2, 2]} />}
    </group>
  )
}
