import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { Layout } from '@/components/layout/Layout';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { Alert } from '@/components/ui/Alert';

export default function Appointments() {
    const { user } = useAuth();
    const router = useRouter();

    // Fetch appointments based on user role
    const { data: appointments, loading, error, refetch } = useFetch(
        user?.role === 'doctor'
            ? user ? `/doctors/${user.id}/appointments` : null
            : user ? `/clients/${user.id}/appointments` : null
    );

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                        Appointments
                    </h1>
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                        {user.role === 'doctor'
                            ? 'Manage your patient appointments'
                            : 'View and schedule your doctor appointments'}
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    {error && (
                        <Alert
                            type="error"
                            message="Failed to load appointments. Please try again later."
                            className="mb-6"
                        />
                    )}

                    <AppointmentList
                        appointments={appointments}
                        isLoading={loading}
                        error={error}
                    />
                </div>
            </div>
        </Layout>
    );
}
