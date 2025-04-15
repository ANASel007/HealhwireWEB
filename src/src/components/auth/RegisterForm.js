import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';

export const RegisterForm = ({ userType = 'client' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [registerError, setRegisterError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const router = useRouter();

    // Sample specialties for doctors
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

    // Sample cities
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

    const onSubmit = async (data) => {
        setIsLoading(true);
        setRegisterError(null);

        try {
            const result = await registerUser(data, userType);

            if (result.success) {
                // Redirect based on user type
                const redirectPath = userType === 'doctor' ? '/dashboard' : '/dashboard';
                router.push(redirectPath);
            } else {
                setRegisterError(result.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setRegisterError('An unexpected error occurred. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {registerError && (
                <Alert
                    type="error"
                    message={registerError}
                    className="mb-4"
                />
            )}

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

            {userType === 'doctor' && (
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

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                </>
            )}

            <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                error={errors.password?.message}
                {...register('password', {
                    required: 'Password is required',
                    minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                    },
                })}
            />

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
            >
                {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
        </form>
    );
};