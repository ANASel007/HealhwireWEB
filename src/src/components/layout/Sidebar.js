import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import {
    FiHome,
    FiCalendar,
    FiMessageSquare,
    FiFileText,
    FiUsers,
    FiSettings,
    FiActivity,
    FiList
} from 'react-icons/fi';

export const Sidebar = () => {
    const { user } = useAuth();
    const router = useRouter();

    // Return null if no user is authenticated
    if (!user) return null;

    // Define navigation items based on user role
    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: FiHome,
            current: router.pathname === '/dashboard',
        },
        {
            name: 'Appointments',
            href: '/appointments',
            icon: FiCalendar,
            current: router.pathname.startsWith('/appointments'),
        },
        {
            name: 'Messages',
            href: '/messages',
            icon: FiMessageSquare,
            current: router.pathname.startsWith('/messages'),
        },
    ];

    // Doctor-specific navigation items
    if (user.role === 'doctor') {
        navigation.push(
            {
                name: 'Prescriptions',
                href: '/prescriptions',
                icon: FiFileText,
                current: router.pathname.startsWith('/prescriptions'),
            },
            {
                name: 'My Patients',
                href: '/patients',
                icon: FiUsers,
                current: router.pathname.startsWith('/patients'),
            }
        );
    }

    // Client-specific navigation items
    if (user.role === 'client') {
        navigation.push(
            {
                name: 'Medical Records',
                href: '/medical-records',
                icon: FiActivity,
                current: router.pathname.startsWith('/medical-records'),
            },
            {
                name: 'My Prescriptions',
                href: '/prescriptions',
                icon: FiList,
                current: router.pathname.startsWith('/prescriptions'),
            }
        );
    }

    // Add settings to both roles
    navigation.push({
        name: 'Settings',
        href: '/profile/settings',
        icon: FiSettings,
        current: router.pathname.startsWith('/profile/settings'),
    });

    return (
        <div className="h-full flex flex-col border-r border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 px-4 flex items-center">
                    <Link href="/dashboard" className="text-xl font-bold text-primary-600">
                        HealthWire
                    </Link>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`${
                                item.current
                                    ? 'bg-primary-50 dark:bg-secondary-900 text-primary-600 dark:text-white'
                                    : 'text-secondary-600 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-700'
                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                            aria-current={item.current ? 'page' : undefined}
                        >
                            <item.icon
                                className={`${
                                    item.current
                                        ? 'text-primary-600 dark:text-white'
                                        : 'text-secondary-400 group-hover:text-secondary-500 dark:text-secondary-400 dark:group-hover:text-secondary-300'
                                } mr-3 flex-shrink-0 h-5 w-5`}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-secondary-200 dark:border-secondary-700 p-4">
                <Link href="/profile" className="flex-shrink-0 w-full group block">
                    <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-primary-200 flex items-center justify-center text-primary-600">
                            <span className="text-sm font-medium">{user.nom.charAt(0)}</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-secondary-700 dark:text-white">{user.nom}</p>
                            <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 capitalize">
                                {user.role}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};
