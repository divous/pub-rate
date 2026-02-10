'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitRating(visitId: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        // return { error: 'Not authenticated' }
        return
    }

    // Extract values
    const foodTime = Number(formData.get('food'))
    const drink = Number(formData.get('drink'))
    const service = Number(formData.get('service'))
    const atmosphere = Number(formData.get('atmosphere'))
    const value = Number(formData.get('value'))
    const note = formData.get('note') as string

    // Upsert rating
    const { error } = await supabase
        .from('ratings')
        .upsert({
            visit_id: visitId,
            user_id: user.id,
            food_rating: foodTime,
            drink_rating: drink,
            service_rating: service,
            atmosphere_rating: atmosphere,
            value_rating: value,
            note: note,
        }, { onConflict: 'visit_id, user_id' })

    if (error) {
        console.error('Error submitting rating:', error)
        // return { error: 'Failed to submit rating' }
        return
    }

    revalidatePath(`/visits/${visitId}`)
    revalidatePath('/')
    // return { success: true }
}
