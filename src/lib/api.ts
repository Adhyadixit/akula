import { supabase } from '@/integrations/supabase/client';

// VEHICLE API FUNCTIONS
export async function getVehicles(locationId?: string) {
  let query = supabase.from('vehicles').select('*');
  
  if (locationId) {
    query = query.eq('location_id', locationId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
  
  return data;
}

export async function getVehicleById(id: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*, locations(*)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching vehicle with id ${id}:`, error);
    throw error;
  }
  
  return data;
}

// LOCATION API FUNCTIONS
export async function getLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*');
  
  if (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
  
  return data;
}

export async function getLocationByCity(citySlug: string) {
  // Convert slug to city name (e.g., "new-delhi" to "New Delhi")
  const cityName = citySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const { data, error } = await supabase
    .from('locations')
    .select('*, vehicles(*)')
    .ilike('city', cityName)
    .single();
  
  if (error) {
    console.error(`Error fetching location for city ${cityName}:`, error);
    throw error;
  }
  
  return data;
}

// BOOKING API FUNCTIONS
export async function createBooking(bookingData: {
  user_id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
  
  return data;
}

export async function getUserBookings(userId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, vehicles(*), payments(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error);
    throw error;
  }
  
  return data;
}

// PAYMENT API FUNCTIONS
export async function createPayment(paymentData: {
  booking_id: string;
  amount: number;
  payment_method: string;
}) {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      ...paymentData,
      status: 'paid',
      paid_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
  
  // Update booking status to confirmed
  await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', paymentData.booking_id);
  
  return data;
}

// USER API FUNCTIONS
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    throw error;
  }
  
  return data;
}

export async function updateUserProfile(userId: string, userData: {
  full_name?: string;
  phone?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating user profile for ${userId}:`, error);
    throw error;
  }
  
  return data;
}
