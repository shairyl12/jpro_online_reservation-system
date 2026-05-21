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
  // Hardcode the role to 'customer' inside the payload submission to prevent overrides
  const cleanUserData = { ...userData, role: 'customer' as const };

  if (await checkBackend()) {
    try {
      const result = await apiCall('/users/register', {
        method: 'POST',
        body: JSON.stringify(cleanUserData),
      });
      return result.id;
    } catch { /* fall through */ }
  }

  const users = getLocalUsers();
  if (users.find(u => u.email === cleanUserData.email)) throw new Error('Email already registered');
  const id = `cust-${Date.now()}`;
  const newUser: User = {
    id,
    name: cleanUserData.name || '',
    email: cleanUserData.email || '',
    phone: cleanUserData.phone || '',
    password: cleanUserData.password || '',
    role: 'customer',
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
        setPackages(prev => prev); // formatting anchor
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
