'use client'

import { useState } from 'react'
import { submitRating } from '@/app/visits/[id]/actions'
import { motion } from 'framer-motion'

interface RatingFormProps {
    visitId: string
    existingRating?: any // TODO: Type properly
}

export function RatingForm({ visitId, existingRating }: RatingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initial values
    const [scores, setScores] = useState({
        food: existingRating?.food_rating || 5,
        drink: existingRating?.drink_rating || 5,
        service: existingRating?.service_rating || 5,
        atmosphere: existingRating?.atmosphere_rating || 5,
        value: existingRating?.value_rating || 5,
    })

    // Handlers
    const handleScoreChange = (category: keyof typeof scores, value: number) => {
        setScores(prev => ({ ...prev, [category]: value }))
    }

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        await submitRating(visitId, formData)
        setIsSubmitting(false)
    }

    const sliders = [
        { id: 'food', label: 'Jídlo', min: 1, max: 10 },
        { id: 'drink', label: 'Pití', min: 1, max: 10 },
        { id: 'service', label: 'Obsluha', min: 1, max: 10 },
        { id: 'atmosphere', label: 'Prostředí', min: 1, max: 10 },
        { id: 'value', label: 'Cena/Výkon', min: 1, max: 10 },
    ]

    return (
        <div className="bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-200 mb-6">Vaše Hodnocení</h3>
            <form action={handleSubmit} className="space-y-6">

                {sliders.map(slider => (
                    <div key={slider.id} className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <label htmlFor={slider.id} className="text-zinc-400 font-medium">
                                {slider.label}
                            </label>
                            <span className="text-zinc-200 font-bold bg-zinc-800 px-2 py-0.5 rounded-md min-w-[30px] text-center">
                                {scores[slider.id as keyof typeof scores]}
                            </span>
                        </div>
                        <input
                            type="range"
                            name={slider.id}
                            id={slider.id}
                            min={slider.min}
                            max={slider.max}
                            value={scores[slider.id as keyof typeof scores]}
                            onChange={(e) => handleScoreChange(slider.id as keyof typeof scores, Number(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                ))}

                <div className="space-y-2 pt-2">
                    <label htmlFor="note" className="text-zinc-400 text-sm font-medium">Poznámka</label>
                    <textarea
                        name="note"
                        id="note"
                        rows={3}
                        defaultValue={existingRating?.note || ''}
                        placeholder="Jaké to bylo?"
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-zinc-950 font-bold py-4 rounded-xl shadow-lg shadow-white/5 hover:bg-zinc-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Ukládám...' : existingRating ? 'Upravit Hodnocení' : 'Odeslat Hodnocení'}
                </button>
            </form>
        </div>
    )
}
