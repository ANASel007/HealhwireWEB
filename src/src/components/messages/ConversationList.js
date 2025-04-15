import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FiSearch } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { Input } from '@/components/ui/Input';
import { truncateText } from '@/utils/helpers';

export const ConversationList = ({ onSelectConversation, selectedId }) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch conversations based on user role
    useEffect(() => {
        const fetchConversations = async () => {
            if (!user) return;

            setLoading(true);
            try {
                // Use the correct endpoint based on user role
                const endpoint = user.role === 'doctor'
                    ? `/messages/doctor/${user.id}/conversations`
                    : `/messages/client/${user.id}/conversations`;

                const response = await axios.get(endpoint);
                setConversations(response.data);
            } catch (err) {
                console.error('Error fetching conversations:', err);
                setError('Failed to load conversations');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [user]);

    // Filter conversations based on search term
    useEffect(() => {
        if (!conversations) return;

        if (!searchTerm) {
            setFilteredConversations(conversations);
            return;
        }

        const filtered = conversations.filter(conversation => {
            // Handle both client and doctor name formats
            const name = user?.role === 'doctor'
                ? conversation.client_name || conversation.nom
                : conversation.doctor_name || conversation.nom;

            return name && name.toLowerCase().includes(searchTerm.toLowerCase());
        });

        setFilteredConversations(filtered);
    }, [conversations, searchTerm, user]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-4">
                {error}
            </div>
        );
    }

    if (!conversations || conversations.length === 0) {
        return (
            <div className="text-center py-12 text-secondary-500 dark:text-secondary-400">
                <p className="text-lg font-medium">No conversations yet</p>
                <p className="mt-1">Start a new conversation with a {user?.role === 'doctor' ? 'patient' : 'doctor'}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    prefix={<FiSearch className="text-secondary-400" />}
                />
            </div>

            <div className="space-y-1">
                {filteredConversations.map((conversation) => {
                    // Handle both data formats from the controller
                    const conversationId = user?.role === 'doctor'
                        ? conversation.client_id || conversation.id_clt
                        : conversation.doctor_id || conversation.id_doc;

                    const name = user?.role === 'doctor'
                        ? conversation.client_name || conversation.nom
                        : conversation.doctor_name || conversation.nom;

                    const specialite = user?.role === 'client'
                        ? conversation.doctor_speciality || conversation.specialite
                        : null;

                    const lastMessage = conversation.last_message || conversation.message_content;
                    const unreadCount = conversation.unread_count || 0;
                    const lastMessageDate = conversation.last_message_date || conversation.created_at;

                    const isSelected = selectedId === conversationId;

                    return (
                        <button
                            key={conversationId}
                            className={`w-full flex items-center p-3 rounded-md transition-colors ${
                                isSelected
                                    ? 'bg-primary-50 dark:bg-primary-900'
                                    : 'hover:bg-secondary-50 dark:hover:bg-secondary-800'
                            }`}
                            onClick={() => onSelectConversation(conversationId)}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300">
                                    {name?.charAt(0) || 'U'}
                                </div>
                                {unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                        {unreadCount}
                                    </div>
                                )}
                            </div>
                            <div className="ml-3 flex-1 text-left">
                                <div className="flex justify-between items-baseline">
                                    <p className={`text-sm font-medium ${
                                        isSelected
                                            ? 'text-primary-800 dark:text-primary-200'
                                            : unreadCount > 0
                                                ? 'text-secondary-900 dark:text-white'
                                                : 'text-secondary-700 dark:text-secondary-300'
                                    }`}>
                                        {name}
                                        {user?.role === 'client' && specialite && (
                                            <span className="ml-1 text-xs font-normal text-secondary-500 dark:text-secondary-400">
                                                ({specialite})
                                            </span>
                                        )}
                                    </p>
                                    <span className="text-xs text-secondary-500 dark:text-secondary-400">
                                        {lastMessageDate && format(new Date(lastMessageDate), 'MMM d')}
                                    </span>
                                </div>
                                <p className={`text-xs truncate ${
                                    unreadCount > 0
                                        ? 'font-medium text-secondary-900 dark:text-white'
                                        : 'text-secondary-500 dark:text-secondary-400'
                                }`}>
                                    {truncateText(lastMessage, 50)}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};