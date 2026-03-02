import * as React from 'react';
import lightLogo from '@/assets/logo/light_logo.png';
import logo from '@/assets/logo/logo.png';
import NavigationField from './nav-field';
import { admin } from './items/admin.items';
import { LogOut, MonitorCog, User } from 'lucide-react';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { user } from './items/user.items';
import { useClientStatus } from '@/hooks/useClientStatus';
import { Dialog, DialogTrigger } from '../ui/dialog';
import Settings from '@/features/settings/components/settings';
import { useTranslation } from 'react-i18next';

export default function Navbar(): React.ReactNode {
  const { t } = useTranslation(['navbar']);
  const { data } = useClientStatus();
  const [items] = React.useState(data.role ? admin : user);
  const { exit } = useLogout();
   const [version, setVersion] = React.useState<string>('');

  React.useEffect(() => {
    let mounted = true;

    const loadVersion = async () => {
      try {
        const v =
          (typeof window !== 'undefined' &&
            window.appInfo &&
            (await window.appInfo.getVersion())) ||
          '';
        if (mounted) {
          setVersion(v);
        }
      } catch (error) {
        console.error('Failed to load app version', error);
      }
    };

    loadVersion();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside className="bg-primary h-dvh fixed left-0 top-0 bottom-0 z-50 p-4 w-20 transition-all duration-300 ease-in hover:w-80 shadow-2xl group flex flex-col gap-5">
      <div className="w-full flex justify-center items-center">
        <img src={logo} className="h-12 w-12 object-contain group-hover:hidden" />
        <img src={lightLogo} className="hidden w-full h-16 object-contain group-hover:block" />
      </div>

      <div>
        <ul className="flex flex-col gap-5">
          {items.map((item, _: number) => (
            <li key={_}>
              <NavigationField icon={item.icon} href={item.href} text={t(item.text)} />
            </li>
          ))}
        </ul>
      </div>

      <div className="h-full flex flex-col justify-between w-full">
        <ul className="flex flex-col gap-5 w-full">
          <li>
            <NavigationField
              text={`${data?.name} ${data?.surname}`}
              icon={<User className="aspect-square size-6 text-card" />}
            />
          </li>
          {Boolean(data.role) && (
            <li>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full">
                    <NavigationField
                      text={t('settings')}
                      icon={<MonitorCog className="aspect-square size-6 text-card" />}
                    />
                  </button>
                </DialogTrigger>
                <Settings />
              </Dialog>
            </li>
          )}

          <li onClick={() => exit()}>
            <NavigationField
              text={t('logout')}
              icon={<LogOut className="aspect-square size-6 text-card" />}
            />
          </li>
        </ul>

        {version && (
          <p className="mt-4 text-[10px] text-card/80 text-left px-1 group-hover:px-0 truncate">
            [v{version}]
          </p>
        )}
      </div>
    </aside>
  );
}
