const TAX_RATE = 0.05;

const JOBS = [
  { min: 1,   name: '🧹 Цэвэрлэгч',           pay: [800,   1500]  },
  { min: 2,   name: '🚚 Хүргэлтийн жолооч',    pay: [1000,  2000]  },
  { min: 3,   name: '🛒 Худалдагч',             pay: [1500,  2500]  },
  { min: 4,   name: '🏭 Үйлдвэрийн ажилчин',   pay: [2000,  3500]  },
  { min: 5,   name: '👨‍🍳 Тогооч',               pay: [2500,  4500]  },
  { min: 7,   name: '👮 Цагдаа',                pay: [3000,  5000]  },
  { min: 9,   name: '🚒 Гал сөнөөгч',           pay: [3500,  6000]  },
  { min: 12,  name: '🎤 Дуучин',                pay: [4000,  7000]  },
  { min: 13,  name: '💃 Бүжигчин',              pay: [4000,  7000]  },
  { min: 15,  name: '👨‍🏫 Багш',                 pay: [5000,  8000]  },
  { min: 18,  name: '💻 Developer',              pay: [6000,  10000] },
  { min: 22,  name: '⚖️ Өмгөөлөгч',            pay: [8000,  13000] },
  { min: 25,  name: '👨‍⚕️ Эмч',                 pay: [10000, 15000] },
  { min: 30,  name: '📊 Manager',                pay: [12000, 18000] },
  { min: 35,  name: '🏫 Захирал',               pay: [15000, 22000] },
  { min: 40,  name: '🏦 Business Owner',         pay: [18000, 26000] },
  { min: 50,  name: '🏭 Үйлдвэрийн захирал',    pay: [22000, 32000] },
  { min: 60,  name: '👔 CEO',                    pay: [30000, 45000] },
  { min: 75,  name: '🏛️ Bank Director',         pay: [40000, 60000] },
  { min: 90,  name: '🏙️ Улс төрч',             pay: [50000, 70000] },
  { min: 110, name: '🇲🇳 Ерөнхийлөгч',         pay: [70000, 100000] },
];

const RANKS = [
  { min: 1,   max: 5,   name: 'Broke',         emoji: '😔' },
  { min: 6,   max: 10,  name: 'Earner',        emoji: '💵' },
  { min: 11,  max: 15,  name: 'Hustler',       emoji: '💪' },
  { min: 16,  max: 20,  name: 'Investor',      emoji: '📈' },
  { min: 21,  max: 30,  name: 'Banker',        emoji: '🏦' },
  { min: 31,  max: 50,  name: 'Millionaire',   emoji: '💰' },
  { min: 51,  max: 70,  name: 'Billionaire',   emoji: '💎' },
  { min: 71,  max: 99,  name: 'Tycoon',        emoji: '🏆' },
  { min: 100, max: 999, name: 'Monopoly Boss', emoji: '👑' },
];

function getRank(level) { return RANKS.find(r => level >= r.min && level <= r.max) || RANKS[0]; }
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

module.exports = { JOBS, RANKS, getJob, getRank, getAvailableJobs, checkLevelUp, rand, applyTax, TAX_RATE, xpForNextLevel, shortNum };
