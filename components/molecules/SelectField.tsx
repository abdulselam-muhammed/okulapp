import { Label, Select } from "@/components/atoms";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: string;
  required?: boolean;
}

export default function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  icon,
  required = false,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        icon={icon}
        required={required}
      />
    </div>
  );
}
