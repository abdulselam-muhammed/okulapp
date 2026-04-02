"use client";

import { useState } from "react";
import { Label, Input, Icon } from "@/components/atoms";

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function PasswordField({
  id,
  label,
  placeholder = "••••••••",
  value,
  onChange,
  required = false,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon="lock"
        required={required}
        rightElement={
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-on-surface-variant/50 hover:text-primary transition-colors"
          >
            <Icon name={show ? "visibility_off" : "visibility"} className="text-lg" />
          </button>
        }
      />
    </div>
  );
}
