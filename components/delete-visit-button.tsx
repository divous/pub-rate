'use client'

import { Trash2, AlertTriangle } from 'lucide-react'
import { deleteVisit } from '@/app/visits/delete-action'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function DeleteVisitButton({ visitId }: { visitId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        await deleteVisit(visitId)
        // No need to set false as we redirect
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                title="Smazat Návštěvu"
            >
                <Trash2 className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl max-w-sm w-full z-10"
                        >
                            <div className="flex items-center gap-4 mb-4 text-red-500">
                                <div className="p-3 bg-red-500/10 rounded-full">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Smazat Návštěvu?</h3>
                            </div>

                            <p className="text-zinc-400 text-sm mb-6">
                                Jste si jistí? Toto trvale odstraní návštěvu a všechna asociovaná hodnocení. Tato akce je nevratná.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-zinc-400 hover:text-white font-medium transition-colors"
                                >
                                    Zrušit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? 'Mažu...' : 'Smazat'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
