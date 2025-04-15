import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export const MFAForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [mfaError, setMfaError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { verifyMFA } = useAuth();
    const router = useRouter();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setMfaError(null);

        try {
            const result = await verifyMFA(data.token);

            if (result.success) {
                router.push('/dashboard');
            } else {
                setMfaError(result.error || 'Verification failed. Please try again.');
            }
        } catch (error) {
            setMfaError('An unexpected error occurred. Please try again.');
            console.error('MFA verification error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {mfaError && (
                <Alert
                    type="error"
                    message={mfaError}
                    className="mb-4"
                />
            )}

            <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">Two-Factor Authentication</h2>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Please enter the verification code from your authenticator app.
                </p>
            </div>

            <Input
                label="Verification Code"
                name="token"
                placeholder="Enter your 6-digit code"
                required
                error={errors.token?.message}
                {...register('token', {
                    required: 'Verification code is required',
                    pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Code must be 6 digits',
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
                {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
        </form>
    );
};
