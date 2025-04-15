// src/pages/patients/index.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiSearch, FiUserPlus, FiFileText, FiActivity, FiCalendar } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Table } from '@/components/ui/Table';

export default function Patients() {
    const { user } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);

    // Fetch all patients/clients of the doctor
    const {
        data: patients,
        loading,
        error
    } = useFetch(user?.role === 'doctor' ? '/clients' : null);

    // Filter patients based on search term
    useEffect(() => {
        if (!patients) return;

        if (!searchTerm) {
            setFilteredPatients(patients);
            return;
        }

        const filtered = patients.filter(patient => {
            const fullName = patient.nom.toLowerCase();
            const email = patient.email.toLowerCase();
            const ville = patient.ville?.toLowerCase() || '';
            const searchLower = searchTerm.toLowerCase();

            return fullName.includes(searchLower) ||
                email.includes(searchLower) ||
                ville.includes(searchLower);
        });

        setFilteredPatients(filtered);
    }, [patients, searchTerm]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Set up patient table columns
    const patientColumns = [
        {
            header: 'Name',
            accessor: 'nom',
        },
        {
            header: 'City',
            accessor: 'ville',
        },
        {
            header: 'Email',
            accessor: 'email',
        },
        {
            header: 'Phone',
            accessor: 'telephone',
        },
        {
            header: 'Actions',
            accessor: 'id_clt',
            render: (patient) => (
                <div className="flex space-x-2">
                    <Link href={`/medical-records/${patient.id_clt}`}>
                        <Button variant="secondary" className="px-2 py-1 text-xs">
                            <FiActivity className="h-3 w-3 mr-1" />
                            Records
                        </Button>
                    </Link>
                    <Link href={`/appointments/new?clientId=${patient.id_clt}`}>
                        <Button variant="primary" className="px-2 py-1 text-xs">
                            <FiCalendar className="h-3 w-3 mr-1" />
                            Appointment
                        </Button>
                    </Link>
                    <Link href={`/prescriptions/new?clientId=${patient.id_clt}`}>
                        <Button variant="outline" className="px-2 py-1 text-xs">
                            <FiFileText className="h-3 w-3 mr-1" />
                            Prescription
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    // Redirect if not authenticated or not a doctor
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'doctor') {
            router.push('/dashboard');
        }
    }, [user, router]);

    if (!user || user.role !== 'doctor') return null;

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                                My Patients
                            </h1>
                            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                View and manage your patients
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Button
                                variant="primary"
                                onClick={() => router.push('/patients/invite')}
                            >
                                <FiUserPlus className="mr-2" />
                                Add New Patient
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6">
                        {error && (
                            <Alert
                                type="error"
                                message="Failed to load patients. Please try again later."
                                className="mb-6"
                            />
                        )}

                        <Card>
                            <div className="mb-6">
                                <Input
                                    placeholder="Search patients by name, email, or city..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    prefix={<FiSearch className="text-secondary-400" />}
                                />
                            </div>

                            {loading ? (
                                <div className="py-8 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                                    <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                                        Loading patients...
                                    </p>
                                </div>
                            ) : filteredPatients?.length > 0 ? (
                                <Table
                                    columns={patientColumns}
                                    data={filteredPatients}
                                    emptyMessage="No patients found."
                                />
                            ) : (
                                <div className="py-8 text-center">
                                    <FiUserPlus className="mx-auto h-12 w-12 text-secondary-400" />
                                    <h3 className="mt-2 text-sm font-medium text-secondary-900 dark:text-white">
                                        No patients
                                    </h3>
                                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                        {searchTerm ? 'No patients match your search criteria.' : 'You don\'t have any patients yet.'}
                                    </p>
                                    {!searchTerm && (
                                        <div className="mt-6">
                                            <Button
                                                variant="primary"
                                                onClick={() => router.push('/patients/invite')}
                                            >
                                                <FiUserPlus className="mr-2" />
                                                Add New Patient
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
