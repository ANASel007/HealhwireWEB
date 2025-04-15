import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { FiFileText, FiFilter } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { PrescriptionCard } from './PrescriptionCard';

export const PrescriptionList = ({ prescriptions, isLoading, error }) => {
    const router = useRouter();
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('desc');

    // Apply filters and sorting
    useEffect(() => {
        if (!prescriptions) return;

        let filtered = [...prescriptions];

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((prescr) => prescr.status === statusFilter);
        }

        // Apply sorting by date
        filtered.sort((a, b) => {
            const dateA = new Date(a.prescribed_date);
            const dateB = new Date(b.prescribed_date);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        setFilteredPrescriptions(filtered);
    }, [prescriptions, statusFilter, sortOrder]);

    const handleNewPrescription = () => {
        router.push('/prescriptions/new');
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
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </Select>
                    <Select
                        name="sortOrder"
                        className="w-full sm:w-40"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </Select>
                </div>
                <Button variant="primary" onClick={handleNewPrescription}>
                    <FiFileText className="mr-2" />
                    New Prescription
                </Button>
            </div>

            <div className="space-y-6">
                {filteredPrescriptions.length === 0 ? (
                    <Card>
                        <div className="py-8 text-center">
                            <FiFileText className="mx-auto h-12 w-12 text-secondary-400" />
                            <h3 className="mt-2 text-sm font-medium text-secondary-900 dark:text-white">
                                No prescriptions found
                            </h3>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                {prescriptions?.length > 0
                                    ? 'Try changing your filters to see more results.'
                                    : 'Get started by creating a new prescription.'}
                            </p>
                            <div className="mt-6">
                                <Button variant="primary" onClick={handleNewPrescription}>
                                    <FiFileText className="mr-2" />
                                    New Prescription
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    filteredPrescriptions.map((prescription) => (
                        <PrescriptionCard
                            key={prescription.id}
                            prescription={prescription}
                        />
                    ))
                )}
            </div>
        </div>
    );
};