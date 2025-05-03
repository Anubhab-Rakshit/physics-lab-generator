import PhysicsLab from "@/components/physics-lab"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-screen">
        <PhysicsLab />
      </div>
    </main>
  )
}
