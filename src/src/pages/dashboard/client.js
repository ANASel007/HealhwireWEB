import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Alert } from '@/components/ui/Alert';
import { FiCalendar, FiMessageSquare, FiFileText, FiActivity } from 'react-icons/fi';

export default function ClientDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [currentDate] = useState(new Date());

    // Fetch appointments
    const { data: appointments, loading: loadingAppointments, error: appointmentsError, refetch: refetchAppointments } =
        useFetch(user ? `/clients/${user.id}/appointments` : null);

    // Fetch prescriptions
    const { data: prescriptions, loading: loadingPrescriptions, error: prescriptionsError } =
        useFetch(user ? `/prescriptions/client/${user.id}` : null);

    // Get upcoming appointments
    const upcomingAppointments = appointments?.filter(
        (appointment) => new Date(appointment.date) > currentDate
    ).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5) || [];

    // Setup appointment table columns
    const appointmentColumns = [
        {
            header: 'Doctor',
            accessor: 'doctor_name',
        },
        {
            header: 'Specialty',
            accessor: 'specialite',
        },
        {
            header: 'Date',
            accessor: 'date',
            render: (row) => format(new Date(row.date), 'MMM dd, yyyy'),
        },
        {
            header: 'Time',
            accessor: 'date',
            render: (row) => format(new Date(row.date), 'h:mm a'),
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : row.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : row.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
            ),
        },
        {
            header: 'Actions',
            accessor: 'id_rdv',
            render: (row) => (
                <div className="flex space-x-2">
                    <Link href={`/appointments/${row.id_rdv}`}>
                        <Button variant="outline" className="px-2 py-1 text-xs">
                            View
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    // Setup prescription table columns
    const prescriptionColumns = [
        {
            header: 'Doctor',
            accessor: 'doctor_name',
        },
        {
            header: 'Date',
            accessor: 'prescribed_date',
            render: (row) => format(new Date(row.prescribed_date), 'MMM dd, yyyy'),
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : row.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-secondary-100 text-secondary-800'
                }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
            ),
        },
        {
            header: 'Actions',
            accessor: 'id',
            render: (row) => (
                <div className="flex space-x-2">
                    <Link href={`/prescriptions/${row.id}`}>
                        <Button variant="outline" className="px-2 py-1 text-xs">
                            View
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    // Redirect if not a client
    useEffect(() => {
        if (user && user.role !== 'client') {
            router.replace('/dashboard/doctor');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                        Patient Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                        Welcome back, {user.nom}
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Stats Overview */}
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-800 rounded-md p-3">
                                    <FiCalendar className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                                            Upcoming Appointments
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-secondary-900 dark:text-white">
                                                {loadingAppointments ? '...' : upcomingAppointments.length}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </Card>

                        <Card className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-md p-3">
                                    <FiFileText className="h-6 w-6 text-green-600 dark:text-green-300" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                                            Active Prescriptions
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-secondary-900 dark:text-white">
                                                {loadingPrescriptions ? '...' :
                                                    prescriptions?.filter(p => p.status === 'active').length || 0}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </Card>

                        <Card className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-md p-3">
                                    <FiMessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                                            Unread Messages
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-secondary-900 dark:text-white">
                                                0
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </Card>

                        <Card className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-800 rounded-md p-3">
                                    <FiActivity className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 truncate">
                                            Total Appointments
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-medium text-secondary-900 dark:text-white">
                                                {loadingAppointments ? '...' : appointments?.length || 0}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="mt-8">
                        <Card
                            title="Upcoming Appointments"
                            actions={
                                <Link href="/appointments">
                                    <Button variant="secondary" className="text-sm">
                                        View All
                                    </Button>
                                </Link>
                            }
                        >
                            {appointmentsError && (
                                <Alert
                                    type="error"
                                    message="Failed to load appointments. Please try again later."
                                    className="mb-4"
                                />
                            )}

                            {loadingAppointments ? (
                                <div className="py-4 text-center text-secondary-500 dark:text-secondary-400">
                                    Loading appointments...
                                </div>
                            ) : upcomingAppointments.length > 0 ? (
                                <Table
                                    columns={appointmentColumns}
                                    data={upcomingAppointments}
                                    emptyMessage="No upcoming appointments."
                                />
                            ) : (
                                <div className="py-4 text-center text-secondary-500 dark:text-secondary-400">
                                    No upcoming appointments.
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Active Prescriptions */}
                    <div className="mt-8">
                        <Card
                            title="Active Prescriptions"
                            actions={
                                <Link href="/prescriptions">
                                    <Button variant="secondary" className="text-sm">
                                        View All
                                    </Button>
                                </Link>
                            }
                        >
                            {prescriptionsError && (
                                <Alert
                                    type="error"
                                    message="Failed to load prescriptions. Please try again later."
                                    className="mb-4"
                                />
                            )}

                            {loadingPrescriptions ? (
                                <div className="py-4 text-center text-secondary-500 dark:text-secondary-400">
                                    Loading prescriptions...
                                </div>
                            ) : prescriptions?.filter(p => p.status === 'active').length > 0 ? (
                                <Table
                                    columns={prescriptionColumns}
                                    data={prescriptions.filter(p => p.status === 'active')}
                                    emptyMessage="No active prescriptions."
                                />
                            ) : (
                                <div className="py-4 text-center text-secondary-500 dark:text-secondary-400">
                                    No active prescriptions.
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 mb-12">
                        <Card title="Quick Actions">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <Link href="/appointments/new">
                                    <Button variant="primary" className="w-full py-3 justify-center">
                                        <FiCalendar className="mr-2" />
                                        Book Appointment
                                    </Button>
                                </Link>

                                <Link href="/messages">
                                    <Button variant="secondary" className="w-full py-3 justify-center">
                                        <FiMessageSquare className="mr-2" />
                                        Message Doctor
                                    </Button>
                                </Link>

                                <Link href="/medical-records">
                                    <Button variant="outline" className="w-full py-3 justify-center">
                                        <FiActivity className="mr-2" />
                                        View Medical Records
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}