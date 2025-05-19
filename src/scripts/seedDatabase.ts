import { supabase } from '../integrations/supabase/client';

// Sample data for locations
const locations = [
  {
    city: 'Rishikesh',
    address: 'Near Laxman Jhula, Rishikesh, Uttarakhand',
    latitude: 30.1208,
    longitude: 78.3230
  },
  {
    city: 'Dehradun',
    address: 'Rajpur Road, Dehradun, Uttarakhand',
    latitude: 30.3165,
    longitude: 78.0322
  },
  {
    city: 'Haridwar',
    address: 'Near Har Ki Pauri, Haridwar, Uttarakhand',
    latitude: 29.9457,
    longitude: 78.1642
  }
];

// Sample data for vehicles
const vehicles = [
  {
    name: 'Royal Enfield Classic 350',
    type: 'bike',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    year: 2022,
    price_per_day: 800,
    image_url: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    name: 'Honda Activa',
    type: 'scooter',
    brand: 'Honda',
    model: 'Activa 6G',
    year: 2023,
    price_per_day: 400,
    image_url: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?q=80&w=1974&auto=format&fit=crop',
    available: true
  },
  {
    name: 'Bajaj Pulsar 150',
    type: 'bike',
    brand: 'Bajaj',
    model: 'Pulsar 150',
    year: 2022,
    price_per_day: 600,
    image_url: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    name: 'TVS Jupiter',
    type: 'scooter',
    brand: 'TVS',
    model: 'Jupiter',
    year: 2023,
    price_per_day: 350,
    image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop',
    available: true
  },
  {
    name: 'Yamaha FZ',
    type: 'bike',
    brand: 'Yamaha',
    model: 'FZ-S V3',
    year: 2022,
    price_per_day: 700,
    image_url: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=2070&auto=format&fit=crop',
    available: true
  }
];

// Sample data for users
const users = [
  {
    email: 'admin@wheeliewanderlust.com',
    full_name: 'Admin User',
    phone: '9534750504',
    role: 'admin'
  },
  {
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    phone: '9534750504',
    role: 'user'
  },
  {
    email: 'jane.smith@example.com',
    full_name: 'Jane Smith',
    phone: '9534750504',
    role: 'user'
  },
  {
    email: 'amit.kumar@example.com',
    full_name: 'Amit Kumar',
    phone: '9534750504',
    role: 'user'
  }
];

// Function to seed the database
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Insert locations
    console.log('Inserting locations...');
    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .upsert(locations, { onConflict: 'city' })
      .select();

    if (locationError) {
      throw locationError;
    }
    console.log(`Inserted ${locationData?.length} locations`);

    // Get location IDs for vehicles
    const locationIds = locationData?.map(loc => loc.id) || [];
    if (locationIds.length === 0) {
      throw new Error('No location IDs found');
    }

    // Insert vehicles with location IDs
    console.log('Inserting vehicles...');
    const vehiclesWithLocations = vehicles.map((vehicle, index) => ({
      ...vehicle,
      location_id: locationIds[index % locationIds.length]
    }));

    const { data: vehicleData, error: vehicleError } = await supabase
      .from('vehicles')
      .upsert(vehiclesWithLocations, { onConflict: 'name' })
      .select();

    if (vehicleError) {
      throw vehicleError;
    }
    console.log(`Inserted ${vehicleData?.length} vehicles`);

    // Insert users
    console.log('Inserting users...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert(users, { onConflict: 'email' })
      .select();

    if (userError) {
      throw userError;
    }
    console.log(`Inserted ${userData?.length} users`);

    // Get user and vehicle IDs for bookings
    const userIds = userData?.map(user => user.id) || [];
    const vehicleIds = vehicleData?.map(vehicle => vehicle.id) || [];

    if (userIds.length === 0 || vehicleIds.length === 0) {
      throw new Error('No user or vehicle IDs found');
    }

    // Create sample bookings
    const today = new Date();
    const bookings = [
      {
        user_id: userIds[1], // John Doe
        vehicle_id: vehicleIds[0], // Royal Enfield
        start_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        end_date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days from now
        total_price: 1600, // 2 days * 800
        status: 'confirmed'
      },
      {
        user_id: userIds[2], // Jane Smith
        vehicle_id: vehicleIds[1], // Honda Activa
        start_date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day from now
        end_date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        total_price: 800, // 2 days * 400
        status: 'confirmed'
      },
      {
        user_id: userIds[3], // Amit Kumar
        vehicle_id: vehicleIds[2], // Bajaj Pulsar
        start_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
        end_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        total_price: 1200, // 2 days * 600
        status: 'pending'
      }
    ];

    // Insert bookings
    console.log('Inserting bookings...');
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .upsert(bookings)
      .select();

    if (bookingError) {
      throw bookingError;
    }
    console.log(`Inserted ${bookingData?.length} bookings`);

    // Create sample payments
    const payments = [
      {
        booking_id: bookingData?.[0].id,
        amount: 1600,
        payment_method: 'card',
        status: 'paid',
        paid_at: new Date().toISOString()
      },
      {
        booking_id: bookingData?.[1].id,
        amount: 800,
        payment_method: 'upi',
        status: 'paid',
        paid_at: new Date().toISOString()
      }
    ];

    // Insert payments
    console.log('Inserting payments...');
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .upsert(payments)
      .select();

    if (paymentError) {
      throw paymentError;
    }
    console.log(`Inserted ${paymentData?.length} payments`);

    console.log('Database seeding completed successfully!');
    return {
      success: true,
      locations: locationData?.length || 0,
      vehicles: vehicleData?.length || 0,
      users: userData?.length || 0,
      bookings: bookingData?.length || 0,
      payments: paymentData?.length || 0
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      error
    };
  }
}
