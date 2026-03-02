import {
  CarFront,
  ChartColumnBig,
  ClipboardPlus,
  Settings,
  User,
  UserCog,
  Wrench
} from 'lucide-react';

export const admin: { icon: React.ReactNode; text: string; href: string }[] = [
  {
    icon: <User className="aspect-square size-6" />,
    text: `customers`,
    href: `/customers`
  },
  { icon: <Wrench className="aspect-square size-6" />, text: `auto_parts`, href: `/autoparts` },
  { icon: <Settings className="aspect-square size-6" />, text: `services`, href: `/services` },
  { icon: <UserCog className="aspect-square size-6" />, text: `workers`, href: `/workers` },
  { icon: <CarFront className="aspect-square size-6" />, text: `cars`, href: `/cars` },
  {
    icon: <ClipboardPlus className="aspect-square size-6" />,
    text: `invoices`,
    href: `/invoices`
  },
  { icon: <ChartColumnBig className="aspect-square size-6" />, text: 'stats', href: '/stats' }
];
