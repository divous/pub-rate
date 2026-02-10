'use client'

import { Trash2 } from 'lucide-react'
import { deleteVisit } from '@/app/visits/delete-action'
import { useState } from 'react'

export function DeleteVisitButton({ visitId }: { visitId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this visit? This allows cannot be undone and will remove all ratings.')) {
            setIsDeleting(true)
            await deleteVisit(visitId)
            // No need to set false as we redirect
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors disabled:opacity-50"
            title="Delete Visit"
        >
            <Trash2 className="w-5 h-5" />
        </button>
    )
}
