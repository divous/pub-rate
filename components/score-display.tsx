'use client'

import { motion } from 'framer-motion'

interface ScoreDisplayProps {
    ratings: {
        food_rating: number
        drink_rating: number
        service_rating: number
        atmosphere_rating: number
        value_rating: number
    }[]
}

export function ScoreDisplay({ ratings }: ScoreDisplayProps) {
    if (!ratings || ratings.length === 0) return null

    // Calculate averages
    const count = ratings.length
    const averages = ratings.reduce(
        (acc, curr) => ({
            food: acc.food + curr.food_rating,
            drink: acc.drink + curr.drink_rating,
            service: acc.service + curr.service_rating,
            atmosphere: acc.atmosphere + curr.atmosphere_rating,
            value: acc.value + curr.value_rating,
        }),
        { food: 0, drink: 0, service: 0, atmosphere: 0, value: 0 }
    )

    const finalAvg = {
        food: averages.food / count,
        drink: averages.drink / count,
        service: averages.service / count,
        atmosphere: averages.atmosphere / count,
        value: averages.value / count,
    }

    const categories = [
        { label: 'Jídlo', value: finalAvg.food, color: 'bg-orange-500' },
        { label: 'Pití', value: finalAvg.drink, color: 'bg-blue-500' },
        { label: 'Obsluha', value: finalAvg.service, color: 'bg-purple-500' },
        { label: 'Prostředí', value: finalAvg.atmosphere, color: 'bg-green-500' },
        { label: 'Cena/Výkon', value: finalAvg.value, color: 'bg-yellow-500' },
    ]

    const totalScore = Object.values(finalAvg).reduce((a, b) => a + b, 0) / 5

    return (
        <div className="bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-zinc-200">Celkové Skóre</h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                    {totalScore.toFixed(1)}
                </div>
            </div>

            <div className="space-y-4">
                {categories.map((cat, i) => (
                    <div key={cat.label} className="space-y-1">
                        <div className="flex justify-between text-sm text-zinc-400">
                            <span>{cat.label}</span>
                            <span className="font-medium text-zinc-200">{cat.value.toFixed(1)}</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(cat.value / 10) * 100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                className={`h-full rounded-full ${cat.color}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
