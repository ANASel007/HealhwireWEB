import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { Layout } from '@/components/layout/Layout';
import { PrescriptionList } from '@/components/prescriptions/PrescriptionList';
import { Alert } from '@/components/ui/Alert';

export default function Prescriptions() {
    const { user } = useAuth();
    const router = useRouter();

    // Fetch prescriptions based on user role
    const { data: prescriptions, loading, error, refetch } = useFetch(
        user?.role === 'doctor'
            ? user ? `/prescriptions/doctor/${user.id}` : null
            : user ? `/prescriptions/client/${user.id}` : null
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
                        Prescriptions
                    </h1>
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                        {user.role === 'doctor'
                            ? 'Manage prescriptions for your patients'
                            : 'View your prescriptions and medication details'}
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    {error && (
                        <Alert
                            type="error"
                            message="Failed to load prescriptions. Please try again later."
                            className="mb-6"
                        />
                    )}

                    <PrescriptionList
                        prescriptions={prescriptions}
                        isLoading={loading}
                        error={error}
                    />
                </div>
            </div>
        </Layout>
    );
}