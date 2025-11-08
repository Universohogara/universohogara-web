
'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points_reward: number
  unlocked: boolean
  unlocked_at?: string
}

interface RewardsDisplayProps {
  points: number
  level: number
  experience: number
  recentAchievements?: Achievement[]
}

export default function RewardsDisplay({
  points,
  level,
  experience,
  recentAchievements = []
}: RewardsDisplayProps) {
  const expForNextLevel = level * 100
  const expProgress = (experience / expForNextLevel) * 100

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50/60 to-pink-50/60 rounded-lg px-3 py-2 border border-purple-100">
      {/* Puntos */}
      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
        <div>
          <p className="text-[10px] text-gray-500 leading-none">Puntos</p>
          <p className="text-sm font-bold text-purple-700 leading-none mt-0.5">{points}</p>
        </div>
      </div>

      {/* Nivel */}
      <div className="flex items-center gap-1.5">
        <Trophy className="h-4 w-4 text-purple-600" />
        <div>
          <p className="text-[10px] text-gray-500 leading-none">Nivel</p>
          <p className="text-sm font-bold text-purple-700 leading-none mt-0.5">{level}</p>
        </div>
      </div>

      {/* Experiencia - compacta */}
      <div className="flex-1 min-w-[100px]">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[9px] text-gray-500">XP</p>
          <p className="text-[9px] text-gray-500">{experience}/{expForNextLevel}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <motion.div
            className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${expProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}
