import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { FiCalendar, FiFilter } from 'react-icons/fi';
import { AppointmentCard } from './AppointmentCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';

export const AppointmentList = ({ appointments, isLoading, error }) => {
    const router = useRouter();
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        if (!appointments) return;

        let filtered = [...appointments];

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((apt) => apt.status === statusFilter);
        }

        // Apply date filter
        const now = new Date();
        switch (dateFilter) {
            case 'today':
                filtered = filtered.filter((apt) => isToday(parseISO(apt.date)));
                break;
            case 'upcoming':
                filtered = filtered.filter((apt) => isAfter(parseISO(apt.date), now));
                break;
            case 'past':
                filtered = filtered.filter((apt) => isBefore(parseISO(apt.date), now));
                break;
            default:
                break;
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        setFilteredAppointments(filtered);
    }, [appointments, statusFilter, dateFilter, sortOrder]);

    const handleNewAppointment = () => {
        router.push('/appointments/new');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-4 text-center text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded-md p-4">
                {error}
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <Select
                        name="statusFilter"
                        className="w-full sm:w-40"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: 'all', label: 'All Statuses' },
                            { value: 'confirmed', label: 'Confirmed' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'cancelled', label: 'Cancelled' },
                            { value: 'completed', label: 'Completed' },
                        ]}
                    />
                    <Select
                        name="dateFilter"
                        className="w-full sm:w-40"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        options={[
                            { value: 'all', label: 'All Dates' },
                            { value: 'today', label: 'Today' },
                            { value: 'upcoming', label: 'Upcoming' },
                            { value: 'past', label: 'Past' },
                        ]}
                    />
                    <Select
                        name="sortOrder"
                        className="w-full sm:w-40"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        options={[
                            { value: 'asc', label: 'Oldest First' },
                            { value: 'desc', label: 'Newest First' },
                        ]}
                    />
                </div>
                <Button variant="primary" onClick={handleNewAppointment}>
                    <FiCalendar className="mr-2" />
                    New Appointment
                </Button>
            </div>

            <div className="space-y-6">
                {filteredAppointments.length === 0 ? (
                    <Card>
                        <div className="py-8 text-center">
                            <FiCalendar className="mx-auto h-12 w-12 text-secondary-400" />
                            <h3 className="mt-2 text-sm font-medium text-secondary-900 dark:text-white">
                                No appointments found
                            </h3>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                {appointments?.length > 0
                                    ? 'Try changing your filters to see more results.'
                                    : 'Get started by creating a new appointment.'}
                            </p>
                            <div className="mt-6">
                                <Button variant="primary" onClick={handleNewAppointment}>
                                    <FiCalendar className="mr-2" />
                                    New Appointment
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    filteredAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id_rdv}
                            appointment={appointment}
                        />
                    ))
                )}
            </div>
        </div>
    );
};