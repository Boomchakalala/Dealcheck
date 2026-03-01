// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          plan: 'free' | 'pro'
          usage_count: number
          is_admin: boolean
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          plan?: 'free' | 'pro'
          usage_count?: number
          is_admin?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          plan?: 'free' | 'pro'
          usage_count?: number
          is_admin?: boolean
        }
      }
      deals: {
        Row: {
          id: string
          user_id: string
          vendor: string | null
          title: string
          deal_type: 'New' | 'Renewal'
          goal: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vendor?: string | null
          title: string
          deal_type: 'New' | 'Renewal'
          goal?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vendor?: string | null
          title?: string
          deal_type?: 'New' | 'Renewal'
          goal?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rounds: {
        Row: {
          id: string
          deal_id: string
          user_id: string
          round_number: number
          created_at: string
          note: string | null
          extracted_text: string | null
          output_json: DealOutput
          output_markdown: string
          status: 'done' | 'error'
          error_message: string | null
          model_version: string | null
        }
        Insert: {
          id?: string
          deal_id: string
          user_id: string
          round_number: number
          created_at?: string
          note?: string | null
          extracted_text?: string | null
          output_json: DealOutput
          output_markdown: string
          status?: 'done' | 'error'
          error_message?: string | null
          model_version?: string | null
        }
        Update: {
          id?: string
          deal_id?: string
          user_id?: string
          round_number?: number
          created_at?: string
          note?: string | null
          extracted_text?: string | null
          output_json?: DealOutput
          output_markdown?: string
          status?: 'done' | 'error'
          error_message?: string | null
          model_version?: string | null
        }
      }
    }
  }
}

// Deal output structure
export type RedFlag = {
  type: 'Commercial' | 'Legal' | 'Operational' | 'Security'
  issue: string
  why_it_matters: string
  what_to_ask_for: string
  if_they_push_back: string
}

export type EmailDraft = {
  subject: string
  body: string
}

export type DealOutput = {
  title: string
  vendor: string
  snapshot: {
    vendor_product: string
    term: string
    total_commitment: string
    billing_payment: string
    pricing_model: string
    deal_type: string
  }
  quick_read: {
    whats_solid: string[]
    whats_concerning: string[]
    conclusion: string
  }
  red_flags: RedFlag[]
  negotiation_plan: {
    leverage_you_have: string[]
    must_have_asks: string[]
    nice_to_have_asks: string[]
    trades_you_can_offer: string[]
  }
  what_to_ask_for: {
    must_have: string[]
    nice_to_have: string[]
  }
  email_drafts: {
    neutral: EmailDraft
    firm: EmailDraft
    final_push: EmailDraft
  }
  assumptions: string[]
  disclaimer: string
}

// UI types
export type Deal = Database['public']['Tables']['deals']['Row']
export type Round = Database['public']['Tables']['rounds']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export type DealWithRounds = Deal & {
  rounds: Round[]
}
