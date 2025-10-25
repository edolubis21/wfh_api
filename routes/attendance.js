import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/attendance/status
router.get('/status', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // Cek apakah user sudah checkin hari ini
    const [rows] = await pool.query(
      `SELECT type, time FROM attendance 
       WHERE user_id = ? 
       AND DATE(time) = CURDATE()
       ORDER BY time DESC 
       LIMIT 1`,
      [userId]
    );

    if (rows.length > 0) {
      return res.status(200).json({
        checkedIn: rows[0].type === 'checkin',
        checkInTime: rows[0].time,
      });
    } else {
      return res.status(200).json({
        checkedIn: false,
      });
    }
  } catch (err) {
    console.error('Error fetching status:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/attendance/checkin
// body: { latitude, longitude, note }
router.post('/checkin', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { latitude, longitude, note } = req.body || {};

  try {
    const [result] = await pool.query(
      'INSERT INTO attendance (user_id, type, time, latitude, longitude, note) VALUES (?, ?, NOW(), ?, ?, ?)',
      [userId, 'checkin', latitude || null, longitude || null, note || null]
    );
    return res.status(201).json({ message: 'Checked in', id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/attendance/checkout
router.post('/checkout', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { latitude, longitude, note } = req.body || {};

  try {
    const [result] = await pool.query(
      'INSERT INTO attendance (user_id, type, time, latitude, longitude, note) VALUES (?, ?, NOW(), ?, ?, ?)',
      [userId, 'checkout', latitude || null, longitude || null, note || null]
    );
    return res.status(201).json({ message: 'Checked out', id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/attendance  -> list records for current user with optional query ?limit=&from=&to=
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const limit = req.query.limit ? Number(req.query.limit) : 100;
  const from = req.query.from; // YYYY-MM-DD
  const to = req.query.to;
  try {
    let sql = 'SELECT id, type, time, latitude, longitude, note FROM attendance WHERE user_id = ?';
    const params = [userId];
    if (from) {
      sql += ' AND time >= ?';
      params.push(from + ' 00:00:00');
    }
    if (to) {
      sql += ' AND time <= ?';
      params.push(to + ' 23:59:59');
    }
    sql += ' ORDER BY time DESC LIMIT ?';
    params.push(limit);

    const [rows] = await pool.query(sql, params);
    return res.json({ records: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/attendance/history
router.get('/history', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT type, time, latitude, longitude, note
       FROM attendance
       WHERE user_id = ?
       ORDER BY time DESC`,
      [userId]
    );

    return res.status(200).json({ history: rows });
  } catch (err) {
    console.error('Error fetching history:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


export default router;
