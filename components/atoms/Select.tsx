import Icon from "./Icon";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: string;
  required?: boolean;
}

export default function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  icon,
  required = false,
}: SelectProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
          <Icon name={icon} className="text-lg" />
        </div>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full ${icon ? "pl-11" : "pl-5"} pr-10 py-4 bg-surface-container-low border-none rounded-md font-body text-on-surface focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer ${!value ? "text-on-surface-variant/40" : ""}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-on-surface-variant/50">
        <Icon name="expand_more" className="text-lg" />
      </div>
    </div>
  );
}
