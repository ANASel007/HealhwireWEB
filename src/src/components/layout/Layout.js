import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export const Layout = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Check if the current route is a public route that doesn't need authentication
    const isPublicRoute = ['/login', '/register', '/register/client', '/register/doctor'].includes(router.pathname);

    // Show loading state if auth is still being determined
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    // Use simple layout for public pages and login
    if (isPublicRoute || !user) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </div>
        );
    }

    // Use dashboard layout for authenticated users
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1">
                <div className="hidden md:flex md:w-64">
                    <Sidebar />
                </div>
                <main className="flex-1 overflow-auto bg-secondary-50 dark:bg-secondary-900">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};