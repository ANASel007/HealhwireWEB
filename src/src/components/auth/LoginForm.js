import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export const LoginForm = ({ userType = 'client' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, mfaRequired } = useAuth();
    const router = useRouter();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setLoginError(null);

        try {
            const result = await login(data.email, data.password, userType);

            if (result.success) {
                // Redirect based on user type
                const redirectPath = userType === 'doctor' ? '/dashboard' : '/dashboard';
                router.push(redirectPath);
            } else if (result.mfaRequired) {
                // Handle MFA if needed
                router.push('/mfa-verification');
            } else {
                setLoginError(result.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            setLoginError('An unexpected error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {loginError && (
                <Alert
                    type="error"
                    message={loginError}
                    className="mb-4"
                />
            )}

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

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-900 dark:text-secondary-300">
                        Remember me
                    </label>
                </div>

                <div className="text-sm">
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                        Forgot your password?
                    </a>
                </div>
            </div>

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
        </form>
    );
};
