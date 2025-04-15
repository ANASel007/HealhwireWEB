import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { useFetch } from '@/hooks/useFetch';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm';

export default function EditPrescription() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    // Fetch prescription details
    const {
        data: prescription,
        loading,
        error
    } = useFetch(id ? `/prescriptions/${id}` : null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'doctor') {
            // Only doctors can edit prescriptions
            router.push('/prescriptions');
        }
    }, [user, router]);

    // Handle form submission
    const handleUpdatePrescription = async (data) => {
        try {
            await axios.put(`/prescriptions/${id}`, data);
            router.push(`/prescriptions/${id}`);
            return true;
        } catch (error) {
            console.error('Error updating prescription:', error);
            throw error;
        }
    };

    // Check if the user has permission to edit this prescription
    const hasPermission = () => {
        if (!user || !prescription || user.role !== 'doctor') {
            return false;
        }

        return parseInt(prescription.doctor_id) === parseInt(user.id);
    };

    if (!user || user.role !== 'doctor') return null;

    if (loading) {
        return (
            <Layout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !prescription) {
        return (
            <Layout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Alert
                            type="error"
                            message="Failed to load prescription details. The prescription may not exist or you may not have permission to edit it."
                            className="mt-6"
                        />
                        <div className="mt-6 flex justify-center">
                            <Button variant="primary" onClick={() => router.push('/prescriptions')}>
                                Back to Prescriptions
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!hasPermission()) {
        return (
            <Layout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Alert
                            type="error"
                            message="You do not have permission to edit this prescription."
                            className="mt-6"
                        />
                        <div className="mt-6 flex justify-center">
                            <Button variant="primary" onClick={() => router.push('/prescriptions')}>
                                Back to Prescriptions
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                                Edit Prescription
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                Modify prescription details
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => router.push(`/prescriptions/${id}`)}
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Card>
                            <PrescriptionForm
                                initialData={prescription}
                                onSubmit={handleUpdatePrescription}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}