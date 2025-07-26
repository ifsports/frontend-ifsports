import { ChangeEvent } from "react";

export interface TextAreaFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export default function TextAreaField({ id, label, placeholder, value, onChange, className = "py-5 px-4 pb-24 border-0 rounded-md bg-white resize-none" }: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
)
}