import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Set up connection to your Aiven MySQL database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: { rejectUnauthorized: false }
});

// Vital health check route for App.tsx data layer
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: "Backend is running!" });
});

// 1. CUSTOMER/ADMIN REGISTRATION ROUTE
app.post('/api/users/register', async (req, res) => {
    try {
        const { id, name, email, password, phone, role } = req.body;
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, error: 'Email already registered' });

        await pool.query(
            'INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [id || `cust-${Date.now()}`, name, email, password, phone, role || 'customer']
        );
        res.json({ success: true, id });
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

// 3. BOOKING AND RESERVATION ROUTE
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
