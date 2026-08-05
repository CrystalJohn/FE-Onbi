import React from 'react';
import { cn } from '@/lib/utils';

export const Main = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <main
      id="main-content"
      className={cn(
        'flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pb-8 lg:px-8 xl:px-10 overflow-y-auto',
        className
      )}
      {...props}
    />
  );
};

Main.displayName = 'Main';
