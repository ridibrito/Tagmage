export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          plan: string
          status: 'active' | 'suspended' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: string
          status?: 'active' | 'suspended' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: string
          status?: 'active' | 'suspended' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          tenant_id: string
          name: string
          email: string
          role: 'owner' | 'admin' | 'member'
          auth_provider: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          email: string
          role?: 'owner' | 'admin' | 'member'
          auth_provider?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          email?: string
          role?: 'owner' | 'admin' | 'member'
          auth_provider?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      licenses: {
        Row: {
          id: string
          tenant_id: string
          provider: 'hotmart' | 'kiwify'
          external_purchase_id: string
          sku: string | null
          status: 'pending' | 'approved' | 'refunded' | 'cancelled' | 'expired'
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          provider: 'hotmart' | 'kiwify'
          external_purchase_id: string
          sku?: string | null
          status?: 'pending' | 'approved' | 'refunded' | 'cancelled' | 'expired'
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          provider?: 'hotmart' | 'kiwify'
          external_purchase_id?: string
          sku?: string | null
          status?: 'pending' | 'approved' | 'refunded' | 'cancelled' | 'expired'
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      providers: {
        Row: {
          id: string
          tenant_id: string
          type: 'meta'
          status: 'active' | 'inactive' | 'error'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          type: 'meta'
          status?: 'active' | 'inactive' | 'error'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          type?: 'meta'
          status?: 'active' | 'inactive' | 'error'
          created_at?: string
          updated_at?: string
        }
      }
      provider_connections: {
        Row: {
          id: string
          tenant_id: string
          provider_id: string
          meta_user_id: string | null
          access_token_encrypted: string
          refresh_token_encrypted: string | null
          token_expires_at: string | null
          permissions: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          provider_id: string
          meta_user_id?: string | null
          access_token_encrypted: string
          refresh_token_encrypted?: string | null
          token_expires_at?: string | null
          permissions?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          provider_id?: string
          meta_user_id?: string | null
          access_token_encrypted?: string
          refresh_token_encrypted?: string | null
          token_expires_at?: string | null
          permissions?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      meta_businesses: {
        Row: {
          id: string
          tenant_id: string
          provider_id: string
          business_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          provider_id: string
          business_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          provider_id?: string
          business_id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      meta_ad_accounts: {
        Row: {
          id: string
          tenant_id: string
          provider_id: string
          business_id: string | null
          account_id: string
          name: string
          currency: string | null
          timezone: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          provider_id: string
          business_id?: string | null
          account_id: string
          name: string
          currency?: string | null
          timezone?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          provider_id?: string
          business_id?: string | null
          account_id?: string
          name?: string
          currency?: string | null
          timezone?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meta_campaigns: {
        Row: {
          id: string
          tenant_id: string
          account_id: string
          campaign_id: string
          name: string
          objective: string | null
          status: string | null
          start_time: string | null
          stop_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          account_id: string
          campaign_id: string
          name: string
          objective?: string | null
          status?: string | null
          start_time?: string | null
          stop_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          account_id?: string
          campaign_id?: string
          name?: string
          objective?: string | null
          status?: string | null
          start_time?: string | null
          stop_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      insights_daily: {
        Row: {
          id: string
          tenant_id: string
          date: string
          level: 'campaign' | 'adset' | 'ad'
          account_id: string
          campaign_id: string | null
          adset_id: string | null
          ad_id: string | null
          spend: number
          impressions: number
          clicks: number
          reach: number
          leads: number
          purchases: number
          cpm: number | null
          cpc: number | null
          ctr: number | null
          cpl: number | null
          cpa: number | null
          roas: number | null
          objective: string | null
          platform: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          date: string
          level: 'campaign' | 'adset' | 'ad'
          account_id: string
          campaign_id?: string | null
          adset_id?: string | null
          ad_id?: string | null
          spend?: number
          impressions?: number
          clicks?: number
          reach?: number
          leads?: number
          purchases?: number
          cpm?: number | null
          cpc?: number | null
          ctr?: number | null
          cpl?: number | null
          cpa?: number | null
          roas?: number | null
          objective?: string | null
          platform?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          date?: string
          level?: 'campaign' | 'adset' | 'ad'
          account_id?: string
          campaign_id?: string | null
          adset_id?: string | null
          ad_id?: string | null
          spend?: number
          impressions?: number
          clicks?: number
          reach?: number
          leads?: number
          purchases?: number
          cpm?: number | null
          cpc?: number | null
          ctr?: number | null
          cpl?: number | null
          cpa?: number | null
          roas?: number | null
          objective?: string | null
          platform?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      vw_insights_campaign_daily: {
        Row: {
          tenant_id: string
          date: string
          account_id: string
          campaign_id: string | null
          spend: number
          impressions: number
          clicks: number
          reach: number
          leads: number
          purchases: number
          cpm: number | null
          cpc: number | null
          ctr: number | null
          cpl: number | null
          cpa: number | null
          roas: number | null
          objective: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

