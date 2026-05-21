import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Set up connection pool using variables configured on Render
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: { rejectUnauthorized: false }
});

// Vital connection ping route
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: "Backend is running!" });
});

// 1. REGISTER USER ROUTE
app.post('/api/users/register', async (req, res) => {
    try {
        const { id, name, email, password, phone, role } = req.body;
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, error: 'Email already registered' });

        const userId = id || `cust-${Date.now()}`;
        await pool.query(
            'INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, name, email, password, phone, role || 'customer']
        );
        res.json({ success: true, id: userId });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// 2. ACCOUNT LOGIN ROUTE
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length === 0) return res.status(401).json({ success: false, error: 'Invalid email or password' });
        res.json({ success: true, data: rows[0] });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// 3. GET ALL USERS (Fixes Admin Dashboard fallback loop!)
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, phone, role FROM users ORDER BY id DESC');
        res.json({ success: true, data: rows });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// 4. CREATE BOOKING AND RESERVATION ROUTE
app.post('/api/bookings', async (req, res) => {
    try {
        const b = req.body;
        const id = 'BK' + String(Date.now()).slice(-6);
        const totalAmount = b.packagePrice + (b.isRush ? 2000 : 0);

        await pool.query(
            `INSERT INTO bookings (id, customer_id, customer_name, customer_email, customer_phone, 
            event_type, event_date, event_time, venue, package_name, package_price, is_rush, total_amount, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, b.customerId, b.customerName, b.customerEmail, b.customerPhone, 
             b.eventType, b.eventDate, b.eventTime, b.venue, b.package || b.packageName, b.packagePrice, b.isRush ? 1 : 0, totalAmount, b.notes || '']
        );
        res.json({ success: true, id });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// 5. GET ALL BOOKINGS
app.get('/api/bookings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM bookings ORDER BY event_date DESC');
        res.json({ success: true, data: rows });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// 6. GET BOOKINGS FOR A SPECIFIC CUSTOMER
app.get('/api/bookings/customer/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const [rows] = await pool.query('SELECT * FROM bookings WHERE customer_id = ? ORDER BY event_date DESC', [customerId]);
        res.json({ success: true, data: rows });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// 7. PUBLIC PACKAGES ROUTE
app.get('/api/packages', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 'basic', name: 'Basic Package', display_price: '₱5,000', price: 5000, features: ['2 Speakers', '1 Mixer', '2 Microphones'], is_active: true },
            { id: 'standard', name: 'Standard Package', display_price: '₱10,000', price: 10000, features: ['4 Speakers', '1 Mixer', '4 Microphones'], is_popular: true, is_active: true },
            { id: 'premium', name: 'Premium Package', display_price: '₱20,000', price: 20000, features: ['6 Speakers', '2 Subwoofers'], is_active: true }
        ]
    });
});

// 8. ADMIN PACKAGES ROUTE (Fixes the frontend /packages/all 404!)
app.get('/api/packages/all', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 'basic', name: 'Basic Package', display_price: '₱5,000', price: 5000, is_active: true },
            { id: 'standard', name: 'Standard Package', display_price: '₱10,000', price: 10000, is_popular: true, is_active: true },
            { id: 'premium', name: 'Premium Package', display_price: '₱20,000', price: 20000, is_active: true }
        ]
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
