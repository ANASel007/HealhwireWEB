import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiPlusCircle, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AllergyForm } from './AllergyForm';
import { ConditionForm } from './ConditionForm';

export const MedicalRecordView = ({
                                      medicalRecord,
                                      onAddAllergy,
                                      onRemoveAllergy,
                                      onAddCondition,
                                      onUpdateCondition,
                                      onRemoveCondition,
                                      isDoctor = false,
                                  }) => {
    const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
    const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
    const [selectedCondition, setSelectedCondition] = useState(null);

    const handleAddAllergy = async (data) => {
        await onAddAllergy(data);
        setIsAllergyModalOpen(false);
    };

    const handleConditionAction = async (data) => {
        if (selectedCondition) {
            await onUpdateCondition(selectedCondition.id, data);
        } else {
            await onAddCondition(data);
        }
        setIsConditionModalOpen(false);
        setSelectedCondition(null);
    };

    const handleEditCondition = (condition) => {
        setSelectedCondition(condition);
        setIsConditionModalOpen(true);
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMMM d, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="space-y-8">
            {/* Basic Medical Information */}
            <Card title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            Blood Type
                        </h4>
                        <p className="mt-1 text-base text-secondary-900 dark:text-white">
                            {medicalRecord?.blood_type || 'Not specified'}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            Height
                        </h4>
                        <p className="mt-1 text-base text-secondary-900 dark:text-white">
                            {medicalRecord?.height ? `${medicalRecord.height} cm` : 'Not specified'}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            Weight
                        </h4>
                        <p className="mt-1 text-base text-secondary-900 dark:text-white">
                            {medicalRecord?.weight ? `${medicalRecord.weight} kg` : 'Not specified'}
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            Medical Notes
                        </h4>
                        <p className="mt-1 text-base text-secondary-900 dark:text-white">
                            {medicalRecord?.medical_notes || 'No medical notes available'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Allergies */}
            <Card
                title="Allergies"
                actions={
                    isDoctor && (
                        <Button
                            variant="primary"
                            className="text-sm"
                            onClick={() => setIsAllergyModalOpen(true)}
                        >
                            <FiPlusCircle className="mr-1 h-4 w-4" />
                            Add Allergy
                        </Button>
                    )
                }
            >
                {medicalRecord?.allergies?.length > 0 ? (
                    <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                        {medicalRecord.allergies.map((allergy) => (
                            <div key={allergy.id} className="py-4 first:pt-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-base font-medium text-secondary-900 dark:text-white">
                                            {allergy.allergy_name}
                                        </h4>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                            Severity: <span className="font-medium">{allergy.severity}</span>
                                        </p>
                                    </div>
                                    {isDoctor && (
                                        <Button
                                            variant="danger"
                                            className="text-sm"
                                            onClick={() => onRemoveAllergy(allergy.id)}
                                        >
                                            <FiTrash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                {allergy.notes && (
                                    <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-300">
                                        {allergy.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-4 text-center text-secondary-500 dark:text-secondary-400">
                        No allergies recorded
                    </div>
                )}
            </Card>

            {/* Medical Conditions */}
            <Card
                title="Medical Conditions"
                actions={
                    isDoctor && (
                        <Button
                            variant="primary"
                            className="text-sm"
                            onClick={() => {
                                setSelectedCondition(null);
                                setIsConditionModalOpen(true);
                            }}
                        >
                            <FiPlusCircle className="mr-1 h-4 w-4" />
                            Add Condition
                        </Button>
                    )
                }
            >
                {medicalRecord?.conditions?.length > 0 ? (
                    <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                        {medicalRecord.conditions.map((condition) => (
                            <div key={condition.id} className="py-4 first:pt-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-base font-medium text-secondary-900 dark:text-white">
                                            {condition.condition_name}
                                        </h4>
                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm text-secondary-500 dark:text-secondary-400">
                                            <p>
                                                Diagnosed: <span className="font-medium">{formatDate(condition.diagnosis_date)}</span>
                                            </p>
                                            <p>
                                                Status: <span className="font-medium">{condition.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                    {isDoctor && (
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="secondary"
                                                className="text-sm"
                                                onClick={() => handleEditCondition(condition)}
                                            >
                                                <FiEdit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="text-sm"
                                                onClick={() => onRemoveCondition(condition.id)}
                                            >
                                                <FiTrash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {condition.notes && (
                                    <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-300">
                                        {condition.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-4 text-center text-secondary-500 dark:text-secondary-400">
                        No medical conditions recorded
                    </div>
                )}
            </Card>

            {/* Recent Consultations */}
            <Card title="Recent Consultations">
                {medicalRecord?.consultations?.length > 0 ? (
                    <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
                        {medicalRecord.consultations.map((consultation) => (
                            <div key={consultation.id} className="py-4 first:pt-0 last:pb-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-base font-medium text-secondary-900 dark:text-white">
                                            {consultation.consultation_type}
                                        </h4>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                            Date: {formatDate(consultation.consultation_date)}
                                        </p>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                            Doctor: {consultation.doctor_name}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                        Diagnosis: {consultation.diagnosis}
                                    </p>
                                    <p className="text-sm text-secondary-600 dark:text-secondary-300">
                                        Treatment: {consultation.treatment}
                                    </p>
                                    {consultation.notes && (
                                        <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
                                            Notes: {consultation.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-4 text-center text-secondary-500 dark:text-secondary-400">
                        No consultation records available
                    </div>
                )}
            </Card>

            {/* Allergy Modal */}
            <Modal
                isOpen={isAllergyModalOpen}
                onClose={() => setIsAllergyModalOpen(false)}
                title="Add Allergy"
            >
                <AllergyForm onSubmit={handleAddAllergy} onCancel={() => setIsAllergyModalOpen(false)} />
            </Modal>

            {/* Condition Modal */}
            <Modal
                isOpen={isConditionModalOpen}
                onClose={() => {
                    setIsConditionModalOpen(false);
                    setSelectedCondition(null);
                }}
                title={selectedCondition ? "Edit Medical Condition" : "Add Medical Condition"}
            >
                <ConditionForm
                    initialData={selectedCondition}
                    onSubmit={handleConditionAction}
                    onCancel={() => {
                        setIsConditionModalOpen(false);
                        setSelectedCondition(null);
                    }}
                />
            </Modal>
        </div>
    );
};