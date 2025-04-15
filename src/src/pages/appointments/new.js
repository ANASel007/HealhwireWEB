import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';

export default function NewAppointment() {
    const { user } = useAuth();
    const router = useRouter();

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    // Handle form submission
    const handleCreateAppointment = async (data) => {
        try {
            const response = await axios.post('/appointments', data);
            router.push(`/appointments/${response.data.appointment.id_rdv}`);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    };

    if (!user) return null;

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                                New Appointment
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                Create a new appointment
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => router.push('/appointments')}
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Card>
                            <AppointmentForm onSubmit={handleCreateAppointment} />
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}