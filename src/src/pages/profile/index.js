import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiMapPin, FiTag } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';

export default function Profile() {
    const { user, getCurrentUser } = useAuth();
    const { showNotification } = useNotifications();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            nom: user?.nom || '',
            ville: user?.ville || '',
            email: user?.email || '',
            telephone: user?.telephone || '',
            imageurl: user?.imageurl || '',
            specialite: user?.specialite || '',
            default_price: user?.default_price || '',
            currency_code: user?.currency_code || 'EUR'
        }
    });

    // Handle form submission
    const onSubmit = async (data) => {
        setIsLoading(true);
        setUpdateError(null);

        try {
            const endpoint = user?.role === 'doctor'
                ? `/doctors/${user.id}`
                : `/clients/${user.id}`;

            await axios.put(endpoint, data);
            await getCurrentUser();
            showNotification('Profile updated successfully', 'success');
            setIsEditing(false);
        } catch (error) {
            setUpdateError(
                error.response?.data?.message || 'Failed to update profile'
            );
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form cancel
    const handleCancel = () => {
        reset({
            nom: user?.nom || '',
            ville: user?.ville || '',
            email: user?.email || '',
            telephone: user?.telephone || '',
            imageurl: user?.imageurl || '',
            specialite: user?.specialite || '',
            default_price: user?.default_price || '',
            currency_code: user?.currency_code || 'EUR'
        });
        setIsEditing(false);
        setUpdateError(null);
    };

    // List of French cities
    const cities = [
        { value: 'Paris', label: 'Paris' },
        { value: 'Lyon', label: 'Lyon' },
        { value: 'Marseille', label: 'Marseille' },
        { value: 'Bordeaux', label: 'Bordeaux' },
        { value: 'Lille', label: 'Lille' },
        { value: 'Toulouse', label: 'Toulouse' },
        { value: 'Nice', label: 'Nice' },
        { value: 'Nantes', label: 'Nantes' },
        { value: 'Strasbourg', label: 'Strasbourg' },
        { value: 'Montpellier', label: 'Montpellier' },
    ];

    // List of specialties for doctors
    const specialties = [
        { value: 'Cardiology', label: 'Cardiology' },
        { value: 'Dermatology', label: 'Dermatology' },
        { value: 'Neurology', label: 'Neurology' },
        { value: 'Pediatrics', label: 'Pediatrics' },
        { value: 'Psychiatry', label: 'Psychiatry' },
        { value: 'Orthopedics', label: 'Orthopedics' },
        { value: 'Gynecology', label: 'Gynecology' },
        { value: 'Internal Medicine', label: 'Internal Medicine' },
        { value: 'Ophthalmology', label: 'Ophthalmology' },
        { value: 'Urology', label: 'Urology' },
    ];

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                        My Profile
                    </h1>
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                        View and manage your profile information
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <Card>
                        {updateError && (
                            <Alert
                                type="error"
                                message={updateError}
                                className="mb-6"
                            />
                        )}

                        {isEditing ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Full Name"
                                        name="nom"
                                        placeholder="Enter your full name"
                                        required
                                        error={errors.nom?.message}
                                        {...register('nom', {
                                            required: 'Full name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'Name must be at least 2 characters',
                                            },
                                        })}
                                    />

                                    <Select
                                        label="City"
                                        name="ville"
                                        options={cities}
                                        required
                                        error={errors.ville?.message}
                                        {...register('ville', {
                                            required: 'City is required',
                                        })}
                                    />

                                    <Input
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                        error={errors.email?.message}
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                    />

                                    <Input
                                        label="Phone Number"
                                        name="telephone"
                                        placeholder="Enter your phone number"
                                        required
                                        error={errors.telephone?.message}
                                        {...register('telephone', {
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^\+?[0-9]{10,15}$/,
                                                message: 'Invalid phone number',
                                            },
                                        })}
                                    />

                                    <Input
                                        label="Profile Image URL"
                                        name="imageurl"
                                        placeholder="Enter URL for your profile image (optional)"
                                        error={errors.imageurl?.message}
                                        {...register('imageurl', {
                                            pattern: {
                                                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                                message: 'Invalid URL',
                                            },
                                        })}
                                    />

                                    {user.role === 'doctor' && (
                                        <>
                                            <Select
                                                label="Specialty"
                                                name="specialite"
                                                options={specialties}
                                                required
                                                error={errors.specialite?.message}
                                                {...register('specialite', {
                                                    required: 'Specialty is required',
                                                })}
                                            />

                                            <Input
                                                label="Default Price"
                                                type="number"
                                                name="default_price"
                                                placeholder="Enter your default consultation price"
                                                error={errors.default_price?.message}
                                                {...register('default_price', {
                                                    valueAsNumber: true,
                                                    min: {
                                                        value: 0,
                                                        message: 'Price cannot be negative',
                                                    },
                                                })}
                                            />

                                            <Select
                                                label="Currency"
                                                name="currency_code"
                                                options={[
                                                    { value: 'EUR', label: 'EUR (€)' },
                                                    { value: 'USD', label: 'USD ($)' },
                                                    { value: 'GBP', label: 'GBP (£)' },
                                                ]}
                                                error={errors.currency_code?.message}
                                                {...register('currency_code')}
                                            />
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleCancel}
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
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300 text-2xl font-semibold">
                                            {user.nom?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                                                {user.nom}
                                            </h2>
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400 capitalize">
                                                {user.role}
                                                {user.role === 'doctor' && user.specialite && ` - ${user.specialite}`}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                                        Edit Profile
                                    </Button>
                                </div>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <FiUser className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Full Name</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {user.nom}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FiMapPin className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">City</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {user.ville || 'Not specified'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FiMail className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Email</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FiPhone className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Phone</h4>
                                                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {user.telephone || 'Not specified'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {user.role === 'doctor' && (
                                        <div className="space-y-6">
                                            <div className="flex items-start">
                                                <FiTag className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                <div>
                                                    <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Specialty</h4>
                                                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                        {user.specialite || 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <FiTag className="mt-1 mr-3 h-5 w-5 text-secondary-500 dark:text-secondary-400" />
                                                <div>
                                                    <h4 className="text-sm font-medium text-secondary-900 dark:text-white">Default Price</h4>
                                                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                        {user.default_price
                                                            ? new Intl.NumberFormat('fr-FR', {
                                                                style: 'currency',
                                                                currency: user.currency_code || 'EUR',
                                                            }).format(user.default_price)
                                                            : 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                        Account Actions
                                    </h3>
                                    <div className="flex space-x-3">
                                        <Button
                                            variant="secondary"
                                            onClick={() => router.push('/profile/settings')}
                                        >
                                            Security Settings
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => router.push('/profile/settings')}
                                        >
                                            Change Password
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    );
}