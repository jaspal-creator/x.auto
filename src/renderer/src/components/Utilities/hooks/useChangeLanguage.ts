import { useTranslation } from 'react-i18next';

export const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  return {
    setLang: (lng: 'ro' | 'ru' | 'en') =>
      i18n.changeLanguage(lng, () => localStorage.setItem('locale', lng)),
    i18n
  };
};
