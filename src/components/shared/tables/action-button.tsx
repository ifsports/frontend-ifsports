import { MouseEventHandler, ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface ActionButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: ReactNode;
  icon?: LucideIcon;
  text?: string;
  hideTextOnMobile?: boolean;
}

export default function ActionButton({ onClick, className, children, icon: Icon, text, hideTextOnMobile = true }: ActionButtonProps) {
  return (
    <button onClick={onClick} className={className}>
      {text && (
        <span className={hideTextOnMobile ? "max-md:hidden" : ""}>
          {text}
        </span>
      )}
      {Icon && <Icon className="h-3.5 w-3.5 stroke-2" />}
      {children}
    </button>
  );
};