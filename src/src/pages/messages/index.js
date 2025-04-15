import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { ConversationList } from '@/components/messages/ConversationList';
import { Conversation } from '@/components/messages/Conversation';

export default function Messages() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isMobileListVisible, setIsMobileListVisible] = useState(true);

    // Handle conversation selection
    const handleSelectConversation = (conversationId) => {
        setSelectedConversation(conversationId);
        setIsMobileListVisible(false);
    };

    // Handle back button on mobile
    const handleBackToList = () => {
        setIsMobileListVisible(true);
    };

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                        Messages
                    </h1>
                    <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                        Communicate with your {user.role === 'doctor' ? 'patients' : 'doctors'}
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <Card className="p-0 overflow-hidden">
                        <div className="flex h-[calc(80vh-100px)]">
                            {/* Conversation List - hidden on mobile when a conversation is selected */}
                            <div
                                className={`${
                                    isMobileListVisible ? 'block' : 'hidden'
                                } md:block w-full md:w-1/3 lg:w-1/4 border-r border-secondary-200 dark:border-secondary-700 p-4 overflow-y-auto`}
                            >
                                <ConversationList
                                    onSelectConversation={handleSelectConversation}
                                    selectedId={selectedConversation}
                                />
                            </div>

                            {/* Conversation - hidden on mobile when list is shown */}
                            <div
                                className={`${
                                    isMobileListVisible ? 'hidden' : 'block'
                                } md:block flex-1 flex flex-col`}
                            >
                                <Conversation
                                    conversationId={selectedConversation}
                                    onBack={handleBackToList}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}