# Graph Report - Vehicle-Marketplace-App  (2026-10-28)

## Corpus Check
- 91 files · ~36,615 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 42 file(s) not represented in the graph (top: .ttf 19, .xml 6, (none) 5)

## Summary
- 466 nodes · 1225 edges · 42 communities (19 shown, 23 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `82abc11b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- BannerSlider.jsx
- react-native
- react
- AppDelegate
- useThemeStyles
- dependencies
- react
- devDependencies
- AppNavigator.jsx
- react-native
- Getting Started
- MessageScreen.tsx
- react-native-vector-icons
- MySalesScreen.jsx
- MainApplication.kt
- MainActivity.kt
- package.json
- tsconfig.json
- scripts
- metro.config.js
- @react-native/babel-preset@0.84.1
- {useGetCountriesQuery, useGetStatesQuery, useGetCitiesQuery, useGetAreasQuery}
- @babel/preset-env@^7.25.3
- @babel/core@^7.25.2
- Brand.test.jsx
- @react-native-community/cli-platform-ios@20.1.0
- ehicleData.jsx
- @react-native/eslint-config@0.84.1
- {useGetVehiclesQuery, useRegisterUserMutation, useSendOtpMutation, useVerifyOtpMutation, useRefreshTokenMutation}
- @react-native/typescript-config@0.84.1
- {useGetUserAddressByIdMutation, useUpdateAddressMutation, useDeleteAddressMutation}

## God Nodes (most connected - your core abstractions)
1. `useThemeStyles()` - 98 edges
2. `react` - 59 edges
3. `react-native` - 56 edges
4. `react-native-vector-icons` - 28 edges
5. `NetworkVehicleImage()` - 19 edges
6. `useTheme()` - 17 edges
7. `react-test-renderer` - 16 edges
8. `react-native-safe-area-context` - 15 edges
9. `@react-native-async-storage/async-storage` - 14 edges
10. `WishlistHeart()` - 13 edges

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

## Communities (42 total, 23 thin omitted)

### Community 0 - "BannerSlider.jsx"
Cohesion: 0.22
Nodes (8): BannerImage(), BannerSlider(), isWebUrl(), styles, {width}, {useGetBannersQuery}, Redux setup, banner

### Community 1 - "react-native"
Cohesion: 0.15
Nodes (24): react, createStyles(), NetworkVehicleImage(), createStyles(), getFallbackImage(), TopVehicleCard(), {width}, TWO_WHEELER_FILTER_DEFAULTS (+16 more)

### Community 2 - "react"
Cohesion: 0.11
Nodes (30): @react-navigation/native@^7.2.2, @react-navigation/native, CategoryCard(), createStyles(), CategoryTab(), createStyles(), createStyles(), Header() (+22 more)

### Community 3 - "AppDelegate"
Cohesion: 0.12
Nodes (6): AppDelegate, ReactNativeDelegate, React, React_RCTAppDelegate, ReactAppDependencyProvider, UIKit

### Community 4 - "useThemeStyles"
Cohesion: 0.14
Nodes (30): @react-native-async-storage/async-storage, {useGetProfileQuery}, {useGetUserAddressesQuery}, AccountLogoutContext, AccountNavigator(), AccountScreen(), Avatar(), Button() (+22 more)

### Community 5 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, react@19.2.3, react-native@0.84.1, @react-native-async-storage/async-storage@^2.2.0, react-native-gesture-handler@^2.31.0, react-native-keychain@^10.0.0, @react-native/new-app-screen@0.84.1, react-native-reanimated@^4.3.0 (+13 more)

### Community 6 - "react"
Cohesion: 0.11
Nodes (16): AuthStack(), Stack, createStyles(), LoginScreen(), createStyles(), onboardingData, OnboardingScreen(), { width, height } (+8 more)

### Community 7 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, @babel/runtime@^7.25.0, eslint@^8.19.0, prettier@2.8.8, @react-native-community/cli@20.1.0, @react-native-community/cli-platform-android@20.1.0, react-test-renderer@19.2.3, @types/jest@^29.5.13 (+8 more)

### Community 8 - "AppNavigator.jsx"
Cohesion: 0.10
Nodes (37): App(), displayName, name, ThemedApp(), @reduxjs/toolkit@^2.13.0, react-native-keychain, react-redux, react-test-renderer (+29 more)

### Community 9 - "react-native"
Cohesion: 0.24
Nodes (15): react-native, Chip(), createStyles(), Dropdown(), OTHER_FILTER_DEFAULTS, OtherVehicleFilterDrawer(), PriceSlider(), createStyles() (+7 more)

### Community 10 - "Getting Started"
Cohesion: 0.18
Nodes (10): Android, Congratulations! :tada:, Getting Started, iOS, Learn More, Now what?, Step 1: Start Metro, Step 2: Build and run your app (+2 more)

### Community 11 - "MessageScreen.tsx"
Cohesion: 0.29
Nodes (7): Conversation, createStyles(), Draft, isConversation(), MessageScreen(), findButton(), press()

### Community 12 - "react-native-vector-icons"
Cohesion: 0.12
Nodes (18): react-native-safe-area-context@^5.7.0, react-native-safe-area-context, react-native-vector-icons, createStyles(), NOTIFICATIONS, NotificationsScreen(), createStyles(), PARTS (+10 more)

### Community 13 - "MySalesScreen.jsx"
Cohesion: 0.26
Nodes (6): createStyles(), LocationFields(), button(), complete, Form(), press()

### Community 16 - "package.json"
Cohesion: 0.17
Nodes (11): jest@^29.6.3, @types/react@^19.2.0, typescript@^5.8.3, engines, node, name, private, version (+3 more)

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
Cohesion: 0.10
Nodes (33): BrandDropdown(), createStyles(), Chip(), createStyles(), Dropdown(), FOUR_WHEELER_FILTER_DEFAULTS, FourWheelerFilterDrawer(), PriceSlider() (+25 more)

## Knowledge Gaps
- **8 isolated node(s):** `UIKit`, `React`, `React_RCTAppDelegate`, `ReactAppDependencyProvider`, `@react-native/typescript-config` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 122 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react-native` to `BannerSlider.jsx`, `react`, `useThemeStyles`, `dependencies`, `react`, `AppNavigator.jsx`, `react-native`, `MessageScreen.tsx`, `react-native-vector-icons`, `MySalesScreen.jsx`, `package.json`, `Brand.test.jsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `UIKit`, `React`, `React_RCTAppDelegate` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.14919354838709678 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `BannerSlider.jsx`, `react-native`, `react`, `useThemeStyles`, `dependencies`, `react`, `AppNavigator.jsx`, `MessageScreen.tsx`, `react-native-vector-icons`, `MySalesScreen.jsx`, `package.json`, `Brand.test.jsx`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.10801393728222997 - nodes in this community are weakly interconnected._
- **Why does `useThemeStyles()` connect `useThemeStyles` to `react-native`, `react`, `react`, `AppNavigator.jsx`, `react-native`, `MessageScreen.tsx`, `react-native-vector-icons`, `MySalesScreen.jsx`, `Brand.test.jsx`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Should `AppDelegate` be split into smaller, more focused modules?**
  _Cohesion score 0.12105263157894737 - nodes in this community are weakly interconnected._