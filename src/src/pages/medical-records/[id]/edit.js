import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

// Blood types for the dropdown
const BLOOD_TYPES = [
    { value: "", label: "Select blood type (optional)" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" }
];

export default function EditMedicalRecord() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Determine which medical record to fetch
    const clientId = id || (user?.role === 'client' ? user.id : null);

    // Fetch current medical record data
    const {
        data: medicalRecord,
        loading: fetchLoading,
        error: fetchError
    } = useFetch(clientId ? `/medical-records/${clientId}` : null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            blood_type: 'O+', // Pre-selected for demo
            height: '175',    // Example height in cm
            weight: '70',     // Example weight in kg
            medical_notes: 'Patient has a history of seasonal allergies. No known drug allergies.'
        }
    });

    // Populate form with existing data when it's fetched
    useEffect(() => {
        if (medicalRecord) {
            reset({
                blood_type: medicalRecord.blood_type || 'O+', // Default to O+ for demo
                height: medicalRecord.height || '175',
                weight: medicalRecord.weight || '70',
                medical_notes: medicalRecord.medical_notes || 'Patient has a history of seasonal allergies. No known drug allergies.'
            });
        }
    }, [medicalRecord, reset]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role === 'doctor' && !id) {
            // Doctors need to specify a patient
            router.push('/patients');
        }
    }, [user, router, id]);

    // Check if the user has permission to edit this record
    const hasPermission = () => {
        if (!user || !medicalRecord) return false;

        if (user.role === 'doctor') {
            return true; // Doctors can edit any patient record they can access
        } else if (user.role === 'client') {
            return parseInt(clientId) === parseInt(user.id); // Clients can only edit their own record
        }

        return false;
    };

    // Handle form submission
    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!hasPermission()) {
                throw new Error('You do not have permission to edit this medical record');
            }

            // Format the data
            const formattedData = {
                ...data,
                height: data.height ? parseInt(data.height, 10) : null,
                weight: data.weight ? parseInt(data.weight, 10) : null
            };

            await axios.put(`/medical-records/${clientId}`, formattedData);

            // Redirect to the medical record page
            router.push(user.role === 'client'
                ? '/medical-records'
                : `/medical-records/${clientId}`
            );
        } catch (error) {
            setError(
                error.response?.data?.message || error.message || 'Failed to update medical record'
            );
            console.error('Error updating medical record:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    if (fetchLoading) {
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

    if (fetchError && fetchError !== 'Resource not found') {
        return (
            <Layout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Alert
                            type="error"
                            message="Failed to load medical record. Please try again later."
                            className="mb-6"
                        />
                        <div className="flex justify-center">
                            <Button
                                variant="primary"
                                onClick={() => router.back()}
                            >
                                Go Back
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
                    <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                        Edit Medical Record
                    </h1>
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                        {user.role === 'client'
                            ? 'Update your basic medical information'
                            : `Update basic medical information for ${medicalRecord?.client_name || 'patient'}`
                        }
                    </p>

                    <div className="mt-6">
                        <Card>
                            {error && (
                                <Alert
                                    type="error"
                                    message={error}
                                    className="mb-6"
                                />
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Blood Type Dropdown - Using native select for reliability */}
                                <div className="mb-4">
                                    <label htmlFor="blood_type" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                                        Blood Type
                                    </label>
                                    <select
                                        id="blood_type"
                                        name="blood_type"
                                        className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-secondary-800 dark:border-secondary-700 dark:text-white"
                                        {...register('blood_type')}
                                    >
                                        {BLOOD_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.blood_type?.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.blood_type.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Height (cm)"
                                        name="height"
                                        type="number"
                                        placeholder="Enter height in centimeters"
                                        error={errors.height?.message}
                                        {...register('height', {
                                            valueAsNumber: true,
                                            validate: value => !value || value > 0 || 'Height must be a positive number'
                                        })}
                                    />

                                    <Input
                                        label="Weight (kg)"
                                        name="weight"
                                        type="number"
                                        placeholder="Enter weight in kilograms"
                                        error={errors.weight?.message}
                                        {...register('weight', {
                                            valueAsNumber: true,
                                            validate: value => !value || value > 0 || 'Weight must be a positive number'
                                        })}
                                    />
                                </div>

                                <Input
                                    label="Medical Notes"
                                    name="medical_notes"
                                    as="textarea"
                                    rows={5}
                                    placeholder="Enter any relevant medical history or notes"
                                    error={errors.medical_notes?.message}
                                    {...register('medical_notes')}
                                />

                                <div className="flex justify-end space-x-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => router.back()}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        isLoading={isLoading}
                                        disabled={isLoading}
                                    >
                                        Update Record
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}