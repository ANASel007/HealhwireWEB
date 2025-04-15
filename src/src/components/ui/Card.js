import React from 'react';

export const Card = ({
                         children,
                         title,
                         subtitle,
                         actions,
                         className = '',
                         ...props
                     }) => {
    return (
        <div
            className={`bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden ${className}`}
            {...props}
        >
            {(title || subtitle || actions) && (
                <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                    <div>
                        {title && <h3 className="text-lg font-medium text-secondary-900 dark:text-white">{title}</h3>}
                        {subtitle && <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">{subtitle}</p>}
                    </div>
                    {actions && <div className="flex space-x-2">{actions}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};