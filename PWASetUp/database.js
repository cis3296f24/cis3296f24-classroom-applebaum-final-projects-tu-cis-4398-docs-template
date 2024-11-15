import Dexie from 'dexie';

// Initialize Dexie and create the database
const db = new Dexie("SpeechDatabase");
db.version(1).stores({
    words: '++id, word, count, timestamp'
});

export default db;
