# Graph Report - Vehicle-Marketplace-App  (2026-10-27)

## Corpus Check
- 73 files · ~25,172 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 42 file(s) not represented in the graph (top: .ttf 19, .xml 6, (none) 5)

## Summary
- 354 nodes · 897 edges · 37 communities (17 shown, 20 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `623fc1ef`
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
- package.json
- App.jsx
- Getting Started
- AllOtherVehiclesScreen.jsx
- AllTwoWheelersScreen.jsx
- MessageScreen.tsx
- MainApplication.kt
- MainActivity.kt
- tsconfig.json
- scripts
- metro.config.js
- jest@^29.6.3
- @react-native-community/cli@20.1.0
- @react-native/typescript-config@0.84.1
- @types/jest@^29.5.13
- @types/react@^19.2.0
- @types/react-test-renderer@^19.1.0
- ehicleData.jsx

## God Nodes (most connected - your core abstractions)
1. `useThemeStyles()` - 89 edges
2. `react` - 48 edges
3. `react-native` - 45 edges
4. `react-native-vector-icons` - 28 edges
5. `NetworkVehicleImage()` - 19 edges
6. `useTheme()` - 17 edges
7. `@react-native-async-storage/async-storage` - 16 edges
8. `react-native-safe-area-context` - 15 edges
9. `WishlistHeart()` - 13 edges
10. `VehicleScreen()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ThemedApp()` --calls--> `useTheme()`  [EXTRACTED]
  App.jsx → src/context/ThemeContext.jsx
- `ThemedApp()` --calls--> `WishlistProvider()`  [EXTRACTED]
  App.jsx → src/context/WishlistContext.jsx
- `ThemedApp()` --calls--> `AppNavigator()`  [EXTRACTED]
  App.jsx → src/navigation/AppNavigator.jsx
- `Screen()` --calls--> `useThemeStyles()`  [EXTRACTED]
  __tests__/Theme.test.jsx → src/theme/colors.js
- `Probe()` --calls--> `useWishlist()`  [EXTRACTED]
  __tests__/Wishlist.test.jsx → src/context/WishlistContext.jsx

## Import Cycles
- None detected.

## Communities (37 total, 20 thin omitted)

### Community 0 - "AppNavigator.jsx"
Cohesion: 0.08
Nodes (31): react-native-safe-area-context@^5.7.0, react-test-renderer@19.2.3, @react-native-async-storage/async-storage, react-native-safe-area-context, react-test-renderer, AppNavigator(), createStyles(), MainStack() (+23 more)

### Community 1 - "react-native"
Cohesion: 0.12
Nodes (27): react-native, FOUR_WHEELER_FILTER_DEFAULTS, createStyles(), NetworkVehicleImage(), createStyles(), getFallbackImage(), TopVehicleCard(), {width} (+19 more)

### Community 2 - "colors.js"
Cohesion: 0.11
Nodes (32): react-native-vector-icons, BannerSlider(), styles, {width}, CategoryCard(), createStyles(), CategoryTab(), createStyles() (+24 more)

### Community 3 - "AppDelegate"
Cohesion: 0.12
Nodes (6): AppDelegate, ReactNativeDelegate, React, React_RCTAppDelegate, ReactAppDependencyProvider, UIKit

### Community 4 - "useThemeStyles"
Cohesion: 0.20
Nodes (25): Chip(), createStyles(), Dropdown(), FourWheelerFilterDrawer(), PriceSlider(), AccountScreen(), Avatar(), Button() (+17 more)

### Community 5 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, react@19.2.3, react-native@0.84.1, @react-native-async-storage/async-storage@^2.2.0, react-native-gesture-handler@^2.31.0, @react-native/new-app-screen@0.84.1, react-native-reanimated@^4.3.0, react-native-screens@^4.24.0 (+11 more)

### Community 6 - "react"
Cohesion: 0.21
Nodes (12): react, Stack, createStyles(), LoginScreen(), createStyles(), onboardingData, OnboardingScreen(), { width, height } (+4 more)

### Community 7 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, @babel/core@^7.25.2, @babel/preset-env@^7.25.3, @babel/runtime@^7.25.0, eslint@^8.19.0, prettier@2.8.8, @react-native/eslint-config@0.84.1, typescript@^5.8.3 (+7 more)

### Community 8 - "package.json"
Cohesion: 0.17
Nodes (11): @react-native/babel-preset@0.84.1, @react-native-community/cli-platform-android@20.1.0, @react-native-community/cli-platform-ios@20.1.0, engines, node, name, private, version (+3 more)

### Community 9 - "App.jsx"
Cohesion: 0.27
Nodes (7): App(), displayName, name, ThemedApp(), @react-navigation/native@^7.2.2, @react-navigation/native, ThemeProvider()

### Community 10 - "Getting Started"
Cohesion: 0.18
Nodes (10): Android, Congratulations! :tada:, Getting Started, iOS, Learn More, Now what?, Step 1: Start Metro, Step 2: Build and run your app (+2 more)

### Community 11 - "AllOtherVehiclesScreen.jsx"
Cohesion: 0.40
Nodes (9): Chip(), createStyles(), Dropdown(), OTHER_FILTER_DEFAULTS, OtherVehicleFilterDrawer(), PriceSlider(), AllOtherVehiclesScreen(), createStyles() (+1 more)

### Community 12 - "AllTwoWheelersScreen.jsx"
Cohesion: 0.40
Nodes (9): Chip(), createStyles(), Dropdown(), PriceSlider(), TWO_WHEELER_FILTER_DEFAULTS, TwoWheelerFilterDrawer(), AllTwoWheelersScreen(), createStyles() (+1 more)

### Community 13 - "MessageScreen.tsx"
Cohesion: 0.29
Nodes (7): Conversation, createStyles(), Draft, isConversation(), MessageScreen(), findButton(), press()

### Community 17 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, @react-native/typescript-config

### Community 18 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, ios, lint, start, test

### Community 19 - "metro.config.js"
Cohesion: 0.40
Nodes (3): config, @react-native/metro-config@0.84.1, @react-native/metro-config

## Knowledge Gaps
- **5 isolated node(s):** `UIKit`, `React`, `React_RCTAppDelegate`, `ReactAppDependencyProvider`, `@react-native/typescript-config`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 89 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useThemeStyles()` connect `useThemeStyles` to `AppNavigator.jsx`, `react-native`, `colors.js`, `react`, `AllOtherVehiclesScreen.jsx`, `AllTwoWheelersScreen.jsx`, `MessageScreen.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **What connects `UIKit`, `React`, `React_RCTAppDelegate` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppNavigator.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08246225319396051 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `AppNavigator.jsx`, `colors.js`, `useThemeStyles`, `dependencies`, `react`, `package.json`, `App.jsx`, `AllOtherVehiclesScreen.jsx`, `AllTwoWheelersScreen.jsx`, `MessageScreen.tsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.11740890688259109 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `AppNavigator.jsx`, `react-native`, `colors.js`, `useThemeStyles`, `dependencies`, `package.json`, `App.jsx`, `AllOtherVehiclesScreen.jsx`, `AllTwoWheelersScreen.jsx`, `MessageScreen.tsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `colors.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10505050505050505 - nodes in this community are weakly interconnected._