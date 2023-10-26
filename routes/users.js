const express = require('express');
const bcrypt = require('bcrypt');
const { findUserByToken, confirmUserEmail } = require('../services/databaseService');
const generateToken = require('../utils/tokenGenerator'); 
const sendConfirmationEmail = require('../services/emailService');
const crypto = require('crypto');

const saltRounds = 10;

module.exports = (pool) => {
    const router = express.Router();

    // Define your routes here...
router.post('/register', (req, res) => {
    const { firstName, surname, email, username, password, confirmPassword } = req.body;

    // Basic validation
    if (!firstName || !surname || !email || !username || !password || !confirmPassword) {
        return res.json({ success: false, message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.json({ success: false, message: "Passwords do not match." });
    }

    const emailToken = generateToken();  // Generate a confirmation token

    // Hash the user's password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.json({ success: false, message: "Server error. Please try again later." });
        }

        // TODO: Store the hashed password and user data in your database.
        // I'll provide a simple pseudocode for this as the actual code depends on how you've set up your database.

        
        const query = "INSERT INTO users (username, password, email, first_name, last_name, email_token) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [username, hashedPassword, email, firstName, surname, emailToken];
    
        pool.execute(query, values, (error, results) => {
            if (error) {
                console.error("MySQL Error:", error);  // Log the specific error
                return res.json({ success: false, message: "Error registering user." });
            }

            sendConfirmationEmail(email, emailToken);  // Send the confirmation email

            res.json({ success: true, message: "User registered successfully!" });
        });
        
        console.log("Processing completed for /register"); 
    });
});

router.get('/confirm-email', async (req, res) => {
    const token = req.query.token;
    const user = await findUserByToken(token);

    if(!user) {
        return res.status(400).send('Invalid token.');
    }

    if(user.emailTokenExpiration < new Date()) {
        return res.status(400).send('Token has expired.');
    }

    await confirmUserEmail(user.id);
    res.send('Email confirmed successfully!');
});
return router;
};

