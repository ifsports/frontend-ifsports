import { ReactNode, MouseEventHandler } from "react";

export type ButtonVariant = "primary" | "danger" | "secondary";

export interface ActionButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function ActionButton({ onClick, type = "button", variant = "primary", children, className, disabled = false }: ActionButtonProps) {
  const baseClasses = "py-5 border-0 w-full rounded-md text-center font-medium font-semibold cursor-pointer";
  const variants = {
    primary: "bg-[#4CAF50] text-white",
    danger: "bg-red-600 text-white",
    secondary: "bg-gray-300 text-gray-700"
  };
  
  const buttonClass = className || `${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  
  return (
    <button type={type} onClick={onClick} className={buttonClass} disabled={disabled}>
      {children}
    </button>
  );
};