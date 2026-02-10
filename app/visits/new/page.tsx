import { createVisit } from './actions'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function NewVisitPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center">
            <header className="w-full max-w-lg mb-8 flex items-center relative">
                <Link href="/" className="absolute left-0 p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-zinc-400" />
                </Link>
                <h1 className="w-full text-center text-xl font-semibold">New Visit</h1>
            </header>

            <main className="w-full max-w-lg">
                <form action={createVisit} className="space-y-6">

                    <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-6">

                        <div className="space-y-2">
                            <label htmlFor="restaurantName" className="text-sm font-medium text-zinc-400 ml-1">
                                Restaurant
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-3.5 text-zinc-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    name="restaurantName"
                                    id="restaurantName"
                                    required
                                    placeholder="e.g. The Fancy Fork"
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="visitDate" className="text-sm font-medium text-zinc-400 ml-1">
                                Date
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-3.5 text-zinc-500">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <input
                                    type="date"
                                    name="visitDate"
                                    id="visitDate"
                                    required
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-zinc-950 font-bold py-4 rounded-xl shadow-lg shadow-white/5 hover:bg-zinc-100 active:scale-[0.98] transition-all"
                    >
                        Create Visit
                    </button>
                </form>
            </main>
        </div>
    )
}
