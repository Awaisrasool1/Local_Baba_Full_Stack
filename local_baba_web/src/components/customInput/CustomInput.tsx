import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { className = "", type, label, error, success, icon, helperText, ...props },
    ref
  ) => {
    const baseInputClasses = "form-control";
    const inputClasses = `${baseInputClasses} ${icon ? "ps-5" : ""} ${
      error ? "is-invalid" : success ? "is-valid" : ""
    } ${className}`;

    return (
      <div className="w-100 mb-3">
        {label && (
          <label
            className={`form-label ${error ? "text-danger" : "text-dark"}`}
          >
            {label}
          </label>
        )}
        <div className="position-relative">
          <input type={type} className={inputClasses} ref={ref} {...props} />
          {icon && (
            <div
              className="position-absolute top-50 translate-middle-y"
              style={{ left: "15px" }}
            >
              <span className="text-muted">{icon}</span>
            </div>
          )}
          {error && (
            <div
              className="position-absolute top-50 translate-middle-y"
              style={{ right: "15px" }}
            >
              <AlertCircle
                className="text-danger"
                style={{ width: "16px", height: "16px" }}
              />
            </div>
          )}
        </div>
        {(helperText || error || success) && (
          <div className={`form-text ${error ? "text-danger" : "text-muted"}`}>
            {error || success || helperText}
          </div>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
