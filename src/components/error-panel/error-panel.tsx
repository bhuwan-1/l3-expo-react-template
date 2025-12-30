import { ErrorBoundaryProps } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Text, View } from 'react-native';

// Simple error panel component
// Customize it as per your needs.
function ErrorPanel(props: ErrorBoundaryProps) {
  const { t } = useTranslation();
  return (
    <View>
      <Text>{t('LABEL_OOPS_TEXT')}</Text>
      <Text>{t('LABEL_FIXING_ISSUE')}</Text>
      <Button
        title={t('BTN_GO_BACK')}
        onPress={props.retry}
      />
    </View>
  );
}

export default ErrorPanel;
