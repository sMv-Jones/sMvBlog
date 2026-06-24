import crypto from 'crypto';

/**
 * Generates a clean, unique username from a full name.
 * @param {string} fullName - The user's full name.
 * @param {string} [extraSeed=''] - Optional ID or timestamp to ensure 100% uniqueness.
 */

function generateUsername(fullName) {
    const extraSeed = Date.now().toString();
    // 1. Clean the name: lowercase, remove accents, remove non-alphanumeric characters
    const cleanName = fullName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');

    // 2. Generate the hash (using the name + an optional extra seed for true uniqueness)
    const rawHash = crypto
        .createHash('sha256')
        .update(fullName + extraSeed)
        .digest('hex');
        
    const shortHash = rawHash.substring(0, 8);

    // 3. Combine them
    return `${cleanName}_${shortHash}`;
}

export default generateUsername;