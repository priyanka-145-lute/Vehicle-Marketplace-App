# Graph Report - Vehicle-Marketplace-App  (2026-10-27)

## Corpus Check
- 84 files · ~30,209 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 42 file(s) not represented in the graph (top: .ttf 19, .xml 6, (none) 5)

## Summary
- 425 nodes · 1083 edges · 38 communities (17 shown, 21 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 62 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f5c0767b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AppNavigator.jsx
- react-native
- colors.js
- AppDelegate
- useThemeStyles
- dependencies
- react
- devDependencies
- AppNavigator.jsx
- @react-native/eslint-config@0.84.1
- Getting Started
- @types/react@^19.2.0
- AllTwoWheelersScreen.jsx
- eslint@^8.19.0
- MainApplication.kt
- MainActivity.kt
- package.json
- tsconfig.json
- scripts
- metro.config.js
- AllOtherVehiclesScreen.jsx
- {useGetCountriesQuery, useGetStatesQuery, useGetCitiesQuery, useGetAreasQuery}
- @babel/preset-env@^7.25.3
- MySalesScreen.jsx
- ehicleData.jsx
- @types/jest@^29.5.13
- {useGetVehiclesQuery, useRegisterUserMutation, useSendOtpMutation, useVerifyOtpMutation, useRefreshTokenMutation}

## God Nodes (most connected - your core abstractions)
1. `useThemeStyles()` - 91 edges
2. `react` - 52 edges
3. `react-native` - 49 edges
4. `react-native-vector-icons` - 28 edges
5. `NetworkVehicleImage()` - 19 edges
6. `useTheme()` - 17 edges
7. `react-native-safe-area-context` - 15 edges
8. `@react-native-async-storage/async-storage` - 14 edges
9. `WishlistHeart()` - 13 edges
10. `react-test-renderer` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Redux setup` --references--> `LocationFields()`  [INFERRED]
  src/redux/README.md → src/components/LocationFields.jsx
- `ThemedApp()` --calls--> `WishlistProvider()`  [EXTRACTED]
  App.jsx → src/context/WishlistContext.jsx
- `ThemedApp()` --calls--> `AppNavigator()`  [EXTRACTED]
  App.jsx → src/navigation/AppNavigator.jsx
- `Form()` --calls--> `LocationFields()`  [EXTRACTED]
  __tests__/LocationFields.test.jsx → src/components/LocationFields.jsx
- `render()` --calls--> `OtpScreen()`  [EXTRACTED]
  __tests__/Otp.test.jsx → src/screens/authScreen/OtpScreen.jsx

## Import Cycles
- None detected.

## Communities (38 total, 21 thin omitted)

### Community 0 - "AppNavigator.jsx"
Cohesion: 0.11
Nodes (17): react-native-safe-area-context@^5.7.0, react-native-safe-area-context, createStyles(), NOTIFICATIONS, NotificationsScreen(), createStyles(), PARTS, PartsScreen() (+9 more)

### Community 1 - "react-native"
Cohesion: 0.13
Nodes (29): react-native, Chip(), createStyles(), Dropdown(), FOUR_WHEELER_FILTER_DEFAULTS, FourWheelerFilterDrawer(), PriceSlider(), createStyles() (+21 more)

### Community 2 - "colors.js"
Cohesion: 0.09
Nodes (40): App(), displayName, name, ThemedApp(), @react-navigation/native@^7.2.2, react, react-native-vector-icons, @react-navigation/native (+32 more)

### Community 3 - "AppDelegate"
Cohesion: 0.12
Nodes (6): AppDelegate, ReactNativeDelegate, React, React_RCTAppDelegate, ReactAppDependencyProvider, UIKit

### Community 4 - "useThemeStyles"
Cohesion: 0.11
Nodes (31): createStyles(), LocationFields(), Redux setup, AccountScreen(), Avatar(), Button(), createStyles(), EditProfileScreen() (+23 more)

### Community 5 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, react@19.2.3, react-native@0.84.1, @react-native-async-storage/async-storage@^2.2.0, react-native-gesture-handler@^2.31.0, react-native-keychain@^10.0.0, @react-native/new-app-screen@0.84.1, react-native-reanimated@^4.3.0 (+14 more)

### Community 6 - "react"
Cohesion: 0.11
Nodes (16): AuthStack(), Stack, createStyles(), LoginScreen(), createStyles(), onboardingData, OnboardingScreen(), { width, height } (+8 more)

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @babel/core@^7.25.2, @babel/runtime@^7.25.0, jest@^29.6.3, @react-native/babel-preset@0.84.1, @react-native-community/cli@20.1.0, @react-native/typescript-config@0.84.1, react-test-renderer@19.2.3 (+10 more)

### Community 8 - "AppNavigator.jsx"
Cohesion: 0.12
Nodes (31): react-native-keychain, react-redux, @reduxjs/toolkit, AppNavigator(), createStyles(), MainStack(), Stack, api (+23 more)

### Community 10 - "Getting Started"
Cohesion: 0.18
Nodes (10): Android, Congratulations! :tada:, Getting Started, iOS, Learn More, Now what?, Step 1: Start Metro, Step 2: Build and run your app (+2 more)

### Community 12 - "AllTwoWheelersScreen.jsx"
Cohesion: 0.40
Nodes (9): Chip(), createStyles(), Dropdown(), PriceSlider(), TWO_WHEELER_FILTER_DEFAULTS, TwoWheelerFilterDrawer(), AllTwoWheelersScreen(), createStyles() (+1 more)

### Community 16 - "package.json"
Cohesion: 0.17
Nodes (11): prettier@2.8.8, @react-native-community/cli-platform-android@20.1.0, @react-native-community/cli-platform-ios@20.1.0, engines, node, name, private, version (+3 more)

### Community 17 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, @react-native/typescript-config

### Community 18 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, ios, lint, start, test

### Community 19 - "metro.config.js"
Cohesion: 0.40
Nodes (3): config, @react-native/metro-config@0.84.1, @react-native/metro-config

### Community 21 - "AllOtherVehiclesScreen.jsx"
Cohesion: 0.40
Nodes (9): Chip(), createStyles(), Dropdown(), OTHER_FILTER_DEFAULTS, OtherVehicleFilterDrawer(), PriceSlider(), AllOtherVehiclesScreen(), createStyles() (+1 more)

### Community 24 - "MySalesScreen.jsx"
Cohesion: 0.13
Nodes (13): @react-native-async-storage/async-storage, react-test-renderer, AccountNavigator(), Conversation, createStyles(), Draft, isConversation(), MessageScreen() (+5 more)

## Knowledge Gaps
- **7 isolated node(s):** `UIKit`, `React`, `React_RCTAppDelegate`, `ReactAppDependencyProvider`, `@react-native/typescript-config` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 111 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useThemeStyles()` connect `useThemeStyles` to `AppNavigator.jsx`, `react-native`, `colors.js`, `react`, `AppNavigator.jsx`, `AllTwoWheelersScreen.jsx`, `AllOtherVehiclesScreen.jsx`, `MySalesScreen.jsx`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **What connects `UIKit`, `React`, `React_RCTAppDelegate` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppNavigator.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11067193675889328 - nodes in this community are weakly interconnected._
- **Why does `react` connect `colors.js` to `AppNavigator.jsx`, `react-native`, `useThemeStyles`, `dependencies`, `react`, `AppNavigator.jsx`, `AllTwoWheelersScreen.jsx`, `package.json`, `AllOtherVehiclesScreen.jsx`, `MySalesScreen.jsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.12944523470839261 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `AppNavigator.jsx`, `colors.js`, `useThemeStyles`, `dependencies`, `react`, `AppNavigator.jsx`, `AllTwoWheelersScreen.jsx`, `package.json`, `AllOtherVehiclesScreen.jsx`, `MySalesScreen.jsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Should `colors.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0852994555353902 - nodes in this community are weakly interconnected._