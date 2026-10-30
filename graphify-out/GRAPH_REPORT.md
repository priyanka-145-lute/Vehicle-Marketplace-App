# Graph Report - Vehicle-Marketplace-App  (2026-10-30)

## Corpus Check
- 95 files · ~37,572 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 42 file(s) not represented in the graph (top: .ttf 19, .xml 6, (none) 5)

## Summary
- 470 nodes · 1266 edges · 40 communities (17 shown, 23 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cfdb28f3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BannerSlider.jsx
- react
- react
- AppDelegate
- useThemeStyles
- dependencies
- OtpScreen.jsx
- devDependencies
- AppNavigator.jsx
- react
- Getting Started
- MessageScreen.tsx
- react-native-screens@^4.24.0
- @react-native-community/cli-platform-ios@20.1.0
- MainApplication.kt
- MainActivity.kt
- package.json
- tsconfig.json
- scripts
- metro.config.js
- @types/react-test-renderer@^19.1.0
- {useGetCountriesQuery, useGetStatesQuery, useGetCitiesQuery, useGetAreasQuery}
- @babel/core@^7.25.2
- @babel/runtime@^7.25.0
- Brand.test.jsx
- jest@^29.6.3
- ehicleData.jsx
- {useGetVehiclesQuery, useRegisterUserMutation, useSendOtpMutation, useVerifyOtpMutation, useRefreshTokenMutation}
- {useGetUserAddressByIdMutation, useUpdateAddressMutation, useDeleteAddressMutation}

## God Nodes (most connected - your core abstractions)
1. `useThemeStyles()` - 98 edges
2. `react` - 63 edges
3. `react-native` - 60 edges
4. `react-native-vector-icons` - 28 edges
5. `react-test-renderer` - 20 edges
6. `NetworkVehicleImage()` - 19 edges
7. `useTheme()` - 17 edges
8. `react-native-safe-area-context` - 16 edges
9. `WishlistHeart()` - 15 edges
10. `@react-native-async-storage/async-storage` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Redux setup` --references--> `LocationFields()`  [INFERRED]
  src/redux/README.md → src/components/LocationFields.jsx
- `ThemedApp()` --calls--> `useTheme()`  [EXTRACTED]
  App.jsx → src/context/ThemeContext.jsx
- `ThemedApp()` --calls--> `WishlistProvider()`  [EXTRACTED]
  App.jsx → src/context/WishlistContext.jsx
- `Form()` --calls--> `LocationFields()`  [EXTRACTED]
  __tests__/LocationFields.test.jsx → src/components/LocationFields.jsx
- `render()` --calls--> `OtpScreen()`  [EXTRACTED]
  __tests__/Otp.test.jsx → src/screens/authScreen/OtpScreen.jsx

## Import Cycles
- None detected.

## Communities (40 total, 23 thin omitted)

### Community 0 - "BannerSlider.jsx"
Cohesion: 0.22
Nodes (8): BannerImage(), BannerSlider(), isWebUrl(), styles, {width}, {useGetBannersQuery}, Redux setup, banner

### Community 1 - "react"
Cohesion: 0.10
Nodes (44): react, react-native, react-native-safe-area-context, react-native-vector-icons, CategoryTab(), createStyles(), createStyles(), NetworkVehicleImage() (+36 more)

### Community 2 - "react"
Cohesion: 0.07
Nodes (37): @react-native-async-storage/async-storage, CategoryCard(), createStyles(), createStyles(), Header(), MenuItem(), createStyles(), SearchBar() (+29 more)

### Community 3 - "AppDelegate"
Cohesion: 0.12
Nodes (6): AppDelegate, ReactNativeDelegate, React, React_RCTAppDelegate, ReactAppDependencyProvider, UIKit

### Community 4 - "useThemeStyles"
Cohesion: 0.14
Nodes (30): AccountScreen(), Avatar(), Button(), createStyles(), EditProfileScreen(), InformationScreen(), Page(), ProfileScreen() (+22 more)

### Community 5 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, react@19.2.3, react-native@0.84.1, @react-native-async-storage/async-storage@^2.2.0, react-native-gesture-handler@^2.31.0, react-native-keychain@^10.0.0, @react-native/new-app-screen@0.84.1, react-native-reanimated@^4.3.0 (+14 more)

### Community 6 - "OtpScreen.jsx"
Cohesion: 0.15
Nodes (8): createStyles(), LoginScreen(), createStyles(), OtpScreen(), button(), submit(), render(), session

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @babel/preset-env@^7.25.3, prettier@2.8.8, @react-native-community/cli@20.1.0, @react-native-community/cli-platform-android@20.1.0, @react-native/eslint-config@0.84.1, @react-native/typescript-config@0.84.1, react-test-renderer@19.2.3 (+10 more)

### Community 8 - "AppNavigator.jsx"
Cohesion: 0.09
Nodes (38): App(), displayName, name, ThemedApp(), react-native-keychain, @react-navigation/native-stack, react-redux, @reduxjs/toolkit (+30 more)

### Community 9 - "react"
Cohesion: 0.26
Nodes (6): createStyles(), LocationFields(), button(), complete, Form(), press()

### Community 10 - "Getting Started"
Cohesion: 0.18
Nodes (10): Android, Congratulations! :tada:, Getting Started, iOS, Learn More, Now what?, Step 1: Start Metro, Step 2: Build and run your app (+2 more)

### Community 11 - "MessageScreen.tsx"
Cohesion: 0.29
Nodes (7): Conversation, createStyles(), Draft, isConversation(), MessageScreen(), findButton(), press()

### Community 16 - "package.json"
Cohesion: 0.17
Nodes (11): eslint@^8.19.0, @react-native/babel-preset@0.84.1, @types/react@^19.2.0, engines, node, name, private, version (+3 more)

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
Nodes (43): react-test-renderer, BrandDropdown(), createStyles(), Chip(), createStyles(), Dropdown(), FOUR_WHEELER_FILTER_DEFAULTS, FourWheelerFilterDrawer() (+35 more)

## Knowledge Gaps
- **8 isolated node(s):** `UIKit`, `React`, `React_RCTAppDelegate`, `ReactAppDependencyProvider`, `@react-native/typescript-config` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 122 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BannerSlider.jsx`, `react`, `useThemeStyles`, `dependencies`, `OtpScreen.jsx`, `AppNavigator.jsx`, `react`, `MessageScreen.tsx`, `package.json`, `Brand.test.jsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **What connects `UIKit`, `React`, `React_RCTAppDelegate` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.09943502824858758 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react` to `BannerSlider.jsx`, `react`, `useThemeStyles`, `dependencies`, `OtpScreen.jsx`, `AppNavigator.jsx`, `react`, `MessageScreen.tsx`, `package.json`, `Brand.test.jsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07380520266182698 - nodes in this community are weakly interconnected._
- **Why does `useThemeStyles()` connect `useThemeStyles` to `react`, `react`, `OtpScreen.jsx`, `AppNavigator.jsx`, `react`, `MessageScreen.tsx`, `Brand.test.jsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Should `AppDelegate` be split into smaller, more focused modules?**
  _Cohesion score 0.12105263157894737 - nodes in this community are weakly interconnected._