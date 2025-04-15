import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';

export default function NewMedicalRecord() {
    const { user } = useAuth();
    const router = useRouter();
    const { clientId } = router.query;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            blood_type: '',
            height: '',
            weight: '',
            medical_notes: ''
        }
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role === 'doctor' && !clientId) {
            // Doctors need to select a patient first
            router.push('/patients');
        }
    }, [user, router, clientId]);

    // Handle form submission
    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const patientId = user.role === 'client' ? user.id : clientId;

            // Format the data
            const formattedData = {
                ...data,
                height: data.height ? parseInt(data.height, 10) : null,
                weight: data.weight ? parseInt(data.weight, 10) : null
            };

            await axios.put(`/medical-records/${patientId}`, formattedData);

            // Redirect to the medical record page
            router.push(user.role === 'client'
                ? '/medical-records'
                : `/medical-records/${patientId}`
            );
        } catch (error) {
            setError(
                error.response?.data?.message || 'Failed to create medical record'
            );
            console.error('Error creating medical record:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                        Create Medical Record
                    </h1>
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                        {user.role === 'client'
                            ? 'Set up your basic medical information'
                            : 'Set up basic medical information for your patient'
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
                                <Select
                                    label="Blood Type"
                                    name="blood_type"
                                    error={errors.blood_type?.message}
                                    {...register('blood_type')}
                                >
                                    <option value="">Select blood type (optional)</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </Select>

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
                                        Create Record
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