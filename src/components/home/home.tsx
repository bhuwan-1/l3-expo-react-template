// Example component demonstrating TanStack Query and TailwindCSS (NativeWind)
import { ScrollView, Text, View } from 'react-native';

export default function Home() {
  return (
    <ScrollView className="flex-1 p-10 bg-white dark:bg-gray-900">
      <View className="flex-1 p-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Expo React Native Template
        </Text>

        <Text className="text-base text-gray-600 dark:text-gray-400 mb-6">
          A production-ready Expo React Native template with TypeScript,
          TailwindCSS (NativeWind), TanStack Query, and i18n.
        </Text>

        {/* Repository Documentation */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📁 Repository Structure
          </Text>

          <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Key Directories:
            </Text>
            <Text className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-mono">
              • app/ - Expo Router file-based routing{'\n'}• src/components/ -
              Reusable React components{'\n'}• src/screens/ - Page-level screen
              components{'\n'}• src/services/ - API services and business logic
              {'\n'}• src/hooks/ - Custom React hooks{'\n'}• src/models/ -
              TypeScript type definitions{'\n'}• src/utils/ - Utility functions
              {'\n'}• src/i18n/ - Internationalization files{'\n'}• src/styles/
              - Global styles and themes{'\n'}• src/constants/ - Application
              constants
            </Text>
          </View>

          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <Text className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Path Aliases:
            </Text>
            <Text className="text-xs text-blue-700 dark:text-blue-300 font-mono">
              @template/* → ./src/*
            </Text>
            <Text className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Example: import HomeScreen from
              '@template/screens/home/home-screen';
            </Text>
          </View>
        </View>

        {/* Initialization Guide */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Initialization Guide
          </Text>

          <View className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-3">
            <Text className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              Step 1: Clone & Install
            </Text>
            <Text className="text-xs text-green-700 dark:text-green-300 font-mono mb-1">
              git clone {'<repository-url>'}
            </Text>
            <Text className="text-xs text-green-700 dark:text-green-300 font-mono">
              yarn install
            </Text>
          </View>

          <View className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-3">
            <Text className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Step 2: Update Configuration
            </Text>
            <Text className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">
              • Update app.json (name, slug, bundleIdentifier, package)
            </Text>
            <Text className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">
              • Update package.json (name field)
            </Text>
            <Text className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">
              • Update tsconfig.json path alias (@template → your alias)
            </Text>
            <Text className="text-xs text-yellow-700 dark:text-yellow-300">
              • Replace app icons in src/assets/images/
            </Text>
          </View>

          <View className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-3">
            <Text className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
              Step 3: Update Path Aliases
            </Text>
            <Text className="text-xs text-purple-700 dark:text-purple-300 mb-1">
              After changing the alias in tsconfig.json, update all imports:
            </Text>
            <Text className="text-xs text-purple-600 dark:text-purple-400 font-mono">
              find . -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i ''
              's/@template/@myapp/g'
            </Text>
          </View>

          <View className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <Text className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
              Step 4: Start Development
            </Text>
            <Text className="text-xs text-indigo-700 dark:text-indigo-300 font-mono mb-1">
              yarn start
            </Text>
            <Text className="text-xs text-indigo-600 dark:text-indigo-400">
              Then press 'i' for iOS or 'a' for Android
            </Text>
          </View>
        </View>

        {/* Features */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ✨ Features
          </Text>

          <View>
            <View className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-2">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                • Expo Router - File-based routing with TypeScript
              </Text>
            </View>
            <View className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-2">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                • NativeWind (TailwindCSS) - Utility-first styling
              </Text>
            </View>
            <View className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-2">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                • TanStack Query - Server state management
              </Text>
            </View>
            <View className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-2">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                • i18next - Multi-language support (EN, DE, FR, IT)
              </Text>
            </View>
            <View className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-2">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                • TypeScript - Full type safety
              </Text>
            </View>
            <View className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                • Husky & Commitlint - Code quality & commit standards
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Commands */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ⚡ Quick Commands
          </Text>

          <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <Text className="text-xs text-gray-700 dark:text-gray-300 font-mono mb-2">
              yarn start # Start dev server
            </Text>
            <Text className="text-xs text-gray-700 dark:text-gray-300 font-mono mb-2">
              yarn start:ios # iOS simulator
            </Text>
            <Text className="text-xs text-gray-700 dark:text-gray-300 font-mono mb-2">
              yarn start:android # Android emulator
            </Text>
            <Text className="text-xs text-gray-700 dark:text-gray-300 font-mono mb-2">
              yarn lint # Run linter
            </Text>
            <Text className="text-xs text-gray-700 dark:text-gray-300 font-mono mb-2">
              yarn test # Run tests
            </Text>
            <Text className="text-xs text-gray-700 dark:text-gray-300 font-mono">
              yarn reset-project # Remove example content
            </Text>
          </View>
        </View>

        {/* Clear Examples Notice */}
        <View className="mb-6">
          <View className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <Text className="text-lg font-bold text-orange-800 dark:text-orange-200 mb-2">
              🧹 Ready to Start Building?
            </Text>
            <Text className="text-sm text-orange-700 dark:text-orange-300 mb-3">
              Remove the example content from the home and test pages to start
              fresh:
            </Text>
            <View className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
              <Text className="text-xs text-orange-800 dark:text-orange-200 font-mono">
                yarn clear-examples
              </Text>
            </View>
            <Text className="text-xs text-orange-600 dark:text-orange-400 mt-2">
              This will clear the example content while keeping the basic
              component structure.
            </Text>
          </View>
        </View>

        <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <Text className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            📖 For detailed documentation, see README.md
          </Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            This template provides a base for building production-ready React
            Native apps with Expo. Feel free to customize it to your needs.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
