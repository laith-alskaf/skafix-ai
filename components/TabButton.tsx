
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  const baseClasses = "w-full text-center px-4 py-2.5 text-sm md:text-base font-semibold rounded-lg focus:outline-none transition-all duration-300 ease-in-out";
  const activeClasses = "bg-gradient-to-r from-brand-primary to-teal-400 text-white shadow-md";
  const inactiveClasses = "bg-base-300 text-text-secondary hover:bg-base-100 hover:text-text-primary";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};