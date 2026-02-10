import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sliders } from 'lucide-react'
import { updateSettings } from './actions'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .single()

    // defaults if empty
    const weights = settings || {
        food_weight: 1.0,
        drink_weight: 1.0,
        service_weight: 1.0,
        atmosphere_weight: 1.0,
        value_weight: 1.0
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center">
            <header className="w-full max-w-lg mb-8 flex items-center relative">
                <Link href="/" className="absolute left-0 p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-zinc-400" />
                </Link>
                <h1 className="w-full text-center text-xl font-semibold">Settings</h1>
            </header>

            <main className="w-full max-w-lg">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <Sliders className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Rating Weights</h2>
                            <p className="text-sm text-zinc-400">Adjust how much each category affects the score.</p>
                        </div>
                    </div>

                    <form action={updateSettings} className="space-y-6">
                        {[
                            { id: 'food', label: 'Food', val: weights.food_weight },
                            { id: 'drink', label: 'Drink', val: weights.drink_weight },
                            { id: 'service', label: 'Service', val: weights.service_weight },
                            { id: 'atmosphere', label: 'Atmosphere', val: weights.atmosphere_weight },
                            { id: 'value', label: 'Value', val: weights.value_weight },
                        ].map((item) => (
                            <div key={item.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <label htmlFor={item.id} className="text-zinc-300 font-medium">{item.label}</label>
                                </div>
                                <input
                                    type="number"
                                    name={item.id}
                                    id={item.id}
                                    step="0.1"
                                    min="0.1"
                                    max="5.0"
                                    defaultValue={item.val}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="w-full bg-white text-zinc-950 font-bold py-3 rounded-xl hover:bg-zinc-100 transition-colors"
                        >
                            Save Weights
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
