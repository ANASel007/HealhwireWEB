import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardRedirect() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            if (user.role === 'doctor') {
                router.replace('/dashboard/doctor');
            } else if (user.role === 'client') {
                router.replace('/dashboard/client');
            }
        }
    }, [user, router]);

    return null;
}