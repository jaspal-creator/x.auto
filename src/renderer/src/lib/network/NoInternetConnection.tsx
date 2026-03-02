import { useTranslation } from 'react-i18next';

export const NoInternetConnection = () => {
  const { t } = useTranslation('common');

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6 text-center
        bg-gradient-to-b from-primary to-white text-white"
    >
      <h1 className="text-4xl font-extrabold mb-6">{t('noInternet.title')}</h1>
      <p className="max-w-xl mb-4 leading-relaxed">{t('noInternet.message')}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-primary rounded-md hover:bg-primary-dark transition"
      >
        {t('noInternet.retry')}
      </button>
    </div>
  );
};
