export const supabase: any = {
  auth: {
    signUp: async () => ({ data: null, error: null }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null } }),
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: async () => ({ data: [], error: null }),
    update: async () => ({ data: [], error: null }),
    delete: async () => ({ data: [], error: null }),
    eq: () => ({
      select: () => ({ data: [], error: null }),
      update: async () => ({ data: [], error: null }),
      delete: async () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
      order: () => ({ data: [], error: null }),
    }),
    order: () => ({ data: [], error: null }),
    single: () => ({ data: null, error: null }),
  }),
};