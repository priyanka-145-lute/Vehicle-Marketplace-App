# Graph Report - Vehicle-Marketplace-App  (2026-11-17)

## Corpus Check
- 97 files · ~41,662 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 42 file(s) not represented in the graph (top: .ttf 19, .xml 6, (none) 5)

## Summary
- 488 nodes · 1315 edges · 39 communities (16 shown, 23 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fed7ef7a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LocationFields.test.jsx
- react
- react
- AppDelegate
- AccountScreens.jsx
- dependencies
- OtpScreen.jsx
- devDependencies
- AppNavigator.jsx
- react-native-worklets@^0.8.1
- Getting Started
- MessageScreen.tsx
- @babel/core@^7.25.2
- @react-native/eslint-config@0.84.1
- MainApplication.kt
- MainActivity.kt
- package.json
- tsconfig.json
- scripts
- metro.config.js
- {useGetCountriesQuery, useGetStatesQuery, useGetCitiesQuery, useGetAreasQuery}
- @babel/preset-env@^7.25.3
- @types/react@^19.2.0
- Brand.test.jsx
- @types/react-test-renderer@^19.1.0
- ehicleData.jsx
- {useGetVehiclesQuery, useRegisterUserMutation, useSendOtpMutation, useVerifyOtpMutation, useRefreshTokenMutation}
- {useGetUserAddressByIdMutation, useUpdateAddressMutation, useDeleteAddressMutation}

## God Nodes (most connected - your core abstractions)
1. `useThemeStyles()` - 101 edges
2. `react` - 64 edges
3. `react-native` - 61 edges
4. `react-native-vector-icons` - 29 edges
5. `NetworkVehicleImage()` - 21 edges
6. `react-test-renderer` - 20 edges
7. `useTheme()` - 17 edges
8. `react-native-safe-area-context` - 16 edges
9. `@react-native-async-storage/async-storage` - 15 edges
10. `WishlistHeart()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `ThemedApp()` --calls--> `useTheme()`  [EXTRACTED]
  App.jsx → src/context/ThemeContext.jsx
- `ThemedApp()` --calls--> `WishlistProvider()`  [EXTRACTED]
  App.jsx → src/context/WishlistContext.jsx
- `Form()` --calls--> `LocationFields()`  [EXTRACTED]
  __tests__/LocationFields.test.jsx → src/components/LocationFields.jsx
- `render()` --calls--> `OtpScreen()`  [EXTRACTED]
  __tests__/Otp.test.jsx → src/screens/authScreen/OtpScreen.jsx
- `renderApp()` --calls--> `AppNavigator()`  [EXTRACTED]
  __tests__/Session.test.jsx → src/navigation/AppNavigator.jsx

## Import Cycles
- None detected.

## Communities (39 total, 23 thin omitted)

### Community 0 - "LocationFields.test.jsx"
Cohesion: 0.12
Nodes (14): BannerImage(), BannerSlider(), isWebUrl(), styles, {width}, createStyles(), LocationFields(), {useGetBannersQuery} (+6 more)

### Community 1 - "react"
Cohesion: 0.10
Nodes (44): react, react-native, react-native-safe-area-context, react-native-vector-icons, CategoryTab(), createStyles(), createStyles(), NetworkVehicleImage() (+36 more)

### Community 2 - "react"
Cohesion: 0.10
Nodes (28): CategoryCard(), createStyles(), createStyles(), Header(), MenuItem(), createStyles(), SearchBar(), ThemeContext (+20 more)

### Community 3 - "AppDelegate"
Cohesion: 0.12
Nodes (6): AppDelegate, ReactNativeDelegate, React, React_RCTAppDelegate, ReactAppDependencyProvider, UIKit

### Community 4 - "AccountScreens.jsx"
Cohesion: 0.09
Nodes (45): @react-native-async-storage/async-storage, {useGetProfileQuery}, {useGetUserAddressesQuery}, AccountNavigator(), AccountScreen(), Avatar(), Button(), createStyles() (+37 more)

### Community 5 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, react@19.2.3, react-native@0.84.1, @react-native-async-storage/async-storage@^2.2.0, react-native-gesture-handler@^2.31.0, react-native-keychain@^10.0.0, @react-native/new-app-screen@0.84.1, react-native-reanimated@^4.3.0 (+14 more)

### Community 6 - "OtpScreen.jsx"
Cohesion: 0.11
Nodes (16): AuthStack(), Stack, createStyles(), LoginScreen(), createStyles(), onboardingData, OnboardingScreen(), { width, height } (+8 more)

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @babel/runtime@^7.25.0, eslint@^8.19.0, jest@^29.6.3, prettier@2.8.8, @react-native-community/cli-platform-ios@20.1.0, @react-native/typescript-config@0.84.1, react-test-renderer@19.2.3 (+10 more)

### Community 8 - "AppNavigator.jsx"
Cohesion: 0.10
Nodes (37): App(), displayName, name, ThemedApp(), @reduxjs/toolkit@^2.13.0, react-native-keychain, react-redux, @reduxjs/toolkit (+29 more)

### Community 10 - "Getting Started"
Cohesion: 0.18
Nodes (10): Android, Congratulations! :tada:, Getting Started, iOS, Learn More, Now what?, Step 1: Start Metro, Step 2: Build and run your app (+2 more)

### Community 11 - "MessageScreen.tsx"
Cohesion: 0.29
Nodes (7): Conversation, createStyles(), Draft, isConversation(), MessageScreen(), findButton(), press()

### Community 16 - "package.json"
Cohesion: 0.17
Nodes (11): @react-native/babel-preset@0.84.1, @react-native-community/cli@20.1.0, @react-native-community/cli-platform-android@20.1.0, engines, node, name, private, version (+3 more)

### Community 17 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, types, exclude, extends, include, @react-native/typescript-config

### Community 18 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, android, ios, lint, start, test

### Community 19 - "metro.config.js"
Cohesion: 0.40
Nodes (3): config, @react-native/metro-config@0.84.1, @react-native/metro-config

### Community 25 - "Brand.test.jsx"
Cohesion: 0.08
Nodes (46): @react-native-documents/picker@^12.1.0, @react-native-documents/picker, react-test-renderer, BrandDropdown(), createStyles(), Chip(), createStyles(), Dropdown() (+38 more)

## Knowledge Gaps
- **8 isolated node(s):** `UIKit`, `React`, `React_RCTAppDelegate`, `ReactAppDependencyProvider`, `@react-native/typescript-config` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 127 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `LocationFields.test.jsx`, `react`, `AccountScreens.jsx`, `dependencies`, `OtpScreen.jsx`, `AppNavigator.jsx`, `MessageScreen.tsx`, `package.json`, `Brand.test.jsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **What connects `UIKit`, `React`, `React_RCTAppDelegate` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LocationFields.test.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._
- **Why does `useThemeStyles()` connect `AccountScreens.jsx` to `LocationFields.test.jsx`, `react`, `react`, `OtpScreen.jsx`, `AppNavigator.jsx`, `MessageScreen.tsx`, `Brand.test.jsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.09943502824858758 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react` to `LocationFields.test.jsx`, `react`, `AccountScreens.jsx`, `dependencies`, `OtpScreen.jsx`, `AppNavigator.jsx`, `MessageScreen.tsx`, `package.json`, `Brand.test.jsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.09966777408637874 - nodes in this community are weakly interconnected._