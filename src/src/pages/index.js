import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { FiCalendar, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';

export default function Home() {
    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative bg-white dark:bg-secondary-900 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white dark:bg-secondary-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <svg
                            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-secondary-900 transform translate-x-1/2"
                            fill="currentColor"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <polygon points="50,0 100,0 50,100 0,100" />
                        </svg>

                        <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-secondary-900 dark:text-white sm:text-5xl md:text-6xl">
                                    <span className="block">Streamlined healthcare</span>{' '}
                                    <span className="block text-primary-600">for everyone</span>
                                </h1>
                                <p className="mt-3 text-base text-secondary-500 dark:text-secondary-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    HealthWire connects doctors and patients, making healthcare more accessible and efficient.
                                    Manage appointments, medical records, and communications all in one place.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link href="/register/client">
                                            <Button
                                                variant="primary"
                                                className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10"
                                            >
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link href="/login">
                                            <Button
                                                variant="secondary"
                                                className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10"
                                            >
                                                Log In
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="h-56 w-full bg-primary-200 dark:bg-primary-900 sm:h-72 md:h-96 lg:w-full lg:h-full">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-primary-700 dark:text-primary-300 text-xl font-semibold">
                                Medical illustration placeholder
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white dark:bg-secondary-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
                            Features
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
                            A better way to manage healthcare
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-secondary-500 dark:text-secondary-400 lg:mx-auto">
                            HealthWire provides tools for both doctors and patients to make healthcare more efficient and accessible.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    <FiCalendar className="h-6 w-6" />
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                                    Easy Appointment Scheduling
                                </p>
                                <p className="mt-2 ml-16 text-base text-secondary-500 dark:text-secondary-400">
                                    Book, reschedule, or cancel appointments with just a few clicks. Get reminders and real-time updates.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    <FiMessageSquare className="h-6 w-6" />
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                                    Secure Messaging
                                </p>
                                <p className="mt-2 ml-16 text-base text-secondary-500 dark:text-secondary-400">
                                    Communicate directly with your doctor or patients through our secure messaging platform.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    <FiShield className="h-6 w-6" />
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                                    Digital Medical Records
                                </p>
                                <p className="mt-2 ml-16 text-base text-secondary-500 dark:text-secondary-400">
                                    Access and manage your medical history, prescriptions, and test results securely in one place.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    <FiUsers className="h-6 w-6" />
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                                    Find the Right Doctor
                                </p>
                                <p className="mt-2 ml-16 text-base text-secondary-500 dark:text-secondary-400">
                                    Search for doctors by specialty, location, or availability to find the perfect match for your needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary-50 dark:bg-primary-900">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-secondary-900 dark:text-white sm:text-4xl">
                        <span className="block">Ready to get started?</span>
                        <span className="block text-primary-600 dark:text-primary-300">
              Join HealthWire today.
            </span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <Link href="/register/client">
                                <Button
                                    variant="primary"
                                    className="px-5 py-3 text-base font-medium"
                                >
                                    Sign up as Patient
                                </Button>
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex rounded-md shadow">
                            <Link href="/register/doctor">
                                <Button
                                    variant="secondary"
                                    className="px-5 py-3 text-base font-medium"
                                >
                                    Sign up as Doctor
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}