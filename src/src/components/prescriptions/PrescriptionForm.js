import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';

export const PrescriptionForm = ({
                                     initialData = null,
                                     onSubmit,
                                     clientId = null,
                                 }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch patients directly if user is a doctor
    useEffect(() => {
        const fetchPatients = async () => {
            if (user?.role === 'doctor') {
                try {
                    setLoading(true);
                    const response = await axios.get('/clients');
                    console.log('Patients data for prescription:', response.data);
                    setPatients(response.data || []);
                } catch (error) {
                    console.error('Error fetching patients:', error);
                    setPatients([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPatients();
    }, [user?.role]);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: initialData || {
            client_id: clientId || '',
            notes: '',
            items: [
                {
                    medication: '',
                    dosage: '',
                    frequency: '',
                    duration: '',
                    instructions: ''
                }
            ]
        }
    });

    const watchedValues = watch();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    });

    // Reset form when initialData changes
    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else if (clientId) {
            setValue('client_id', clientId);
        }
    }, [initialData, clientId, reset, setValue]);

    const handleFormSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            // Format the data if needed
            const formattedData = {
                ...data,
                client_id: parseInt(data.client_id, 10),
            };

            console.log('Submitting prescription data:', formattedData);

            await onSubmit(formattedData);

            // Clear form if it's a new prescription (no initialData)
            if (!initialData) {
                reset({
                    client_id: clientId || '',
                    notes: '',
                    items: [
                        {
                            medication: '',
                            dosage: '',
                            frequency: '',
                            duration: '',
                            instructions: ''
                        }
                    ]
                });
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'An error occurred while saving the prescription'
            );
            console.error('Error submitting prescription:', error);
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

            {/* Patient selection for doctors */}
            {user?.role === 'doctor' && !clientId && (
                <div className="mb-4">
                    <label htmlFor="client_id" className="label">
                        Patient <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                        id="client_id"
                        name="client_id"
                        className={`input ${errors.client_id ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        aria-invalid={errors.client_id ? 'true' : 'false'}
                        aria-describedby={errors.client_id ? 'client_id-error' : undefined}
                        disabled={isLoading || loading}
                        value={watchedValues.client_id}
                        onChange={(e) => setValue('client_id', e.target.value)}
                        {...register('client_id', { required: 'Patient is required' })}
                    >
                        <option value="">Select a patient</option>
                        {patients && patients.map((patient) => (
                            <option key={patient.id_clt} value={patient.id_clt}>
                                {patient.nom}
                            </option>
                        ))}
                    </select>
                    {errors.client_id && (
                        <p className="form-error" id="client_id-error" role="alert">
                            {errors.client_id.message}
                        </p>
                    )}
                    {loading && (
                        <p className="text-sm text-secondary-500 mt-1">Loading patients...</p>
                    )}
                </div>
            )}

            <Input
                label="Notes"
                name="notes"
                placeholder="General notes about this prescription"
                error={errors.notes?.message}
                disabled={isLoading}
                {...register('notes')}
            />

            <div className="mt-8">
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                    Medications
                </h3>

                {fields.map((item, index) => (
                    <Card key={item.id} className="mb-4">
                        <div className="flex justify-between mb-4">
                            <h4 className="text-base font-medium text-secondary-900 dark:text-white">
                                Medication #{index + 1}
                            </h4>
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={() => remove(index)}
                                    disabled={isLoading}
                                    className="text-sm"
                                >
                                    <FiTrash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Medication Name"
                                name={`items.${index}.medication`}
                                placeholder="Enter medication name"
                                required
                                error={errors.items?.[index]?.medication?.message}
                                disabled={isLoading}
                                {...register(`items.${index}.medication`, {
                                    required: 'Medication name is required'
                                })}
                            />

                            <Input
                                label="Dosage"
                                name={`items.${index}.dosage`}
                                placeholder="e.g., 10mg, 500mg, etc."
                                required
                                error={errors.items?.[index]?.dosage?.message}
                                disabled={isLoading}
                                {...register(`items.${index}.dosage`, {
                                    required: 'Dosage is required'
                                })}
                            />

                            <Input
                                label="Frequency"
                                name={`items.${index}.frequency`}
                                placeholder="e.g., Once daily, Twice daily, etc."
                                required
                                error={errors.items?.[index]?.frequency?.message}
                                disabled={isLoading}
                                {...register(`items.${index}.frequency`, {
                                    required: 'Frequency is required'
                                })}
                            />

                            <Input
                                label="Duration"
                                name={`items.${index}.duration`}
                                placeholder="e.g., 7 days, 2 weeks, etc."
                                required
                                error={errors.items?.[index]?.duration?.message}
                                disabled={isLoading}
                                {...register(`items.${index}.duration`, {
                                    required: 'Duration is required'
                                })}
                            />

                            <div className="md:col-span-2">
                                <Input
                                    label="Instructions"
                                    name={`items.${index}.instructions`}
                                    placeholder="Special instructions for taking this medication"
                                    error={errors.items?.[index]?.instructions?.message}
                                    disabled={isLoading}
                                    {...register(`items.${index}.instructions`)}
                                />
                            </div>
                        </div>
                    </Card>
                ))}

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => append({
                        medication: '',
                        dosage: '',
                        frequency: '',
                        duration: '',
                        instructions: ''
                    })}
                    disabled={isLoading}
                    className="mt-2"
                >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Add Another Medication
                </Button>
            </div>

            <div className="pt-5">
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? initialData
                                ? 'Updating...'
                                : 'Creating...'
                            : initialData
                                ? 'Update Prescription'
                                : 'Create Prescription'}
                    </Button>
                </div>
            </div>
        </form>
    );
};