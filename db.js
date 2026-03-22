const fs = require('fs');
const path = require('path');

// Railway дээр /tmp хэзээ ч устдаггүй
const DATA_DIR = process.env.RAILWAY_ENVIRONMENT ? '/tmp' : path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'economy.json');

function loadDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ users: {}, owner: null }));
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {}, owner: null }));
    return { users: {}, owner: null };
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getUser(userId) {
  const db = loadDB();
  if (!db.users[userId]) {
    db.users[userId] = {
      cash: 1000, bank: 0, xp: 0, level: 1,
      lastWork: 0, lastRob: 0, lastCrime: 0, lastDaily: 0,
      lastBankRob: 0, dailyStreak: 0, inventory: {},
      hunger: 100, lastHungerUpdate: Date.now(),
      married: null, selectedJob: null,
    };
    saveDB(db);
  }
  const u = db.users[userId];
  let changed = false;
  if (u.hunger === undefined) { u.hunger = 100; changed = true; }
  if (u.lastHungerUpdate === undefined) { u.lastHungerUpdate = Date.now(); changed = true; }
  if (u.married === undefined) { u.married = null; changed = true; }
  if (u.selectedJob === undefined) { u.selectedJob = null; changed = true; }
  if (u.lastBankRob === undefined) { u.lastBankRob = 0; changed = true; }
  if (u.lastCrime === undefined) { u.lastCrime = 0; changed = true; }
  if (u.lastDaily === undefined) { u.lastDaily = 0; changed = true; }
  if (u.dailyStreak === undefined) { u.dailyStreak = 0; changed = true; }
  if (u.inventory === undefined) { u.inventory = {}; changed = true; }
  if (changed) { db.users[userId] = u; saveDB(db); }
  return db.users[userId];
}

function saveUser(userId, data) {
  const db = loadDB();
  db.users[userId] = data;
  saveDB(db);
}

function getAllUsers() { return loadDB().users; }

function setOwner(userId) {
  const db = loadDB();
  db.owner = userId;
  saveDB(db);
}

function getOwner() { return loadDB().owner; }

function addToOwner(amount) {
  const db = loadDB();
  if (!db.owner) return;
  if (!db.users[db.owner]) db.users[db.owner] = { cash: 0, bank: 0, xp: 0, level: 1, lastWork: 0, lastRob: 0, lastCrime: 0, lastDaily: 0, lastBankRob: 0, dailyStreak: 0, inventory: {}, hunger: 100, lastHungerUpdate: Date.now(), married: null, selectedJob: null };
  db.users[db.owner].cash += amount;
  saveDB(db);
}

function updateHunger(user) {
  const now = Date.now();
  const elapsed = (now - (user.lastHungerUpdate || now)) / 1000 / 3600;
  const decrease = elapsed * (100 / 12);
  user.hunger = Math.max(0, (user.hunger || 100) - decrease);
  user.lastHungerUpdate = now;
  return user;
}

module.exports = { getUser, saveUser, getAllUsers, setOwner, getOwner, addToOwner, updateHunger };
