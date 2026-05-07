import React from 'react';
import { cn } from '@/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        padding && 'p-6',
        onClick && 'cursor-pointer hover:border-blue-400 hover:shadow-md transition-all',
        className,
      )}
    >
      {children}
    </div>
  );
};
