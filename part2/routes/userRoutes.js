const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { user, pass } = req.body;
  console.log("Request body: ", req.body);
  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [user, pass]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Save to session
    req.session.user = {
      id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST logout
router.post('/logout', async (req, res) => {
    // delete session
    req.session.destroy((err) => {
      if (err) {return res.status(500).json({ error: 'Login failed' });}
      // clear cookie
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout sucessful' });
    });

});

// Router to get all dogs owned by the owner
router.get('/myDogs', async (req, res) => {
  try {
    console.log('Session: ', req.session);
    // Get owner id from user session
    const ownerID = req.session.user.id;
    if (!ownerID) {
      return res.status(401).json({error: 'Not logged in' });
    }

    // Query the database for list of dogs owned by the user
    const [dogsList] = await db.query(`
      SELECT dog_id, name FROM Dogs
      WHERE owner_id = ?`, [ownerID]);

    // If no results, no dogs are owned
    if (dogsList.length === 0) {
      return res.status(401).json({ error: 'No dogs owned' });
    }

    res.json(dogsList);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }

});

// From part 1: to display list of all dogs in the database
router.get('/dogList', async (req, res) => {
    try {
        const [dogs] = await db.execute('SELECT dog_id, name, size, owner_id FROM Dogs;');
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

module.exports = router;