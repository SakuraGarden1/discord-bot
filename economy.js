const TAX_RATE = 0.05;

const JOBS = [
  { min: 1,   name: '🚕 Taxi driver',      pay: [1000, 2000]  },
  { min: 6,   name: '🛒 Худалдагч',         pay: [2000, 3500]  },
  { min: 11,  name: '🏢 Company employee', pay: [3500, 5000]  },
  { min: 16,  name: '💻 Developer',        pay: [5000, 7000]  },
  { min: 21,  name: '📊 Manager',          pay: [7000, 9000]  },
  { min: 31,  name: '🏦 Business owner',   pay: [9000, 12000] },
  { min: 51,  name: '👔 CEO',              pay: [12000, 16000] },
  { min: 71,  name: '🏛️ Bank director',   pay: [16000, 20000] },
  { min: 100, name: '🏙️ Mayor',           pay: [20000, 30000] },
  { min: 111, name: '🧑‍⚖️ Senator',       pay: [30000, 40000] },
  { min: 121, name: '🇲🇳 President',      pay: [40000, 50000] },
];

function getJob(level) { const a = JOBS.filter(j => level >= j.min); return a[a.length-1] || JOBS[0]; }
function getAvailableJobs(level) { return JOBS.filter(j => level >= j.min); }
function xpForNextLevel(level) { return level * 100; }

function checkLevelUp(user) {
  let leveled = false;
  while (user.xp >= xpForNextLevel(user.level)) { user.xp -= xpForNextLevel(user.level); user.level++; leveled = true; }
  return leveled;
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function applyTax(amount) { const tax = Math.floor(amount * TAX_RATE); return { net: amount - tax, tax }; }

function shortNum(n) {
  if (n >= 1_000_000_000) return (n/1_000_000_000).toFixed(1).replace(/\.0$/,'')+'B';
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1).replace(/\.0$/,'')+'M';
  if (n >= 1_000) return (n/1_000).toFixed(1).replace(/\.0$/,'')+'k';
  return n.toString();
}

module.exports = { JOBS, getJob, getAvailableJobs, checkLevelUp, rand, applyTax, TAX_RATE, xpForNextLevel, shortNum };
