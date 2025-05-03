"use client"

import { useSimulation } from "@/context/simulation-context"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function ControlPanel() {
  const {
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
    isRunning,
    setIsRunning,
    showCompass,
    setShowCompass,
    showFieldMeter,
    setShowFieldMeter,
  } = useSimulation()

  return (
    <div className="absolute top-0 right-0 w-80 h-full">
      <div className="h-full overflow-y-auto bg-slate-100/90 backdrop-blur-md p-4 text-black">
        {/* Bar Magnet Controls */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <h2 className="text-lg font-bold mb-2">Bar Magnet</h2>

          <div className="mb-2">
            <div className="flex justify-between">
              <span>Strength:</span>
              <span className="font-medium">{magnetStrength}%</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setMagnetStrength(Math.max(0, magnetStrength - 5))}
              >
                <span>◀</span>
              </Button>

              <div className="relative flex-1 h-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-1 w-full bg-gray-200 rounded-full"></div>
                  <div className="absolute left-0 right-0 flex justify-between px-1 text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                <Slider
                  value={[magnetStrength]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setMagnetStrength(value[0])}
                  className="pt-3"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setMagnetStrength(Math.min(100, magnetStrength + 5))}
              >
                <span>▶</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="magnetic-field"
              checked={showMagneticField}
              onCheckedChange={(checked) => setShowMagneticField(checked as boolean)}
            />
            <label htmlFor="magnetic-field" className="text-sm">
              Magnetic Field (B)
            </label>
          </div>
        </div>

        {/* Pickup Coil Controls */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <h2 className="text-lg font-bold mb-2">Pickup Coil</h2>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Indicator:</span>
              <div className="flex gap-2">
                <div className="border border-gray-300 rounded p-1 w-12 h-12 flex items-center justify-center bg-gray-100">
                  <div className="w-6 h-8 bg-gray-300 rounded-full relative">
                    <div className="absolute inset-x-0 top-1 bottom-3 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div className="border border-gray-300 rounded p-1 w-12 h-12 flex items-center justify-center bg-blue-100">
                  <div className="w-6 h-8 flex items-center justify-center">
                    <span className="text-blue-600 text-xl">↑</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between">
              <span>Loops:</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setCoilLoops(Math.max(1, coilLoops - 1))}
                  disabled={coilLoops <= 1}
                >
                  <span>◀</span>
                </Button>
                <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center bg-white">
                  {coilLoops}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setCoilLoops(Math.min(5, coilLoops + 1))}
                  disabled={coilLoops >= 5}
                >
                  <span>▶</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between">
              <span>Loop Area:</span>
              <span className="font-medium">{loopArea}%</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setLoopArea(Math.max(20, loopArea - 5))}
              >
                <span>◀</span>
              </Button>

              <div className="relative flex-1 h-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-1 w-full bg-gray-200 rounded-full"></div>
                  <div className="absolute left-0 right-0 flex justify-between px-1 text-xs text-gray-500">
                    <span>20%</span>
                    <span>100%</span>
                  </div>
                </div>
                <Slider
                  value={[loopArea]}
                  min={20}
                  max={100}
                  step={1}
                  onValueChange={(value) => setLoopArea(value[0])}
                  className="pt-3"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setLoopArea(Math.min(100, loopArea + 5))}
              >
                <span>▶</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="electrons"
              checked={showElectrons}
              onCheckedChange={(checked) => setShowElectrons(checked as boolean)}
            />
            <label htmlFor="electrons" className="text-sm flex items-center gap-2">
              Electrons{" "}
              <span className="inline-block w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                -
              </span>
            </label>
          </div>
        </div>

        {/* Measurement Tools */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="compass"
              checked={showCompass}
              onCheckedChange={(checked) => setShowCompass(checked as boolean)}
            />
            <label htmlFor="compass" className="text-sm flex items-center gap-2">
              Compass{" "}
              <span className="text-xs">
                S <span className="text-red-500">→</span> N
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-meter"
              checked={showFieldMeter}
              onCheckedChange={(checked) => setShowFieldMeter(checked as boolean)}
            />
            <label htmlFor="field-meter" className="text-sm flex items-center gap-2">
              Field Meter <span className="text-blue-500 font-bold">⊕</span>
            </label>
          </div>
        </div>

        {/* Water Flow Controls */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <h2 className="text-lg font-bold mb-2">Water Flow</h2>

          <div className="mb-2">
            <div className="flex justify-between">
              <span>Flow Rate:</span>
              <span className="font-medium">{waterFlow}%</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setWaterFlow(Math.max(0, waterFlow - 5))}
              >
                <span>◀</span>
              </Button>

              <Slider
                value={[waterFlow]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setWaterFlow(value[0])}
              />

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setWaterFlow(Math.min(100, waterFlow + 5))}
              >
                <span>▶</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant={isRunning ? "destructive" : "default"}
              onClick={() => setIsRunning(!isRunning)}
              className="w-12 h-12 rounded-full"
            >
              {isRunning ? "⏸" : "▶"}
            </Button>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setWaterFlow(0)
              setIsRunning(false)
            }}
            className="rounded-full w-12 h-12 bg-orange-100 hover:bg-orange-200 text-orange-600"
          >
            ↻
          </Button>
        </div>
      </div>
    </div>
  )
}
