const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = 'discordbot';

let client = null;
let db = null;

async function connect() {
  if (db) return db;
  client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  console.log('✅ MongoDB холбогдлоо!');
  return db;
}

async function getUser(userId) {
  const database = await connect();
  const users = database.collection('users');
  let user = await users.findOne({ userId });
  if (!user) {
    user = {
      userId, cash: 1000, bank: 0, xp: 0, level: 1,
      lastWork: 0, lastRob: 0, lastCrime: 0, lastDaily: 0,
      lastBankRob: 0, dailyStreak: 0, inventory: {},
      hunger: 100, lastHungerUpdate: Date.now(),
      married: null, selectedJob: null,
    };
    await users.insertOne(user);
  }
  // Migrate хуучин талбарууд
  const updates = {};
  if (user.hunger === undefined) updates.hunger = 100;
  if (user.lastHungerUpdate === undefined) updates.lastHungerUpdate = Date.now();
  if (user.married === undefined) updates.married = null;
  if (user.selectedJob === undefined) updates.selectedJob = null;
  if (user.lastBankRob === undefined) updates.lastBankRob = 0;
  if (user.inventory === undefined) updates.inventory = {};
  if (user.dailyStreak === undefined) updates.dailyStreak = 0;
  if (Object.keys(updates).length > 0) {
    await users.updateOne({ userId }, { $set: updates });
    Object.assign(user, updates);
  }
  return user;
}

async function saveUser(userId, data) {
  const database = await connect();
  const users = database.collection('users');
  const { _id, ...updateData } = data;
  await users.updateOne({ userId }, { $set: updateData }, { upsert: true });
}

async function getAllUsers() {
  const database = await connect();
  const users = database.collection('users');
  const all = await users.find({}).toArray();
  const result = {};
  for (const u of all) result[u.userId] = u;
  return result;
}

async function setOwner(userId) {
  const database = await connect();
  await database.collection('config').updateOne(
    { key: 'owner' }, { $set: { value: userId } }, { upsert: true }
  );
}

async function getOwner() {
  const database = await connect();
  const config = await database.collection('config').findOne({ key: 'owner' });
  return config?.value || null;
}

async function addToOwner(amount) {
  const ownerId = await getOwner();
  if (!ownerId) return;
  const owner = await getUser(ownerId);
  owner.cash += amount;
  await saveUser(ownerId, owner);
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
