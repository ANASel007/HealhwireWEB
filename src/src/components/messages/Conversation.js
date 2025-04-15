import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { FiSend } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const Conversation = ({ conversationId, onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Determine the receiver type based on user role
    const receiverType = user?.role === 'doctor' ? 'client' : 'doctor';

    // Fetch conversation messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!conversationId || !user) return;

            setLoading(true);
            try {
                // Fix for API endpoint - construct the URL correctly based on roles
                let url;
                if (user.role === 'doctor') {
                    // If user is a doctor, conversationId is the client ID
                    url = `/messages/conversation/doctor/${user.id}/client/${conversationId}`;
                } else {
                    // If user is a client, conversationId is the doctor ID
                    url = `/messages/conversation/doctor/${conversationId}/client/${user.id}`;
                }

                const response = await axios.get(url);
                setMessages(response.data);
            } catch (err) {
                console.error('Error fetching messages:', err);
                setError('Failed to load messages. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [conversationId, user]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Mark messages as read
    useEffect(() => {
        if (conversationId && user && messages && messages.length > 0) {
            const markAsRead = async () => {
                try {
                    await axios.put('/messages/read', {
                        senderId: conversationId,
                        senderType: receiverType
                    });
                } catch (error) {
                    console.error('Error marking messages as read:', error);
                }
            };

            markAsRead();
        }
    }, [conversationId, messages, user, receiverType]);

    // Handle message input change
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    // Handle send message
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        setIsSending(true);
        setError(null);

        try {
            const response = await axios.post('/messages/send', {
                receiverId: conversationId,
                receiverType,
                messageContent: message
            });

            setMessage('');

            // Refresh messages after sending
            if (user.role === 'doctor') {
                // If user is a doctor, conversationId is the client ID
                const url = `/messages/conversation/doctor/${user.id}/client/${conversationId}`;
                const messagesResponse = await axios.get(url);
                setMessages(messagesResponse.data);
            } else {
                // If user is a client, conversationId is the doctor ID
                const url = `/messages/conversation/doctor/${conversationId}/client/${user.id}`;
                const messagesResponse = await axios.get(url);
                setMessages(messagesResponse.data);
            }
        } catch (error) {
            setError(
                error.response?.data?.message || 'Failed to send message'
            );
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    if (!conversationId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-secondary-500 dark:text-secondary-400 p-6">
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="mt-1">Choose a conversation from the list to start messaging</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Mobile back button */}
            <div className="md:hidden p-3 border-b border-secondary-200 dark:border-secondary-700">
                <Button variant="secondary" onClick={onBack} className="text-sm">
                    Back to conversations
                </Button>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages && messages.length > 0 ? (
                    messages.map((msg) => {
                        const isSender = msg.sender_type === user.role && parseInt(msg.sender_id) === parseInt(user.id);

                        return (
                            <div
                                key={msg.id || msg.id_message}
                                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                                        isSender
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white'
                                    }`}
                                >
                                    <div className="text-sm">{msg.message_content || msg.content}</div>
                                    <div className={`text-xs mt-1 ${isSender ? 'text-primary-100' : 'text-secondary-500 dark:text-secondary-400'}`}>
                                        {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-secondary-500 dark:text-secondary-400">
                        <p className="text-lg font-medium">No messages yet</p>
                        <p className="mt-1">Send a message to start the conversation</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="border-t border-secondary-200 dark:border-secondary-700 p-4">
                {error && (
                    <div className="text-red-500 text-sm mb-2">{error}</div>
                )}
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={handleMessageChange}
                        className="flex-1"
                        disabled={isSending}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSending}
                        disabled={isSending || !message.trim()}
                    >
                        <FiSend className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
};