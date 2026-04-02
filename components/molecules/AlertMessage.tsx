interface AlertMessageProps {
  message: string;
  type?: "error" | "success";
}

export default function AlertMessage({ message, type = "error" }: AlertMessageProps) {
  if (!message) return null;

  const styles = {
    error: "bg-error-container/20 border-error/30 text-error",
    success: "bg-primary-container/20 border-primary/30 text-primary",
  };

  return (
    <div className={`px-4 py-3 rounded-lg border text-sm font-body ${styles[type]}`}>
      {message}
    </div>
  );
}
