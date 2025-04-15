import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import {
    FiCalendar,
    FiClock,
    FiUser,
    FiMapPin,
    FiPhone,
    FiMail,
    FiTag,
    FiFileText,
    FiEdit3,
    FiTrash2
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';

export default function AppointmentDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const [statusUpdateError, setStatusUpdateError] = useState(null);

    // Fetch appointment details
    const {
        data: appointment,
        loading,
        error,
        refetch
    } = useFetch(id ? `/appointments/${id}` : null);

    // Check if the user has permission to view this appointment
    const hasPermission = () => {
        if (!user || !appointment) return false;

        if (user.role === 'doctor') {
            return parseInt(appointment.id_doc) === parseInt(user.id);
        } else if (user.role === 'client') {
            return parseInt(appointment.id_clt) === parseInt(user.id);
        }

        return false;
    };

    // Handle appointment update
    const handleUpdateAppointment = async (data) => {
        try {
            const response = await axios.put(`/appointments/${id}`, data);
            await refetch();
            setIsModalOpen(false);
            return response.data;
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    };

    // Handle status update
    const handleStatusUpdate = async (newStatus) => {
        setStatusUpdateLoading(true);
        setStatusUpdateError(null);

        try {
            await axios.put(`/appointments/${id}/status`, { status: newStatus });
            await refetch();
        } catch (error) {
            setStatusUpdateError(
                error.response?.data?.message || 'Failed to update appointment status'
            );
            console.error('Error updating status:', error);
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    // Handle appointment deletion
    const handleDeleteAppointment = async () => {
        if (!confirm('Are you sure you want to delete this appointment?')) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await axios.delete(`/appointments/${id}`);
            router.push('/appointments');
        } catch (error) {
            setDeleteError(
                error.response?.data?.message || 'Failed to delete appointment'
            );
            console.error('Error deleting appointment:', error);
            setIsDeleting(false);
        }
    };

    // Format currency
    const formatCurrency = (amount, currency = 'EUR') => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-secondary-100 text-secondary-800';
        }
    };

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

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

    if (error || !appointment) {
        return (
            <Layout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Alert
                            type="error"
                            message="Failed to load appointment details. The appointment may not exist or you may not have permission to view it."
                            className="mt-6"
                        />
                        <div className="mt-6 flex justify-center">
                            <Button variant="primary" onClick={() => router.push('/appointments')}>
                                Back to Appointments
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!hasPermission()) {
        return (
            <Layout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Alert
                            type="error"
                            message="You do not have permission to view this appointment."
                            className="mt-6"
                        />
                        <div className="mt-6 flex justify-center">
                            <Button variant="primary" onClick={() => router.push('/appointments')}>
                                Back to Appointments
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                                Appointment Details
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                View and manage appointment information
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => setIsModalOpen(true)}
                                disabled={isDeleting}
                            >
                                <FiEdit3 className="mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDeleteAppointment}
                                isLoading={isDeleting}
                                disabled={isDeleting}
                            >
                                <FiTrash2 className="mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>

                    {deleteError && (
                        <Alert
                            type="error"
                            message={deleteError}
                            className="mt-6"
                        />
                    )}

                    <div className="mt-6">
                        <Card>
                            <div className="border-b border-secondary-200 dark:border-secondary-700 pb-4 mb-4 flex justify-between items-center">
                                <h2 className="text-xl font-medium text-secondary-900 dark:text-white">
                                    Appointment #{appointment.id_rdv}
                                </h2>
                                <span
                                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
                                        appointment.status
                                    )}`}
                                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
                            </div>

                            {statusUpdateError && (
                                <Alert
                                    type="error"
                                    message={statusUpdateError}
                                    className="mb-4"
                                />
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                        Appointment Information
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <FiCalendar className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Date</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FiClock className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Time</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {format(new Date(appointment.date), 'h:mm a')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FiTag className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Price</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {formatCurrency(appointment.price, appointment.currency_code)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FiFileText className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Description</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {appointment.description_rdv || 'No description provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {user.role === 'doctor' && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                                Update Status
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    variant={appointment.status === 'pending' ? 'primary' : 'outline'}
                                                    className="text-sm"
                                                    onClick={() => handleStatusUpdate('pending')}
                                                    disabled={statusUpdateLoading || appointment.status === 'pending'}
                                                >
                                                    Pending
                                                </Button>
                                                <Button
                                                    variant={appointment.status === 'confirmed' ? 'primary' : 'outline'}
                                                    className="text-sm"
                                                    onClick={() => handleStatusUpdate('confirmed')}
                                                    disabled={statusUpdateLoading || appointment.status === 'confirmed'}
                                                >
                                                    Confirm
                                                </Button>
                                                <Button
                                                    variant={appointment.status === 'completed' ? 'primary' : 'outline'}
                                                    className="text-sm"
                                                    onClick={() => handleStatusUpdate('completed')}
                                                    disabled={statusUpdateLoading || appointment.status === 'completed'}
                                                >
                                                    Complete
                                                </Button>
                                                <Button
                                                    variant={appointment.status === 'cancelled' ? 'danger' : 'outline'}
                                                    className="text-sm"
                                                    onClick={() => handleStatusUpdate('cancelled')}
                                                    disabled={statusUpdateLoading || appointment.status === 'cancelled'}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {user.role === 'doctor' && appointment.client && (
                                        <div>
                                            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                                Patient Information
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <FiUser className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Name</h4>
                                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                            {appointment.client_name}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <FiMapPin className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Location</h4>
                                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                            {appointment.client_ville || 'Not specified'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <FiMail className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Email</h4>
                                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                            {appointment.client_email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <FiPhone className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Phone</h4>
                                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                            {appointment.client_telephone || 'Not specified'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {user.role === 'client' && appointment.doctor && (
                                        <div>
                                            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                                Doctor Information
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <FiUser className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Name</h4>
                                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                            {appointment.doctor_name}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <FiTag className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Specialty</h4>
                                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                            {appointment.specialite || 'Not specified'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <FiMail className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Email</h4>
                                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                            {appointment.doctor_email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <FiPhone className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Phone</h4>
                                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                            {appointment.doctor_telephone || 'Not specified'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700 flex justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={() => router.push('/appointments')}
                                >
                                    Back to Appointments
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit Appointment"
                size="lg"
            >
                <AppointmentForm
                    initialData={appointment}
                    onSubmit={handleUpdateAppointment}
                />
            </Modal>
        </Layout>
    );
}