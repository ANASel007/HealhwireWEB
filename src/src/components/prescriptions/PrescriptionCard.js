import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiCalendar, FiUser, FiFileText, FiExternalLink } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export const PrescriptionCard = ({ prescription }) => {
    const {
        id,
        client_id,
        client_name,
        doctor_id,
        doctor_name,
        prescribed_date,
        notes,
        status,
        pharmacy_id,
        sent_to_pharmacy,
    } = prescription;

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-secondary-100 text-secondary-800';
        }
    };

    return (
        <div className="bg-white dark:bg-secondary-800 overflow-hidden shadow rounded-lg">
            <div className="border-b border-secondary-200 dark:border-secondary-700 px-4 py-4 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                        Prescription #{id}
                    </h3>
                    <p className="max-w-2xl text-sm text-secondary-500 dark:text-secondary-400">
                        {notes || 'No notes provided'}
                    </p>
                </div>
                <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        status
                    )}`}
                >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
            </div>
            <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center mb-4">
                            <FiCalendar className="mr-2 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                            <span className="text-sm text-secondary-900 dark:text-white">
                {format(new Date(prescribed_date), 'MMMM d, yyyy')}
              </span>
                        </div>
                        <div className="flex items-center mb-4">
                            <FiFileText className="mr-2 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                            <span className="text-sm text-secondary-900 dark:text-white">
                {sent_to_pharmacy ? 'Sent to pharmacy' : 'Not sent to pharmacy'}
              </span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center mb-4">
                            <FiUser className="mr-2 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                            <span className="text-sm text-secondary-900 dark:text-white">
                {doctor_name ? `Dr. ${doctor_name}` : `Patient: ${client_name}`}
              </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-secondary-50 dark:bg-secondary-700 px-4 py-4 sm:px-6 flex justify-end space-x-3">
                <Link href={`/prescriptions/${id}`}>
                    <Button variant="primary">
                        <FiExternalLink className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
                </Link>
            </div>
        </div>
    );
};