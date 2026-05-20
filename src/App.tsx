import { useState, useEffect } from 'react';

// =============================================================================
// 🔴 API CONFIGURATION - UPDATE THIS FOR YOUR DEPLOYMENT
// =============================================================================

// For local development
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

// For production (Render), this will be: https://your-backend.onrender.com

// =============================================================================
// 📌 CUSTOMIZATION INDICATORS - EDIT THESE TO CUSTOMIZE YOUR SYSTEM
// =============================================================================

// 🔴 INDICATOR 1: BUSINESS INFORMATION
const BUSINESS_INFO = {
  name: 'J-Pro Lights and Sounds',
  fullName: 'J-Pro Lights and Sounds Rentals',
  phone: '09355189875',
  email: 'jprolightandsoundrentals@gmail.com',
  address: 'Palongpong, Hinunangan, Southern Leyte',
  facebook: 'https://facebook.com/JProLightsAndSoundsRentals',
  hoursWeekday: 'Monday - Saturday: 8:00 AM - 8:00 PM',
  hoursWeekend: 'Sunday: By Appointment',
};

// 🔴 INDICATOR 2: PACKAGES AND PRICES
const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Package',
    price: 5000,
    displayPrice: '₱5,000',
    features: ['2 Speakers', '1 Mixer', '2 Microphones', 'Basic Lighting', '4 Hours Service'],
    color: 'from-blue-500 to-cyan-500',
    image: '/images/basic.jpg',
    description: 'Perfect for small gatherings and intimate events',
  },
  {
    id: 'standard',
    name: 'Standard Package',
    price: 10000,
    displayPrice: '₱10,000',
    features: ['4 Speakers', '1 Mixer', '4 Microphones', 'LED Par Lights', 'DJ Equipment', '6 Hours Service'],
    color: 'from-purple-500 to-pink-500',
    popular: true,
    image: '/images/standard.jpg',
    description: 'Ideal for medium-sized parties and celebrations',
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: 20000,
    displayPrice: '₱20,000',
    features: ['6 Speakers', '2 Subwoofers', 'Professional Mixer', 'Wireless Microphones', 'Moving Head Lights', 'Fog Machine', 'Full Day Service'],
    color: 'from-yellow-500 to-orange-500',
    image: '/images/premium.jpg',
    description: 'Best for large events and professional occasions',
  },
];

// 🔴 INDICATOR 3: EVENT TYPES WITH DETAILS
const EVENT_TYPES = [
  {
    id: 'wedding',
    name: 'Wedding',
    icon: '💒',
    description: 'Make your special day unforgettable with our premium wedding sound and lighting packages. Perfect for church ceremonies, reception halls, and outdoor venues.',
    features: ['Ceremony Sound System', 'Reception Lighting', 'DJ Equipment', 'Microphones for Vows'],
    recommendedPackage: 'Premium Package',
  },
  {
    id: 'birthday',
    name: 'Birthday Party',
    icon: '🎂',
    description: 'Celebrate another year with style! From intimate gatherings to grand celebrations, we have packages for all ages and budgets.',
    features: ['Party Lighting', 'DJ Sound System', 'Microphones for Toasts', 'Fog Machine (optional)'],
    recommendedPackage: 'Standard Package',
  },
  {
    id: 'corporate',
    name: 'Corporate Event',
    icon: '💼',
    description: 'Professional audio-visual solutions for seminars, conferences, product launches, and company anniversaries.',
    features: ['Professional Sound System', 'Presentation Equipment', 'Wireless Microphones', 'Stage Lighting'],
    recommendedPackage: 'Premium Package',
  },
  {
    id: 'concert',
    name: 'Concert',
    icon: '🎸',
    description: 'High-quality sound and dynamic lighting for live performances, bands, and musical events.',
    features: ['High-Power Speakers', 'Professional Mixing Console', 'Stage Lighting', 'Monitor Speakers'],
    recommendedPackage: 'Premium Package',
  },
  {
    id: 'graduation',
    name: 'Graduation',
    icon: '🎓',
    description: 'Celebrate academic achievements with our graduation ceremony packages. Perfect for schools and universities.',
    features: ['Ceremony Sound System', 'Announcement Microphones', 'Ambient Lighting', 'Backup Equipment'],
    recommendedPackage: 'Standard Package',
  },
  {
    id: 'reunion',
    name: 'Reunion',
    icon: '👨‍👩‍👧‍👦',
    description: 'Bring everyone together with quality sound and lighting for family reunions, class reunions, and gatherings.',
    features: ['Party Sound System', 'Dance Floor Lighting', 'Microphones for Programs', 'DJ Equipment'],
    recommendedPackage: 'Standard Package',
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    icon: '🚀',
    description: 'Make a stunning impression with our premium A/V solutions for product unveilings and marketing events.',
    features: ['Premium Sound System', 'Dynamic Lighting', 'Presentation Setup', 'Professional Microphones'],
    recommendedPackage: 'Premium Package',
  },
  {
    id: 'fiesta',
    name: 'Fiesta',
    icon: '🎊',
    description: 'Traditional Filipino celebrations deserve the best! Complete sound and lighting for barrio fiestas and town celebrations.',
    features: ['High-Power Speakers', 'Colorful Lighting', 'DJ Equipment', 'Extended Service Hours'],
    recommendedPackage: 'Premium Package',
  },
  {
    id: 'other',
    name: 'Other Events',
    icon: '✨',
    description: 'Have a special event in mind? We customize our packages to fit your unique needs and requirements.',
    features: ['Customizable Packages', 'Consultation Available', 'Flexible Setup', 'Tailored Solutions'],
    recommendedPackage: 'Contact Us',
  },
];

// 🔴 INDICATOR 4: IMAGE PATHS
const IMAGES = {
  logo: '/images/logo.png',
  heroBg: '/images/hero-bg.jpg',
};

// =============================================================================
// TYPES
// =============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'admin' | 'customer';
  createdAt?: string;
}

interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  package: string;
  packagePrice: number;
  paymentMethod: string;
  isRush: boolean;
  totalAmount: number;
  notes: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

// =============================================================================
// 🔴 SMART DATA LAYER — Uses API when backend is running, localStorage otherwise
// =============================================================================

// Default users stored in localStorage
const DEFAULT_ADMIN: User = { id: 'admin-001', name: 'Administrator', email: 'admin@jpro.com', password: 'admin123', phone: '09355189875', role: 'admin', createdAt: '2025-01-01' };
const DEFAULT_CUSTOMER: User = { id: 'cust-001', name: 'Test Customer', email: 'customer@test.com', password: 'test123', phone: '09171234567', role: 'customer', createdAt: '2025-01-05' };

const initLocalStorage = () => {
  if (!localStorage.getItem('jpro_users')) {
    localStorage.setItem('jpro_users', JSON.stringify([DEFAULT_ADMIN, DEFAULT_CUSTOMER]));
  }
  if (!localStorage.getItem('jpro_bookings')) {
    localStorage.setItem('jpro_bookings', JSON.stringify([]));
  }
};

const getLocalUsers = (): User[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem('jpro_users') || '[]');
};
const saveLocalUsers = (users: User[]) => localStorage.setItem('jpro_users', JSON.stringify(users));

const getLocalBookings = (): Booking[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem('jpro_bookings') || '[]');
};
const saveLocalBookings = (bookings: Booking[]) => localStorage.setItem('jpro_bookings', JSON.stringify(bookings));

// Check if backend API is reachable
let backendAvailable: boolean | null = null;

async function checkBackend(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    backendAvailable = res.ok;
    return backendAvailable;
  } catch {
    backendAvailable = false;
    return false;
  }
}

// Generic API call helper
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'API request failed');
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// USER API FUNCTIONS — with localStorage fallback
const fetchUsers = async (): Promise<User[]> => {
  if (await checkBackend()) {
    try {
      const result = await apiCall('/users');
      return result.data;
    } catch { /* fall through */ }
  }
  return getLocalUsers();
};

const registerUser = async (userData: Partial<User>): Promise<string> => {
  if (await checkBackend()) {
    try {
      const result = await apiCall('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return result.id;
    } catch { /* fall through */ }
  }
  // localStorage fallback
  const users = getLocalUsers();
  if (users.find(u => u.email === userData.email)) throw new Error('Email already registered');
  const id = userData.role === 'admin' ? `admin-${Date.now()}` : `cust-${Date.now()}`;
  const newUser: User = {
    id,
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    password: userData.password || '',
    role: (userData.role as 'admin' | 'customer') || 'customer',
    createdAt: new Date().toISOString().split('T')[0],
  };
  users.push(newUser);
  saveLocalUsers(users);
  return id;
};

const loginUser = async (email: string, password: string): Promise<User> => {
  if (await checkBackend()) {
    try {
      const result = await apiCall('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return result.data;
    } catch { /* fall through */ }
  }
  // localStorage fallback
  const users = getLocalUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  return user;
};

const updateUserRole = async (userId: string, role: 'admin' | 'customer'): Promise<void> => {
  if (await checkBackend()) {
    try {
      await apiCall(`/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
      return;
    } catch { /* fall through */ }
  }
  const users = getLocalUsers().map(u => u.id === userId ? { ...u, role } : u);
  saveLocalUsers(users);
};

const deleteUser = async (userId: string): Promise<void> => {
  if (await checkBackend()) {
    try {
      await apiCall(`/users/${userId}`, { method: 'DELETE' });
      return;
    } catch { /* fall through */ }
  }
  saveLocalUsers(getLocalUsers().filter(u => u.id !== userId));
};

// BOOKING API FUNCTIONS — with localStorage fallback
const fetchBookings = async (): Promise<Booking[]> => {
  if (await checkBackend()) {
    try {
      const result = await apiCall('/bookings');
      return result.data;
    } catch { /* fall through */ }
  }
  return getLocalBookings();
};

const fetchCustomerBookings = async (customerId: string): Promise<Booking[]> => {
  if (await checkBackend()) {
    try {
      const result = await apiCall(`/bookings/customer/${customerId}`);
      return result.data;
    } catch { /* fall through */ }
  }
  return getLocalBookings().filter(b => b.customerId === customerId);
};

const createBooking = async (bookingData: any): Promise<string> => {
  if (await checkBackend()) {
    try {
      const result = await apiCall('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      return result.id;
    } catch { /* fall through */ }
  }
  // localStorage fallback
  const bookings = getLocalBookings();
  const id = 'BK' + String(bookings.length + 1).padStart(3, '0');
  const rushFee = bookingData.isRush ? 2000 : 0;
  const newBooking: Booking = {
    id,
    customerId: bookingData.customerId,
    customerName: bookingData.customerName,
    customerEmail: bookingData.customerEmail,
    customerPhone: bookingData.customerPhone,
    eventType: bookingData.eventType,
    eventDate: bookingData.eventDate,
    eventTime: bookingData.eventTime,
    venue: bookingData.venue,
    package: bookingData.package || bookingData.packageName,
    packagePrice: bookingData.packagePrice,
    paymentMethod: 'Cash on Venue',
    isRush: bookingData.isRush || false,
    totalAmount: bookingData.packagePrice + rushFee,
    notes: bookingData.notes || '',
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
  };
  bookings.push(newBooking);
  saveLocalBookings(bookings);
  return id;
};

const updateBookingStatus = async (bookingId: string, status: string): Promise<void> => {
  if (await checkBackend()) {
    try {
      await apiCall(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return;
    } catch { /* fall through */ }
  }
  const bookings = getLocalBookings().map(b => b.id === bookingId ? { ...b, status: status as Booking['status'] } : b);
  saveLocalBookings(bookings);
};

// PACKAGE API FUNCTIONS - Available for future use
// const fetchPackages = async () => {
//   try {
//     const result = await apiCall('/packages');
//     return result.data;
//   } catch (error) {
//     console.error('Error fetching packages:', error);
//     return [];
//   }
// };

// SCHEDULE API FUNCTIONS - Available for future use
// const fetchScheduleByDate = async (date: string): Promise<Booking[]> => {
//   try {
//     const result = await apiCall(`/schedule/date/${date}`);
//     return result.data;
//   } catch (error) {
//     console.error('Error fetching schedule:', error);
//     return [];
//   }
// };

// =============================================================================
// HELPER FUNCTIONS - Current user management
// =============================================================================

const getCurrentUser = (): User | null => {
  const data = localStorage.getItem('jpro_current_user');
  return data ? JSON.parse(data) : null;
};

const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('jpro_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('jpro_current_user');
  }
};

// =============================================================================
// COMPONENT: Navigation Bar
// =============================================================================

const Navbar = ({
  user,
  onNavigate,
  currentPage,
  onLogout,
}: {
  user: User | null;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex items-center space-x-2">
              <img
                src={IMAGES.logo}
                alt="Logo"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">{BUSINESS_INFO.name}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === 'home' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => onNavigate('services')}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === 'services' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              📦 Services
            </button>

            {!user ? (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition"
                >
                  🔐 Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-400 hover:to-orange-400 transition font-medium"
                >
                  ✨ Register
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm hidden lg:inline">
                    Welcome, <span className="text-yellow-400 font-medium">{user.name}</span>
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider border flex items-center gap-1 ${
                    user.role === 'admin'
                      ? 'bg-purple-900/80 text-yellow-300 border-yellow-500/50'
                      : 'bg-blue-900/80 text-cyan-300 border-cyan-500/50'
                  }`}>
                    <span>{user.role === 'admin' ? '👨‍💼' : '👤'}</span>
                    <span>{user.role}</span>
                  </span>
                </div>
                <button
                  onClick={() =>
                    onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard')
                  }
                  className="bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="bg-red-500/20 text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/30 transition"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10">🏠 Home</button>
            <button onClick={() => { onNavigate('services'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10">📦 Services</button>
            {!user ? (
              <>
                <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10">🔐 Login</button>
                <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="block w-full text-left text-yellow-400 hover:text-yellow-300 px-3 py-2 rounded-lg hover:bg-white/10">✨ Register</button>
              </>
            ) : (
              <>
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-white font-medium">{user.name}</span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${
                    user.role === 'admin' ? 'bg-yellow-500 text-purple-900 font-bold' : 'bg-blue-500 text-white'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button onClick={() => { onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10">📊 Dashboard</button>
                <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="block w-full text-left text-red-300 hover:text-red-200 px-3 py-2 rounded-lg hover:bg-red-500/10">🚪 Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// =============================================================================
// COMPONENT: Home Page
// =============================================================================

const HomePage = ({ onNavigate, user }: { onNavigate: (page: string) => void; user: User | null }) => {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <img
              src={IMAGES.logo}
              alt="J-Pro Logo"
              className="h-24 w-24 mx-auto mb-6 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-yellow-400">{BUSINESS_INFO.name}</span>
              <span className="block text-3xl md:text-4xl mt-2 text-gray-300">Rentals</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Make your events shine with professional lights and sounds equipment.
              Book online and let us handle your event needs!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate(user ? (user.role === 'admin' ? 'admin-dashboard' : 'book-now') : 'login')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-400 hover:to-orange-400 transition transform hover:scale-105 shadow-lg"
              >
                🎉 Book Now
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="bg-white/10 backdrop-blur text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition border border-white/20"
              >
                📦 View Services
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Easy Booking</h3>
              <p className="text-gray-600">Book your lights and sounds equipment online anytime, anywhere.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Equipment</h3>
              <p className="text-gray-600">Professional-grade lights, speakers, and sound systems.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">💪</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Reliable Service</h3>
              <p className="text-gray-600">Professional setup and support for your events.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Events We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {EVENT_TYPES.slice(0, 8).map((event: any) => (
              <button
                key={event.id}
                onClick={() => onNavigate(`event-details-${event.id}`)}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl text-center hover:shadow-xl hover:scale-105 transition-all border border-purple-100 cursor-pointer group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{event.icon}</div>
                <span className="text-gray-800 font-bold">{event.name}</span>
                <div className="mt-2 text-xs text-purple-600 font-medium">Click for details →</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Event?</h2>
          <p className="text-gray-300 mb-8">Create an account now and start booking!</p>
          {!user && (
            <button onClick={() => onNavigate('register')} className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-yellow-400 transition">
              Get Started Today
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

// =============================================================================
// COMPONENT: Services Page
// =============================================================================

const ServicesPage = ({ user, onNavigate }: { user?: User | null; onNavigate?: (page: string) => void }) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const result = await apiCall(isAdmin ? '/packages/all' : '/packages');
        setPackages(result.data);
      } catch (error) {
        console.error('Error loading packages from API, using fallback:', error);
        setPackages(PACKAGES.map(p => ({
          id: p.id,
          name: p.name,
          display_price: p.displayPrice,
          price: p.price,
          features: p.features,
          color: p.color,
          image_url: p.image,
          is_popular: p.popular || false,
          is_active: true,
          description: p.description,
        })));
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Packages</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose the perfect package for your event.</p>
          {isAdmin && onNavigate && (
            <button
              onClick={() => onNavigate('manage-packages')}
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-500 hover:to-indigo-500 transition shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">➕</span>
              <span>Add New Package / Equipment</span>
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg: any) => (
            <div key={pkg.id} className={`relative bg-white rounded-2xl shadow-xl overflow-hidden group ${pkg.is_popular ? 'ring-2 ring-purple-500 transform md:-translate-y-4' : ''} ${!pkg.is_active ? 'opacity-50 border-2 border-dashed border-red-300' : ''}`}>
              {pkg.is_popular && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg z-10">⭐ Most Popular</div>
              )}
              {!pkg.is_active && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full z-10">⏸️ INACTIVE</div>
              )}
              <div className="relative h-52 overflow-hidden bg-gray-200">
                <img
                  src={pkg.image_url || '/images/' + pkg.id + '.jpg'}
                  alt={pkg.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/312e81/ffffff?text=' + encodeURIComponent(pkg.name);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold drop-shadow-lg">{pkg.name}</h3>
                  <p className="text-3xl font-bold mt-1 drop-shadow-lg">{pkg.display_price || pkg.displayPrice}</p>
                  {pkg.description && <p className="text-sm text-gray-200 mt-1">{pkg.description}</p>}
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {(pkg.features || []).length > 0 ? (pkg.features || []).map((feature: string, i: number) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  )) : <li className="text-gray-500">No features listed</li>}
                </ul>
                {isAdmin && onNavigate && (
                  <button
                    onClick={() => onNavigate('manage-packages')}
                    className="mt-4 w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
                  >
                    <span>✏️</span> Edit This Package
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add New Package Card - Admin Only */}
          {isAdmin && onNavigate && (
            <button
              onClick={() => onNavigate('manage-packages')}
              className="relative bg-white/50 rounded-2xl shadow-lg overflow-hidden border-4 border-dashed border-purple-300 flex flex-col items-center justify-center min-h-[400px] hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 group-hover:scale-110 transition-all">
                <span className="text-4xl">➕</span>
              </div>
              <h3 className="text-xl font-bold text-purple-700">Add New Package</h3>
              <p className="text-sm text-purple-500 mt-2 max-w-[200px] text-center">Add new equipment or service packages here</p>
            </button>
          )}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🎤', title: 'Wireless Microphones', desc: 'Additional wireless microphones available for rent' },
              { icon: '💡', title: 'Special Effects', desc: 'Fog machines, bubble machines, and more' },
              { icon: '📺', title: 'LED Screens', desc: 'LED video walls for presentations' },
              { icon: '🎧', title: 'DJ Services', desc: 'Professional DJ for your event' },
            ].map((service) => (
              <div key={service.title} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Login Page
// =============================================================================

const LoginPage = ({ onLogin, onNavigate }: { onLogin: (user: User) => void; onNavigate: (page: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      onLogin(user);
      onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center">
          <img src={IMAGES.logo} alt="Logo" className="h-16 w-16 mx-auto mb-4 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-purple-200 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">❌ {error}</div>}
          <div>
            <label className="block text-gray-700 font-medium mb-2">📧 Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" placeholder="Enter your email" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">🔒 Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" placeholder="Enter your password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-indigo-500 transition disabled:opacity-50">
            {loading ? '🔄 Signing in...' : '🔐 Sign In'}
          </button>
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <button type="button" onClick={() => onNavigate('register')} className="text-purple-600 font-medium hover:underline">Register here</button>
          </p>
          <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-purple-900 font-bold">⚡ Quick Role Demo Login:</p>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-semibold">One-Click</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setEmail('admin@jpro.com'); setPassword('admin123'); }} className="bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 p-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
                <span>👨‍💼</span><span>Login as Admin</span>
              </button>
              <button type="button" onClick={() => { setEmail('customer@test.com'); setPassword('test123'); }} className="bg-white hover:bg-blue-100 text-blue-900 border border-blue-200 p-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm">
                <span>👤</span><span>Login as Customer</span>
              </button>
            </div>
            <div className="text-[11px] text-gray-500 space-y-0.5 pt-1 border-t border-purple-200/50">
              <p>👨‍💼 <strong>Admin:</strong> admin@jpro.com / admin123</p>
              <p>👤 <strong>Customer:</strong> customer@test.com / test123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Register Page
// =============================================================================

const RegisterPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'admin',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      alert(`✅ Registration successful! Please login with your credentials.`);
      onNavigate('login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-purple-200 mt-1">Join us and start booking!</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">❌ {error}</div>}
          <div>
            <label className="block text-gray-700 font-medium mb-2">👤 Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" placeholder="Enter your full name" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">📧 Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" placeholder="Enter your email" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">📞 Phone Number</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" placeholder="Enter your phone number" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">🏷️ Select Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${formData.role === 'customer' ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-600/20' : 'border-gray-200 text-gray-700 hover:bg-gray-50 font-medium'}`}>
                <input type="radio" name="role" value="customer" checked={formData.role === 'customer'} onChange={() => setFormData({ ...formData, role: 'customer' })} className="mr-2.5 accent-purple-600 w-4 h-4" />
                <span>👤 Customer</span>
              </label>
              <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${formData.role === 'admin' ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-600/20' : 'border-gray-200 text-gray-700 hover:bg-gray-50 font-medium'}`}>
                <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={() => setFormData({ ...formData, role: 'admin' })} className="mr-2.5 accent-purple-600 w-4 h-4" />
                <span>👨‍💼 Admin</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 ml-1">
              {formData.role === 'customer' ? 'ℹ️ Customers can book equipment rentals and check their reservation status.' : 'ℹ️ Administrators can approve bookings, view master schedules, and manage users.'}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">🔒 Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" placeholder="Create a password (min 6 characters)" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">🔒 Confirm Password</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" placeholder="Confirm your password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-indigo-500 transition disabled:opacity-50">
            {loading ? '🔄 Creating Account...' : '✨ Create Account'}
          </button>
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <button type="button" onClick={() => onNavigate('login')} className="text-purple-600 font-medium hover:underline">Sign in here</button>
          </p>
        </form>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Customer Dashboard
// =============================================================================

const CustomerDashboard = ({ user, onNavigate }: { user: User; onNavigate: (page: string) => void }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchCustomerBookings(user.id);
      setBookings(data);
    };
    loadBookings();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      case 'completed': return '✔️';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
          <h1 className="text-2xl font-bold">👋 Welcome, {user.name}!</h1>
          <p className="text-purple-200 mt-1">Manage your bookings and reservations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button onClick={() => onNavigate('book-now')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left group">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-gray-800">New Booking</h3>
            <p className="text-gray-500 text-sm mt-1">Book lights & sounds for your event</p>
          </button>
          <button onClick={() => onNavigate('my-bookings')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-semibold text-gray-800">My Bookings</h3>
            <p className="text-gray-500 text-sm mt-1">View all your reservations</p>
          </button>
          <button onClick={() => onNavigate('services')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="font-semibold text-gray-800">Packages</h3>
            <p className="text-gray-500 text-sm mt-1">View available packages</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">📊 Recent Bookings</h2>
          </div>
          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📭</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800">No bookings yet</h3>
              <p className="text-gray-500 mt-1">Start by creating your first booking!</p>
              <button onClick={() => onNavigate('book-now')} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-500 transition">
                📝 Book Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{booking.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.eventType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.eventDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.package}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Booking Form
// =============================================================================

const BookingForm = ({ user, onNavigate }: { user: User; onNavigate: (page: string) => void }) => {
  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    packageId: '',
    paymentMethod: 'Cash',
    isRush: false,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookedId, setBookedId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedPackage = PACKAGES.find((p) => p.id === formData.packageId);
    if (!selectedPackage) {
      alert('Please select a package');
      setLoading(false);
      return;
    }

    try {
      const rushFee = formData.isRush ? 2000 : 0;
      const bookingId = await createBooking({
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        venue: formData.venue,
        package: selectedPackage.name,
        packagePrice: selectedPackage.price,
        paymentMethod: formData.paymentMethod,
        isRush: formData.isRush,
        totalAmount: selectedPackage.price + rushFee,
        notes: formData.notes,
      });
      setBookedId(bookingId);
      setSuccess(true);
    } catch (err: any) {
      alert('Booking failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Booking Submitted!</h2>
          <p className="text-gray-600 mb-2">Your reservation has been submitted successfully.</p>
          <p className="text-purple-600 font-medium mb-6">Booking ID: {bookedId}</p>
          <p className="text-gray-500 text-sm mb-6">We will review and confirm your booking soon.</p>
          <div className="space-y-3">
            <button onClick={() => onNavigate('customer-dashboard')} className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-500 transition">
              📊 Go to Dashboard
            </button>
            <button onClick={() => { setSuccess(false); setFormData({ eventType: '', eventDate: '', eventTime: '', venue: '', packageId: '', paymentMethod: 'Cash', isRush: false, notes: '' }); }} className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
              📝 Book Another Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold">📝 Book Your Event</h2>
            <p className="text-purple-200 mt-1">Fill out the form below to reserve our services</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">🎉 Event Type *</label>
                <select value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required>
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map((type: any) => <option key={type.id} value={type.name}>{type.icon} {type.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">📦 Package *</label>
                <select value={formData.packageId} onChange={(e) => setFormData({ ...formData, packageId: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required>
                  <option value="">Select a package</option>
                  {PACKAGES.map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.displayPrice}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">📅 Event Date *</label>
                <input type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">⏰ Event Time *</label>
                <input type="time" value={formData.eventTime} onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div>
                <label className="block text-purple-900 font-bold mb-2">💳 Payment Method</label>
                <select value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-full px-4 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" disabled>
                  <option value="Cash on Venue">💵 Cash on Venue (Official Receipt Provided)</option>
                </select>
                <p className="text-xs text-purple-600 mt-2">ℹ️ Payment is made on the event day. Official business receipt will be provided.</p>
              </div>
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" checked={formData.isRush} onChange={(e) => setFormData({ ...formData, isRush: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                  <div>
                    <span className="text-purple-900 font-bold block">🚨 Rush Booking</span>
                    <span className="text-xs text-purple-600">Adds ₱2,000 to total price</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">📍 Venue / Location *</label>
              <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" placeholder="Enter complete venue address" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">📋 Additional Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" rows={4} placeholder="Any special requests or additional information..." />
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => onNavigate('customer-dashboard')} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">❌ Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-indigo-500 transition disabled:opacity-50">
                {loading ? '🔄 Submitting...' : '✅ Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: My Bookings Page
// =============================================================================

const MyBookingsPage = ({ user, onNavigate }: { user: User; onNavigate: (page: string) => void }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchCustomerBookings(user.id);
      setBookings(data);
    };
    loadBookings();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      case 'completed': return '✔️';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📋 My Bookings</h1>
            <p className="text-gray-600 mt-1">View all your reservations and their status</p>
          </div>
          <button onClick={() => onNavigate('book-now')} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition flex items-center gap-2">
            <span>➕</span> New Booking
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-lg font-medium text-gray-800">No bookings yet</h3>
            <p className="text-gray-500 mt-1">Start by creating your first booking!</p>
            <button onClick={() => onNavigate('book-now')} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-500 transition">
              📝 Book Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-gray-500">#{booking.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mt-2">{booking.eventType}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">₱{booking.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{booking.package}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-lg">📅</span>
                      <span>{booking.eventDate} at {booking.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-lg">📍</span>
                      <span>{booking.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-lg">💳</span>
                      <span>{booking.paymentMethod}</span>
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <strong>📋 Notes:</strong> {booking.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Admin Dashboard
// =============================================================================

const AdminDashboard = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      const bookingsData = await fetchBookings();
      const usersData = await fetchUsers();
      setBookings(bookingsData);
      setUsers(usersData);

      try {
        const statsResult = await apiCall('/bookings/stats');
        setStats(statsResult.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    loadData();
  }, []);

  const customers = users.filter((u) => u.role === 'customer').length;
  const admins = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
          <h1 className="text-2xl font-bold">👨‍💼 Admin Dashboard</h1>
          <p className="text-purple-200 mt-1">Manage bookings and reservations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <p className="text-gray-500 text-sm font-semibold">📊 Total</p>
            <p className="text-3xl font-bold text-gray-800">{stats?.total || bookings.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <p className="text-yellow-600 text-sm font-semibold">⏳ Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats?.pending || bookings.filter((b: Booking) => b.status === 'pending').length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <p className="text-green-600 text-sm font-semibold">✅ Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats?.approved || bookings.filter((b: Booking) => b.status === 'approved').length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <p className="text-blue-600 text-sm font-semibold">✔️ Completed</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.completed || bookings.filter((b: Booking) => b.status === 'completed').length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <p className="text-red-600 text-sm font-semibold">❌ Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats?.rejected || bookings.filter((b: Booking) => b.status === 'rejected').length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg cursor-pointer hover:ring-2 hover:ring-purple-400 transition" onClick={() => onNavigate('manage-users')}>
            <p className="text-purple-600 text-sm font-semibold">👥 Customers</p>
            <p className="text-3xl font-bold text-purple-600">{customers}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg cursor-pointer hover:ring-2 hover:ring-purple-400 transition" onClick={() => onNavigate('manage-users')}>
            <p className="text-indigo-600 text-sm font-semibold">👨‍💼 Admins</p>
            <p className="text-3xl font-bold text-indigo-600">{admins}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <p className="text-emerald-600 text-sm font-semibold">💰 Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">₱{(stats?.totalRevenue || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <button onClick={() => onNavigate('manage-bookings')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left group">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-semibold text-gray-800">Manage Bookings</h3>
            <p className="text-gray-500 text-sm mt-1">Approve, reject, or update bookings</p>
            {stats?.pending > 0 && <span className="inline-block mt-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">{stats.pending} pending</span>}
          </button>
          <button onClick={() => onNavigate('view-schedule')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-semibold text-gray-800">View Schedule</h3>
            <p className="text-gray-500 text-sm mt-1">See all booked dates and events</p>
          </button>
          <button onClick={() => onNavigate('booking-records')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-800">Booking Records</h3>
            <p className="text-gray-500 text-sm mt-1">View all reservation history</p>
          </button>
          <button onClick={() => onNavigate('manage-users')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left group">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-semibold text-gray-800">User Roles & Accounts</h3>
            <p className="text-gray-500 text-sm mt-1">Manage admin & customer accounts</p>
          </button>
          <button onClick={() => onNavigate('manage-packages')} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left group">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="font-semibold text-gray-800">Package Management</h3>
            <p className="text-gray-500 text-sm mt-1">Add, edit, or delete packages</p>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">📋 Recent Bookings</h2>
            <button onClick={() => onNavigate('manage-bookings')} className="text-purple-600 hover:text-purple-700 font-medium text-sm">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.eventType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.eventDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Manage Bookings (Admin)
// =============================================================================

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchBookings();
      setBookings(data);
    };
    loadBookings();
  }, []);

  const updateStatus = async (bookingId: string, newStatus: 'approved' | 'rejected' | 'completed') => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      const updated = bookings.map((b) => b.id === bookingId ? { ...b, status: newStatus } : b);
      setBookings(updated);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📋 Manage Bookings</h1>
            <p className="text-gray-600 mt-1">Approve, reject, or update booking status</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
              <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === status ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)} ({filter === status ? filteredBookings.length : bookings.filter((b) => b.status === status).length})
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <span className="text-4xl">📭</span>
              <p className="text-gray-500 mt-4">No bookings found</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-gray-500">#{booking.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mt-2">{booking.eventType} - {booking.package}</h3>
                      <p className="text-gray-600 mt-1">👤 {booking.customerName} ({booking.customerEmail})</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(booking.id, 'approved')} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm">✅ Approve</button>
                          <button onClick={() => updateStatus(booking.id, 'rejected')} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm">❌ Reject</button>
                        </>
                      )}
                      {booking.status === 'approved' && (
                        <button onClick={() => updateStatus(booking.id, 'completed')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm">✔️ Mark Completed</button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{booking.eventDate} at {booking.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="truncate">{booking.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>{booking.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span>₱{booking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <strong>📋 Notes:</strong> {booking.notes}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: View Schedule (Admin)
// =============================================================================

const ViewSchedule = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchBookings();
      setBookings(data.filter((b) => b.status === 'approved' || b.status === 'completed'));
    };
    loadBookings();
  }, []);

  const generateCalendarDays = () => {
    const today = new Date(selectedDate);
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const hasBooking = (day: number) => {
    const today = new Date(selectedDate);
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.some((b) => b.eventDate === dateStr);
  };

  const handleDayClick = (day: number) => {
    const today = new Date(selectedDate);
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const changeMonth = (delta: number) => {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() + delta);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const calendarDays = generateCalendarDays();
  const currentMonth = new Date(selectedDate).toLocaleString('default', { month: 'long', year: 'numeric' });
  const dayBookings = bookings.filter((b) => b.eventDate === selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">📅 Event Schedule</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-xl">◀️</button>
              <h2 className="text-xl font-bold text-gray-800">{currentMonth}</h2>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg text-xl">▶️</button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">{day}</div>
              ))}
              {calendarDays.map((day, index) => (
                <div key={index} className={`aspect-square p-2 text-center rounded-lg cursor-pointer transition ${day === null ? '' : hasBooking(day) ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 font-medium' : 'hover:bg-gray-100'}`} onClick={() => day && handleDayClick(day)}>
                  {day}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 rounded"></div>
                <span>Has booking</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>

            {dayBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <p className="text-gray-500">No events scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dayBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-purple-600">⏰ {booking.eventTime}</span>
                        {booking.isRush && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">RUSH</span>}
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{booking.status}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800">{booking.eventType}</h4>
                    <p className="text-sm text-gray-600">👤 {booking.customerName}</p>
                    <p className="text-sm text-gray-500 mt-1">📍 {booking.venue}</p>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">💰 ₱{booking.totalAmount.toLocaleString()}</span>
                      <span className="text-purple-600 font-bold">{booking.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Booking Records (Admin)
// =============================================================================

const BookingRecords = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadBookings = async () => {
      const data = await fetchBookings();
      setBookings(data);
    };
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase()) || b.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">📊 Booking Records</h1>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input type="text" placeholder="🔍 Search by customer, ID, or event..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">No records found</td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{booking.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{booking.customerName}</p>
                          <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span>{booking.eventType}</span>
                          <span className="text-[10px] text-gray-400">{booking.package}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs">
                          <p className="font-bold text-gray-800">{booking.eventDate}</p>
                          <p className="text-gray-500">{booking.eventTime}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-700">₱{booking.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">{booking.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.isRush ? (
                          <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold">RUSH</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">📊 Showing {filteredBookings.length} of {bookings.length} records</div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Manage Users & Roles (Admin)
// =============================================================================

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' as 'admin' | 'customer',
  });

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data as User[]);
    };
    loadUsers();
  }, []);

  const handleRoleToggle = async (userId: string) => {
    if (userId === 'admin-001') {
      alert('⚠️ Cannot modify the primary default administrator.');
      return;
    }
      try {
        const user = users.find((u) => u.id === userId);
        if (user) {
          await updateUserRole(userId, user.role === 'admin' ? 'customer' : 'admin');
          const updatedUsers = users.map((u) => {
            if (u.id === userId) {
              return { ...u, role: (u.role === 'admin' ? 'customer' : 'admin') as 'admin' | 'customer' };
            }
            return u;
          });
          setUsers(updatedUsers as User[]);
        }
      } catch (error) {
        alert('Failed to update role');
      }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === 'admin-001') {
      alert('⚠️ Cannot delete the primary default administrator.');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        const updatedUsers = users.filter((u) => u.id !== userId);
        setUsers(updatedUsers);
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({
        name: newUserData.name,
        email: newUserData.email,
        phone: newUserData.phone,
        password: newUserData.password,
        role: newUserData.role,
      });
      const data = await fetchUsers();
      setUsers(data);
      setShowAddModal(false);
      setNewUserData({ name: '', email: '', phone: '', password: '', role: 'customer' });
      alert(`✅ ${newUserData.role === 'admin' ? 'Administrator' : 'Customer'} account created successfully!`);
    } catch (error) {
      alert('Failed to create user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">👥 User Roles & Accounts Management</h1>
            <p className="text-gray-600 mt-1">Manage administrators and customer accounts</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-500 transition font-bold flex items-center gap-2 shadow-lg">
            <span>➕</span> Add New Account
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px]">
            <input type="text" placeholder="🔍 Search users by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          </div>
          <div className="flex gap-2">
            {(['all', 'admin', 'customer'] as const).map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2 rounded-lg text-sm font-bold transition capitalize ${roleFilter === r ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {r === 'all' ? 'All Roles' : `${r}s`} ({users.filter((u) => r === 'all' || u.role === r).length})
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Account ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">📭 No accounts found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-semibold text-gray-700">{u.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email} • {u.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit border ${u.role === 'admin' ? 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold' : 'bg-blue-100 text-blue-800 border-blue-300'}`}>
                          <span>{u.role === 'admin' ? '👨‍💼' : '👤'}</span>
                          <span>{u.role}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{u.createdAt || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleRoleToggle(u.id)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1">🔄 Switch Role</button>
                          <button onClick={() => handleDeleteUser(u.id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1">❌ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">➕ Create New Account</h3>
                  <p className="text-purple-200 text-xs mt-0.5">Directly add an Administrator or Customer</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white text-xl p-1">✕</button>
              </div>
              <form onSubmit={handleAddUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1.5">👤 Full Name</label>
                  <input type="text" required value={newUserData.name} onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" placeholder="Enter full name" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1.5">📧 Email Address</label>
                  <input type="email" required value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" placeholder="name@company.com" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1.5">📞 Phone Number</label>
                  <input type="tel" required value={newUserData.phone} onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" placeholder="09123456789" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1.5">🔒 Password</label>
                  <input type="password" required minLength={6} value={newUserData.password} onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" placeholder="Minimum 6 characters" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1.5">🏷️ Account Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${newUserData.role === 'customer' ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-600/20' : 'border-gray-200 text-gray-700 hover:bg-gray-50 font-medium'}`}>
                      <input type="radio" name="modalRole" value="customer" checked={newUserData.role === 'customer'} onChange={() => setNewUserData({ ...newUserData, role: 'customer' })} className="mr-2 accent-purple-600" />
                      <span className="text-sm">👤 Customer</span>
                    </label>
                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition ${newUserData.role === 'admin' ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-600/20' : 'border-gray-200 text-gray-700 hover:bg-gray-50 font-medium'}`}>
                      <input type="radio" name="modalRole" value="admin" checked={newUserData.role === 'admin'} onChange={() => setNewUserData({ ...newUserData, role: 'admin' })} className="mr-2 accent-purple-600" />
                      <span className="text-sm">👨‍💼 Admin</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition">Cancel</button>
                  <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition shadow-md">Create Account</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Admin Package Management
// =============================================================================

const AdminPackageManagement = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    displayPrice: '',
    price: '',
    features: '',
    color: 'from-purple-500 to-pink-500',
    imageUrl: '',
    isPopular: false,
    isActive: true,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const result = await apiCall('/packages/all');
      setPackages(result.data);
    } catch (error) {
      alert('Failed to load packages');
    }
  };

  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      displayPrice: '',
      price: '',
      features: '',
      color: 'from-purple-500 to-pink-500',
      imageUrl: '',
      isPopular: false,
      isActive: true,
    });
    setEditingPackage(null);
    setShowAddModal(true);
  };

  const openEditModal = (pkg: any) => {
    setFormData({
      id: pkg.id,
      name: pkg.name,
      displayPrice: pkg.display_price,
      price: pkg.price.toString(),
      features: pkg.features || '[]',
      color: pkg.color || 'from-purple-500 to-pink-500',
      imageUrl: pkg.image_url || '',
      isPopular: pkg.is_popular || false,
      isActive: pkg.is_active !== false,
    });
    setEditingPackage(pkg);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const features = JSON.parse(formData.features);
      
      if (editingPackage) {
        await apiCall(`/packages/${formData.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: formData.name,
            displayPrice: formData.displayPrice,
            price: parseFloat(formData.price),
            features: features,
            color: formData.color,
            imageUrl: formData.imageUrl,
            isPopular: formData.isPopular,
            isActive: formData.isActive,
          }),
        });
        alert('✅ Package updated successfully!');
      } else {
        await apiCall('/packages', {
          method: 'POST',
          body: JSON.stringify({
            id: formData.id.toLowerCase().replace(/\s+/g, '-'),
            name: formData.name,
            displayPrice: formData.displayPrice,
            price: parseFloat(formData.price),
            features: features,
            color: formData.color,
            imageUrl: formData.imageUrl,
            isPopular: formData.isPopular,
            isActive: formData.isActive,
          }),
        });
        alert('✅ Package created successfully!');
      }
      setShowAddModal(false);
      loadPackages();
    } catch (error: any) {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('⚠️ Are you sure you want to delete this package? This action cannot be undone.')) {
      try {
        const result = await apiCall(`/packages/${id}`, {
          method: 'DELETE',
        });
        if (result.deleted === false) {
          alert('⚠️ Package deactivated instead (it has existing bookings)');
        } else {
          alert('✅ Package deleted successfully!');
        }
        loadPackages();
      } catch (error) {
        alert('❌ Failed to delete package');
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await apiCall(`/packages/${id}/toggle`, {
        method: 'PUT',
      });
      loadPackages();
    } catch (error) {
      alert('❌ Failed to toggle package status');
    }
  };

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Blue' },
    { value: 'from-purple-500 to-pink-500', label: 'Purple' },
    { value: 'from-yellow-500 to-orange-500', label: 'Yellow' },
    { value: 'from-green-500 to-emerald-500', label: 'Green' },
    { value: 'from-red-500 to-rose-500', label: 'Red' },
    { value: 'from-indigo-500 to-blue-500', label: 'Indigo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📦 Package Management</h1>
            <p className="text-gray-600 mt-1">Add, edit, or delete service packages</p>
          </div>
          <button onClick={openAddModal} className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-500 transition font-bold flex items-center gap-2 shadow-lg">
            <span>➕</span> Add New Package
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden ${!pkg.is_active ? 'opacity-60' : ''}`}>
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={pkg.image_url || 'https://placehold.co/600x400/312e81/ffffff?text=No+Image'}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/312e81/ffffff?text=No+Image'; }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {pkg.is_popular && <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">⭐ Popular</span>}
                  {!pkg.is_active && <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">⏸️ Inactive</span>}
                </div>
              </div>
              <div className={`bg-gradient-to-r ${pkg.color} p-4 text-white`}>
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                <p className="text-2xl font-bold mt-1">{pkg.display_price}</p>
              </div>
              <div className="p-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  {pkg.features && pkg.features.length > 0 ? pkg.features.slice(0, 3).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{f}</span>
                    </li>
                  )) : <li>No features listed</li>}
                </ul>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEditModal(pkg)} className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 rounded-lg text-sm font-bold transition">✏️ Edit</button>
                  <button onClick={() => handleToggleActive(pkg.id)} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${pkg.is_active ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}>
                    {pkg.is_active ? '⏸️ Deactivate' : '▶️ Activate'}
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 rounded-lg text-sm font-bold transition">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{editingPackage ? '✏️ Edit Package' : '➕ Add New Package'}</h3>
                  <p className="text-purple-200 text-xs mt-0.5">Manage your service package details</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white text-xl p-1">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1.5">📝 Package ID *</label>
                    <input type="text" required value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" placeholder="e.g., basic, standard, premium" disabled={!!editingPackage} />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1.5">📦 Package Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" placeholder="e.g., Basic Package" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1.5">💰 Display Price *</label>
                    <input type="text" required value={formData.displayPrice} onChange={(e) => setFormData({ ...formData, displayPrice: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" placeholder="e.g., ₱5,000" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1.5">🔢 Numeric Price *</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" placeholder="e.g., 5000" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1.5">🖼️ Image URL *</label>
                  <input type="text" required value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" placeholder="https://example.com/image.jpg" />
                  <p className="text-xs text-gray-500 mt-1">💡 Tip: Upload your image to a hosting service and paste the URL here</p>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1.5">🎨 Color Theme</label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map((opt) => (
                      <button key={opt.value} type="button" onClick={() => setFormData({ ...formData, color: opt.value })} className={`p-2 rounded-lg border-2 transition ${formData.color === opt.value ? 'border-purple-600 ring-2 ring-purple-300' : 'border-gray-200'}`} title={opt.label}>
                        <div className={`w-full h-6 rounded bg-gradient-to-r ${opt.value}`}></div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1.5">✨ Features (JSON Array) *</label>
                  <textarea required value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono" rows={4} placeholder='["Feature 1", "Feature 2", "Feature 3"]' />
                  <p className="text-xs text-gray-500 mt-1">💡 Format: ["Feature 1", "Feature 2", "Feature 3"]</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })} className="w-5 h-5 accent-purple-600" />
                    <div>
                      <span className="text-gray-700 font-bold">⭐ Mark as Popular</span>
                      <p className="text-xs text-gray-500">Shows "Most Popular" badge</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 accent-purple-600" />
                    <div>
                      <span className="text-gray-700 font-bold">✅ Active Package</span>
                      <p className="text-xs text-gray-500">Visible to customers</p>
                    </div>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition">Cancel</button>
                  <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition shadow-md">{editingPackage ? '💾 Update Package' : '✨ Create Package'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Event Details Page
// =============================================================================

const EventDetailsPage = ({ eventId, onNavigate }: { eventId: string; onNavigate: (page: string) => void }) => {
  const event = EVENT_TYPES.find((e: any) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <button onClick={() => onNavigate('home')} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => onNavigate('home')} className="mb-6 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition">
          <span>←</span> Back to Events
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
            <div className="text-7xl mb-4">{event.icon}</div>
            <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
            <p className="text-purple-200 text-lg">{event.description}</p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>✨</span> What's Included
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {event.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>📦</span> Recommended Package
              </h3>
              <p className="text-gray-700 mb-4">For this type of event, we recommend:</p>
              <div className="text-2xl font-bold text-purple-600">{event.recommendedPackage}</div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Book This Event?</h3>
              <p className="text-gray-600 mb-6">Click below to start your booking process and select the perfect package for your {event.name}!</p>
              <button
                onClick={() => onNavigate('book-now')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-purple-500 hover:to-indigo-500 transition transform hover:scale-105 shadow-lg"
              >
                🎉 Book This Event Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT: Footer
// =============================================================================

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={IMAGES.logo} alt="Logo" className="h-10 w-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">{BUSINESS_INFO.name}</span>
              </div>
            </div>
            <p className="text-gray-400">Professional lights and sounds rental services for all your events.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">📞 Contact Us</h3>
            <div className="space-y-2 text-gray-400">
              <p>📞 {BUSINESS_INFO.phone}</p>
              <p>📧 {BUSINESS_INFO.email}</p>
              <p>📍 {BUSINESS_INFO.address}</p>
              <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
                <span>📘</span>
                <span>Facebook Page</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">⏰ Business Hours</h3>
            <div className="space-y-2 text-gray-400">
              <p>{BUSINESS_INFO.hoursWeekday}</p>
              <p>{BUSINESS_INFO.hoursWeekend}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} {BUSINESS_INFO.fullName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} user={user} />;
      case 'services':
        return <ServicesPage user={user} onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'customer-dashboard':
        return user && user.role === 'customer' ? <CustomerDashboard user={user} onNavigate={setCurrentPage} /> : <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'book-now':
        return user && user.role === 'customer' ? <BookingForm user={user} onNavigate={setCurrentPage} /> : <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'my-bookings':
        return user && user.role === 'customer' ? <MyBookingsPage user={user} onNavigate={setCurrentPage} /> : <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
        return user && user.role === 'admin' ? <AdminDashboard onNavigate={setCurrentPage} /> : <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'manage-bookings':
        return user && user.role === 'admin' ? <ManageBookings /> : <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'view-schedule':
        return user && user.role === 'admin' ? <ViewSchedule /> : <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'booking-records':
        return user && user.role === 'admin' ? <BookingRecords /> : <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'manage-users':
        return user && user.role === 'admin' ? <ManageUsers /> : <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'manage-packages':
        return user && user.role === 'admin' ? <AdminPackageManagement /> : <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      default:
        // Check if it's an event details page
        if (currentPage.startsWith('event-details-')) {
          const eventId = currentPage.replace('event-details-', '');
          return <EventDetailsPage eventId={eventId} onNavigate={setCurrentPage} />;
        }
        return <HomePage onNavigate={setCurrentPage} user={user} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onNavigate={setCurrentPage} currentPage={currentPage} onLogout={handleLogout} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}
