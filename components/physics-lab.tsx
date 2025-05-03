"use client"

import { useRef } from "react"
import { SimulationProvider } from "@/context/simulation-context"
import ControlPanel from "./control-panel"
import SimulationCanvas from "./simulation-canvas"

export default function PhysicsLab() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <SimulationProvider>
      <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden">
        <SimulationCanvas />
        <ControlPanel />
      </div>
    </SimulationProvider>
  )
}
