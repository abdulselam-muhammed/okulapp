import Icon from "./Icon";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <div className="relative cursor-pointer" onClick={() => onChange(!checked)}>
      <div
        className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
          checked
            ? "bg-primary border-primary"
            : "border-outline-variant"
        }`}
      >
        {checked && (
          <Icon name="check" className="text-white text-xs" filled />
        )}
      </div>
    </div>
  );
}
