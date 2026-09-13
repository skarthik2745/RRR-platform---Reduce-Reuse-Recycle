import { supabase } from './supabase'

// Climate Events
export const getClimateEvents = async () => {
  const { data, error } = await supabase.from('climate_events').select('*')
  return { data, error }
}

// Green Hall Posts
export const getGreenHallPosts = async () => {
  const { data, error } = await supabase
    .from('green_hall_posts')
    .select('*, profiles(username, full_name)')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createGreenHallPost = async (postData: any) => {
  const { data, error } = await supabase
    .from('green_hall_posts')
    .insert([postData])
    .select('*')
  return { data, error }
}

export const getUserGreenHallPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from('green_hall_posts')
    .select('*, profiles(username, full_name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const updateGreenHallPost = async (postId: string, postData: any) => {
  const { data, error } = await supabase
    .from('green_hall_posts')
    .update(postData)
    .eq('id', postId)
    .select('*')
  return { data, error }
}

export const deleteGreenHallPost = async (postId: string) => {
  const { data, error } = await supabase
    .from('green_hall_posts')
    .delete()
    .eq('id', postId)
  return { data, error }
}

// Food Expiry Items
export const getFoodExpiryItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('food_expiry_items')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

export const getAllFoodExpiryItems = async () => {
  const { data, error } = await supabase
    .from('food_expiry_items')
    .select('*')
  return { data, error }
}

export const createFoodExpiryItem = async (itemData: any) => {
  const { data, error } = await supabase
    .from('food_expiry_items')
    .insert([itemData])
    .select('*')
  return { data, error }
}

export const updateFoodExpiryItem = async (itemId: string, itemData: any) => {
  const { data, error } = await supabase
    .from('food_expiry_items')
    .update(itemData)
    .eq('id', itemId)
    .select('*')
  return { data, error }
}

export const deleteFoodExpiryItem = async (itemId: string) => {
  const { data, error } = await supabase
    .from('food_expiry_items')
    .delete()
    .eq('id', itemId)
  return { data, error }
}

// Leaderboard
export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select('*, profiles(username, full_name)')
    .order('points', { ascending: false })
  return { data, error }
}

// Reuse Items
export const getReuseItems = async () => {
  const { data, error } = await supabase
    .from('reuse_items')
    .select('*, profiles(username, full_name)')
    .eq('is_available', true)
  return { data, error }
}

export const createReuseItem = async (itemData: any) => {
  const { data, error } = await supabase
    .from('reuse_items')
    .insert([itemData])
    .select('*, profiles(username, full_name)')
  return { data, error }
}

export const updateReuseItem = async (itemId: string, itemData: any) => {
  const { data, error } = await supabase
    .from('reuse_items')
    .update(itemData)
    .eq('id', itemId)
    .select('*, profiles(username, full_name)')
  return { data, error }
}

export const deleteReuseItem = async (itemId: string) => {
  const { data, error } = await supabase
    .from('reuse_items')
    .delete()
    .eq('id', itemId)
  return { data, error }
}

// Recycler Partners
export const getRecyclerPartners = async () => {
  const { data, error } = await supabase.from('recycler_partners').select('*')
  return { data, error }
}

export const createRecyclerPartner = async (partnerData: any) => {
  const { data, error } = await supabase
    .from('recycler_partners')
    .insert([{
      user_id: partnerData.user_id,
      name: partnerData.name,
      description: partnerData.description,
      location: partnerData.location,
      contact_info: partnerData.contact_info,
      accepted_materials: partnerData.accepted_materials,
      rating: partnerData.rating
    }])
    .select('*')
  return { data, error }
}

export const updateRecyclerPartner = async (partnerId: string, partnerData: any) => {
  const { data, error } = await supabase
    .from('recycler_partners')
    .update(partnerData)
    .eq('id', partnerId)
    .select('*')
  return { data, error }
}

export const deleteRecyclerPartner = async (partnerId: string) => {
  const { data, error } = await supabase
    .from('recycler_partners')
    .delete()
    .eq('id', partnerId)
  return { data, error }
}

// NGO Events
export const getNGOEvents = async () => {
  const { data, error } = await supabase.from('ngo_events').select('*')
  return { data, error }
}

export const createNGOEvent = async (eventData: any) => {
  const { data, error } = await supabase
    .from('ngo_events')
    .insert([{
      user_id: eventData.user_id,
      ngo_name: eventData.ngo_name,
      event_title: eventData.event_title,
      description: eventData.description,
      event_date: eventData.event_date,
      location: eventData.location,
      contact_info: eventData.contact_info,
      volunteers_needed: eventData.volunteers_needed,
      current_volunteers: eventData.current_volunteers,
      images: eventData.images || []
    }])
    .select('*')
  return { data, error }
}

export const updateNGOEvent = async (eventId: string, eventData: any) => {
  const { data, error } = await supabase
    .from('ngo_events')
    .update(eventData)
    .eq('id', eventId)
    .select('*')
  return { data, error }
}

export const deleteNGOEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from('ngo_events')
    .delete()
    .eq('id', eventId)
  return { data, error }
}

// TAD Homes
export const getTADHomes = async () => {
  const { data, error } = await supabase.from('tad_homes').select('*')
  return { data, error }
}

export const createTADHome = async (homeData: any) => {
  const { data, error } = await supabase
    .from('tad_homes')
    .insert([{
      user_id: homeData.user_id,
      name: homeData.organizationName || homeData.name,
      address: homeData.address,
      contact_person: homeData.contactPerson || homeData.contact_person,
      phone: homeData.phone,
      email: homeData.email,
      capacity: homeData.capacity,
      current_residents: homeData.residents || homeData.current_residents,
      description: homeData.description,
      images: homeData.images || []
    }])
    .select('*')
  return { data, error }
}

export const updateTADHome = async (homeId: string, homeData: any) => {
  const { data, error } = await supabase
    .from('tad_homes')
    .update(homeData)
    .eq('id', homeId)
    .select('*')
  return { data, error }
}

export const deleteTADHome = async (homeId: string) => {
  const { data, error } = await supabase
    .from('tad_homes')
    .delete()
    .eq('id', homeId)
  return { data, error }
}

// Recycle Posts - using reuse_items table instead
export const getRecyclePosts = async () => {
  const { data, error } = await supabase
    .from('reuse_items')
    .select('*, profiles(username, full_name)')
    .eq('category', 'Recyclables')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createRecyclePost = async (postData: any) => {
  const { data, error } = await supabase
    .from('reuse_items')
    .insert([{
      user_id: postData.user_id,
      title: 'Recyclable Materials',
      description: postData.description,
      category: 'Recyclables',
      condition: 'used',
      price: 0,
      image_url: postData.photo,
      location: 'Available for pickup',
      is_available: true
    }])
  return { data, error }
}

// Food Posts
export const getFoodPosts = async () => {
  const { data, error } = await supabase
    .from('food_posts')
    .select('*, profiles(username, full_name)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createFoodPost = async (postData: any) => {
  const { data, error } = await supabase
    .from('food_posts')
    .insert([postData])
    .select('*, profiles(username, full_name)')
  return { data, error }
}

export const updateFoodPost = async (postId: string, postData: any) => {
  const { data, error } = await supabase
    .from('food_posts')
    .update(postData)
    .eq('id', postId)
    .select('*, profiles(username, full_name)')
  return { data, error }
}

export const deleteFoodPost = async (postId: string) => {
  const { data, error } = await supabase
    .from('food_posts')
    .delete()
    .eq('id', postId)
  return { data, error }
}

// Climate Events
export const getUserClimateEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from('climate_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  console.log('Database query for user:', userId)
  console.log('Returned events with user_ids:', data?.map(e => ({ id: e.id, title: e.title, user_id: e.user_id })))
  return { data, error }
}

export const createClimateEvent = async (eventData: any) => {
  const { data, error } = await supabase
    .from('climate_events')
    .insert([{
      user_id: eventData.user_id,
      title: eventData.title,
      description: eventData.description,
      photo: eventData.images?.[0] || null,
      location: eventData.location,
      organizer_name: eventData.organizer_name,
      organizer_phone: eventData.organizer_phone,
      organizer_email: eventData.organizer_email,
      event_date: eventData.event_date,
      event_time: eventData.event_time
    }])
    .select('*')
  return { data, error }
}

export const updateClimateEvent = async (eventId: string, eventData: any) => {
  const { data, error } = await supabase
    .from('climate_events')
    .update(eventData)
    .eq('id', eventId)
    .select('*')
  return { data, error }
}

export const deleteClimateEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from('climate_events')
    .delete()
    .eq('id', eventId)
  return { data, error }
}

// Profile
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
  return { data, error }
}