import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm';

export default function NewPrescription() {
    const { user } = useAuth();
    const router = useRouter();
    const { clientId } = router.query;

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role === 'client') {
            // Clients cannot create prescriptions
            router.push('/prescriptions');
        }
    }, [user, router]);

    // Handle form submission
    const handleCreatePrescription = async (data) => {
        try {
            const response = await axios.post('/prescriptions', data);
            router.push(`/prescriptions/${response.data.prescription.id}`);
            return response.data;
        } catch (error) {
            console.error('Error creating prescription:', error);
            throw error;
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
                                New Prescription
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                Create a new prescription for your patient
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => router.push('/prescriptions')}
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Card>
                            <PrescriptionForm
                                onSubmit={handleCreatePrescription}
                                clientId={clientId}
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}