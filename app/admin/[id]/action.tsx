'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleApproval(Id: string, is_approved: boolean) {
  await db.articles_mod.update({
    where: { id: Id },
    data: { is_approved: is_approved },
  })

revalidatePath(`/admin/${Id}`) // update this to your actual route if different
}
