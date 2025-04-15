import React from 'react';

export const Table = ({
                          columns,
                          data,
                          emptyMessage = 'No data available',
                          className = '',
                          ...props
                      }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 text-center text-secondary-500 dark:text-secondary-400">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`} {...props}>
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
                <thead className="bg-secondary-50 dark:bg-secondary-900">
                <tr>
                    {columns.map((column, index) => (
                        <th
                            key={index}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider"
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                        {columns.map((column, columnIndex) => (
                            <td
                                key={columnIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-white"
                            >
                                {column.render ? column.render(row) : row[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};