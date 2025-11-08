
'use client'

import { GamificationDashboard } from '@/components/gamification/gamification-dashboard'

export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-[#1a1a1a] mb-4">
            ✨ Tu Viaje Mágico ✨
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cada acción que realizas te acerca más a tu mejor versión. Gana puntos, desbloquea logros y sube de nivel mientras cuidas de ti misma.
          </p>
        </div>

        <GamificationDashboard />
      </div>
    </div>
  )
}
