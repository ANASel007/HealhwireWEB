import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { FiMenu, FiX, FiUser, FiBell, FiLogOut } from 'react-icons/fi';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

    const closeMenus = () => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-secondary-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" aria-label="HealthWire Home" onClick={closeMenus}>
                                <span className="text-xl font-bold text-primary-600">HealthWire</span>
                            </Link>
                        </div>
                    </div>

                    {user ? (
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            {/* Desktop Navigation Links */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/dashboard"
                                    className={`${
                                        router.pathname === '/dashboard'
                                            ? 'border-primary-500 text-secondary-900 dark:text-white'
                                            : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-white'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/appointments"
                                    className={`${
                                        router.pathname.startsWith('/appointments')
                                            ? 'border-primary-500 text-secondary-900 dark:text-white'
                                            : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-white'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Appointments
                                </Link>
                                <Link
                                    href="/messages"
                                    className={`${
                                        router.pathname.startsWith('/messages')
                                            ? 'border-primary-500 text-secondary-900 dark:text-white'
                                            : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-white'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Messages
                                </Link>
                                {user.role === 'doctor' && (
                                    <Link
                                        href="/prescriptions"
                                        className={`${
                                            router.pathname.startsWith('/prescriptions')
                                                ? 'border-primary-500 text-secondary-900 dark:text-white'
                                                : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-white'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                    >
                                        Prescriptions
                                    </Link>
                                )}
                                {user.role === 'client' && (
                                    <Link
                                        href="/medical-records"
                                        className={`${
                                            router.pathname.startsWith('/medical-records')
                                                ? 'border-primary-500 text-secondary-900 dark:text-white'
                                                : 'border-transparent text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-white'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                    >
                                        Medical Records
                                    </Link>
                                )}
                            </div>

                            {/* Notification Icon */}
                            <button
                                className="p-1 ml-3 rounded-full text-secondary-400 hover:text-secondary-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                aria-label="Notifications"
                            >
                                <FiBell className="h-6 w-6" />
                            </button>

                            {/* Profile Dropdown */}
                            <div className="ml-3 relative">
                                <div>
                                    <button
                                        onClick={toggleProfileMenu}
                                        className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        id="user-menu"
                                        aria-haspopup="true"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-600">
                                            <FiUser className="h-5 w-5" />
                                        </div>
                                    </button>
                                </div>

                                {isProfileMenuOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-secondary-800 ring-1 ring-black ring-opacity-5"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu"
                                    >
                                        <div className="px-4 py-2 text-sm text-secondary-500 dark:text-secondary-400">
                                            Signed in as
                                            <p className="font-medium text-secondary-900 dark:text-white truncate">
                                                {user.nom}
                                            </p>
                                        </div>

                                        <hr className="border-secondary-200 dark:border-secondary-700" />

                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                                            role="menuitem"
                                            onClick={closeMenus}
                                        >
                                            Your Profile
                                        </Link>
                                        <Link
                                            href="/profile/settings"
                                            className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                                            role="menuitem"
                                            onClick={closeMenus}
                                        >
                                            Settings
                                        </Link>

                                        <hr className="border-secondary-200 dark:border-secondary-700" />

                                        <button
                                            onClick={logout}
                                            className="w-full text-left block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                                            role="menuitem"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                            <Link
                                href="/login"
                                className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-white px-3 py-2 text-sm font-medium"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register/client"
                                className="btn btn-primary"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                            {isMenuOpen ? (
                                <FiX className="block h-6 w-6" />
                            ) : (
                                <FiMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    {user ? (
                        <div className="pt-2 pb-3 space-y-1">
                            <Link
                                href="/dashboard"
                                className={`${
                                    router.pathname === '/dashboard'
                                        ? 'bg-primary-50 dark:bg-secondary-900 border-primary-500 text-primary-700 dark:text-white'
                                        : 'border-transparent text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-700 dark:hover:text-white'
                                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                                onClick={closeMenus}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/appointments"
                                className={`${
                                    router.pathname.startsWith('/appointments')
                                        ? 'bg-primary-50 dark:bg-secondary-900 border-primary-500 text-primary-700 dark:text-white'
                                        : 'border-transparent text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-700 dark:hover:text-white'
                                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                                onClick={closeMenus}
                            >
                                Appointments
                            </Link>
                            <Link
                                href="/messages"
                                className={`${
                                    router.pathname.startsWith('/messages')
                                        ? 'bg-primary-50 dark:bg-secondary-900 border-primary-500 text-primary-700 dark:text-white'
                                        : 'border-transparent text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-700 dark:hover:text-white'
                                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                                onClick={closeMenus}
                            >
                                Messages
                            </Link>
                            {user.role === 'doctor' && (
                                <Link
                                    href="/prescriptions"
                                    className={`${
                                        router.pathname.startsWith('/prescriptions')
                                            ? 'bg-primary-50 dark:bg-secondary-900 border-primary-500 text-primary-700 dark:text-white'
                                            : 'border-transparent text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-700 dark:hover:text-white'
                                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                                    onClick={closeMenus}
                                >
                                    Prescriptions
                                </Link>
                            )}
                            {user.role === 'client' && (
                                <Link
                                    href="/medical-records"
                                    className={`${
                                        router.pathname.startsWith('/medical-records')
                                            ? 'bg-primary-50 dark:bg-secondary-900 border-primary-500 text-primary-700 dark:text-white'
                                            : 'border-transparent text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-700 dark:hover:text-white'
                                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                                    onClick={closeMenus}
                                >
                                    Medical Records
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="pt-2 pb-3 space-y-1">
                            <Link
                                href="/login"
                                className="border-transparent text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                onClick={closeMenus}
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register/client"
                                className="border-transparent text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-700 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                onClick={closeMenus}
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {user && (
                        <div className="pt-4 pb-3 border-t border-secondary-200 dark:border-secondary-700">
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-600">
                                        <FiUser className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-secondary-800 dark:text-white">{user.nom}</div>
                                    <div className="text-sm font-medium text-secondary-500 dark:text-secondary-400">{user.email}</div>
                                </div>
                                <button
                                    className="ml-auto flex-shrink-0 bg-white dark:bg-secondary-800 p-1 rounded-full text-secondary-400 hover:text-secondary-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    aria-label="Notifications"
                                >
                                    <FiBell className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="mt-3 space-y-1">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-white dark:hover:bg-secondary-700"
                                    onClick={closeMenus}
                                >
                                    Your Profile
                                </Link>
                                <Link
                                    href="/profile/settings"
                                    className="block px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-white dark:hover:bg-secondary-700"
                                    onClick={closeMenus}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-left block px-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-800 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-white dark:hover:bg-secondary-700"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};
