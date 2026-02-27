export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionTier = "ucenic" | "mester" | "master" | "premium"
export type ApprovalStatus = "pending" | "approved" | "rejected"
export type UserRole = "client" | "mester" | "admin"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          keywords: string[] | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          keywords?: string[] | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          keywords?: string[] | null
          order_index?: number
          created_at?: string
        }
      }
      mesters: {
        Row: {
          id: string
          profile_id: string
          category_id: string
          slug: string
          business_name: string
          description: string | null
          experience_years: number | null
          subscription_tier: SubscriptionTier
          approval_status: ApprovalStatus
          is_featured: boolean
          whatsapp_number: string | null
          address: string | null
          city: string
          average_rating: number
          total_reviews: number
          total_views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          category_id: string
          slug: string
          business_name: string
          description?: string | null
          experience_years?: number | null
          subscription_tier?: SubscriptionTier
          approval_status?: ApprovalStatus
          is_featured?: boolean
          whatsapp_number?: string | null
          address?: string | null
          city?: string
          average_rating?: number
          total_reviews?: number
          total_views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          category_id?: string
          slug?: string
          business_name?: string
          description?: string | null
          experience_years?: number | null
          subscription_tier?: SubscriptionTier
          approval_status?: ApprovalStatus
          is_featured?: boolean
          whatsapp_number?: string | null
          address?: string | null
          city?: string
          average_rating?: number
          total_reviews?: number
          total_views?: number
          created_at?: string
          updated_at?: string
        }
      }
      mester_photos: {
        Row: {
          id: string
          mester_id: string
          url: string
          caption: string | null
          is_cover: boolean
          approval_status: ApprovalStatus
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          mester_id: string
          url: string
          caption?: string | null
          is_cover?: boolean
          approval_status?: ApprovalStatus
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          mester_id?: string
          url?: string
          caption?: string | null
          is_cover?: boolean
          approval_status?: ApprovalStatus
          order_index?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          mester_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mester_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mester_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          mester_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mester_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mester_id?: string
          created_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          user_id: string | null
          query: string
          category_id: string | null
          status: "pending" | "sent" | "completed"
          notified_mesters: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          query: string
          category_id?: string | null
          status?: "pending" | "sent" | "completed"
          notified_mesters?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          query?: string
          category_id?: string | null
          status?: "pending" | "sent" | "completed"
          notified_mesters?: string[] | null
          created_at?: string
        }
      }
      transport_requests: {
        Row: {
          id: string
          user_id: string | null
          pickup_address: string
          pickup_lat: number
          pickup_lng: number
          dropoff_address: string
          dropoff_lat: number
          dropoff_lng: number
          description: string | null
          phone: string
          status: "pending" | "accepted" | "completed" | "cancelled"
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          pickup_address: string
          pickup_lat: number
          pickup_lng: number
          dropoff_address: string
          dropoff_lat: number
          dropoff_lng: number
          description?: string | null
          phone: string
          status?: "pending" | "accepted" | "completed" | "cancelled"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          pickup_address?: string
          pickup_lat?: number
          pickup_lng?: number
          dropoff_address?: string
          dropoff_lat?: number
          dropoff_lng?: number
          description?: string | null
          phone?: string
          status?: "pending" | "accepted" | "completed" | "cancelled"
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          details?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: SubscriptionTier
      approval_status: ApprovalStatus
      user_role: UserRole
    }
  }
}

// Helper types for common operations
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Mester = Database["public"]["Tables"]["mesters"]["Row"]
export type MesterPhoto = Database["public"]["Tables"]["mester_photos"]["Row"]
export type Review = Database["public"]["Tables"]["reviews"]["Row"]
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"]
export type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"]
export type TransportRequest = Database["public"]["Tables"]["transport_requests"]["Row"]
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"]

// Extended types with relations
export type MesterWithCategory = Mester & {
  category: Category
}

export type MesterWithDetails = Mester & {
  category: Category
  profile: Profile
  photos: MesterPhoto[]
}

export type ReviewWithUser = Review & {
  profile: Pick<Profile, "full_name" | "avatar_url">
}
