# Product+ive - Tech Stack and Versions

> Last Updated: 2026-04-02 (IST)

## Core Runtime

| Technology | Version in repo | Notes |
|---|---|---|
| Expo | `^55.0.9` | SDK 55 line |
| React Native | `0.83.4` | Locked by Expo SDK 55 compatibility |
| React | `19.2.0` | Current project lock |
| React DOM | `19.2.0` | For web target |
| TypeScript | `~5.9.2` | Strict mode |

## Key App Dependencies

| Package | Version |
|---|---|
| `expo-router` | `~55.0.8` |
| `zustand` | `^5.0.0` |
| `expo-sqlite` | `~55.0.11` |
| `expo-notifications` | `~55.0.14` |
| `@react-native-async-storage/async-storage` | `2.2.0` |
| `react-native-reanimated` | `4.2.1` |
| `react-native-worklets` | `0.7.2` |
| `react-native-gesture-handler` | `~2.30.0` |
| `react-native-safe-area-context` | `~5.6.0` |
| `react-native-screens` | `~4.23.0` |
| `react-native-svg` | `15.15.3` |
| `lucide-react-native` | `^1.7.0` |
| `@shopify/flash-list` | `2.0.2` |

## Dev Dependencies

| Package | Version |
|---|---|
| `eslint` | `^9.25.0` |
| `eslint-config-expo` | `~55.0.0` |
| `@types/react` | `~19.2.10` |
| `typescript` | `~5.9.2` |

## CI/CD Stack

| Item | Version / Setting |
|---|---|
| Runner OS | `ubuntu-latest` (currently Ubuntu 24.04 image) |
| Node in workflow | `22` |
| Java in workflow | Temurin `17` |
| Action runtime migration | `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` |

## Minimum Local Requirements

- Node.js: `>=20.19.4` (22 LTS recommended)
- npm: 10.x+
- Java 17 for local Android release builds
- Android SDK with API 34+

## Deprecation Notes

- Project-level dependencies were updated for Expo SDK 55 compatibility.
- Some deprecated warnings still appear from transitive upstream packages (`glob@7`, `rimraf@3`, `inflight`) inside React Native / Expo toolchain dependencies.
- These are not directly controlled in app `package.json` and should be revisited when upstream releases update.
