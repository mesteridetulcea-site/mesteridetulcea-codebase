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
export type PhotoType = "profile" | "work" | "certificate"

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
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      mester_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          bio: string | null
          years_experience: number | null
          subscription_tier: SubscriptionTier
          approval_status: ApprovalStatus
          is_featured: boolean
          whatsapp_number: string | null
          neighborhood: string | null
          city: string
          avg_rating: number
          reviews_count: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          bio?: string | null
          years_experience?: number | null
          subscription_tier?: SubscriptionTier
          approval_status?: ApprovalStatus
          is_featured?: boolean
          whatsapp_number?: string | null
          neighborhood?: string | null
          city?: string
          avg_rating?: number
          reviews_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          bio?: string | null
          years_experience?: number | null
          subscription_tier?: SubscriptionTier
          approval_status?: ApprovalStatus
          is_featured?: boolean
          whatsapp_number?: string | null
          neighborhood?: string | null
          city?: string
          avg_rating?: number
          reviews_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      mester_categories: {
        Row: {
          mester_id: string
          category_id: string
        }
        Insert: {
          mester_id: string
          category_id: string
        }
        Update: {
          mester_id?: string
          category_id?: string
        }
      }
      mester_photos: {
        Row: {
          id: string
          mester_id: string
          storage_path: string
          public_url: string
          photo_type: PhotoType
          caption: string | null
          approval_status: ApprovalStatus
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          mester_id: string
          storage_path: string
          public_url: string
          photo_type?: PhotoType
          caption?: string | null
          approval_status?: ApprovalStatus
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          mester_id?: string
          storage_path?: string
          public_url?: string
          photo_type?: PhotoType
          caption?: string | null
          approval_status?: ApprovalStatus
          sort_order?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          mester_id: string
          client_id: string
          rating: number
          title: string | null
          body: string | null
          approval_status: "pending" | "approved" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mester_id: string
          client_id: string
          rating: number
          title?: string | null
          body?: string | null
          approval_status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mester_id?: string
          client_id?: string
          rating?: number
          title?: string | null
          body?: string | null
          approval_status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          client_id: string
          mester_id: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          mester_id: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          mester_id?: string
          created_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          client_id: string | null
          original_message: string
          detected_category_id: string | null
          notified_mesters: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          original_message: string
          detected_category_id?: string | null
          notified_mesters?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          original_message?: string
          detected_category_id?: string | null
          notified_mesters?: string[] | null
          created_at?: string
        }
      }
      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          target_type: string
          target_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          target_type: string
          target_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          target_type?: string
          target_id?: string
          notes?: string | null
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
export type MesterProfile = Database["public"]["Tables"]["mester_profiles"]["Row"]
export type MesterCategory = Database["public"]["Tables"]["mester_categories"]["Row"]
export type MesterPhoto = Database["public"]["Tables"]["mester_photos"]["Row"]
export type Review = Database["public"]["Tables"]["reviews"]["Row"]
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"]
export type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"]
export type AdminLog = Database["public"]["Tables"]["admin_logs"]["Row"]

// Extended types with relations
export type CategoryRef = {
  category_id: string
  category: Category | null
}

export type MesterWithCategory = MesterProfile & {
  mester_categories: CategoryRef[]
}

export type MesterWithDetails = MesterProfile & {
  mester_categories: CategoryRef[]
  profile: Profile | null
  photos: MesterPhoto[]
}

export type ReviewWithUser = Review & {
  profile: Pick<Profile, "full_name" | "avatar_url"> | null
}
