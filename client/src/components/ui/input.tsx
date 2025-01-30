import * as React from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomInputProps extends React.ComponentProps<"input"> {
  eye?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, eye, ...props }, ref) => {
    const [inputType, setInputType] =
      React.useState<React.HTMLInputTypeAttribute>("text");

    React.useEffect(() => {
      if (type) setInputType(type);
    }, [type]);

    return (
      <div className="relative w-full">
        <input
          type={inputType}
          className={cn(
            `
            flex w-full rounded-full border border-input bg-input px-6 py-2.5
            transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium 
            file:text-foreground placeholder:text- focus-visible:outline-none 
            disabled:cursor-not-allowed disabled:opacity-50
          `,
            className
          )}
          ref={ref}
          {...props}
        />
        {eye && (
          <button
            type="button"
            onClick={() => {
              if (inputType === "password") setInputType("text");
              else setInputType("password");
            }}
            className="
              absolute top-0 right-1 inset-y-1 p-3
              rounded-r-xl
            "
          >
            {inputType === "password" ? (
              <EyeOff strokeWidth={1.5} size={20} />
            ) : (
              <EyeIcon strokeWidth={1.5} size={20} />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
