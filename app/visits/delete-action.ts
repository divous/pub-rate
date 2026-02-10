'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deleteVisit(visitId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return
    }

    // First confirm the visit exists and maybe check permissions
    // For now, we allow any authenticated user to delete (trusted friends app)

    // Delete associated ratings first (manual cascade)
    const { error: ratingsError } = await supabase
        .from('ratings')
        .delete()
        .eq('visit_id', visitId)

    if (ratingsError) {
        console.error('Error deleting ratings:', ratingsError)
        return { error: 'Failed to delete associated ratings' }
    }

    // Delete the visit
    const { error: visitError } = await supabase
        .from('visits')
        .delete()
        .eq('id', visitId)

    if (visitError) {
        console.error('Error deleting visit:', visitError)
        return { error: 'Failed to delete visit' }
    }

    revalidatePath('/')
    redirect('/')
}
