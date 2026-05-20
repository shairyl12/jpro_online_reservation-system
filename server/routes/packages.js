// server/routes/packages.js
const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// Get all packages
router.get('/', async (req, res) => {
  try {
    const [packages] = await pool.query('SELECT * FROM packages WHERE is_active = TRUE ORDER BY price ASC');
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all packages including inactive (Admin only)
router.get('/all', async (req, res) => {
  try {
    const [packages] = await pool.query('SELECT * FROM packages ORDER BY price ASC');
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get package by ID
router.get('/:id', async (req, res) => {
  try {
    const [packages] = await pool.query('SELECT * FROM packages WHERE id = ?', [req.params.id]);
    if (packages.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    res.json({ success: true, data: packages[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new package (Admin)
router.post('/', async (req, res) => {
  try {
    const { id, name, displayPrice, price, features, color, imageUrl, isPopular, isActive } = req.body;
    
    await pool.query(`
      INSERT INTO packages (id, name, display_price, price, features, color, image_url, is_popular, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, name, displayPrice, price, JSON.stringify(features), color, imageUrl, isPopular, isActive]);
    
    res.json({ success: true, message: 'Package created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update package (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { name, displayPrice, price, features, color, imageUrl, isPopular, isActive } = req.body;
    const { id } = req.params;
    
    await pool.query(`
      UPDATE packages SET
        name = ?, display_price = ?, price = ?, features = ?, color = ?,
        image_url = ?, is_popular = ?, is_active = ?
      WHERE id = ?
    `, [name, displayPrice, price, JSON.stringify(features), color, imageUrl, isPopular, isActive, id]);
    
    res.json({ success: true, message: 'Package updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete package (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if package is being used in bookings
    const [bookings] = await pool.query('SELECT COUNT(*) as count FROM bookings WHERE package_id = ?', [id]);
    
    if (bookings[0].count > 0) {
      // Soft delete - just deactivate
      await pool.query('UPDATE packages SET is_active = FALSE WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Package deactivated (cannot delete as it has bookings)', deleted: false });
    }
    
    // Hard delete
    await pool.query('DELETE FROM packages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Package deleted successfully', deleted: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle package active status
router.put('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current status
    const [packages] = await pool.query('SELECT is_active FROM packages WHERE id = ?', [id]);
    
    if (packages.length === 0) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }
    
    const newStatus = !packages[0].is_active;
    await pool.query('UPDATE packages SET is_active = ? WHERE id = ?', [newStatus, id]);
    
    res.json({ success: true, message: `Package ${newStatus ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
