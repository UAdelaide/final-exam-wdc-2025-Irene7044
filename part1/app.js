var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { write } = require('fs');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

app.get('/api/dogs', async (req, res) => {
    try {
        const [dogs] = await db.execute('SELECT d.name AS dog_name, d.size, u.username AS owner_username FROM Dogs d JOIN Users u ON d.owner_id = u.user_id;');
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const [requests] = await db.execute(
            "SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_name FROM WalkRequests wr JOIN Dogs d ON wr.dog_id = d.dog_id JOIN Users u ON d.owner_id = u.user_id WHERE wr.status = 'open';"
        );
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch walk requests' });
    }
});

app.get('/api/walkers/summary', async (req, res) => {
    try {
        const [dogs] = await db.execute("SELECT
            username AS walker_username,
            COUNT(DISTINCT wrt.rating_id) AS total_ratings,
            ROUND(AVG(wrt.rating), 2) AS average_rating,
            COUNT (DISTINCT CASE WHEN wrq.status = 'completed' THEN wrq.request_id END)

            "


        );
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch walker details' });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
