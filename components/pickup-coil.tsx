"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useSimulation } from "@/context/simulation-context"
import { Vector3, type Group, CatmullRomCurve3, Mesh } from "three"

interface PickupCoilProps {
  position: [number, number, number]
}

export function PickupCoil({ position }: PickupCoilProps) {
  const { coilLoops, loopArea, showElectrons } = useSimulation()
  const groupRef = useRef<Group>(null)
  const electronsRef = useRef<Group>(null)

  // Create coil geometry based on number of loops and area
  const coilPoints = useMemo(() => {
    const points = []
    const radius = 0.3 + (loopArea / 100) * 0.3
    const height = 0.05 * coilLoops
    const segments = 32

    for (let loop = 0; loop < coilLoops; loop++) {
      const loopHeight = loop * (height / coilLoops)

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        points.push(
          new Vector3(
            Math.cos(angle) * radius,
            loopHeight + (i / segments) * (height / coilLoops),
            Math.sin(angle) * radius,
          ),
        )
      }
    }

    return points
  }, [coilLoops, loopArea])

  const coilCurve = useMemo(() => {
    return new CatmullRomCurve3(coilPoints)
  }, [coilPoints])

  // Create electron positions
  const electronPositions = useMemo(() => {
    return Array(5)
      .fill(0)
      .map((_, i) => i * 0.2)
  }, [])

  // Electron animation
  useFrame(() => {
    if (!showElectrons || !electronsRef.current) return

    const electrons = electronsRef.current.children

    electrons.forEach((electron, i) => {
      if (electron instanceof Mesh) {
        const time = (Date.now() / 1000 + i * 0.2) % 1
        const point = coilCurve.getPoint(time)
        electron.position.copy(point)
      }
    })
  })

  return (
    <group position={new Vector3(...position)} ref={groupRef}>
      {/* Coil base */}
      <mesh castShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* Coil */}
      <mesh>
        <tubeGeometry args={[coilCurve, 64, 0.03, 8, false]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>

      {/* Electrons */}
      <group ref={electronsRef} visible={showElectrons}>
        {electronPositions.map((pos, i) => (
          <mesh key={i} position={coilCurve.getPoint(pos)}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#00BFFF" emissive="#00BFFF" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
