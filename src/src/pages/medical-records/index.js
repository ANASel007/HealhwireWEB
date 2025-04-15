import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { MedicalRecordView } from '@/components/medical-records/MedicalRecordView';

export default function MedicalRecords() {
    const { user } = useAuth();
    const router = useRouter();

    // Fetch medical records based on user role
    const {
        data: medicalRecord,
        loading,
        error,
        refetch
    } = useFetch(
        user && user.role === 'client'
            ? `/medical-records/${user.id}`
            : null
    );

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role === 'doctor') {
            // Doctors need to select a patient first
            router.push('/patients');
        }
    }, [user, router]);

    // Handle adding an allergy
    const handleAddAllergy = async (data) => {
        try {
            await axios.post(`/medical-records/${user.id}/allergies`, data);
            await refetch();
        } catch (error) {
            console.error('Error adding allergy:', error);
            throw error;
        }
    };

    // Handle removing an allergy
    const handleRemoveAllergy = async (allergyId) => {
        if (!confirm('Are you sure you want to remove this allergy?')) {
            return;
        }

        try {
            await axios.delete(`/medical-records/${user.id}/allergies/${allergyId}`);
            await refetch();
        } catch (error) {
            console.error('Error removing allergy:', error);
            throw error;
        }
    };

    // Handle adding a condition
    const handleAddCondition = async (data) => {
        try {
            await axios.post(`/medical-records/${user.id}/conditions`, data);
            await refetch();
        } catch (error) {
            console.error('Error adding condition:', error);
            throw error;
        }
    };

    // Handle updating a condition
    const handleUpdateCondition = async (conditionId, data) => {
        try {
            await axios.put(`/medical-records/${user.id}/conditions/${conditionId}`, data);
            await refetch();
        } catch (error) {
            console.error('Error updating condition:', error);
            throw error;
        }
    };

    // Handle removing a condition
    const handleRemoveCondition = async (conditionId) => {
        if (!confirm('Are you sure you want to remove this condition?')) {
            return;
        }

        try {
            await axios.delete(`/medical-records/${user.id}/conditions/${conditionId}`);
            await refetch();
        } catch (error) {
            console.error('Error removing condition:', error);
            throw error;
        }
    };

    if (!user || user.role !== 'client') return null;

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                                Medical Records
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                View and manage your medical information
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Button
                                variant="primary"
                                onClick={() => router.push('/medical-records/edit')}
                            >
                                Update Basic Information
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6">
                        {error && (
                            <Alert
                                type="error"
                                message="Failed to load medical records. Please try again later."
                                className="mb-6"
                            />
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                            </div>
                        ) : !medicalRecord ? (
                            <Card>
                                <div className="text-center py-8">
                                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                                        No Medical Records Found
                                    </h3>
                                    <p className="text-secondary-500 dark:text-secondary-400 mb-6">
                                        Your medical record hasn't been created yet.
                                    </p>
                                    <Button
                                        variant="primary"
                                        onClick={() => router.push('/medical-records/new')}
                                    >
                                        Create Medical Record
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <MedicalRecordView
                                medicalRecord={medicalRecord}
                                onAddAllergy={handleAddAllergy}
                                onRemoveAllergy={handleRemoveAllergy}
                                onAddCondition={handleAddCondition}
                                onUpdateCondition={handleUpdateCondition}
                                onRemoveCondition={handleRemoveCondition}
                                isDoctor={false}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}