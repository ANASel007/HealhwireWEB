import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({
                          isOpen,
                          onClose,
                          title,
                          children,
                          size = 'md', // sm, md, lg, xl
                          closeOnOverlayClick = true,
                      }) => {
    const modalRef = useRef(null);

    // Handle escape key press
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    // Lock scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on overlay click
    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    if (!isOpen) return null;

    // Use portal to render modal outside the component tree
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity"
            onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className={`${sizeClasses[size]} w-full bg-white dark:bg-secondary-800 rounded-lg shadow-xl overflow-hidden transform transition-all`}
            >
                <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                    <h2 id="modal-title" className="text-lg font-medium text-secondary-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        type="button"
                        className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.body
    );
};