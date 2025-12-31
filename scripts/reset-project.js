#!/usr/bin/env node

/**
 * This script clears the example content from the home and test pages.
 * It keeps the basic component structure but removes all example/demo content.
 * Run with: yarn clear-examples
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Files to clear with their minimal content
const filesToClear = {
  // Home component - clear to minimal structure
  'src/components/home/home.tsx': `import { ScrollView, Text, View } from 'react-native';

export default function Home() {
  return (
    <ScrollView className="flex-1 p-10 bg-white dark:bg-gray-900">
      <View className="flex-1 p-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          Home
        </Text>
      </View>
    </ScrollView>
  );
}
`,

  // Test component - clear to minimal structure
  'src/components/test/test.tsx': `import { ScrollView, Text, View } from 'react-native';

export default function Test() {
  return (
    <ScrollView className="flex-1 pt-10 bg-white dark:bg-gray-900">
      <View className="p-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          Test
        </Text>
      </View>
    </ScrollView>
  );
}
`,
};

function clearExampleContent() {
  try {
    console.log('🧹 Clearing example content from home and test pages...\n');

    let clearedCount = 0;
    let skippedCount = 0;

    for (const [filePath, content] of Object.entries(filesToClear)) {
      const fullPath = path.join(root, filePath);

      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        skippedCount++;
        continue;
      }

      // Write the minimal content
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Cleared: ${filePath}`);
      clearedCount++;
    }

    console.log(`\n✨ Done! Cleared ${clearedCount} file(s).`);
    if (skippedCount > 0) {
      console.log(`⚠️  Skipped ${skippedCount} file(s) (not found).`);
    }
    console.log('\n📝 Next steps:');
    console.log('   • Customize the home and test components as needed');
    console.log('   • Remove or modify the test tab if not needed');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
clearExampleContent();
