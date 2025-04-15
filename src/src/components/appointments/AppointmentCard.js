import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiUser, FiTag, FiMapPin } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

export const AppointmentCard = ({ appointment }) => {
    const {
        id_rdv,
        date,
        status,
        description_rdv,
        price,
        doctor_name,
        specialite,
        client_name,
        client_ville,
        currency_code = 'EUR',
    } = appointment;

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-secondary-100 text-secondary-800';
        }
    };

    return (
        <div className="bg-white dark:bg-secondary-800 overflow-hidden shadow rounded-lg">
            <div className="border-b border-secondary-200 dark:border-secondary-700 px-4 py-4 sm:px-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                        Appointment #{id_rdv}
                    </h3>
                    <p className="max-w-2xl text-sm text-secondary-500 dark:text-secondary-400">
                        {description_rdv || 'No description provided'}
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
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </span>
                        </div>
                        <div className="flex items-center mb-4">
                            <FiClock className="mr-2 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                            <span className="text-sm text-secondary-900 dark:text-white">
                {format(new Date(date), 'h:mm a')}
              </span>
                        </div>
                        <div className="flex items-center mb-4">
                            <FiTag className="mr-2 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                            <span className="text-sm text-secondary-900 dark:text-white">
                Price: {formatCurrency(price, currency_code)}
              </span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center mb-4">
                            <FiUser className="mr-2 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                            <span className="text-sm text-secondary-900 dark:text-white">
                {doctor_name ? `Dr. ${doctor_name}` : client_name}
                                {specialite && ` (${specialite})`}
              </span>
                        </div>
                        {client_ville && (
                            <div className="flex items-center mb-4">
                                <FiMapPin className="mr-2 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                <span className="text-sm text-secondary-900 dark:text-white">
                  {client_ville}
                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-secondary-50 dark:bg-secondary-700 px-4 py-4 sm:px-6 flex justify-end space-x-3">
                <Link href={`/appointments/${id_rdv}`}>
                    <Button variant="secondary">View Details</Button>
                </Link>
            </div>
        </div>
    );
};
