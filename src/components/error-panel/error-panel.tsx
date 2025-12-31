import { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

// Simple error panel component
// Customize it as per your needs.
function ErrorPanel(props: ErrorBoundaryProps) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center p-6">
      <View className="items-center max-w-md w-full">
        {/* Error Icon/Emoji */}
        <View className="mb-6">
          <Text className="text-6xl">⚠️</Text>
        </View>

        {/* Error Title */}
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
          {t('LABEL_OOPS_TEXT')}
        </Text>

        {/* Error Message */}
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-8 text-center">
          {t('LABEL_FIXING_ISSUE')}
        </Text>

        {/* Retry Button */}
        <Pressable
          onPress={props.retry}
          className="bg-blue-500 dark:bg-blue-600 px-8 py-4 rounded-lg active:bg-blue-600 dark:active:bg-blue-700 shadow-lg"
        >
          <Text className="text-white text-center font-semibold text-base">
            {t('BTN_GO_BACK')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default ErrorPanel;
