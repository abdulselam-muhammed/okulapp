import Icon from "./Icon";

interface InputProps {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: string;
  required?: boolean;
  maxLength?: number;
  rightElement?: React.ReactNode;
}

export default function Input({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  maxLength,
  rightElement,
}: InputProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
          <Icon name={icon} className="text-lg" />
        </div>
      )}
      <input
        className={`w-full ${icon ? "pl-11" : "pl-4"} ${rightElement ? "pr-12" : "pr-4"} py-4 bg-surface-container-low border-none rounded-md font-body text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all`}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
}
