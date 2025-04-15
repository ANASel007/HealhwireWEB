import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/layout/Layout';

export default function Login() {
    const [userType, setUserType] = useState('client');
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary-50 dark:bg-secondary-900">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-secondary-900 dark:text-white">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                            Or{' '}
                            <Link href={`/register/${userType}`} className="font-medium text-primary-600 hover:text-primary-500">
                                create a new account
                            </Link>
                        </p>
                    </div>

                    <Card>
                        <div className="flex space-x-2 mb-6">
                            <Button
                                variant={userType === 'client' ? 'primary' : 'secondary'}
                                className="flex-1"
                                onClick={() => setUserType('client')}
                            >
                                I'm a Patient
                            </Button>
                            <Button
                                variant={userType === 'doctor' ? 'primary' : 'secondary'}
                                className="flex-1"
                                onClick={() => setUserType('doctor')}
                            >
                                I'm a Doctor
                            </Button>
                        </div>

                        <LoginForm userType={userType} />
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
