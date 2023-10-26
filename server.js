const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'soothe_db',
});

const usersRoutes = require('./routes/users')(pool);  // Pass the pool here

const app = express();
const port = 8080;

// Middleware
app.use(cors('*'));
app.use(bodyParser.json());
app.use(usersRoutes);

// ... rest of your code


app.get('/test', (req, res) => {
    res.send('Paul Doran');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ success: false, message: 'Something went wrong!' });
});