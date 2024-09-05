

const express = require('express');
const mysql = require('mysql');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Create a MySQL connection

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'tom',
    password: 'pwd123',
    database: 'test1'
});


// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');

    const createUserTable = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        join_date DATETIME NOT NULL DEFAULT now()
    )`;
    db.query(createUserTable, function (err, result) {
        if (err) {
            console.error('Error creating users table:', err.stack);
            return;
        }
        console.log('Users table created or already exists');
    });
});

// GET endpoint to fetch all users
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

// POST endpoint to create a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(query, [name, email], (err, result) => {
        if (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json({ id: result.insertId, name, email });
        }
    });
});

// PUT endpoint to update a user by ID
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(query, [name, email, id], (err) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ id, name, email });
        }
    });
});

// DELETE endpoint to delete a user by ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(204).send(); // No content
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
