import React, { forwardRef } from 'react';

export const Input = forwardRef(({
                                     label,
                                     name,
                                     type = 'text',
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
            <input
                ref={ref}
                id={name}
                name={name}
                type={type}
                className={`input ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${name}-error` : undefined}
                {...props}
            />
            {error && (
                <p className="form-error" id={`${name}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';