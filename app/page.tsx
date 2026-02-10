import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Settings } from 'lucide-react'
import { VisitCard } from '@/components/visit-card'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch visits with their ratings for average calculation
  // We explicitly type the query or use automatic type inference if generated types existed
  const { data: visits } = await supabase
    .from('visits')
    .select(`
      id,
      restaurant_name,
      visit_date,
      ratings (
        food_rating,
        drink_rating,
        service_rating,
        atmosphere_rating,
        value_rating
      )
    `)
    .order('visit_date', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 pb-24 md:p-8">
      <header className="max-w-3xl mx-auto flex items-center justify-between mb-10 mt-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Your Visits
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Track and rate your culinary adventures.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/settings" className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
          <div className="h-10 w-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
            {/* User Avatar Placeholder or basic img */}
            <img src={user.user_metadata.avatar_url} alt="User" className="h-full w-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto space-y-4">
        {visits && visits.length > 0 ? (
          visits.map((visit, index) => (
            <VisitCard key={visit.id} visit={visit} index={index} />
          ))
        ) : (
          <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800 border-dashed">
            <p className="text-zinc-500">No visits recorded yet.</p>
            <p className="text-zinc-600 text-sm">Start by adding your first restaurant!</p>
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile / Desktop */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
        <Link
          href="/visits/new"
          className="flex items-center justify-center w-14 h-14 bg-white text-zinc-950 rounded-full shadow-lg shadow-white/10 hover:scale-110 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  )
}
