import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { ScoreDisplay } from '@/components/score-display'
import { RatingForm } from '@/components/rating-form'
import { DeleteVisitButton } from '@/components/delete-visit-button'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function VisitPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch visit details and all ratings
    const { data: visit, error } = await supabase
        .from('visits')
        .select(`
      *,
      ratings (*)
    `)
        .eq('id', id)
        .single()

    if (error || !visit) {
        return <div className="p-8 text-center bg-zinc-950 text-white h-screen">Visit not found</div>
    }

    // Find user's existing rating
    const userRating = visit.ratings.find((r: any) => r.user_id === user.id)

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 pb-20 md:p-8">
            <header className="max-w-2xl mx-auto mb-8 flex items-center relative justify-center">
                <Link href="/" className="absolute left-0 p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-zinc-400" />
                </Link>
                <div className="text-center">
                    <h1 className="text-xl font-bold">{visit.restaurant_name}</h1>
                    <p className="text-xs text-zinc-500">{format(new Date(visit.visit_date), 'MMMM d, yyyy')}</p>
                </div>
                <div className="absolute right-0">
                    <DeleteVisitButton visitId={id} />
                </div>
            </header>

            <main className="max-w-2xl mx-auto space-y-8">
                {/* Aggregated Score Display */}
                <ScoreDisplay ratings={visit.ratings} />

                {/* User Rating Form */}
                <RatingForm visitId={id} existingRating={userRating} />

                {/* Friends Reviews List */}
                {visit.ratings.length > 0 && (
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-zinc-300 px-2">Friends' Interactions</h3>
                        {visit.ratings.map((rating: any) => (
                            rating.note ? (
                                <div key={rating.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                                    <p className="text-zinc-600 text-xs mb-1">Review</p>
                                    <p className="text-zinc-300 italic">"{rating.note}"</p>
                                </div>
                            ) : null
                        ))}
                        {visit.ratings.filter((r: any) => r.note).length === 0 && (
                            <p className="text-zinc-500 text-sm px-2">No written reviews yet.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
