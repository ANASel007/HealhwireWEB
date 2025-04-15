import React, { forwardRef } from 'react';

export const Select = forwardRef(({
                                      label,
                                      name,
                                      options,
                                      error,
                                      className = '',
                                      required = false,
                                      ...props
                                  }, ref) => {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="label">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                ref={ref}
                id={name}
                name={name}
                className={`input ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${name}-error` : undefined}
                {...props}
            >
                <option value="">Select an option</option>
                {options && options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="form-error" id={`${name}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

Select.displayName = 'Select';