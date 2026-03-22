# 🤖 Economy Discord Bot

## 📁 Файлын бүтэц
```
discord-bot/
├── index.js          ← Үндсэн файл
├── db.js             ← Өгөгдлийн сан (JSON)
├── economy.js        ← Level, job, tax системүүд
├── package.json
├── data/
│   └── economy.json  ← Автоматаар үүснэ
└── commands/
    ├── work.js
    ├── slot.js
    ├── coinflip.js
    ├── blackjack.js
    ├── rob.js
    ├── deposit.js
    ├── withdraw.js
    ├── balance.js
    ├── profile.js
    ├── leaderboard.js
    ├── setowner.js
    └── help.js
```

## ⚙️ Суулгах заавар

### 1. Node.js суулгах
https://nodejs.org дээрээс Node.js татаж суулгана.

### 2. Dependency суулгах
```bash
cd discord-bot
npm install
```

### 3. Discord Bot үүсгэх
1. https://discord.com/developers/applications руу орно
2. "New Application" дарна
3. "Bot" → "Add Bot" дарна
4. Token-оо хуулж авна
5. "MESSAGE CONTENT INTENT" -ийг **идэвхжүүлнэ** ✅

### 4. Bot-ыг server-тоо нэмэх
OAuth2 → URL Generator → `bot` scope → дараах permissions:
- Read Messages
- Send Messages
- Read Message History

### 5. Ажиллуулах
```bash
# Windows
set DISCORD_TOKEN=таны_token_энд
node index.js

# Mac/Linux
DISCORD_TOKEN=таны_token_энд node index.js
```

---

## 🎮 Командууд

| Команд | Тайлбар |
|--------|---------|
| `!work` | Ажил хийж мөнгө + XP ав (30 мин cooldown) |
| `!slot 500` | Slot machine тоглох |
| `!coinflip 500 heads` | Зоос шидэх |
| `!blackjack 500` | Blackjack эхлэх |
| `!blackjack hit` | Карт авах |
| `!blackjack stand` | Зогсох |
| `!rob @user` | Cash хулгайлах (45% амжилт) |
| `!deposit 1000` | Банкинд хийх |
| `!withdraw all` | Бүгдийг банкнаас гаргах |
| `!balance` | Дансны мэдээлэл |
| `!profile` | Профайл харах |
| `!leaderboard` | Тэргүүний 10 |
| `!setowner @user` | Owner тохируулах |

---

## 📊 Level & Job System

| Level | Ажил | Цалин |
|-------|------|-------|
| 1-5 | 🚕 Taxi Driver | ₮1,000–2,000 |
| 6-10 | 🛒 Худалдагч | ₮2,000–3,500 |
| 11-15 | 🏢 Company Employee | ₮3,500–5,000 |
| 16-20 | 💻 Developer | ₮5,000–7,000 |
| 21-30 | 📊 Manager | ₮7,000–9,000 |
| 31-50 | 🏦 Business Owner | ₮9,000–12,000 |
| 51-70 | 👔 CEO | ₮12,000–16,000 |
| 71-99 | 🏛️ Bank Director | ₮16,000–20,000 |
| 100-110 | 🏙️ Mayor | ₮20,000–30,000 |
| 111-120 | 🏛️ Senator | ₮30,000–40,000 |
| 121-150 | 🇲🇳 President | ₮40,000–50,000 |

**XP:** Ажил хийх бүр 10–30 XP авна. Level × 100 XP хуримтлуулвал дараагийн level рүү орно.

**Татвар:** Бүх хожлын 5% нь автоматаар owner-ын данс руу орно.
