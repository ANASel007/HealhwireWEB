import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Conversation } from '@/components/messages/Conversation';

export default function MessageDetail() {
    const { user } = useAuth();
    const router = useRouter();
    const { id } = router.query;

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user || !id) return null;

    return (
        <Layout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
                            Conversation
                        </h1>
                        <Button
                            variant="secondary"
                            onClick={() => router.push('/messages')}
                        >
                            Back to All Messages
                        </Button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <Card className="p-0 overflow-hidden">
                        <div className="h-[calc(80vh-100px)]">
                            <Conversation conversationId={id} />
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}