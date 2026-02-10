'use client'

import { format } from 'date-fns'
import { Calendar, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface VisitCardProps {
    visit: {
        id: string
        restaurant_name: string
        visit_date: string
        // TODO: Add rating types later
        ratings?: {
            food_rating: number
            drink_rating: number
            service_rating: number
            atmosphere_rating: number
            value_rating: number
        }[]
    }
    index: number
}

export function VisitCard({ visit, index }: VisitCardProps) {
    // Calculate average if ratings exist
    const avgRating = visit.ratings && visit.ratings.length > 0
        ? visit.ratings.reduce((acc, curr) => {
            const visitAvg = (curr.food_rating + curr.drink_rating + curr.service_rating + curr.atmosphere_rating + curr.value_rating) / 5
            return acc + visitAvg
        }, 0) / visit.ratings.length
        : null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Link
                href={`/visits/${visit.id}`}
                className="group block relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-purple-500/10"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                                {visit.restaurant_name}
                            </h3>
                            <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(visit.visit_date), 'MMMM d, yyyy')}</span>
                            </div>
                        </div>

                        {avgRating ? (
                            <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-500/20">
                                <Star className="w-4 h-4 fill-current" />
                                <span>{avgRating.toFixed(1)}</span>
                            </div>
                        ) : (
                            <div className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-500 border border-zinc-700">
                                Bez hodnocení
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-zinc-500 mt-2">
                        <span>{visit.ratings?.length || 0} hodnocení</span>
                        <div className="group-hover:translate-x-1 transition-transform">
                            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
