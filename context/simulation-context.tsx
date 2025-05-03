"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SimulationContextType {
  // Water Flow
  waterFlow: number
  setWaterFlow: (value: number) => void

  // Bar Magnet
  magnetStrength: number
  setMagnetStrength: (value: number) => void
  showMagneticField: boolean
  setShowMagneticField: (value: boolean) => void

  // Pickup Coil
  coilLoops: number
  setCoilLoops: (value: number) => void
  loopArea: number
  setLoopArea: (value: number) => void
  showElectrons: boolean
  setShowElectrons: (value: boolean) => void

  // Generator
  rotationSpeed: number
  isRunning: boolean
  setIsRunning: (value: boolean) => void

  // Tools
  showCompass: boolean
  setShowCompass: (value: boolean) => void
  showFieldMeter: boolean
  setShowFieldMeter: (value: boolean) => void

  // Derived values
  currentVoltage: number
  bulbBrightness: number
}

// Create a default context value
const defaultContextValue: SimulationContextType = {
  waterFlow: 0,
  setWaterFlow: () => {},
  magnetStrength: 75,
  setMagnetStrength: () => {},
  showMagneticField: true,
  setShowMagneticField: () => {},
  coilLoops: 2,
  setCoilLoops: () => {},
  loopArea: 50,
  setLoopArea: () => {},
  showElectrons: true,
  setShowElectrons: () => {},
  rotationSpeed: 0,
  isRunning: false,
  setIsRunning: () => {},
  showCompass: true,
  setShowCompass: () => {},
  showFieldMeter: false,
  setShowFieldMeter: () => {},
  currentVoltage: 0,
  bulbBrightness: 0,
}

const SimulationContext = createContext<SimulationContextType>(defaultContextValue)

export function SimulationProvider({ children }: { children: ReactNode }) {
  // Water Flow
  const [waterFlow, setWaterFlow] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // Bar Magnet
  const [magnetStrength, setMagnetStrength] = useState(75)
  const [showMagneticField, setShowMagneticField] = useState(true)

  // Pickup Coil
  const [coilLoops, setCoilLoops] = useState(2)
  const [loopArea, setLoopArea] = useState(50)
  const [showElectrons, setShowElectrons] = useState(true)

  // Tools
  const [showCompass, setShowCompass] = useState(true)
  const [showFieldMeter, setShowFieldMeter] = useState(false)

  // Calculate derived values
  const rotationSpeed = isRunning ? waterFlow * 2 : 0

  const currentVoltage = isRunning
    ? (magnetStrength / 100) * coilLoops * (loopArea / 100) * (rotationSpeed / 100) * 10
    : 0

  const bulbBrightness = Math.min(1, Math.max(0, currentVoltage / 5))

  return (
    <SimulationContext.Provider
      value={{
        waterFlow,
        setWaterFlow,
        magnetStrength,
        setMagnetStrength,
        showMagneticField,
        setShowMagneticField,
        coilLoops,
        setCoilLoops,
        loopArea,
        setLoopArea,
        showElectrons,
        setShowElectrons,
        rotationSpeed,
        isRunning,
        setIsRunning,
        showCompass,
        setShowCompass,
        showFieldMeter,
        setShowFieldMeter,
        currentVoltage,
        bulbBrightness,
      }}
    >
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  return useContext(SimulationContext)
}
