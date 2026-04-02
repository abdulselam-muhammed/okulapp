interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

export default function Label({ htmlFor, children }: LabelProps) {
  return (
    <label
      className="block font-label text-sm font-semibold text-on-surface-variant px-1"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
