// Staff role-уудын нэрний хэсэг — role нэр энэ утгуудын аль нэгийг агуулж байвал хамгаалагдана
const PROTECTED_KEYWORDS = [
  'Owner',
  'Co owner',
  'Admin',
  'Developer',
  'Event Manager',
  'Adult Manager',
  'Moderator',
  'Host',
  'Designer',
  'Staff',
  'Trial Staff',
];

function isProtected(member) {
  return member.roles.cache.some(role =>
    PROTECTED_KEYWORDS.some(keyword => role.name.includes(keyword))
  );
}

module.exports = { isProtected };
