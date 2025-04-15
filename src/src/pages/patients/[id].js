import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiActivity, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function PatientDetail() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    // Fetch patient details
    const {
        data: patient,
        loading,
        error
    } = useFetch(id ? `/clients/${id}` : null);

    // Redirect if not authenticated or not a doctor
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'doctor') {
            router.push('/dashboard');
        }
    }, [user, router]);

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

    if (error) {
        return (
            <Layout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Alert
                            type="error"
                            message="Failed to load patient details. The patient may not exist or you may not have permission to view their information."
                            className="mb-6"
                        />
                        <div className="flex justify-center">
                            <Button
                                variant="primary"
                                onClick={() => router.push('/patients')}
                            >
                                Back to Patients
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
                                Patient Profile
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                View and manage {patient?.nom}'s information
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => router.push('/patients')}
                        >
                            Back to Patients
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Card>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-4">
                                    <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300 text-2xl font-semibold">
                                        {patient?.nom?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                                            {patient?.nom}
                                        </h2>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                            Patient
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <FiUser className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                        <div>
                                            <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Full Name</h4>
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                {patient?.nom}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <FiMapPin className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                        <div>
                                            <h4 className="text-sm font-medium text-secondary-900 dark:text-white">City</h4>
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                {patient?.ville || 'Not specified'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <FiMail className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                        <div>
                                            <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Email</h4>
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                {patient?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <FiPhone className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                        <div>
                                            <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Phone</h4>
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                {patient?.telephone || 'Not specified'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                                        Quick Actions
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <Link href={`/medical-records/${patient?.id_clt}`}>
                                            <Button
                                                variant="secondary"
                                                className="w-full justify-center"
                                            >
                                                <FiActivity className="mr-2" />
                                                View Medical Records
                                            </Button>
                                        </Link>

                                        <Link href={`/appointments/new?clientId=${patient?.id_clt}`}>
                                            <Button
                                                variant="primary"
                                                className="w-full justify-center"
                                            >
                                                <FiCalendar className="mr-2" />
                                                Schedule Appointment
                                            </Button>
                                        </Link>

                                        <Link href={`/prescriptions/new?clientId=${patient?.id_clt}`}>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-center"
                                            >
                                                <FiFileText className="mr-2" />
                                                Create Prescription
                                            </Button>
                                        </Link>

                                        <Link href={`/messages?clientId=${patient?.id_clt}`}>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-center"
                                            >
                                                <FiMessageSquare className="mr-2" />
                                                Send Message
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}