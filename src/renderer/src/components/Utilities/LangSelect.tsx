import * as React from 'react';
import { useChangeLanguage } from './hooks/useChangeLanguage';

export default function LangSelect(): React.ReactNode {
  const { i18n, setLang } = useChangeLanguage();

  return (
    <ul className="flex gap-6 text-base font-normal text-foreground/50 w-1/4 justify-end">
      <li
        className={`cursor-pointer ${i18n.language === 'en' && 'text-primary'}`}
        onClick={() => setLang('en')}
      >
        En
      </li>
      <li
        className={`cursor-pointer ${i18n.language === 'ro' && 'text-primary'}`}
        onClick={() => setLang('ro')}
      >
        Ro
      </li>
      <li
        className={`cursor-pointer ${i18n.language === 'ru' && 'text-primary'}`}
        onClick={() => setLang('ru')}
      >
        Ру
      </li>
    </ul>
  );
}
