import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { MFAForm } from '@/components/auth/MFAForm';
import { Card } from '@/components/ui/Card';
import { Layout } from '@/components/layout/Layout';

export default function MFAVerification() {
    const { isAuthenticated, mfaRequired } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect if already authenticated or if MFA is not required
        if (isAuthenticated) {
            router.push('/dashboard');
        } else if (!mfaRequired) {
            router.push('/login');
        }
    }, [isAuthenticated, mfaRequired, router]);

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary-50 dark:bg-secondary-900">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-secondary-900 dark:text-white">
                            Two-Factor Authentication
                        </h2>
                        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                            Please verify your identity to continue
                        </p>
                    </div>

                    <Card>
                        <MFAForm />

                        <div className="mt-6 text-center">
                            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                Back to login
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}