// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          created_at: string
          plan: 'free' | 'pro' | 'business'
          usage_count: number
          is_admin: boolean
          base_currency: string | null
          locale: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          subscription_end_date: string | null
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          plan?: 'free' | 'pro' | 'business'
          usage_count?: number
          is_admin?: boolean
          base_currency?: string | null
          locale?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_end_date?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          plan?: 'free' | 'pro' | 'business'
          usage_count?: number
          is_admin?: boolean
          base_currency?: string | null
          locale?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_end_date?: string | null
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
          extracted_data: any | null
          output_json: DealOutput | DealOutputV2
          output_markdown: string | null
          status: 'done' | 'error'
          error_message: string | null
          model_version: string | null
          schema_version: 'v1' | 'v2'
        }
        Insert: {
          id?: string
          deal_id: string
          user_id: string
          round_number: number
          created_at?: string
          note?: string | null
          extracted_text?: string | null
          extracted_data?: any | null
          output_json: DealOutput | DealOutputV2
          output_markdown?: string | null
          status?: 'done' | 'error'
          error_message?: string | null
          model_version?: string | null
          schema_version?: 'v1' | 'v2'
        }
        Update: {
          id?: string
          deal_id?: string
          user_id?: string
          round_number?: number
          created_at?: string
          note?: string | null
          extracted_text?: string | null
          extracted_data?: any | null
          output_json?: DealOutput | DealOutputV2
          output_markdown?: string | null
          status?: 'done' | 'error'
          error_message?: string | null
          model_version?: string | null
          schema_version?: 'v1' | 'v2'
        }
      }
    }
  }
}

// Deal output structure (V1)
export type RedFlag = {
  type: string
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
  category?: string
  description?: string
  verdict: string
  verdict_type: 'negotiate' | 'competitive' | 'overpay_risk'
  price_insight?: string
  snapshot: {
    vendor_product: string
    term: string
    total_commitment: string
    currency?: string
    billing_payment: string
    pricing_model: string
    deal_type: string
    renewal_date?: string
    signing_deadline?: string
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
  potential_savings?: Array<{
    ask: string
    annual_impact: string
    confidence: 'high' | 'medium' | 'low'
    rationale?: string
  }>
  cash_flow_improvements?: Array<{
    type: string
    recommendation: string
    category: 'cash_flow' | 'risk_protection' | 'liability'
  }>
  score?: number
  score_label?: string
  score_breakdown?: {
    pricing_fairness: number
    terms_protections: number
    leverage_position: number
    pricing_deductions?: Array<{ points: number; reason: string }>
    terms_deductions?: Array<{ points: number; reason: string }>
    leverage_deductions?: Array<{ points: number; reason: string }>
  }
  score_rationale?: string
  email_drafts: {
    neutral: EmailDraft
    firm: EmailDraft
    final_push: EmailDraft
  }
  assumptions: string[]
  disclaimer: string
}

// V2 Schema Types
export type PriorityPoint = {
  title: string
  why_it_matters: string
  recommended_direction: string
}

export type EmailControls = {
  tone_preference: 'soft' | 'balanced' | 'firm'
  supplier_relationship: 'new' | 'existing' | 'renewal' | 'unknown'
  email_goal: 'clarify' | 'negotiate' | 'revise' | 'accept'
  user_notes?: string
}

export type DealOutputV2 = {
  schema_version: 'v2'
  deal_snapshot: {
    audience: 'business' | 'personal'
    quote_type:
      | 'saas_software'
      | 'consulting_services'
      | 'home_improvement'
      | 'marketing_agency'
      | 'hardware_equipment'
      | 'managed_services'
      | 'professional_services'
      | 'household_services'
      | 'construction'
      | 'maintenance'
      | 'other'
    deal_type: 'new_purchase' | 'renewal' | 'expansion' | 'trial_conversion' | 'unknown'
    pricing_model:
      | 'fixed_fee'
      | 'per_seat'
      | 'usage_based'
      | 'tiered'
      | 'hybrid'
      | 'quote_based'
      | 'hourly'
      | 'milestone'
      | 'unclear'
    leverage_level: 'high' | 'medium' | 'low' | 'unclear'
    main_negotiation_angle:
      | 'price'
      | 'flexibility'
      | 'scope_clarity'
      | 'payment_terms'
      | 'commitment_length'
      | 'renewal_terms'
      | 'bundling'
      | 'none'
    overall_assessment: string
  }
  commercial_facts: {
    supplier: string
    total_value: string
    currency: string
    term_length: string
    billing_structure: string
    key_elements: string[]
    unclear_or_missing: string[]
  }
  dominant_issue: {
    title: string
    explanation: string
  }
  priority_points: PriorityPoint[]
  low_priority_or_acceptable: string[]
  recommended_strategy: {
    posture:
      | 'no_push_needed'
      | 'soft_clarification'
      | 'collaborative_optimization'
      | 'standard_negotiation'
      | 'firm_pushback'
      | 'structural_rethink'
    summary: string
    success_looks_like: string
  }
  email_controls: EmailControls
}

// Negotiation preferences (stored in profiles.negotiation_preferences JSONB)
export type NegotiationPreferences = {
  payment_terms: 'net_30' | 'net_60' | 'net_90' | 'no_preference'
  top_priority: 'lowest_price' | 'best_terms' | 'max_flexibility'
  auto_renewal: 'fine' | 'prefer_opt_in'
}

// UI types
export type Deal = Database['public']['Tables']['deals']['Row']
export type Round = Database['public']['Tables']['rounds']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export type DealWithRounds = Deal & {
  rounds: Round[]
}
