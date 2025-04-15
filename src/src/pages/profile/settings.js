import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FiLock, FiBell, FiShield } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import axios from '@/lib/axios';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export default function ProfileSettings() {
    const { user } = useAuth();
    const { showNotification } = useNotifications();
    const router = useRouter();

    // Password change state
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);

    // MFA state
    const [isMfaEnabled, setIsMfaEnabled] = useState(false);
    const [showMfaQrCode, setShowMfaQrCode] = useState(false);
    const [mfaSecret, setMfaSecret] = useState(null);
    const [mfaQrCode, setMfaQrCode] = useState(null);
    const [mfaError, setMfaError] = useState(null);

    // Notification preferences state
    const [notificationPrefs, setNotificationPrefs] = useState({
        email_enabled: true,
        sms_enabled: false,
        push_enabled: false,
        appointment_reminders: true,
        messages: true,
        prescription_updates: true
    });
    const [isUpdatingPrefs, setIsUpdatingPrefs] = useState(false);
    const [prefsError, setPrefsError] = useState(null);

    // Password form
    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        formState: { errors: passwordErrors }
    } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    // MFA verification form
    const {
        register: registerMfa,
        handleSubmit: handleMfaSubmit,
        reset: resetMfa,
        formState: { errors: mfaErrors }
    } = useForm({
        defaultValues: {
            mfaToken: ''
        }
    });

    // Fetch notification preferences
    React.useEffect(() => {
        if (user) {
            const fetchPreferences = async () => {
                try {
                    const response = await axios.get('/notifications/preferences');
                    setNotificationPrefs(response.data);
                } catch (error) {
                    console.error('Error fetching notification preferences:', error);
                }
            };

            fetchPreferences();
        }
    }, [user]);

    // Handle password change
    const onPasswordSubmit = async (data) => {
        setIsChangingPassword(true);
        setPasswordError(null);

        if (data.newPassword !== data.confirmPassword) {
            setPasswordError('New passwords do not match');
            setIsChangingPassword(false);
            return;
        }

        try {
            const endpoint = user?.role === 'doctor'
                ? `/doctors/${user.id}/password`
                : `/clients/${user.id}/password`;

            await axios.put(endpoint, {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });

            showNotification('Password updated successfully', 'success');
            resetPassword();
        } catch (error) {
            setPasswordError(
                error.response?.data?.message || 'Failed to update password'
            );
            console.error('Error updating password:', error);
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Handle enable MFA
    const handleEnableMfa = async () => {
        setMfaError(null);

        try {
            const response = await axios.post('/auth/enhanced/mfa/enable');
            setMfaSecret(response.data.secret);
            setMfaQrCode(response.data.qrCode);
            setShowMfaQrCode(true);
        } catch (error) {
            setMfaError(
                error.response?.data?.message || 'Failed to enable MFA'
            );
            console.error('Error enabling MFA:', error);
        }
    };

    // Handle verify MFA
    const onMfaVerify = async (data) => {
        setMfaError(null);

        try {
            await axios.post('/auth/enhanced/mfa/verify', {
                token: data.mfaToken
            });

            setIsMfaEnabled(true);
            setShowMfaQrCode(false);
            resetMfa();
            showNotification('MFA enabled successfully', 'success');
        } catch (error) {
            setMfaError(
                error.response?.data?.message || 'Failed to verify MFA token'
            );
            console.error('Error verifying MFA token:', error);
        }
    };

    // Handle disable MFA
    const handleDisableMfa = async () => {
        setMfaError(null);

        try {
            await axios.post('/auth/enhanced/mfa/disable');
            setIsMfaEnabled(false);
            showNotification('MFA disabled successfully', 'success');
        } catch (error) {
            setMfaError(
                error.response?.data?.message || 'Failed to disable MFA'
            );
            console.error('Error disabling MFA:', error);
        }
    };

    // Handle notification preferences update
    const handlePrefsChange = (e) => {
        const { name, checked } = e.target;
        setNotificationPrefs(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSavePrefs = async () => {
        setIsUpdatingPrefs(true);
        setPrefsError(null);

        try {
            await axios.put('/notifications/preferences', notificationPrefs);
            showNotification('Notification preferences updated', 'success');
        } catch (error) {
            setPrefsError(
                error.response?.data?.message || 'Failed to update notification preferences'
            );
            console.error('Error updating notification preferences:', error);
        } finally {
            setIsUpdatingPrefs(false);
        }
    };

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                        Account Settings
                    </h1>
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                        Manage your account security and preferences
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    {/* Password Settings */}
                    <Card
                        title="Password"
                        className="mb-6"
                        subtitle="Update your password to secure your account"
                    >
                        {passwordError && (
                            <Alert
                                type="error"
                                message={passwordError}
                                className="mb-4"
                            />
                        )}

                        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                            <div className="space-y-4">
                                <Input
                                    label="Current Password"
                                    name="currentPassword"
                                    type="password"
                                    required
                                    error={passwordErrors.currentPassword?.message}
                                    {...registerPassword('currentPassword', {
                                        required: 'Current password is required'
                                    })}
                                />

                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    required
                                    error={passwordErrors.newPassword?.message}
                                    {...registerPassword('newPassword', {
                                        required: 'New password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters'
                                        }
                                    })}
                                />

                                <Input
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    error={passwordErrors.confirmPassword?.message}
                                    {...registerPassword('confirmPassword', {
                                        required: 'Please confirm your new password'
                                    })}
                                />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full sm:w-auto"
                                    isLoading={isChangingPassword}
                                    disabled={isChangingPassword}
                                >
                                    <FiLock className="mr-2" />
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Two-Factor Authentication */}
                    <Card
                        title="Two-Factor Authentication"
                        className="mb-6"
                        subtitle="Add an extra layer of security to your account"
                    >
                        {mfaError && (
                            <Alert
                                type="error"
                                message={mfaError}
                                className="mb-4"
                            />
                        )}

                        {!isMfaEnabled && !showMfaQrCode && (
                            <div>
                                <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                                    Two-factor authentication adds an extra layer of security to your account. Once enabled, you'll need to enter a code from your authenticator app in addition to your password when signing in.
                                </p>

                                <Button
                                    variant="primary"
                                    onClick={handleEnableMfa}
                                >
                                    <FiShield className="mr-2" />
                                    Enable Two-Factor Authentication
                                </Button>
                            </div>
                        )}

                        {showMfaQrCode && (
                            <div>
                                <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                                    Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator) to set up two-factor authentication.
                                </p>

                                <div className="flex justify-center my-6">
                                    <div className="bg-white p-4 rounded-lg">
                                        <img src={mfaQrCode} alt="QR Code for MFA" />
                                    </div>
                                </div>

                                <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                                    If you can't scan the QR code, you can manually enter this code in your authenticator app:
                                </p>

                                <div className="bg-secondary-100 dark:bg-secondary-800 p-3 rounded-md font-mono text-center mb-6">
                                    {mfaSecret}
                                </div>

                                <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                                    Enter the verification code from your authenticator app to complete setup:
                                </p>

                                <form onSubmit={handleMfaSubmit(onMfaVerify)} className="mt-4">
                                    <Input
                                        label="Verification Code"
                                        name="mfaToken"
                                        placeholder="Enter 6-digit code"
                                        required
                                        error={mfaErrors.mfaToken?.message}
                                        {...registerMfa('mfaToken', {
                                            required: 'Verification code is required',
                                            pattern: {
                                                value: /^[0-9]{6}$/,
                                                message: 'Code must be 6 digits'
                                            }
                                        })}
                                    />

                                    <div className="mt-4 flex justify-end space-x-3">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setShowMfaQrCode(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                        >
                                            Verify
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {isMfaEnabled && (
                            <div>
                                <p className="text-green-600 dark:text-green-400 mb-4">
                                    Two-factor authentication is enabled for your account.
                                </p>

                                <Button
                                    variant="danger"
                                    onClick={handleDisableMfa}
                                >
                                    Disable Two-Factor Authentication
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Notification Preferences */}
                    <Card
                        title="Notification Preferences"
                        subtitle="Manage how you receive notifications"
                    >
                        {prefsError && (
                            <Alert
                                type="error"
                                message={prefsError}
                                className="mb-4"
                            />
                        )}

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                    Notification Methods
                                </h4>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            id="email_enabled"
                                            name="email_enabled"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                            checked={notificationPrefs.email_enabled}
                                            onChange={handlePrefsChange}
                                        />
                                        <label htmlFor="email_enabled" className="ml-3 text-secondary-700 dark:text-secondary-300">
                                            Email Notifications
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="sms_enabled"
                                            name="sms_enabled"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                            checked={notificationPrefs.sms_enabled}
                                            onChange={handlePrefsChange}
                                        />
                                        <label htmlFor="sms_enabled" className="ml-3 text-secondary-700 dark:text-secondary-300">
                                            SMS Notifications
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="push_enabled"
                                            name="push_enabled"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                            checked={notificationPrefs.push_enabled}
                                            onChange={handlePrefsChange}
                                        />
                                        <label htmlFor="push_enabled" className="ml-3 text-secondary-700 dark:text-secondary-300">
                                            Push Notifications
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                                    Notification Types
                                </h4>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            id="appointment_reminders"
                                            name="appointment_reminders"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                            checked={notificationPrefs.appointment_reminders}
                                            onChange={handlePrefsChange}
                                        />
                                        <label htmlFor="appointment_reminders" className="ml-3 text-secondary-700 dark:text-secondary-300">
                                            Appointment Reminders
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="messages"
                                            name="messages"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                            checked={notificationPrefs.messages}
                                            onChange={handlePrefsChange}
                                        />
                                        <label htmlFor="messages" className="ml-3 text-secondary-700 dark:text-secondary-300">
                                            New Messages
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            id="prescription_updates"
                                            name="prescription_updates"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                                            checked={notificationPrefs.prescription_updates}
                                            onChange={handlePrefsChange}
                                        />
                                        <label htmlFor="prescription_updates" className="ml-3 text-secondary-700 dark:text-secondary-300">
                                            Prescription Updates
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5">
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={handleSavePrefs}
                                        isLoading={isUpdatingPrefs}
                                        disabled={isUpdatingPrefs}
                                    >
                                        <FiBell className="mr-2" />
                                        Save Preferences
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}