import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import {
    FiCalendar,
    FiUser,
    FiFileText,
    FiEdit3,
    FiTrash2,
    FiSend
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm';

export default function PrescriptionDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [sendError, setSendError] = useState(null);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const [statusUpdateError, setStatusUpdateError] = useState(null);
    const [selectedPharmacy, setSelectedPharmacy] = useState('');
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);

    // Fetch prescription details
    const {
        data: prescription,
        loading,
        error,
        refetch
    } = useFetch(id ? `/prescriptions/${id}` : null);

    // Fetch pharmacies
    const {
        data: pharmacies,
        loading: loadingPharmacies
    } = useFetch('/prescriptions/pharmacies');

    // Check if the user has permission to view this prescription
    const hasPermission = () => {
        if (!user || !prescription) return false;

        if (user.role === 'doctor') {
            return parseInt(prescription.doctor_id) === parseInt(user.id);
        } else if (user.role === 'client') {
            return parseInt(prescription.client_id) === parseInt(user.id);
        }

        return false;
    };

    // Handle prescription update
    const handleUpdatePrescription = async (data) => {
        try {
            await axios.put(`/prescriptions/${id}`, data);
            await refetch();
            setIsModalOpen(false);
            return true;
        } catch (error) {
            console.error('Error updating prescription:', error);
            throw error;
        }
    };

    // Handle status update
    const handleStatusUpdate = async (newStatus) => {
        setStatusUpdateLoading(true);
        setStatusUpdateError(null);

        try {
            await axios.put(`/prescriptions/${id}/status`, { status: newStatus });
            await refetch();
        } catch (error) {
            setStatusUpdateError(
                error.response?.data?.message || 'Failed to update prescription status'
            );
            console.error('Error updating status:', error);
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    // Handle prescription deletion
    const handleDeletePrescription = async () => {
        if (!confirm('Are you sure you want to delete this prescription?')) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await axios.delete(`/prescriptions/${id}`);
            router.push('/prescriptions');
        } catch (error) {
            setDeleteError(
                error.response?.data?.message || 'Failed to delete prescription'
            );
            console.error('Error deleting prescription:', error);
            setIsDeleting(false);
        }
    };

    // Handle send to pharmacy
    const handleSendToPharmacy = async () => {
        if (!selectedPharmacy) {
            setSendError('Please select a pharmacy');
            return;
        }

        setIsSending(true);
        setSendError(null);

        try {
            await axios.post(`/prescriptions/${id}/send`, { pharmacy_id: selectedPharmacy });
            await refetch();
            setIsSendModalOpen(false);
        } catch (error) {
            setSendError(
                error.response?.data?.message || 'Failed to send prescription to pharmacy'
            );
            console.error('Error sending to pharmacy:', error);
        } finally {
            setIsSending(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMMM d, yyyy');
        } catch (error) {
            return dateString;
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

    if (error || !prescription) {
        return (
            <Layout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Alert
                            type="error"
                            message="Failed to load prescription details. The prescription may not exist or you may not have permission to view it."
                            className="mt-6"
                        />
                        <div className="mt-6 flex justify-center">
                            <Button variant="primary" onClick={() => router.push('/prescriptions')}>
                                Back to Prescriptions
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
                            message="You do not have permission to view this prescription."
                            className="mt-6"
                        />
                        <div className="mt-6 flex justify-center">
                            <Button variant="primary" onClick={() => router.push('/prescriptions')}>
                                Back to Prescriptions
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
                                Prescription Details
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                Prescription #{prescription.id}
                            </p>
                        </div>
                        {user.role === 'doctor' && (
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
                                    variant="primary"
                                    onClick={() => setIsSendModalOpen(true)}
                                    disabled={isDeleting || prescription.sent_to_pharmacy}
                                >
                                    <FiSend className="mr-2" />
                                    Send to Pharmacy
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleDeletePrescription}
                                    isLoading={isDeleting}
                                    disabled={isDeleting}
                                >
                                    <FiTrash2 className="mr-2" />
                                    Delete
                                </Button>
                            </div>
                        )}
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
                                    Prescription Information
                                </h2>
                                <span
                                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                        prescription.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : prescription.status === 'completed'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-secondary-100 text-secondary-800'
                                    }`}
                                >
                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
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
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <FiCalendar className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Prescribed Date</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {formatDate(prescription.prescribed_date)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FiFileText className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Notes</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {prescription.notes || 'No notes provided'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FiSend className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Pharmacy Status</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {prescription.sent_to_pharmacy
                                                        ? `Sent to pharmacy on ${formatDate(prescription.sent_date)}`
                                                        : 'Not sent to pharmacy'}
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
                                                    variant={prescription.status === 'active' ? 'primary' : 'outline'}
                                                    className="text-sm"
                                                    onClick={() => handleStatusUpdate('active')}
                                                    disabled={statusUpdateLoading || prescription.status === 'active'}
                                                >
                                                    Active
                                                </Button>
                                                <Button
                                                    variant={prescription.status === 'completed' ? 'primary' : 'outline'}
                                                    className="text-sm"
                                                    onClick={() => handleStatusUpdate('completed')}
                                                    disabled={statusUpdateLoading || prescription.status === 'completed'}
                                                >
                                                    Completed
                                                </Button>
                                                <Button
                                                    variant={prescription.status === 'cancelled' ? 'danger' : 'outline'}
                                                    className="text-sm"
                                                    onClick={() => handleStatusUpdate('cancelled')}
                                                    disabled={statusUpdateLoading || prescription.status === 'cancelled'}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-start mb-4">
                                        <FiUser className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                        <div>
                                            <h4 className="text-sm font-medium text-secondary-900 dark:text-white">
                                                {user.role === 'doctor' ? 'Patient' : 'Doctor'}
                                            </h4>
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                {user.role === 'doctor'
                                                    ? prescription.client_name
                                                    : `Dr. ${prescription.doctor_name}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medications */}
                            <div className="mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                                <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                    Medications
                                </h3>

                                {prescription.items && prescription.items.length > 0 ? (
                                    <div className="space-y-6">
                                        {prescription.items.map((item, index) => (
                                            <Card key={item.id} className="bg-secondary-50 dark:bg-secondary-900">
                                                <div className="flex justify-between">
                                                    <h4 className="text-base font-medium text-secondary-900 dark:text-white">
                                                        {item.medication}
                                                    </h4>
                                                    <span className="text-sm text-secondary-500 dark:text-secondary-400">
                            #{index + 1}
                          </span>
                                                </div>

                                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <h5 className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Dosage</h5>
                                                        <p className="text-sm text-secondary-900 dark:text-white">{item.dosage}</p>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Frequency</h5>
                                                        <p className="text-sm text-secondary-900 dark:text-white">{item.frequency}</p>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Duration</h5>
                                                        <p className="text-sm text-secondary-900 dark:text-white">{item.duration}</p>
                                                    </div>
                                                </div>

                                                {item.instructions && (
                                                    <div className="mt-4">
                                                        <h5 className="text-xs font-medium text-secondary-500 dark:text-secondary-400">Instructions</h5>
                                                        <p className="text-sm text-secondary-900 dark:text-white">{item.instructions}</p>
                                                    </div>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-secondary-500 dark:text-secondary-400 py-4 text-center">
                                        No medications in this prescription
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700 flex justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={() => router.push('/prescriptions')}
                                >
                                    Back to Prescriptions
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Prescription Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit Prescription"
                size="lg"
            >
                <PrescriptionForm
                    initialData={prescription}
                    onSubmit={handleUpdatePrescription}
                />
            </Modal>

            {/* Send to Pharmacy Modal */}
            <Modal
                isOpen={isSendModalOpen}
                onClose={() => setIsSendModalOpen(false)}
                title="Send to Pharmacy"
            >
                {sendError && (
                    <Alert
                        type="error"
                        message={sendError}
                        className="mb-4"
                    />
                )}

                <div className="mb-4">
                    <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                        Select a pharmacy to send this prescription to:
                    </p>

                    <Select
                        name="pharmacy"
                        value={selectedPharmacy}
                        onChange={(e) => setSelectedPharmacy(e.target.value)}
                        required
                        disabled={isSending || loadingPharmacies}
                    >
                        <option value="">Select a pharmacy</option>
                        {pharmacies?.map((pharmacy) => (
                            <option key={pharmacy.id} value={pharmacy.id}>
                                {pharmacy.name} - {pharmacy.address}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        variant="secondary"
                        onClick={() => setIsSendModalOpen(false)}
                        disabled={isSending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSendToPharmacy}
                        isLoading={isSending}
                        disabled={isSending || !selectedPharmacy}
                    >
                        Send Prescription
                    </Button>
                </div>
            </Modal>
        </Layout>
    );
}