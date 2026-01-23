interface FormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
    className?: string;
}

export function Form({ onSubmit, children, className = "" }: FormProps) {
    return (
        <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
            {children}
        </form>
    );
}

export * from "./form-input";
export * from "./form-select";
export * from "./form-section";
export * from "./form-actions";
export * from "./default-actions";
