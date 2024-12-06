import Dexie from 'dexie';

// Initialize Dexie and create the database
const db = new Dexie("SpeechDatabase");

// Define database schema
db.version(1).stores({
    words: '++id, word, count, timestamp, severity, category',
    sessions: '++id, startTime, endTime, totalWords, averagePace'
});

// Utility function to calculate word severity
const calculateSeverity = (word) => {
    // Add your profanity/severity checking logic here
    // Example implementation:
    const profanityList = {
        mild: ['darn', 'heck'],
        moderate: ['damn'],
        severe: ['fuck', 'shit']
    };

    if (profanityList.severe.includes(word.toLowerCase())) return 'severe';
    if (profanityList.moderate.includes(word.toLowerCase())) return 'moderate';
    if (profanityList.mild.includes(word.toLowerCase())) return 'mild';
    return 'clean';
};

// Utility function to determine word category
const determineCategory = (word) => {
    // Add your word categorization logic here
    // Example: filler words, technical terms, etc.
    const categories = {
        fillers: ['um', 'uh', 'like', 'you know'],
        technical: ['algorithm', 'database', 'function'],
        // Add more categories as needed
    };

    for (const [category, words] of Object.entries(categories)) {
        if (words.includes(word.toLowerCase())) return category;
    }
    return 'general';
};

// Function to add a new word or update existing word count
export const addWord = async (word) => {
    try {
        const existingWord = await db.words
            .where('word').equals(word)
            .and(w => w.timestamp > Date.now() - 86400000)
            .first();

        if (existingWord) {
            await db.words.update(existingWord.id, {
                count: existingWord.count + 1
            });
        } else {
            await db.words.add({
                word,
                count: 1,
                timestamp: Date.now(),
                severity: calculateSeverity(word),
                category: determineCategory(word)
            });
        }
    } catch (error) {
        console.error('Error adding word:', error);
    }
};

// Function to start a new session
export const startSession = async () => {
    try {
        const sessionId = await db.sessions.add({
            startTime: Date.now(),
            totalWords: 0
        });
        return sessionId;
    } catch (error) {
        console.error('Error starting session:', error);
    }
};

// Function to end a session
export const endSession = async (sessionId, totalWords) => {
    try {
        await db.sessions.update(sessionId, {
            endTime: Date.now(),
            totalWords,
            averagePace: totalWords / ((Date.now() - db.sessions.get(sessionId).startTime) / 60000)
        });
    } catch (error) {
        console.error('Error ending session:', error);
    }
};

// Function to get statistics for a time period
export const getStats = async (timeRange) => {
    const now = Date.now();
    let startTime;

    switch(timeRange) {
        case 'day':
            startTime = now - 86400000;
            break;
        case 'week':
            startTime = now - 7 * 86400000;
            break;
        case 'month':
            startTime = now - 30 * 86400000;
            break;
        default:
            startTime = now - 86400000;
    }

    try {
        const words = await db.words
            .where('timestamp')
            .above(startTime)
            .toArray();
            
        return words;
    } catch (error) {
        console.error('Error getting stats:', error);
        return [];
    }
};

export const deleteDatabase = async () => {
    try {
        await db.delete(); // Deletes the database
        console.log('Database deleted successfully.');
    } catch (error) {
        console.error('Error deleting database:', error);
    }
};

export default db;
