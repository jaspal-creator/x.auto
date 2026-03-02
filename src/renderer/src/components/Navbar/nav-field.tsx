import * as React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router';

interface Props {
  icon: React.ReactNode;
  text: string;
  href?: string;
}

export default function NavigationField({ icon, text, href }: Props): React.ReactNode {
  const { pathname } = useLocation();
  return (
    <>
      {href ? (
        <Link
          to={href as string}
          className={`flex gap-3 p-2 rounded-md text-card items-center hover:bg-[#5795F5] hover:shadow-2xl ${pathname === href && 'bg-[#5795F5]'}`}
        >
          {icon}
          <h1 className="hidden text-base font-normal group-hover:block cursor-pointer select-none">
            {text}
          </h1>
        </Link>
      ) : (
        <div
          className={`flex gap-3 p-2 rounded-md text-card ${pathname === href && 'bg-[#5795F5]'} items-center hover:bg-[#5795F5] hover:shadow-2xl`}
        >
          {icon}
          <h1 className="hidden text-base font-normal group-hover:block cursor-pointer select-none">
            {text}
          </h1>
        </div>
      )}
    </>
  );
}
