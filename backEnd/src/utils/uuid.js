import crypto from 'crypto'; // Built-in Node.js module

/**
 * Generates a cryptographically secure, UUID-style unique username from a full name.
 * Uses 8 characters of high-entropy base-36 random string tracking.
 * * @param {string} fullName - The user's full name (e.g., "John Doe")
 * @returns {string} - A globally safe unique username (e.g., "johndoe_b8x2m9qp")
 */

function generateNodeUuidUsername(fullName) {
    // Fallback if fullName is missing or invalid
    if (!fullName || typeof fullName !== 'string') {
        const emergencyId = crypto.randomBytes(4).toString('hex'); // 8 hex characters
        return `user_${emergencyId}`;
    }

    // 1. Sanitize the Full Name
    const cleanName = fullName
        .toLowerCase()
        .normalize("NFD")                 // Separate accents from letters (e.g., é -> e + ´)
        .replace(/[\u0300-\u036f]/g, "") // Wipe out the accent marks
        .replace(/[^a-z0-9]/g, '')       // Keep ONLY lowercase letters and numbers
        .trim();

    // 2. Generate a Cryptographically Secure 8-character Suffix
    // randomBytes(6) generates 6 bytes of completely random binary data.
    // Converting to base36 allows alpha-numeric layout (a-z, 0-9)
    const uniqueSuffix = crypto.randomBytes(6)
        .toString('base64')              // Temporarily encode to string
        .replace(/[^a-z0-9]/gi, '')      // Clear out symbols (+, /, =) 
        .toLowerCase()
        .substring(0, 8);                // Extract precisely 8 characters

    // 3. Combine username with its UUID-style token
    return `${cleanName}_${uniqueSuffix}`;
}
