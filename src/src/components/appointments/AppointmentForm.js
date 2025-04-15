import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format, parse, set } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { useFetch } from '@/hooks/useFetch';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { TimeSlotPicker } from './TimeSlotPicker';

export const AppointmentForm = ({ onSubmit, initialData = null }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(initialData?.id_doc || '');
    const [selectedDate, setSelectedDate] = useState(
        initialData?.date ? new Date(initialData.date) : new Date()
    );
    const [selectedTime, setSelectedTime] = useState(
        initialData?.date ? format(new Date(initialData.date), 'HH:mm') : null
    );
    const [price, setPrice] = useState(initialData?.price || '');
    const [currencyCode, setCurrencyCode] = useState(initialData?.currency_code || 'EUR');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    // FIXED: Added separate state for doctors to ensure we capture the data properly
    const [doctorsList, setDoctorsList] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = useForm({
        defaultValues: {
            description_rdv: initialData?.description_rdv || '',
            id_doc: initialData?.id_doc || (user?.role === 'doctor' ? user.id : ''),
            id_clt: initialData?.id_clt || (user?.role === 'client' ? user.id : ''),
            price: initialData?.price || '',
            status: initialData?.status || 'pending',
            currency_code: initialData?.currency_code || 'EUR'
        },
    });

    // FIXED: Manually fetch doctors to ensure data is properly loaded
    useEffect(() => {
        const fetchDoctors = async () => {
            if (user?.role === 'client') {
                try {
                    const response = await axios.get('/doctors');
                    console.log('Doctors data:', response.data);
                    setDoctorsList(response.data || []);

                    // If we have initial data, set the selected doctor
                    if (initialData?.id_doc) {
                        setSelectedDoctor(initialData.id_doc);
                        setValue('id_doc', initialData.id_doc);
                    }
                } catch (error) {
                    console.error('Error fetching doctors:', error);
                    setDoctorsList([]);
                }
            }
        };

        fetchDoctors();
    }, [user, initialData, setValue]);

    // Fetch patients for dropdown (for doctors)
    useEffect(() => {
        const fetchPatients = async () => {
            if (user?.role === 'doctor') {
                try {
                    setLoading(true);
                    const response = await axios.get('/clients');
                    console.log('Patients data:', response.data);
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
    }, [user]);

    // Handle doctor selection
    useEffect(() => {
        if (selectedDoctor && doctorsList.length > 0) {
            const doctor = doctorsList.find((doc) => doc.id_doc === parseInt(selectedDoctor));
            if (doctor) {
                setPrice(doctor.default_price || 0);
                setCurrencyCode(doctor.currency_code || 'EUR');
                setValue('price', doctor.default_price || 0);
                setValue('currency_code', doctor.currency_code || 'EUR');
            }
        }
    }, [selectedDoctor, doctorsList, setValue]);

    // Watch the form values
    const watchedValues = watch();

    // Handle time slot selection
    const handleTimeSlotSelect = (date, time) => {
        setSelectedDate(date);
        setSelectedTime(time);
    };

    // Handle form submission
    const handleFormSubmit = async (data) => {
        setIsLoading(true);
        setFormError(null);

        try {
            // Format date and time
            if (!selectedDate || !selectedTime) {
                throw new Error('Please select a date and time for the appointment');
            }

            // Parse time string to Date object
            const timeParts = selectedTime.split(':');
            const dateTime = set(selectedDate, {
                hours: parseInt(timeParts[0], 10),
                minutes: parseInt(timeParts[1], 10),
                seconds: 0,
                milliseconds: 0
            });

            // Ensure currency_code is set
            if (!data.currency_code) {
                data.currency_code = currencyCode || 'EUR';
            }

            // Prepare appointment data
            const appointmentData = {
                ...data,
                date: dateTime.toISOString(),
                id_doc: parseInt(data.id_doc, 10),
                id_clt: parseInt(data.id_clt, 10),
                price: parseInt(data.price, 10),
                currency_code: data.currency_code
            };

            console.log('Submitting appointment data:', appointmentData);

            await onSubmit(appointmentData);

            // Reset form if it's a new appointment (no initialData)
            if (!initialData) {
                reset();
                setSelectedDate(new Date());
                setSelectedTime(null);
            }
        } catch (error) {
            setFormError(error.response?.data?.message || error.message || 'An error occurred while saving the appointment');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {formError && (
                <Alert
                    type="error"
                    message={formError}
                    className="mb-4"
                />
            )}

            {/* Patient selection for doctors */}
            {user?.role === 'doctor' && (
                <div className="mb-4">
                    <label htmlFor="id_clt" className="label">
                        Patient <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                        id="id_clt"
                        name="id_clt"
                        className={`input ${errors.id_clt ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        aria-invalid={errors.id_clt ? 'true' : 'false'}
                        aria-describedby={errors.id_clt ? 'id_clt-error' : undefined}
                        disabled={isLoading || loading}
                        {...register('id_clt', { required: 'Patient is required' })}
                    >
                        <option value="">Select a patient</option>
                        {patients && patients.map((patient) => (
                            <option key={patient.id_clt} value={patient.id_clt}>
                                {patient.nom}
                            </option>
                        ))}
                    </select>
                    {errors.id_clt && (
                        <p className="form-error" id="id_clt-error" role="alert">
                            {errors.id_clt.message}
                        </p>
                    )}
                    {loading && (
                        <p className="text-sm text-secondary-500 mt-1">Loading patients...</p>
                    )}
                </div>
            )}

            {/* FIXED: Doctor selection for clients */}
            {user?.role === 'client' && (
                <div className="mb-4">
                    <label htmlFor="id_doc" className="label">
                        Doctor <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                        id="id_doc"
                        name="id_doc"
                        className={`input ${errors.id_doc ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        aria-invalid={errors.id_doc ? 'true' : 'false'}
                        aria-describedby={errors.id_doc ? 'id_doc-error' : undefined}
                        disabled={isLoading || doctorsList.length === 0}
                        {...register('id_doc', { required: 'Doctor is required' })}
                        onChange={(e) => {
                            setValue('id_doc', e.target.value);
                            setSelectedDoctor(e.target.value);
                        }}
                    >
                        <option value="">Select a doctor</option>
                        {doctorsList.map((doctor) => (
                            <option key={doctor.id_doc} value={doctor.id_doc}>
                                {doctor.nom} ({doctor.specialite})
                            </option>
                        ))}
                    </select>
                    {errors.id_doc && (
                        <p className="form-error" id="id_doc-error" role="alert">
                            {errors.id_doc.message}
                        </p>
                    )}
                    {doctorsList.length === 0 && (
                        <p className="text-sm text-secondary-500 mt-1">Loading doctors...</p>
                    )}
                </div>
            )}

            <Input
                label="Description"
                name="description_rdv"
                placeholder="Describe the reason for this appointment"
                error={errors.description_rdv?.message}
                disabled={isLoading}
                {...register('description_rdv', {
                    required: 'Description is required',
                    minLength: {
                        value: 5,
                        message: 'Description must be at least 5 characters',
                    },
                })}
            />

            {initialData && (
                <Select
                    label="Status"
                    name="status"
                    required
                    error={errors.status?.message}
                    disabled={isLoading}
                    {...register('status', { required: 'Status is required' })}
                >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </Select>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Price"
                    name="price"
                    type="number"
                    placeholder="Appointment price"
                    value={watchedValues.price}
                    error={errors.price?.message}
                    disabled={isLoading}
                    {...register('price', {
                        required: 'Price is required',
                        valueAsNumber: true,
                        min: {
                            value: 0,
                            message: 'Price cannot be negative',
                        },
                    })}
                    onChange={(e) => {
                        setValue('price', e.target.value);
                    }}
                />

                <div className="mb-4">
                    <label htmlFor="currency_code" className="label">
                        Currency
                    </label>
                    <select
                        id="currency_code"
                        name="currency_code"
                        className="input"
                        disabled={isLoading}
                        {...register('currency_code')}
                        value={watchedValues.currency_code}
                        onChange={(e) => setValue('currency_code', e.target.value)}
                    >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                    Select Date and Time
                </h3>

                <TimeSlotPicker
                    doctorId={user?.role === 'client' ? selectedDoctor : user?.id}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectTimeSlot={handleTimeSlotSelect}
                />
            </div>

            <div className="pt-5">
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={isLoading || !selectedDate || !selectedTime}
                    >
                        {isLoading
                            ? initialData
                                ? 'Updating...'
                                : 'Creating...'
                            : initialData
                                ? 'Update Appointment'
                                : 'Create Appointment'}
                    </Button>
                </div>
            </div>
        </form>
    );
};