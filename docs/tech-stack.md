# Product+ive — Tech Stack & Versions

> **Last Updated:** 2026-04-01 | **All versions are latest stable as of April 2026**

---

## Core Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Expo SDK** | 55 (latest stable) | Framework |
| **React Native** | 0.84.x | Mobile runtime |
| **TypeScript** | 5.x (strict mode) | Language |
| **Node.js** | 22+ LTS (or 24 LTS) | Runtime |
| **npm** | 10.x+ | Package manager |

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation (tabs + stack) |
| `zustand` | Lightweight state management |
| `expo-sqlite` | Local SQLite database |
| `@react-native-async-storage/async-storage` | Theme & settings persistence |
| `react-native-reanimated` | High-performance animations (worklet thread) |
| `expo-notifications` | Local notifications for rule reminders |
| `react-native-svg` | SVG rendering (meter ring, icons) |
| `lucide-react-native` | Icon library |
| `expo-font` | Custom font loading (Syne, Plus Jakarta Sans) |
| `react-native-gesture-handler` | Touch gesture handling |
| `react-native-safe-area-context` | Safe area handling |

## Dev Dependencies

| Package | Purpose |
|---------|---------|
| `jest` | Test runner |
| `@testing-library/react-native` | Component testing |
| `eslint` | Code linting |
| `prettier` | Code formatting |
| `typescript` | Type checking |

## Build Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Java (Temurin) | 17 | Android builds |
| Gradle | 8.x | Android build system |
| Android SDK | 34+ | Android compilation |

## AI Agent Skills (Installed)

### Community Skills (9 skills)
| Skill | Source | Purpose |
|-------|--------|---------|
| `react-native-animations` | pluginagentmarketplace | Animation patterns |
| `react-native-architecture` | wshobson/agents | Architecture patterns |
| `react-native-design` | wshobson/agents | Design patterns |
| `react-native-expert` | jeffallan/claude-skills | RN expertise |
| `react-native-testing` | callstack | Testing library |
| `ui-mobile` | alinaqi/claude-bootstrap | Mobile UI patterns |
| `ui-ux-pro-max` | nextlevelbuilder | UI/UX design intelligence |
| `vercel-react-best-practices` | vercel-labs | React best practices |
| `vercel-react-native-skills` | vercel-labs | RN best practices |

### From Expo Official (expo/skills)
| Skill | Purpose |
|-------|---------|
| `building-native-ui` | Expo Router UI, styling, components |
| `upgrading-expo` | SDK upgrade workflows |
| `expo-cicd-workflows` | EAS workflow YAML files |
| `expo-deployment` | App Store / Play Store deployment |
| `native-data-fetching` | Network requests, React Query, offline |

## Version Update Policy

- Check for new stable versions **monthly**
- Run `npm audit` before every release
- Pin exact versions in `package-lock.json`
- Document version changes in `update-logs.md`
- Test on both iOS and Android after upgrades
