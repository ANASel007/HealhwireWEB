import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/register/client', '/register/doctor'];

export default function App({ Component, pageProps }) {
    const router = useRouter();

    // Check if the current route is public
    const isPublicRoute = publicRoutes.includes(router.pathname);

    return (
        <>
            <Head>
                <title>HealthWire Medical System</title>
                <meta name="description" content="Connect doctors and patients for better healthcare" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <AuthProvider>
                <NotificationProvider>
                    <Component {...pageProps} />
                    <ToastContainer />
                </NotificationProvider>
            </AuthProvider>
        </>
    );
}
