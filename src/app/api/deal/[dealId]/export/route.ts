import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { AnalysisPDF } from '@/lib/pdf-template'
import { cookies } from 'next/headers'
import React from 'react'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const { dealId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the deal and latest round
    const { data: deal } = await supabase
      .from('deals')
      .select('*, rounds(*)')
      .eq('id', dealId)
      .eq('user_id', user.id)
      .single()

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const rounds = (deal as any).rounds || []
    const latestRound = rounds.sort((a: any, b: any) => b.round_number - a.round_number)[0]

    if (!latestRound?.output_json) {
      return NextResponse.json({ error: 'No analysis found' }, { status: 404 })
    }

    const locale = (await cookies()).get('termlift_lang')?.value || 'en'

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(AnalysisPDF, {
        output: latestRound.output_json,
        locale,
      }) as any
    )

    // Build filename
    const vendor = deal.vendor || 'analysis'
    const safeName = vendor.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').toLowerCase()
    const filename = `termlift-${safeName}-${new Date().toISOString().split('T')[0]}.pdf`

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
