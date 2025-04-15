import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { MedicalRecordView } from '@/components/medical-records/MedicalRecordView';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function PatientMedicalRecord() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [consultationFormData, setConsultationFormData] = useState({
        consultation_date: new Date().toISOString().split('T')[0],
        consultation_type: 'Follow-up',
        diagnosis: '',
        treatment: '',
        notes: ''
    });
    const [consultationError, setConsultationError] = useState(null);

    // Fetch medical records
    const {
        data: medicalRecord,
        loading,
        error,
        refetch
    } = useFetch(id ? `/medical-records/${id}` : null);

    // Check if the user has permission to view this medical record
    const hasPermission = () => {
        if (!user || !medicalRecord) return false;

        if (user.role === 'doctor') {
            // Doctor should have permission to view patients' records
            return true;
        } else if (user.role === 'client') {
            // Clients can only view their own records
            return parseInt(id) === parseInt(user.id);
        }

        return false;
    };

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    // Handle adding an allergy
    const handleAddAllergy = async (data) => {
        try {
            await axios.post(`/medical-records/${id}/allergies`, data);
            await refetch();
        } catch (error) {
            console.error('Error adding allergy:', error);
            throw error;
        }
    };

    // Handle removing an allergy
    const handleRemoveAllergy = async (allergyId) => {
        if (!confirm('Are you sure you want to remove this allergy?')) {
            return;
        }

        try {
            await axios.delete(`/medical-records/${id}/allergies/${allergyId}`);
            await refetch();
        } catch (error) {
            console.error('Error removing allergy:', error);
            throw error;
        }
    };

    // Handle adding a condition
    const handleAddCondition = async (data) => {
        try {
            await axios.post(`/medical-records/${id}/conditions`, data);
            await refetch();
        } catch (error) {
            console.error('Error adding condition:', error);
            throw error;
        }
    };

    // Handle updating a condition
    const handleUpdateCondition = async (conditionId, data) => {
        try {
            await axios.put(`/medical-records/${id}/conditions/${conditionId}`, data);
            await refetch();
        } catch (error) {
            console.error('Error updating condition:', error);
            throw error;
        }
    };

    // Handle removing a condition
    const handleRemoveCondition = async (conditionId) => {
        if (!confirm('Are you sure you want to remove this condition?')) {
            return;
        }

        try {
            await axios.delete(`/medical-records/${id}/conditions/${conditionId}`);
            await refetch();
        } catch (error) {
            console.error('Error removing condition:', error);
            throw error;
        }
    };

    // Handle consultation form change
    const handleConsultationChange = (e) => {
        const { name, value } = e.target;
        setConsultationFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle adding a consultation
    const handleAddConsultation = async () => {
        setIsSubmitting(true);
        setConsultationError(null);

        try {
            await axios.post(`/medical-records/${id}/consultations`, consultationFormData);
            await refetch();
            setIsConsultationModalOpen(false);
            setConsultationFormData({
                consultation_date: new Date().toISOString().split('T')[0],
                consultation_type: 'Follow-up',
                diagnosis: '',
                treatment: '',
                notes: ''
            });
        } catch (error) {
            setConsultationError(
                error.response?.data?.message || 'Failed to add consultation'
            );
            console.error('Error adding consultation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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

    if (error || !medicalRecord) {
        return (
            <Layout>
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Alert
                            type="error"
                            message="Failed to load medical records. The record may not exist or you may not have permission to view it."
                            className="mt-6"
                        />
                        <div className="mt-6 flex justify-center">
                            <Button variant="primary" onClick={() => router.push('/dashboard')}>
                                Back to Dashboard
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
                            message="You do not have permission to view this medical record."
                            className="mt-6"
                        />
                        <div className="mt-6 flex justify-center">
                            <Button variant="primary" onClick={() => router.push('/dashboard')}>
                                Back to Dashboard
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
                                {user.role === 'doctor' ? 'Patient' : 'My'} Medical Record
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                {medicalRecord.client_name}'s health information
                            </p>
                        </div>
                        {user.role === 'doctor' && (
                            <div className="mt-4 sm:mt-0 flex space-x-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => router.push(`/medical-records/${id}/edit`)}
                                >
                                    Update Basic Info
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => setIsConsultationModalOpen(true)}
                                >
                                    Add Consultation
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <MedicalRecordView
                            medicalRecord={medicalRecord}
                            onAddAllergy={handleAddAllergy}
                            onRemoveAllergy={handleRemoveAllergy}
                            onAddCondition={handleAddCondition}
                            onUpdateCondition={handleUpdateCondition}
                            onRemoveCondition={handleRemoveCondition}
                            isDoctor={user.role === 'doctor'}
                        />
                    </div>
                </div>
            </div>

            {/* Add Consultation Modal */}
            <Modal
                isOpen={isConsultationModalOpen}
                onClose={() => setIsConsultationModalOpen(false)}
                title="Add Consultation Record"
            >
                {consultationError && (
                    <Alert
                        type="error"
                        message={consultationError}
                        className="mb-4"
                    />
                )}

                <div className="space-y-4">
                    <Input
                        label="Consultation Date"
                        name="consultation_date"
                        type="date"
                        value={consultationFormData.consultation_date}
                        onChange={handleConsultationChange}
                        required
                    />

                    <Select
                        label="Consultation Type"
                        name="consultation_type"
                        value={consultationFormData.consultation_type}
                        onChange={handleConsultationChange}
                        required
                    >
                        <option value="Initial">Initial Visit</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Specialist">Specialist Consultation</option>
                        <option value="Telemedicine">Telemedicine</option>
                    </Select>

                    <Input
                        label="Diagnosis"
                        name="diagnosis"
                        value={consultationFormData.diagnosis}
                        onChange={handleConsultationChange}
                        placeholder="Enter diagnosis"
                        required
                    />

                    <Input
                        label="Treatment"
                        name="treatment"
                        value={consultationFormData.treatment}
                        onChange={handleConsultationChange}
                        placeholder="Enter treatment plan"
                        required
                    />

                    <Input
                        label="Notes"
                        name="notes"
                        value={consultationFormData.notes}
                        onChange={handleConsultationChange}
                        placeholder="Additional notes (optional)"
                    />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        variant="secondary"
                        onClick={() => setIsConsultationModalOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddConsultation}
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        Add Consultation
                    </Button>
                </div>
            </Modal>
        </Layout>
    );
}