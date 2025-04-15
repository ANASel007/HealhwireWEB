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

export default function InvitePatient() {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: '',
            nom: '',
            ville: '',
            telephone: '',
        }
    });

    // List of French cities
    const cities = [
        { value: 'Paris', label: 'Paris' },
        { value: 'Lyon', label: 'Lyon' },
        { value: 'Marseille', label: 'Marseille' },
        { value: 'Bordeaux', label: 'Bordeaux' },
        { value: 'Lille', label: 'Lille' },
        { value: 'Toulouse', label: 'Toulouse' },
        { value: 'Nice', label: 'Nice' },
        { value: 'Nantes', label: 'Nantes' },
        { value: 'Strasbourg', label: 'Strasbourg' },
        { value: 'Montpellier', label: 'Montpellier' },
    ];

    // Redirect if not authenticated or not a doctor
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'doctor') {
            router.push('/dashboard');
        }
    }, [user, router]);

    // Handle form submission
    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // In a real application, this would send an invitation to the patient
            // and potentially pre-register them in the system
            // For now, we'll simulate this by creating a new client directly

            // Generate a temporary password (in a real app, you might send this via email)
            const tempPassword = Math.random().toString(36).slice(-8);

            // Create the client
            await axios.post('/auth/basic/register/client', {
                ...data,
                password: tempPassword,
                imageurl: ''
            });

            setSuccess(true);
            reset();

            // You might want to show the temporary password to the doctor so they can share it
            // In a real app, this would be sent directly to the patient via email

        } catch (error) {
            setError(
                error.response?.data?.message || 'Failed to invite patient'
            );
            console.error('Error inviting patient:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || user.role !== 'doctor') return null;

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                                Invite New Patient
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                Send an invitation for a patient to join HealthWire
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => router.push('/patients')}
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Card>
                            {error && (
                                <Alert
                                    type="error"
                                    message={error}
                                    className="mb-6"
                                />
                            )}

                            {success && (
                                <Alert
                                    type="success"
                                    title="Invitation Sent"
                                    message="The patient has been successfully invited to HealthWire."
                                    className="mb-6"
                                />
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <Input
                                    label="Full Name"
                                    name="nom"
                                    placeholder="Enter patient's full name"
                                    required
                                    error={errors.nom?.message}
                                    disabled={isLoading}
                                    {...register('nom', {
                                        required: 'Full name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters',
                                        },
                                    })}
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    placeholder="Enter patient's email"
                                    required
                                    error={errors.email?.message}
                                    disabled={isLoading}
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                />

                                <Select
                                    label="City"
                                    name="ville"
                                    options={cities}
                                    required
                                    error={errors.ville?.message}
                                    disabled={isLoading}
                                    {...register('ville', {
                                        required: 'City is required',
                                    })}
                                />

                                <Input
                                    label="Phone Number"
                                    name="telephone"
                                    placeholder="Enter patient's phone number"
                                    required
                                    error={errors.telephone?.message}
                                    disabled={isLoading}
                                    {...register('telephone', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^\+?[0-9]{10,15}$/,
                                            message: 'Invalid phone number',
                                        },
                                    })}
                                />

                                <div className="pt-5 flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        isLoading={isLoading}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
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
