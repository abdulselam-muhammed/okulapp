import Icon from "./Icon";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  type = "button",
  disabled = false,
  loading = false,
  icon,
  variant = "primary",
  fullWidth = false,
  onClick,
}: ButtonProps) {
  const base =
    "py-4 rounded-full font-headline font-bold text-lg transition-all relative overflow-hidden group disabled:opacity-60 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-dim hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/10",
    secondary:
      "bg-secondary text-on-secondary hover:bg-secondary-dim hover:scale-[1.02] active:scale-95",
    outline:
      "bg-transparent border-2 border-outline text-on-surface hover:bg-surface-container-low active:scale-95",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : "px-8"}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? "Loading..." : children}
        {!loading && icon && <Icon name={icon} className="text-xl" />}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
