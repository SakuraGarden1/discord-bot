const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.RAILWAY_ENVIRONMENT ? '/tmp' : path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'economy.json');

function loadDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ users: {}, owner: null }));
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
  catch { fs.writeFileSync(DB_PATH, JSON.stringify({ users: {}, owner: null })); return { users: {}, owner: null }; }
}

function saveDB(db) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }

function getUser(userId) {
  const db = loadDB();
  if (!db.users[userId]) {
    db.users[userId] = {
      cash: 1000, bank: 0, xp: 0, level: 1,
      lastWork: 0, lastRob: 0, lastCrime: 0, lastDaily: 0,
      lastBankRob: 0, dailyStreak: 0, inventory: {},
      married: null, selectedJob: null,
    };
    saveDB(db);
  }
  const u = db.users[userId];
  const defaults = {
    married: null, selectedJob: null, lastBankRob: 0,
    lastCrime: 0, lastDaily: 0, dailyStreak: 0, inventory: {},
  };
  let changed = false;
  for (const [k, v] of Object.entries(defaults)) {
    if (u[k] === undefined) { u[k] = v; changed = true; }
  }
  if (changed) { db.users[userId] = u; saveDB(db); }
  return db.users[userId];
}

function saveUser(userId, data) { const db = loadDB(); db.users[userId] = data; saveDB(db); }
function getAllUsers() { return loadDB().users; }
function setOwner(userId) { const db = loadDB(); db.owner = userId; saveDB(db); }
function getOwner() { return loadDB().owner; }

module.exports = { getUser, saveUser, getAllUsers, setOwner, getOwner };
