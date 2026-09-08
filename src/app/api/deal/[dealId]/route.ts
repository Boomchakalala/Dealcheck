import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { deleteDeal } from '@/lib/deal-deletion'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const { dealId } = await params
    const supabase = await createClient()

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get deal to check ownership
    const { data: deal } = await supabase
      .from('deals')
      .select('user_id, status')
      .eq('id', dealId)
      .single()

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    if (deal.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Service role: rounds cascade, linked negotiation requests and their
    // stored documents are removed explicitly (ownership verified above).
    const result = await deleteDeal(createAdminClient(), dealId)
    console.log(`[deal-delete] removed; negotiation requests: ${result.requestsDeleted}, documents: ${result.documentsDeleted}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete deal error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}
