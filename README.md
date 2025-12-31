# L3 Expo React Template

A production-ready Expo React Native template with TypeScript, TailwindCSS (NativeWind), TanStack Query, i18n, and a well-organized folder structure.

## 🚀 Features

- **Expo Router** - File-based routing with TypeScript support
- **React Native** - Latest version with new architecture enabled
- **TypeScript** - Full type safety throughout the project
- **NativeWind (TailwindCSS)** - Utility-first CSS framework for React Native
- **TanStack Query** - Powerful data synchronization for React
- **i18next** - Internationalization support (English, German, French, Italian)
- **FontAwesome Pro** - Professional icon library
- **Husky** - Git hooks for code quality
- **Commitlint** - Conventional commit message validation
- **ESLint** - Code linting and formatting
- **Jest** - Testing framework setup

## 📁 Project Structure

```
l3-expo-react-template/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx              # Root layout with providers
│   ├── index.tsx                 # Entry point (redirects to tabs)
│   └── (tabs)/                   # Tab navigation group
│       ├── _layout.tsx           # Tab layout configuration
│       ├── home/
│       │   └── index.tsx         # Home tab route
│       └── test/
│           └── index.tsx         # Test tab route
│
├── src/                          # Source code directory
│   ├── assets/                   # Static assets
│   │   ├── fonts/                # Custom fonts
│   │   └── images/               # Images, icons, splash screens
│   │
│   ├── components/               # Reusable React components
│   │   ├── error-panel/          # Error boundary component
│   │   ├── feature-1/            # Feature-specific components
│   │   ├── feature-2/            # Feature-specific components
│   │   ├── home/                 # Home screen components
│   │   ├── test/                 # Test screen components
│   │   └── ui-kit/               # Shared UI components (buttons, avatars, etc.)
│   │
│   ├── config/                   # Configuration files
│   │   └── query-client.ts       # TanStack Query client configuration
│   │
│   ├── constants/                # Application constants
│   │   ├── countries.constant.ts
│   │   ├── dial-codes.constant.ts
│   │   ├── languages.constant.ts
│   │   └── sex.constant.ts
│   │
│   ├── contexts/                 # React Context providers
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── features/             # Feature-specific hooks
│   │   ├── use-horizontal-scroll.ts
│   │   ├── use-keyboard-visible.ts
│   │   └── use-list-query-state.ts
│   │
│   ├── i18n/                     # Internationalization
│   │   ├── index.ts              # i18n configuration
│   │   ├── en.ts                 # English translations
│   │   ├── de.ts                 # German translations
│   │   ├── fr.ts                 # French translations
│   │   └── it.ts                 # Italian translations
│   │
│   ├── lib/                      # Third-party library configurations
│   │
│   ├── models/                   # TypeScript type definitions and models
│   │   ├── api.model.ts          # API-related types
│   │   ├── auth.model.ts         # Authentication types
│   │   ├── user.model.ts         # User-related types
│   │   └── constants/            # Model constants
│   │
│   ├── screens/                  # Screen components (page-level)
│   │   ├── auth/                 # Authentication screens
│   │   │   ├── forgot-password-screen/
│   │   │   └── sign-in-screen/
│   │   ├── home/
│   │   │   └── home-screen.tsx
│   │   └── test/
│   │       └── test-screen.tsx
│   │
│   ├── services/                 # Business logic and API services
│   │   ├── api/
│   │   │   └── api.ts            # API client configuration
│   │   ├── storage/
│   │   │   └── storage.service.ts # AsyncStorage wrapper
│   │   └── user/
│   │       └── user.api.ts       # User API endpoints
│   │
│   ├── styles/                   # Global styles and themes
│   │   ├── global.css            # Global CSS (NativeWind)
│   │   └── theme.ts              # Theme configuration (colors, etc.)
│   │
│   └── utils/                    # Utility functions
│       ├── char-utils.ts
│       ├── date-utils.ts
│       ├── file-picker-utils.ts
│       ├── form-validators.ts
│       └── phone-utils.ts
│
├── android/                      # Android native code
├── ios/                          # iOS native code
├── scripts/                      # Build and utility scripts
│   └── reset-project.js          # Script to reset project to blank state
│
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # TailwindCSS/NativeWind configuration
├── babel.config.js               # Babel configuration
├── metro.config.js               # Metro bundler configuration
├── eslint.config.ts              # ESLint configuration
└── commitlint.config.js          # Commitlint configuration
```

## 🏗️ Architecture Overview

### Routing (Expo Router)

- **File-based routing**: Routes are defined by the file structure in the `app/` directory
- **Groups**: Use parentheses `(tabs)` to create route groups without affecting the URL
- **Layouts**: `_layout.tsx` files define shared layouts for nested routes
- **TypeScript routes**: Typed routes enabled for better type safety

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@template/*` → `./src/*`

Example:

```typescript
import HomeScreen from '@template/screens/home/home-screen';
import { Colors } from '@template/styles/theme';
```

### Component Organization

- **`components/`**: Reusable UI components organized by feature or purpose
- **`screens/`**: Page-level components that represent full screens
- **`ui-kit/`**: Shared, generic UI components (buttons, inputs, etc.)

### State Management

- **TanStack Query**: For server state and API data fetching
- **React Context**: For global app state (add providers in `src/contexts/`)
- **Local State**: React hooks (`useState`, `useReducer`) for component-level state

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 16.10.1
- **Yarn**: 4.12.0 (or compatible version)
- **Expo CLI**: Latest version
- **iOS Development**: Xcode (for iOS simulator)
- **Android Development**: Android Studio (for Android emulator)

### Initial Setup (When Cloning for a New Project)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd l3-expo-react-template
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Update project configuration**

   Update the following files with your project details:

   - **`app.json`**: Change `name`, `slug`, `scheme`, `bundleIdentifier`, and `package`
   - **`package.json`**: Update `name` field
   - **`tsconfig.json`**: Update the path alias from `@template` to your project alias (e.g., `@myapp`)

   After changing the alias in `tsconfig.json`, update all imports in the codebase:

   ```bash
   # Find and replace @template with your new alias
   find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's/@template/@myapp/g' {} +
   ```

4. **Update EAS project ID** (if using EAS Build)

   In `app.json`, update the `extra.eas.projectId` with your EAS project ID:

   ```bash
   eas init
   ```

5. **Update app icons and splash screen**

   Replace images in `src/assets/images/`:

   - `icon.png` - App icon (1024x1024)
   - `splash-icon.png` - Splash screen icon
   - `android-icon-*.png` - Android adaptive icons
   - `favicon.png` - Web favicon

6. **Configure Git hooks** (if not already set up)

   ```bash
   yarn prepare
   ```

7. **Start the development server**
   ```bash
   yarn start
   ```

### Development Workflow

#### Running the App

```bash
# Start Expo dev server
yarn start

# Run on iOS simulator
yarn start:ios

# Run on Android emulator
yarn start:android

# Run on web
yarn web

# Build native apps
yarn ios        # iOS
yarn android    # Android
```

#### Code Quality

```bash
# Run linter
yarn lint

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

#### Clear Example Content (Recommended)

After cloning the template, you can quickly remove the example content from the home and test pages:

```bash
yarn reset-project
```

This script will:

- Clear the example content from `src/components/home/home.tsx`
- Clear the example content from `src/components/test/test.tsx`
- Keep the basic component structure intact
- Allow you to start building your own content immediately

#### Reset Project (Optional)

If you want to start fresh while keeping the template structure:

```bash
yarn reset-project
```

This script will:

- Move existing `app/`, `components/`, `hooks/`, `constants/`, and `scripts/` directories to `app-example/`
- Create a new blank `app/` directory with basic files
- Allow you to reference the example code later

## 📝 Key Configuration Files

### `app.json`

Expo configuration including:

- App metadata (name, version, orientation)
- Platform-specific settings (iOS, Android, Web)
- Plugins and experiments
- Splash screen configuration

### `tsconfig.json`

TypeScript configuration with:

- Strict mode enabled
- Path aliases (`@template/*`)
- Expo base configuration

### `tailwind.config.js`

NativeWind/TailwindCSS configuration:

- Content paths for class detection
- Theme extensions
- NativeWind preset

### `eas.json`

EAS Build configuration:

- Build profiles (development, staging, production)
- Platform-specific build settings
- Submit configuration

## 🎨 Styling

This template uses **NativeWind** (TailwindCSS for React Native):

```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
        Hello World
      </Text>
    </View>
  );
}
```

Theme colors are defined in `src/styles/theme.ts` and can be imported:

```typescript
import { Colors } from '@template/styles/theme';
```

## 🌐 Internationalization

i18n is configured with support for multiple languages:

- English (en) - Default
- German (de)
- French (fr)
- Italian (it)

Add translations in `src/i18n/[language].ts` and use in components:

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Text>{t('welcome')}</Text>;
```

## 🔧 Customization Guide

### Adding a New Screen

1. Create a screen component in `src/screens/[feature]/[screen-name].tsx`
2. Create a route file in `app/[route-path]/index.tsx`
3. Import and render your screen component

### Adding a New Tab

1. Add a new route directory in `app/(tabs)/[tab-name]/index.tsx`
2. Update `app/(tabs)/_layout.tsx` to include the new tab
3. Add appropriate icon and title

### Adding API Services

1. Create service files in `src/services/[feature]/[feature].api.ts`
2. Use TanStack Query hooks for data fetching
3. Define types in `src/models/[feature].model.ts`

### Adding Constants

Add constant files in `src/constants/` following the naming pattern:
`[name].constant.ts`

## 📦 Dependencies Overview

### Core

- `expo` - Expo SDK
- `expo-router` - File-based routing
- `react` & `react-native` - Core framework

### UI & Styling

- `nativewind` - TailwindCSS for React Native
- `@expo/vector-icons` - Icon library
- `@fortawesome/react-native-fontawesome` - FontAwesome Pro icons

### Data & State

- `@tanstack/react-query` - Server state management
- `@react-native-async-storage/async-storage` - Local storage

### Utilities

- `i18next` & `react-i18next` - Internationalization
- `dayjs` - Date manipulation
- `libphonenumber-js` - Phone number utilities

## 🤝 Contributing

This is a template repository. When using it for a new project:

1. Clone the repository
2. Follow the initialization steps above
3. Update all project-specific configurations
4. Remove or update this README with your project details

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Native Documentation](https://reactnative.dev/)
