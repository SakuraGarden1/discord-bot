const TAX_RATE = 0.05;

const JOBS = [
  // Анхан шатны ажлууд
  { min: 1,   max: 3,   name: '🚕 Такси жолооч',        pay: [800,  1500] },
  { min: 1,   max: 4,   name: '🛵 Дуудлагын жолооч',    pay: [900,  1600] },
  { min: 2,   max: 5,   name: '🍽️ Зөөгч',               pay: [1000, 1800] },
  { min: 3,   max: 6,   name: '🏭 Үйлдвэрийн ажилчин',  pay: [1200, 2000] },
  { min: 4,   max: 8,   name: '🛒 Худалдагч',            pay: [1500, 2500] },
  { min: 5,   max: 9,   name: '👨‍🍳 Тогооч',              pay: [1800, 3000] },
  // Дунд шатны ажлууд
  { min: 8,   max: 14,  name: '👮 Цагдаа',               pay: [3000, 5000] },
  { min: 9,   max: 15,  name: '🚒 Гал сөнөөгч',          pay: [3200, 5200] },
  { min: 10,  max: 16,  name: '🏢 Company Employee',      pay: [3500, 5500] },
  { min: 12,  max: 18,  name: '🎤 Дуучин',               pay: [4000, 7000] },
  { min: 13,  max: 19,  name: '💃 Бүжигчин',             pay: [3800, 6500] },
  { min: 14,  max: 20,  name: '📺 Мэдээ хөтлөгч',        pay: [4500, 7500] },
  { min: 15,  max: 22,  name: '👨‍🏫 Багш',                pay: [4000, 6500] },
  { min: 18,  max: 25,  name: '💻 Developer',             pay: [5000, 8000] },
  // Дээд шатны ажлууд
  { min: 22,  max: 32,  name: '⚖️ Өмгөөлөгч',           pay: [7000, 11000] },
  { min: 25,  max: 35,  name: '👨‍⚕️ Эмч',                pay: [8000, 13000] },
  { min: 28,  max: 40,  name: '📊 Manager',               pay: [7000, 10000] },
  { min: 35,  max: 50,  name: '🏫 Сургуулийн захирал',   pay: [9000, 14000] },
  { min: 38,  max: 55,  name: '🏦 Business Owner',        pay: [10000, 15000] },
  { min: 45,  max: 65,  name: '🏭 Үйлдвэрийн захирал',   pay: [12000, 18000] },
  // Элит ажлууд
  { min: 55,  max: 75,  name: '👔 CEO',                   pay: [15000, 22000] },
  { min: 65,  max: 90,  name: '🏛️ Bank Director',        pay: [18000, 26000] },
  { min: 80,  max: 99,  name: '💼 Chairman',              pay: [22000, 30000] },
  // Улс төрийн ажлууд
  { min: 100, max: 110, name: '🏙️ Mayor',                 pay: [25000, 35000] },
  { min: 111, max: 120, name: '🏛️ Senator',               pay: [35000, 45000] },
  { min: 121, max: 150, name: '🇲🇳 President',            pay: [45000, 60000] },
];

function getJob(level) {
  const available = JOBS.filter(j => level >= j.min);
  return available[available.length - 1] || JOBS[0];
}

function getAvailableJobs(level) {
  return JOBS.filter(j => level >= j.min && level <= j.max + 5);
}

function xpForNextLevel(level) {
  return level * 100;
}

function checkLevelUp(user) {
  let leveled = false;
  while (user.xp >= xpForNextLevel(user.level)) {
    user.xp -= xpForNextLevel(user.level);
    user.level++;
    leveled = true;
  }
  return leveled;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applyTax(amount) {
  const tax = Math.floor(amount * TAX_RATE);
  return { net: amount - tax, tax };
}

function shortNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toString();
}

module.exports = { JOBS, getJob, getAvailableJobs, checkLevelUp, rand, applyTax, TAX_RATE, xpForNextLevel, shortNum };
