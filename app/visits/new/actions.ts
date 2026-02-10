'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createVisit(formData: FormData) {
    const supabase = await createClient()

    const restaurantName = formData.get('restaurantName') as string
    const visitDate = formData.get('visitDate') as string

    if (!restaurantName || !visitDate) {
        // Basic validation, in real app return errors to form
        // return { error: 'Missing fields' }
        return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        // return { error: 'Not authenticated' }
        return
    }

    // Get profile id - assuming profile exists due to trigger
    // But we can just use user.id referencing profiles.id as they are same in our schema?
    // Schema says: created_by uuid references profiles(id). profiles.id IS auth.users.id.
    // So we can use user.id directly.

    const { error } = await supabase
        .from('visits')
        .insert({
            restaurant_name: restaurantName,
            visit_date: visitDate,
            created_by: user.id
        })

    if (error) {
        console.error('Error creating visit:', error)
        // return { error: 'Failed to create visit' }
        return
    }

    revalidatePath('/')
    redirect('/')
}
