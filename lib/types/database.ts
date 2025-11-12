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
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          website: string | null
          industry: string | null
          timezone: string
          currency: string
          language: string
          max_users: number
          max_contacts: number
          plan: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          website?: string | null
          industry?: string | null
          timezone?: string
          currency?: string
          language?: string
          max_users?: number
          max_contacts?: number
          plan?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          website?: string | null
          industry?: string | null
          timezone?: string
          currency?: string
          language?: string
          max_users?: number
          max_contacts?: number
          plan?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          organization_id: string
          name: string
          email: string
          avatar_url: string | null
          phone: string | null
          role: string
          timezone: string
          language: string
          email_sender_name: string | null
          email_sender_role: string | null
          email_signature: string | null
          calendar_link: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          name: string
          email: string
          avatar_url?: string | null
          phone?: string | null
          role?: string
          timezone?: string
          language?: string
          email_sender_name?: string | null
          email_sender_role?: string | null
          email_signature?: string | null
          calendar_link?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          phone?: string | null
          role?: string
          timezone?: string
          language?: string
          email_sender_name?: string | null
          email_sender_role?: string | null
          email_signature?: string | null
          calendar_link?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          organization_id: string
          owner_id: string | null
          company_id: string | null
          name: string
          email: string | null
          phone: string | null
          mobile: string | null
          whatsapp: string | null
          job_title: string | null
          department: string | null
          seniority: string | null
          linkedin_url: string | null
          twitter_url: string | null
          street: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string
          rfc: string | null
          cnpj: string | null
          lifecycle_stage: string
          lead_score: number
          lead_status: string
          source: string | null
          tags: string[] | null
          email_opt_in: boolean
          whatsapp_opt_in: boolean
          last_contacted_at: string | null
          last_activity_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          owner_id?: string | null
          company_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          mobile?: string | null
          whatsapp?: string | null
          job_title?: string | null
          department?: string | null
          seniority?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          rfc?: string | null
          cnpj?: string | null
          lifecycle_stage?: string
          lead_score?: number
          lead_status?: string
          source?: string | null
          tags?: string[] | null
          email_opt_in?: boolean
          whatsapp_opt_in?: boolean
          last_contacted_at?: string | null
          last_activity_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          owner_id?: string | null
          company_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          mobile?: string | null
          whatsapp?: string | null
          job_title?: string | null
          department?: string | null
          seniority?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          rfc?: string | null
          cnpj?: string | null
          lifecycle_stage?: string
          lead_score?: number
          lead_status?: string
          source?: string | null
          tags?: string[] | null
          email_opt_in?: boolean
          whatsapp_opt_in?: boolean
          last_contacted_at?: string | null
          last_activity_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed
      [key: string]: any
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

