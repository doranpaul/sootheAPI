function cleanupExpiredTokens() {
    // Logic to remove expired tokens from the database.
}

setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);  // Run once every 24 hours.
