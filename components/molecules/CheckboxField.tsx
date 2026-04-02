import { Checkbox } from "@/components/atoms";

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <Checkbox checked={checked} onChange={onChange} />
      <span className="text-sm font-body text-on-surface-variant group-hover:text-on-surface transition-colors">
        {label}
      </span>
    </label>
  );
}
