import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Text } from 'react-native';
import de from './de';
import en from './en';
import fr from './fr';
import it from './it';

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
  it: {
    translation: it,
  },
  fr: {
    translation: fr,
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'en',
  fallbackLng: 'en',
  react: {
    useSuspense: false,
    defaultTransParent: Text,
    transKeepBasicHtmlNodesFor: [Text],
  },
  interpolation: {
    escapeValue: false,
  },
} as any);

export default i18n;
