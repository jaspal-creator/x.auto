import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'ro',
    lng: localStorage.getItem('locale') || 'ro',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
