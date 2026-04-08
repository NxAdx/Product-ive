# Product +ive

**Master Productivity Rules - Daily**

A React Native app built with Expo that teaches you 20 proven productivity rules through interactive learning engines. Track your progress, build streaks, and climb the achievement ladder.

## 🎯 What is Product +ive?

Product +ive is your daily companion for mastering productivity. It combines:
- **20 Productivity Rules** proven to work
- **7 Interactive Learning Engines** to practice
- **Real-time Progress Tracking** to stay motivated
- **Daily Tips & Milestones** to keep you engaged

## ✨ Features

### 📚 20 Productivity Rules

**Learn & Develop**
- Cornell Note-Taking
- SQ3R Method
- Mind Mapping
- Elaborative Interrogation

**Focus & Productivity**
- 1-3-5 Rule
- 80/20 Rule
- Parkinson's Law
- 5-Second Rule

**Memory & Retention**
- Spaced Repetition
- Interleaving
- Blurting
- Chunking
- 1-4-7 Rule

**Awareness & Mindset**
- Awareness Reflection
- Free Write Recall
- And more...

### 🎮 7 Interactive Engines

Each rule comes with interactive practice:
- **Countdown Timer** - Focused practice sessions
- **Guided Prompts** - Question-based learning
- **Free Write** - Writing-based recall
- **Interval Reminders** - Spaced review
- **Reflection** - Self-awareness exercises
- **Smart Sorter** - Priority management
- **Spaced Repetition** - Intelligent scheduling

### 🏠 Home Screen (Tier 1)

- **Today's Progress** - Weekly score, streak, rules used
- **Daily Tips** - Fresh motivation every day
- **Milestone Progress** - 4-tier achievement system

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android or iOS device/emulator

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd "Prouct +ive"

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# For Android
npm run android

# For iOS
npm run ios

# For Web
npm run web
```

### Quick Start

1. Open Product +ive
2. Browse rules in Explore or by Category
3. Tap a rule to read about it
4. Tap "Practice" to use an interactive engine
5. Track your score on the home screen
6. Read your daily tip for motivation
7. Climb toward milestones

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── StatsCard.tsx    # Weekly progress
│   ├── DailyTip.tsx     # Daily motivation
│   ├── ProgressBar.tsx  # Milestone tracker
│   └── ...
├── engines/             # 7 learning engines
├── store/               # Zustand stores
│   ├── positivityStore
│   ├── sessionStore
│   ├── todoStore
│   └── settingsStore
├── theme/               # Theme system (system/light/dark)
├── data/                # Static data (rules, categories)
└── utils/               # Helpers and utilities

app/
├── (tabs)/              # Tab navigation
│   ├── index.tsx        # Home with Tier 1 features
│   ├── explore.tsx      # Search & browse
│   ├── meter.tsx        # Score visualization
│   └── todo.tsx         # Task management
├── category/[id].tsx    # Category detail
├── rule/[id].tsx        # Rule detail
└── settings.tsx         # User settings
```

## 🛠️ Technology Stack

- **Framework:** React Native 0.83.4
- **Build Tool:** Expo SDK 55
- **Language:** TypeScript (strict mode)
- **Navigation:** Expo Router
- **State Management:** Zustand
- **Persistence:** AsyncStorage + SQLite (native) + web-safe SQLite adapter
- **Animations:** Reanimated 3
- **Icons:** Lucide React Native
- **CI/CD:** GitHub Actions

## 📝 Development

### Available Commands

```bash
npm start              # Start dev server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator
npm run web            # Run on web
npm run lint           # Code quality check
npm test               # Run tests
npm run reset-project  # Reset to clean state
```

### Code Quality

- **TypeScript:** Strict type checking
- **ESLint:** Code quality enforcement
- **No Errors:** Zero compilation errors
- **No Warnings:** Zero ESLint warnings

## 🧪 Testing

### QA Testing

Run the automated test script:
```bash
./scripts/qa-test.sh
```

Tests verify:
- TypeScript compilation
- Component imports
- File structure
- Store integration
- Theme support
- Dependencies

### Manual Testing

See `docs/PHASE3_RELEASE_CHECKLIST.md` for manual testing procedures.

## 📊 Project Status

### Phase 1 ✅ Complete
- Foundation & infrastructure
- All 20 rules configured
- All 7 engines implemented
- Theme system
- Navigation

### Phase 2 ✅ Complete
- Animation fixes
- Theme improvements
- Update manager service
- Polish & refinement

### Phase 3 ⚙️ Partial (implemented + expanded)
- Home experience enhancements
- Real session metrics and scoring
- SQLite bootstrap + session/point-event persistence with web-safe adapter split
- Real automated tests (Jest) now active

### Phase 4 ⚙️ Partial
- Notification permissions and wellness schedules wired
- Immediate interval reminder notifications wired
- Additional lifecycle notification templates/coverage still pending

### Phase 5 ⚙️ Partial
- GitHub release version checks
- Semantic update comparison
- APK asset detection + download handoff
- Native PackageInstaller bridge still pending

## 🚢 Release Information

**Current Version:** 1.0.0  
**Status:** Production Ready  
**Platform:** Android 10+, iOS 13+  
**Bundle Size:** ~2.5MB

### Release Documentation

- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [RELEASE_NOTES_1.0.0.md](./docs/RELEASE_NOTES_1.0.0.md) - Release details
- [RELEASE_PACKAGE.md](./RELEASE_PACKAGE.md) - Complete package info
- [PLAYSTORE_LISTING.md](./docs/PLAYSTORE_LISTING.md) - Store copy

## 📚 Documentation

### For Users
- [USER_MANUAL.md](./docs/user_manual.md) - How to use
- [FEATURE_LIST.md](./docs/feature-list.md) - All features

### For Developers
- [ARCHITECTURE.md](./docs/architecture.md) - System design
- [DATABASE_SCHEMA.md](./docs/database-schema.md) - Data models
- [TECH_STACK.md](./docs/tech-stack.md) - Technology decisions
- [TIER2_TIER3_ROADMAP.md](./docs/TIER2_TIER3_ROADMAP.md) - Future plans

### For QA/Release
- [QA_TESTING_PHASE3.md](./docs/QA_TESTING_PHASE3.md) - Test procedures
- [PHASE3_RELEASE_CHECKLIST.md](./docs/PHASE3_RELEASE_CHECKLIST.md) - Release process
- [COMPLETION_VERIFICATION.md](./docs/COMPLETION_VERIFICATION.md) - Verification report

## 🔄 Git History

```
cce3486 - Phase 3 Tier 1: Home screen features
3bf5e28 - Phase 2: Quality improvements
058ef63 - Phase 1: Foundation complete
```

## 🐛 Known Limitations

- Native direct-installer bridge for updater is still pending
- Full session history UI on top of SQLite persistence is still pending
- Full reminder-template parity across all engines is still incremental
- Local Android release build needs Android SDK configured (`ANDROID_HOME`/`local.properties`) on each machine
- No user accounts (cloud sync in v2.0+)

## 🗺️ Roadmap

### v1.1.0 (Q2 2026)
- Updater native installer completion
- Expanded notification lifecycle templates
- Session history UI from SQLite
- Higher coverage integration tests

### v2.0.0 (Q3 2026)
- Achievement system
- Leaderboard
- Advanced analytics
- Expanded SQLite domain model
- Cloud sync

## 🤝 Contributing

This is the initial release. Contributions will be guided by the roadmap.

## 📄 License

[License information to be added]

## 📞 Support

- **Bug Reports:** Use in-app Settings
- **Feedback:** Email us (in-app)
- **Questions:** Check user manual

## 🙏 Acknowledgments

Built with care for productivity enthusiasts everywhere.

---

**Product +ive v1.0.0**  
*Master Productivity Rules - Daily*

Made with ❤️ using React Native & Expo
