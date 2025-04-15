import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';

export const ConditionForm = ({ initialData = {}, onSubmit, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            condition_name: initialData?.condition_name || '',
            diagnosis_date: initialData?.diagnosis_date
                ? new Date(initialData.diagnosis_date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
            status: initialData?.status || 'Active',
            notes: initialData?.notes || ''
        }
    });

    const handleFormSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            await onSubmit(data);
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while saving the condition');
            console.error('Error saving condition:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {error && (
                <Alert
                    type="error"
                    message={error}
                    className="mb-4"
                />
            )}

            <Input
                label="Condition Name"
                name="condition_name"
                placeholder="Enter condition name"
                required
                error={errors.condition_name?.message}
                disabled={isLoading}
                {...register('condition_name', {
                    required: 'Condition name is required'
                })}
            />

            <Input
                label="Diagnosis Date"
                name="diagnosis_date"
                type="date"
                required
                error={errors.diagnosis_date?.message}
                disabled={isLoading}
                {...register('diagnosis_date', {
                    required: 'Diagnosis date is required'
                })}
            />

            <Select
                label="Status"
                name="status"
                required
                error={errors.status?.message}
                disabled={isLoading}
                {...register('status', {
                    required: 'Status is required'
                })}
            >
                <option value="Active">Active</option>
                <option value="Controlled">Controlled</option>
                <option value="In Remission">In Remission</option>
                <option value="Resolved">Resolved</option>
            </Select>

            <Input
                label="Notes"
                name="notes"
                placeholder="Enter additional details about the condition"
                error={errors.notes?.message}
                disabled={isLoading}
                {...register('notes')}
            />

            <div className="flex justify-end space-x-3">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    {initialData?.id ? 'Update Condition' : 'Add Condition'}
                </Button>
            </div>
        </form>
    );
};