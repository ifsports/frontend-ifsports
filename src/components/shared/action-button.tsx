import { ReactNode, MouseEventHandler } from "react";

export type ButtonVariant = "primary" | "danger" | "secondary";

export interface ActionButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

export default function ActionButton({ onClick, type = "button", variant = "primary", children, className }: ActionButtonProps) {
  const baseClasses = "py-5 border-0 rounded-md text-center font-medium font-semibold cursor-pointer";
  const variants = {
    primary: "bg-[#4CAF50] text-white",
    danger: "bg-red-500 text-white",
    secondary: "bg-gray-300 text-gray-700"
  };
  
  const buttonClass = className || `${baseClasses} ${variants[variant]}`;
  
  return (
    <button type={type} onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};