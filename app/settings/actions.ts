'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
    const supabase = await createClient()

    // Check auth - strict admin check could be here, but for friends app, auth is enough for now
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        // return { error: 'Not authenticated' }
        return
    }

    const food = parseFloat(formData.get('food') as string)
    const drink = parseFloat(formData.get('drink') as string)
    const service = parseFloat(formData.get('service') as string)
    const atmosphere = parseFloat(formData.get('atmosphere') as string)
    const value = parseFloat(formData.get('value') as string)

    // Update the single row. We assume there's only one row or we use a fixed ID if we knew it, 
    // but since we inserted one default row, we can just update all or the first one.
    // Best practice: use a known ID or Ensure Singleton.
    // We'll update where id is not null (unsafe but works if only 1 row) or better, fetch first.

    // Let's iterate or just update the first found.
    // To be safe, let's just update all rows (should be 1).
    const { error } = await supabase
        .from('settings')
        .update({
            food_weight: food,
            drink_weight: drink,
            service_weight: service,
            atmosphere_weight: atmosphere,
            value_weight: value
        })
        .neq('id', '00000000-0000-0000-0000-000000000000') // Dummy filter to match all valid UUIDs

    if (error) {
        console.error('Error updating settings:', error)
        // return { error: 'Failed to update' }
        return
    }

    revalidatePath('/settings')
    // return { success: true }
}
