// components/ActionButton.tsx
import { ReactNode } from "react";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export const ActionButton = ({
  onClick,
  disabled = false,
  className = "",
  children,
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
