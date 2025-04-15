import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const MessageInput = ({ onSendMessage, isSending }) => {
    const [message, setMessage] = useState('');

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        onSendMessage(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
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
    );
};