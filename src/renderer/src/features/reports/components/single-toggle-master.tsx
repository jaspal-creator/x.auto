import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import * as React from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { LoadingSpinner } from '@/components/Loading';
import { List } from 'react-virtualized';
import { extract } from '@/lib/extract';
import { User } from 'entities/User';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useGetAllWorkers } from '@/features/workers/hooks/useGetAllWorkers';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMaster: React.Dispatch<React.SetStateAction<User>>;
  currentMasterId: string;
}

export default function SingleToggleMaster({
  open,
  setOpen,
  currentMasterId,
  setMaster
}: Props): React.ReactNode {
  const { t } = useTranslation(['report']);
  const { debounce, pending } = useDebounce(1000);
  const [searchMaster, setSearchMaster] = React.useState<string>('');
  const { users, loading: usersLoading } = useGetAllWorkers({ query: { search: searchMaster } });
  return (
    <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
      <CommandInput
        placeholder={t('create.search_masters')}
        className="text-base text-foreground"
        onValueChange={(e) => debounce(() => setSearchMaster(e))}
      />
      <CommandList className="overflow-y-hidden backdrop-blur-none scale-100">
        {usersLoading || pending ? (
          <div className="flex justify-center items-center p-10">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {users?.length !== 0 ? (
              <List
                key={searchMaster}
                width={510}
                height={Number(users?.length) === 0 ? 0 : 300}
                rowCount={Number(users?.length) || 0}
                rowHeight={50}
                className="m-0 p-0"
                rowRenderer={({ key, index, style }) => (
                  <CommandItem
                    className="backdrop-blur-none scale-100"
                    style={style}
                    key={key}
                    value={(users?.at(index) as User).id}
                    onSelect={() => setMaster(users?.at(index) as User)}
                  >
                    <div className="flex w-full items-center px-3 backdrop-blur-none scale-100">
                      <h1 className="text-base font-normal text-black  subpixel-antialiased backdrop-blur-none scale-100 will-change-auto">
                        {users
                          ? `${extract(users[index], 'surname')} ${extract(users[index], 'name')}`
                          : undefined}
                      </h1>
                      <Check
                        className={cn(
                          'ml-auto',
                          currentMasterId === (users?.at(index) as User).id
                            ? 'opacity-100 bg-primary p-1 rounded-full text-white'
                            : 'opacity-0'
                        )}
                      />
                    </div>
                  </CommandItem>
                )}
              />
            ) : (
              <CommandEmpty>{t('item.not_found')}</CommandEmpty>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
