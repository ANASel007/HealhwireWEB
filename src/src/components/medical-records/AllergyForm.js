import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';

export const AllergyForm = ({ initialData = {}, onSubmit, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            allergy_name: initialData.allergy_name || '',
            severity: initialData.severity || 'Medium',
            notes: initialData.notes || ''
        }
    });

    const handleFormSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            await onSubmit(data);
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while saving the allergy');
            console.error('Error saving allergy:', error);
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
                label="Allergy Name"
                name="allergy_name"
                placeholder="Enter allergy name"
                required
                error={errors.allergy_name?.message}
                disabled={isLoading}
                {...register('allergy_name', {
                    required: 'Allergy name is required'
                })}
            />

            <Select
                label="Severity"
                name="severity"
                required
                error={errors.severity?.message}
                disabled={isLoading}
                {...register('severity', {
                    required: 'Severity is required'
                })}
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </Select>

            <Input
                label="Notes"
                name="notes"
                placeholder="Enter additional details about the allergy"
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
                    {initialData.id ? 'Update Allergy' : 'Add Allergy'}
                </Button>
            </div>
        </form>
    );
};