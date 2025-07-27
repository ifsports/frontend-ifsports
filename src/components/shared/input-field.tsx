import type { ChangeEvent } from "react";

export interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputField({ id, label, type = "text", placeholder, value, onChange, className = "py-5 px-4 border-0 rounded-md bg-white", ...rest }: InputFieldProps){
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={id}>{label}</label>
      <input 
        type={type} 
        id={id} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className} 
        {...rest}
      />
    </div>
  )
};