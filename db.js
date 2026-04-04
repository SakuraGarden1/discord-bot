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
      hunger: 100, lastHungerUpdate: Date.now(),
      married: null, selectedJob: null,
      drunk: 0, stress: 0, addiction: false, drinkCount: 0, lastDrink: 0, lastDrunkDecay: Date.now(),
    };
    saveDB(db);
  }
  const u = db.users[userId];
  const defaults = { hunger: 100, lastHungerUpdate: Date.now(), married: null, selectedJob: null, lastBankRob: 0, lastCrime: 0, lastDaily: 0, dailyStreak: 0, inventory: {}, drunk: 0, stress: 0, addiction: false, drinkCount: 0, lastDrink: 0, lastDrunkDecay: Date.now() };
  let changed = false;
  for (const [k, v] of Object.entries(defaults)) { if (u[k] === undefined) { u[k] = v; changed = true; } }
  if (updateDrunk(u)) changed = true;
  if (changed) { db.users[userId] = u; saveDB(db); }
  return db.users[userId];
}

function saveUser(userId, data) { const db = loadDB(); db.users[userId] = data; saveDB(db); }
function getAllUsers() { return loadDB().users; }
function setOwner(userId) { const db = loadDB(); db.owner = userId; saveDB(db); }
function getOwner() { return loadDB().owner; }

function addToOwner(amount) {
  const db = loadDB();
  if (!db.owner) return;
  if (!db.users[db.owner]) db.users[db.owner] = { cash: 0, bank: 0, xp: 0, level: 1, lastWork: 0, lastRob: 0, lastCrime: 0, lastDaily: 0, lastBankRob: 0, dailyStreak: 0, inventory: {}, hunger: 100, lastHungerUpdate: Date.now(), married: null, selectedJob: null, drunk: 0, stress: 0, addiction: false, drinkCount: 0, lastDrink: 0, lastDrunkDecay: Date.now() };
  db.users[db.owner].cash += amount;
  saveDB(db);
}

function updateHunger(user) {
  const now = Date.now();
  const elapsed = (now - (user.lastHungerUpdate || now)) / 3600000;
  user.hunger = Math.max(0, (user.hunger || 100) - elapsed * (100 / 12));
  user.lastHungerUpdate = now;
  return user;
}

/** Бүтэн цаг тутамд согтолтыг 1.0-ээр бууруулна (команд ажиллах бүрт тооцно). */
function updateDrunk(user) {
  const now = Date.now();
  if (user.lastDrunkDecay == null || !Number.isFinite(user.lastDrunkDecay)) {
    user.lastDrunkDecay = now;
    return true;
  }
  let drunk = +(user.drunk || 0);
  if (!Number.isFinite(drunk) || drunk < 0) {
    user.drunk = 0;
    user.lastDrunkDecay = now;
    return true;
  }
  if (drunk <= 0) {
    if (user.drunk !== 0) {
      user.drunk = 0;
      return true;
    }
    return false;
  }
  const elapsed = now - user.lastDrunkDecay;
  const hours = Math.floor(elapsed / 3600000);
  if (hours <= 0) return false;
  const dec = Math.min(hours, Math.ceil(drunk - 1e-9));
  drunk = Math.max(0, parseFloat((drunk - dec).toFixed(1)));
  user.drunk = drunk;
  user.lastDrunkDecay = user.lastDrunkDecay + dec * 3600000;
  if (user.drunk <= 0) {
    user.drunk = 0;
    user.lastDrunkDecay = now;
  }
  return true;
}

/** Бүх хэрэглэгчид цагийн согтолтын decay тооцох (background). */
function decayAllUsersDrunk() {
  const db = loadDB();
  if (!db.users) return;
  let dirty = false;
  for (const id of Object.keys(db.users)) {
    if (updateDrunk(db.users[id])) dirty = true;
  }
  if (dirty) saveDB(db);
}

module.exports = { getUser, saveUser, getAllUsers, setOwner, getOwner, addToOwner, updateHunger, updateDrunk, decayAllUsersDrunk };
