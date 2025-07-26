import { ChangeEvent } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  className?: string;
}

export default function SelectField({ id, label, options, value, onChange, placeholder, className = "py-5 px-4 border-0 rounded-md bg-white text-gray-500 text-base" }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={className}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-black">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}