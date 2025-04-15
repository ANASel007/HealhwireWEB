import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card } from '@/components/ui/Card';
import { Layout } from '@/components/layout/Layout';

export default function RegisterDoctor() {
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
                            Create your doctor account
                        </h2>
                        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                Sign in
                            </Link>
                        </p>
                        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                            Are you a patient?{' '}
                            <Link href="/register/client" className="font-medium text-primary-600 hover:text-primary-500">
                                Register as a patient
                            </Link>
                        </p>
                    </div>

                    <Card>
                        <RegisterForm userType="doctor" />
                    </Card>
                </div>
            </div>
        </Layout>
    );
}